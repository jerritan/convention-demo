import { getValFromNestedObj } from "./getValFromNestedObj";

declare global {
  interface Window {
    Switchboard: SwitchboardConfig;
  }
}

export interface SwitchboardConfig {
  environmentData: {
    orientation: string;
    location?: string;
    sequence: string;
    hq?: string;
    "channel-name": string;
    "channel-screen": {
      name: string;
    };
    "screen-set-name": string;
  },
  dataSources: any;
}

interface ContentWindow extends Window {
  Switchboard: SwitchboardConfig;
}

export enum SbEnvDataUrlParams {
  ENVIRONMENT_DATA = 'environmentData',
  CONTENT_NAME = 'contentName',
  CHANNEL_SCREEN_NAME = 'screen',
  MASTER_IP = 'supermaster',
  SCREEN_SET_NAME = 'screenSetName',
  ENV_LANE = 'envLane',
}

const DEFAULT_CONFIG = {
  environmentData: {
    orientation: "",
    location: "",
    sequence: "",
    hq: "dev",
  },
};

export function SetConfig(config: SwitchboardConfig) {
  const contentWindow = window as ContentWindow;
  contentWindow.Switchboard = {
    ...DEFAULT_CONFIG,
    ...window.Switchboard,
    environmentData: {
      ...config.environmentData,
      ...window.Switchboard?.environmentData,
    },
    dataSources: {
      ...config.dataSources,
      ...window.Switchboard?.dataSources,
    },
  };
  console.log("%c🕹️📋: loaded:", "color: white; background:black;");
  console.table(window.Switchboard);

  return config;
}

export const getEnvironment = (key = "") => {
  if (typeof window.Switchboard !== "undefined" && window.Switchboard.environmentData) {
    return key !== "" && key !== undefined ? window.Switchboard.environmentData[key] : window.Switchboard.environmentData;
  }
  // Handle the case where window.Switchboard or environmentData is undefined
  console.warn("Switchboard or environmentData is undefined.");
  return key !== "" && key !== undefined ? undefined : {};
};

export const setEnvironment = (key = "", value) =>
  (window.Switchboard.environmentData[key] = value);

export function getScreenSetNameNonAsync(): string {
  const data = getValFromNestedObj(
    window,
    'Switchboard.environmentData.screen-set-name',
  );
  console.log('SwitchboardAvenue getScreenSetName() > screen-set-name', data);
  return data;
}

export function getEnvLaneNonAsync(): string {
  const screenSetName = getScreenSetNameNonAsync();
  const matchResult = screenSetName.match(/\d+/g);
  const envLane = matchResult
    ? `cod-lane-${matchResult[0]}`
    : screenSetName;
  console.log('SwitchboardAvenue getEnvLane() > master-ip', envLane);
  return envLane;
}

export function getMasterIpNonAsync(): string {
  const data = getValFromNestedObj(window, "Switchboard.environmentData.master-ip", "");
  console.log("SwitchboardAvenue getMasterIp() > master-ip", data);
  return data;
}

export function fetchEnvLaneParam(urlParams: URLSearchParams): string {
  const param = urlParams.get(SbEnvDataUrlParams.ENV_LANE);
  if (!param) {
    console.info('Fetching env-data > env-lane');
    return getEnvLaneNonAsync();
  } else {
    return param;
  }
}

export function fetchMasterIpParam(urlParams: URLSearchParams): string | null {
  const masterIp = getMasterIpNonAsync() || urlParams.get('supermaster');
  return masterIp; 
}
