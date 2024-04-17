export interface DataItem {
  [key: string]: string;
}

export interface GlobalDataItem {
  uid: string;
  actionKey: string;
  buttonName: string;
  messageDelay: string;
  messages: string;
}

export interface DemoDataItem {
  uid: string;
  actionKey: string;
  customer: string;
  zone: string;
  journey: string;
  messageDelay: string;
  messages: string;
}

export interface TalkingDataItem {
  uid: string;
  actionKey: string;
  assetFileName: string;
}

export type DataSourceItem = DataItem | GlobalDataItem | DemoDataItem | TalkingDataItem;

export type FileExtensionType = "video" | "image" | "iframe" | null;
