import {LampColors, RgbColor} from './index';

export interface ILight {
  on(): Promise<boolean>;
  off(): Promise<boolean>;
  turn(shouldTurnOn: boolean): Promise<boolean>;
  getColor(): Promise<RgbColor | LampColors>;
  setColor(color: RgbColor): Promise<boolean>;
  setBrightness(brigthness: number): Promise<boolean>;
  setColorAndBrightness(color: RgbColor, brigthness: number): Promise<boolean>;
}
