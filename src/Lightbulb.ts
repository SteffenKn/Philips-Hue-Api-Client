import {HueFetchClient} from './utils/hue-fetch-client';

import {LightbulbData, LightbulbState} from './types/index';

export class Lightbulb {
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

  public async on(): Promise<void> {
    const path: string = `/${this._apiKey}/lights/${this._id + 1}/state`;

    const body = JSON.stringify({on: true});
    const options = {
      body: body,
    };

    const response = await this._fetchClient.put(path, options);

    if (response.error) {
      throw new Error(response.error.description);
    }
  }

  public async off(): Promise<void> {
    const path: string = `/${this._apiKey}/lights/${this._id}/state`;

    const body = JSON.stringify({on: false});
    const options = {
      body: body,
    };

    const response = await this._fetchClient.put(path, options);

    if (response.error) {
      throw new Error(response.error.description);
    }
  }

  public async turn(shouldTurnOn: boolean): Promise<void> {
    const path: string = `/${this._apiKey}/lights/${this._id}/state`;

    const body = JSON.stringify({on: shouldTurnOn});
    const options = {
      body: body,
    };

    const response = await this._fetchClient.put(path, options);

    if (response.error) {
      throw new Error(response.error.description);
    }
  }

  // public async changeColor(color: RgbColor): Promise<void> {

  // }

  // public async changeBrightness(brightness: number): Promise<void> {

  // }

  // public async changeColorAndBrightness(color: RgbColor, brightness: number): Promise<void> {

  // }

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
