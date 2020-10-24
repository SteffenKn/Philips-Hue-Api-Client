import {HueFetchClient} from './utils/hue-fetch-client';

import {ColorConverter} from './utils/ColorConverter';

import {
  BrightnessChangeResponse,
  ColorAsXY,
  ColorChangeResponse,
  ILight,
  LightbulbData,
  LightbulbState,
  MixedChangeResponse,
  RgbColor,
  TurnResponse,
} from './types/index';

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

  public async on(immediate: boolean = false): Promise<boolean> {
    const route: string = `/lights/${this._id}/state`;
    const path: string = `/${this._apiKey}${route}`;

    const order: string = `${route}/on`;

    const body = JSON.stringify({
      on: true,
      transitiontime: immediate ? 0 : undefined,
    });
    const options = {
      body: body,
    };

    const response = await this._fetchClient.put<TurnResponse>(path, options);

    if (response.error) {
      throw new Error(response.error.description);
    }

    return response.value.find((value) => value.success[order] !== undefined).success[order];
  }

  public async off(immediate: boolean = false): Promise<boolean> {
    const route: string = `/lights/${this._id}/state`;
    const path: string = `/${this._apiKey}${route}`;

    const order: string = `${route}/on`;

    const body = JSON.stringify({
      on: false,
      transitiontime: immediate ? 0 : undefined,
    });
    const options = {
      body: body,
    };

    const response = await this._fetchClient.put<TurnResponse>(path, options);

    if (response.error) {
      throw new Error(response.error.description);
    }

    return !response.value.find((value) => value.success[order] !== undefined).success[order];
  }

  public async turn(shouldTurnOn: boolean, immediate: boolean = false): Promise<boolean> {
    if (shouldTurnOn) {
      return this.on(immediate);
    }

    return this.off(immediate);
  }

  public async getColor(): Promise<RgbColor> {
    const state = await this.getState();

    const xy: ColorAsXY = {
      x: state.xy[0],
      y: state.xy[1],
    };
    const brightness: number = state.bri;

    const rgb = ColorConverter.convertXYtoRGB(xy, brightness);

    return rgb;
  }

  public async setColor(color: RgbColor, immediate: boolean = false): Promise<boolean> {
    const route: string = `/lights/${this._id}/state`;
    const path: string = `/${this._apiKey}${route}`;
    const order: string = `${route}/xy`;

    const xy = ColorConverter.convertRGBToXY(color);

    const body = JSON.stringify({
      xy: [xy.x, xy.y],
      transitiontime: immediate ? 0 : undefined,
    });
    const options = {
      body: body,
    };

    const response = await this._fetchClient.put<ColorChangeResponse>(path, options);

    if (response.error) {
      throw new Error(response.error.description);
    }

    const colorResult = response.value.find((value) => value.success[order] !== undefined).success[order];

    return xy.x - colorResult[0] < 0.01 && xy.y - colorResult[1] < 0.01;
  }

  public async setBrightness(brightnessPercent: number, immediate: boolean = false): Promise<boolean> {
    const route: string = `/lights/${this._id}/state`;
    const path: string = `/${this._apiKey}${route}`;
    const order: string = `${route}/bri`;

    const brightness = Math.floor(brightnessPercent * 2.54);

    const body = JSON.stringify({
      bri: brightness,
      transitiontime: immediate ? 0 : undefined,
    });
    const options = {
      body: body,
    };

    const response = await this._fetchClient.put<BrightnessChangeResponse>(path, options);

    if (response.error) {
      throw new Error(response.error.description);
    }

    const brightnessResponse = response.value.find((value) => value.success[order] !== undefined).success[order];

    return brightnessResponse === brightness;
  }

  public async changeState(on?: boolean, color?: RgbColor, brightnessPercent?: number, immediate: boolean = false): Promise<boolean> {
    const route: string = `/lights/${this._id}/state`;
    const path: string = `/${this._apiKey}${route}`;
    const brightnessOrder: string = `${route}/bri`;
    const onOrder: string = `${route}/on`;
    const colorOrder: string = `${route}/xy`;

    const body: {transitiontime?: number, on?: boolean, xy?: Array<number>, bri?: number} = {
      transitiontime: immediate ? 0 : undefined,
      on: on,
    };

    if (color !== undefined) {
      const xy = ColorConverter.convertRGBToXY(color);
      body.xy = [xy.x, xy.y];
    }

    if (brightnessPercent !== undefined) {
      const brightness = Math.floor(brightnessPercent * 2.54);

      body.bri = brightness;
    }

    const options = {
      body: JSON.stringify(body),
    };

    const response = await this._fetchClient.put<MixedChangeResponse>(path, options);

    if (response.error) {
      throw new Error(response.error.description);
    }

    let success: boolean = true;

    if (on !== undefined) {
      const onResult = response.value.find((value) => value.success[onOrder] !== undefined).success[onOrder];

      success = success && onResult === on;
    }

    if (brightnessPercent !== undefined) {
      const brightnessResponse = response.value.find((value) => value.success[brightnessOrder] !== undefined).success[brightnessOrder];

      success = success && brightnessResponse === Math.floor(brightnessPercent * 2.54);
    }

    if (color !== undefined) {
      const colorResult = response.value.find((value) => value.success[colorOrder] !== undefined).success[colorOrder];

      const xy = ColorConverter.convertRGBToXY(color);

      success = success && xy.x - colorResult[0] < 0.01 && xy.y - colorResult[1] < 0.01;
    }

    return success;
  }

  public async getState(): Promise<LightbulbState> {
    const data = await this.getData();

    return data.state;
  }

  public async getData(): Promise<LightbulbData> {
    const path: string = `/${this._apiKey}/lights/${this._id}`;

    const response = await this._fetchClient.get<LightbulbData>(path);

    if (response.error) {
      throw new Error(response.error.description);
    }

    return response.value;
  }
}
