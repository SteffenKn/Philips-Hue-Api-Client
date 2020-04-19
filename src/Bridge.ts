import {RequestInit} from 'node-fetch';

import {HueFetchClient} from './utils/hue-fetch-client';

import { Lightbulb } from './Lightbulb';
import {LightsData, LoginResult} from './types/index';

export class Bridge {
  private _clientName: string;
  private _apiKey: string;
  private _ip: string;

  private _fetchClient: HueFetchClient;

  constructor(ip: string, clientName: string) {
    this._ip = ip;
    this._clientName = clientName;

    this._fetchClient = new HueFetchClient(ip);
  }

  public get apiKey(): string {
    return this._apiKey;
  }

  public async login(apiKey?: string): Promise<void> {
    if (apiKey) {
      await this.loginViaApiKey(apiKey);

      const isLoggedIn = await this.checkIfLoggedIn();

      if (!isLoggedIn) {
        throw new Error('The API key is invalid.');
      }
    } else {
      await this.loginWithoutApiKey();

      const isLoggedIn = await this.checkIfLoggedIn();

      if (!isLoggedIn) {
        throw new Error('Error while logging in. Please try again.');
      }
    }
  }

  public async getAllLights(): Promise<Array<Lightbulb>> {
    if (!this._apiKey) {
      throw new Error('You have to login first.');
    }

    const path: string = `/${this._apiKey}/lights`;

    const response = await this._fetchClient.get<LightsData>(path);

    if (response.error) {
      throw new Error(response.error.description);
    }

    const lightbulbData = response.value;

    const lightbulbIds: Array<string> = Object.keys(lightbulbData);

    const lightbulbs: Array<Lightbulb> = [];
    for (const lightbulbId of lightbulbIds) {
      const lightbulbName: string = lightbulbData[lightbulbId].name;

      const lightbulb = new Lightbulb(this._ip, this._apiKey, lightbulbId, lightbulbName);

      lightbulbs.push(lightbulb);
    }

    return lightbulbs;
  }

  private async loginWithoutApiKey(): Promise<void> {
    const path: string = '/';

    const body: string = JSON.stringify({
      devicetype: `Hue-Api-Client#${this._clientName}`,
    });

    const options: RequestInit = {body: body};

    const response = await this._fetchClient.post<LoginResult>(path, options);

    if (response.error) {
      throw new Error(response.error.description);
    }

    this._apiKey = response.value[0].success.username;
  }

  private async loginViaApiKey(apiKey: string): Promise<void> {
    this._apiKey = apiKey;
  }

  private async checkIfLoggedIn(): Promise<boolean> {
    const path: string = `/${this._apiKey}`;

    const response = await this._fetchClient.get(path);

    return !response.error;
  }
}
