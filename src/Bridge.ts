import {HueFetchClient} from './utils/hue-fetch-client';

import {LightBulb, LightGroup} from './index';
import {LightsData, LoginResult} from './types/index';

export class Bridge {
  private clientName: string;
  private apiKey: string;
  private ip: string;

  private fetchClient: HueFetchClient;

  constructor(ip: string, clientName: string) {
    this.ip = ip;
    this.clientName = clientName;

    this.fetchClient = new HueFetchClient(ip);
  }

  public async login(apiKey?: string): Promise<void> {
    if (apiKey) {
      await this.loginViaApiKey(apiKey);

      const isLoggedIn = await this.isLoggedIn();

      if (!isLoggedIn) {
        throw new Error('The API key is invalid.');
      }
    } else {
      await this.loginWithoutApiKey();

      const isLoggedIn = await this.isLoggedIn();

      if (!isLoggedIn) {
        throw new Error('Error while logging in. Please try again.');
      }
    }
  }

  public async getAllLights(): Promise<Array<LightBulb>> {
    if (!this.apiKey) {
      throw new Error('You have to login first.');
    }

    const path: string = `/${this.apiKey}/lights`;

    const response = await this.fetchClient.get<LightsData>(path);

    if (response.error) {
      throw new Error(response.error.description);
    }

    const lightBulbData = response.value;

    const lightBulbIds: Array<string> = Object.keys(lightBulbData);

    const lightBulbs: Array<LightBulb> = [];
    for (const lightBulbId of lightBulbIds) {
      const lightBulbName: string = lightBulbData[lightBulbId].name;

      const lightBulb = new LightBulb(this.ip, this.apiKey, lightBulbId, lightBulbName);

      lightBulbs.push(lightBulb);
    }

    return lightBulbs;
  }

  public async getAllGroups(): Promise<Array<LightGroup>> {
    if (!this.apiKey) {
      throw new Error('You have to login first.');
    }

    const path: string = `/${this.apiKey}/groups`;

    const response = await this.fetchClient.get<LightsData>(path);

    if (response.error) {
      throw new Error(response.error.description);
    }

    const lightBulbData = response.value;

    const lightGroupIds: Array<string> = Object.keys(lightBulbData);

    const lightGroups: Array<LightGroup> = [];
    for (const lightGroupId of lightGroupIds) {
      const lightGroupName: string = lightBulbData[lightGroupId].name;

      const lightGroup = new LightGroup(this.ip, this.apiKey, lightGroupId, lightGroupName);

      lightGroups.push(lightGroup);
    }

    return lightGroups;
  }

  public async getGroupByName(name: string): Promise<LightGroup> {
    const lightGroups: Array<LightGroup> = await this.getAllGroups();

    const searchedLightGroup = lightGroups.find((lightGroup) => lightGroup.name === name);

    if (!searchedLightGroup) {
      throw new Error(`LightGroup with name ${name} not found.`);
    }

    return searchedLightGroup;
  }

  public async isLoggedIn(): Promise<boolean> {
    const path: string = `/${this.apiKey}`;

    const response = await this.fetchClient.get(path);

    return !response.error;
  }

  private async loginWithoutApiKey(): Promise<void> {
    const path: string = '/';

    const body: string = JSON.stringify({
      devicetype: `Hue-Api-Client#${this.clientName}`,
    });

    const options: RequestInit = {body: body};

    const response = await this.fetchClient.post<LoginResult>(path, options);

    if (response.error) {
      throw new Error(response.error.description);
    }

    this.apiKey = response.value[0].success.username;
  }

  private async loginViaApiKey(apiKey: string): Promise<void> {
    this.apiKey = apiKey;
  }
}
