import {Lightbulb} from './Lightbulb';

import {ILight, LampColors, LightbulbData, LightbulbState, RgbColor} from './types/index';

export class Lamp implements ILight {
  private _lightbulbs: Array<Lightbulb>;
  private _name: string;

  constructor(lightbulbs: Array<Lightbulb>, name: string) {
    this._lightbulbs = lightbulbs;
    this._name = name;
  }

  public get name(): string {
    return this._name;
  }

  public async on(): Promise<void> {
    const promises: Array<Promise<void>> = [];

    this._lightbulbs.forEach((lightbulb) => {
      const promise = lightbulb.on();

      promises.push(promise);
    });

    await Promise.all(promises);
  }

  public async off(): Promise<void> {
    const promises: Array<Promise<void>> = [];

    this._lightbulbs.forEach((lightbulb) => {
      const promise = lightbulb.off();

      promises.push(promise);
    });

    await Promise.all(promises);
  }

  public async turn(shouldTurnOn: boolean): Promise<void> {
    const promises: Array<Promise<void>> = [];

    this._lightbulbs.forEach((lightbulb) => {
      const promise = lightbulb.turn(shouldTurnOn);

      promises.push(promise);
    });

    await Promise.all(promises);
  }

  public async getColor(): Promise<LampColors> {
    const lampColors: LampColors = {};

    for (const lightbulb of this._lightbulbs) {
      const color = await lightbulb.getColor();

      lampColors[lightbulb.id] = color;
    }

    return lampColors;
  }

  public async setColor(color: RgbColor): Promise<boolean> {
    const promises: Array<Promise<boolean>> = [];

    this._lightbulbs.forEach((lightbulb) => {
      const promise = lightbulb.setColor(color);

      promises.push(promise);
    });

    const results = await Promise.all(promises);

    return !results.some((result) => {
      return !result;
    });
  }

  public async setBrightness(brightness: number): Promise<boolean> {
    const promises: Array<Promise<boolean>> = [];

    this._lightbulbs.forEach((lightbulb) => {
      const promise = lightbulb.setBrightness(brightness);

      promises.push(promise);
    });

    const results = await Promise.all(promises);

    return !results.some((result) => {
      return !result;
    });
  }

  public async setColorAndBrightness(color: RgbColor, brightness: number): Promise<boolean> {
    const promises: Array<Promise<boolean>> = [];

    this._lightbulbs.forEach((lightbulb) => {
      const promise = lightbulb.setColorAndBrightness(color, brightness);

      promises.push(promise);
    });

    const results = await Promise.all(promises);

    return !results.some((result) => {
      return !result;
    });
  }

  public async getState(): Promise<Array<LightbulbState>> {
    const lightbulbStates: Array<LightbulbState> = [];

    for (const lightbulb of this._lightbulbs) {
      const lightbulbState = await lightbulb.getState();

      lightbulbStates.push(lightbulbState);
    }

    return lightbulbStates;
  }

  public async getData(): Promise<Array<LightbulbData>> {
    const lightbulbData: Array<LightbulbData> = [];

    for (const lightbulb of this._lightbulbs) {
      const singleLightbulbData = await lightbulb.getData();

      lightbulbData.push(singleLightbulbData);
    }

    return lightbulbData;
  }
}
