import {LightgroupState} from '../index';

export type LightgroupData = {
  name: string,
  lights: Array<number>,
  sensors: Array<any>,
  type: string,
  state: {
    all_on: boolean,
    any_on: boolean,
  },
  recycle: boolean,
  class: string,
  action: LightgroupState,
};
