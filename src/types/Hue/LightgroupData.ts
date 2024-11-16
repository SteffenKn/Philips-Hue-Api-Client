import {LightGroupState} from '../index';

export type LightGroupData = {
  name: string;
  lights: Array<number>;
  sensors: Array<any>;
  type: string;
  state: {
    all_on: boolean;
    any_on: boolean;
  };
  recycle: boolean;
  class: string;
  action: LightGroupState;
};
