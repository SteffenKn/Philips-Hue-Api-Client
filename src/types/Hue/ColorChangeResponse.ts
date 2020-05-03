import {HueXYColor} from './index';

export type ColorChangeResponse = [
  {
    success: {
      [route: string]: HueXYColor;
    },
  }
];
