export interface SaleOnlineSettingDTO { // /odata/SaleOnlineSetting
  id: number;
  enableAutoLiveErrorComment: boolean;
  enableAutoScanFacebookUId: boolean;
  enablePrintAddress: boolean;
  enablePrintComment: boolean;
  intervalTime: number;
  isDisablePrint: boolean;
  isOldest: boolean;
  isPrintMultiTimes: boolean;
  isPrintNote: boolean;
  liveErrorIntervalTime: number;
  localIP: string;
  mainExpanded: boolean;
  messageSender: string;
  postQuantityLimit: number;
  quantity: number;
  session: number;
  sessionEnable: boolean;
  sessionIndex: number;
  sessionStarted: string;
}
