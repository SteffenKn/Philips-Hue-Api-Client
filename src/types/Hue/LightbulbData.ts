import {LightbulbState} from './LightbulbState';

export type LightbulbData = {
  state: LightbulbState;
  swupdate: {
    state: string;
    lastinstall: string;
  };
  type: string;
  name: string;
  modelid: string;
  manufacturername: string;
  productname: string;
  capabilities: {
    certified: boolean,
    control: {
      mindimlevel: number,
      maxlumen: number,
      colorgamuttype: string,
      colorgamut: [
        [
          number,
          number
        ],
        [
          number,
          number
        ],
        [
          number,
          number
        ]
      ],
      ct: {
        min: number,
        max: number,
      },
    },
    streaming: {
      renderer: boolean,
      proxy: boolean,
    },
  },
  config: {
    archetype: string,
    function: string,
    direction: string,
    startup: {
      mode: string,
      configured: boolean,
    },
  },
  uniqueid: string,
  swversion: string,
  swconfigid: string,
  productid: string
};
