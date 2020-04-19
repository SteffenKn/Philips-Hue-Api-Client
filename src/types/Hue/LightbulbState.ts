export type LightbulbState = {
  on: boolean;
  bri: number;
  hue: number;
  sat: number;
  effect: string;
  xy: Array<number>;
  ct: number;
  alert: string;
  colormode: string;
  mode: string;
  reachable: boolean;
};
