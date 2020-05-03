import {HueFetchClient} from './utils/hue-fetch-client';

import {ILight, LightbulbData, LightbulbState, RgbColor, TurnResponse} from './types/index';

export class Lightbulb implements ILight {
  private _id: string;
  private _name: string;
  private _apiKey: string;

  private _fetchClient: HueFetchClient;

  constructor(ip: string, apiKey: string, id: string, name: string) {
    this._apiKey = apiKey;
    this._id = id;
    this._name = name;

    this._fetchClient = new HueFetchClient(ip);
  }

  public get id(): string {
    return this._id;
  }

  public get name(): string {
    return this._name;
  }

  public async on(): Promise<boolean> {
    const route: string = `/lights/${this._id}/state`;
    const path: string = `/${this._apiKey}${route}`;

    const order: string = `${route}/on`;

    const body = JSON.stringify({on: true});
    const options = {
      body: body,
    };

    const response = await this._fetchClient.put<TurnResponse>(path, options);

    if (response.error) {
      throw new Error(response.error.description);
    }

    return response.value[0].success[order];
  }

  public async off(): Promise<boolean> {
    const route: string = `/lights/${this._id}/state`;
    const path: string = `/${this._apiKey}${route}`;

    const order: string = `${route}/on`;

    const body = JSON.stringify({on: false});
    const options = {
      body: body,
    };

    const response = await this._fetchClient.put<TurnResponse>(path, options);

    if (response.error) {
      throw new Error(response.error.description);
    }

    return !response.value[0].success[order];
  }

  public async turn(shouldTurnOn: boolean): Promise<boolean> {
    const route: string = `/lights/${this._id}/state`;
    const path: string = `/${this._apiKey}${route}`;

    const order: string = `${route}/on`;

    const body = JSON.stringify({on: shouldTurnOn});
    const options = {
      body: body,
    };

    const response = await this._fetchClient.put<TurnResponse>(path, options);

    if (response.error) {
      throw new Error(response.error.description);
    }

    return shouldTurnOn === response.value[0].success[order];
  }

  public async getColor(): Promise<RgbColor> {
    throw new Error('Method not implemented.');
  }

  public async setColor(color: RgbColor): Promise<boolean> {
    throw new Error('Method not yet implemented.');
  }

  public async setBrightness(brightness: number): Promise<boolean> {
    throw new Error('Method not yet implemented.');
  }

  public async setColorAndBrightness(color: RgbColor, brightness: number): Promise<boolean> {
    throw new Error('Method not yet implemented.');
  }

  public async getState(): Promise<LightbulbState> {
    const path: string = `/${this._apiKey}/${this._id}`;

    const response = await this._fetchClient.get<LightbulbData>(path);

    if (response.error) {
      throw new Error(response.error.description);
    }

    return response.value.state;
  }

  public async getData(): Promise<LightbulbData> {
    const path: string = `/${this._apiKey}/${this._id}`;

    const response = await this._fetchClient.get<LightbulbData>(path);

    if (response.error) {
      throw new Error(response.error.description);
    }

    return response.value;
  }
}
