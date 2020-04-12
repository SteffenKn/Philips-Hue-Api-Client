import {RequestInit} from 'node-fetch';

import {HueFetchClient} from './utils/hue-fetch-client';

import {LoginResult} from './types/index';

export class Bridge {
  private _clientName: string;
  private _apiKey: string;

  private fetchClient: HueFetchClient;

  constructor(ip: string, clientName: string) {
    this._clientName = clientName;

    this.fetchClient = new HueFetchClient(ip);
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

  private async checkIfLoggedIn(): Promise<boolean> {
    const path: string = `/${this._apiKey}`;

    const response = await this.fetchClient.get(path);

    return !response.error;
  }

  private async loginWithoutApiKey(): Promise<void> {
    const path: string = '/';

    const body: string = JSON.stringify({
      devicetype: `Hue-Api-Client#${this._clientName}`,
    });

    const options: RequestInit = {body: body};

    const response = await this.fetchClient.post<LoginResult>(path, options);

    if (response.error) {
      throw new Error(response.error.description);
    }

    this._apiKey = response.value[0].success.username;
  }

  private async loginViaApiKey(apiKey: string): Promise<void> {
    this._apiKey = apiKey;
  }

}
