import {LampColors, RgbColor} from './index';

export interface ILight {
  on(): Promise<void>;
  off(): Promise<void>;
  turn(shouldTurnOn: boolean): Promise<void>;
  getColor(): Promise<RgbColor | LampColors>;
  setColor(color: RgbColor): Promise<boolean>;
  setBrightness(brigthness: number): Promise<boolean>;
  setColorAndBrightness(color: RgbColor, brigthness: number): Promise<boolean>;
}
