export const HQ_URL: string = "https://us-mcd-wwc.switchboardcms.com";

export const SUPERMASTER_IP = "192.168.1.254";

export const CONTROLLER_DATA_GLOBAL = "wwc.controller.global.csv";
export const CONTROLLER_DATA_DEMO = "wwc.controller.demo.csv";
export const CONTROLLER_DATA_TALKING = "wwc.controller.talking.csv";

export const SCREEN_DATA_ASSET_DEFAULT = "wwc.screen.asset.default.csv";
export const SCREEN_DATA_ASSET_GLOBAL = "wwc.screen.asset.global.csv";
export const SCREEN_DATA_ASSET_DEMO = "wwc.screen.asset.demo.csv";

export const CREW_FACING_DATA = "wwc.cfs.csv";

export const DATASOURCE_CNB = "wwc.cnb.csv";

export const dataSourceString = (dsName: string) => {
  return `/api/dataSource/${dsName}.json`;
};
