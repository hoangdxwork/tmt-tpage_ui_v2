import { TDSSafeAny } from "tds-ui/shared/utility";

export interface ColumnTableDTO {
  value: TDSSafeAny;
  name: TDSSafeAny;
  isChecked: boolean;
}

export interface MessageDeliveryHistoryLiveCampaignParamsDTO {
  LiveCampaignId: string;
  Skip: number;
  Take: number;
  IsSuccess?: boolean;
}

export interface MessageHistorySaleOnlineResultDTO {
  Total: number;
  Datas: MessageHistorySaleOnlineDTO[];
}

export interface MessageHistoryFSOrderResultDTO {
  Total: number;
  Datas: MessageHistoryFSOrderDTO[];
}

export interface MessageHistorySaleOnlineDTO {
  OrderId: string;
  /// Id đơn hàng
  OrderCode: string;
  /// PSId facebook khách hàng
  psid: string;
  LiveCampaignId?: string;
  PartnerId?: number;
  PartnerName: string;
  PhoneNumber: string;
  Address: string;
  MessageCount: number;
  /// Nội dung tin nhắn
  LastMessage: string;
  /// Gửi tin nhắn thành công hay không?
  IsSuccessLastMessage: boolean;
  ErrorLastMessage: string;
  DateCreatedLastMessage: Date;
  TotalAmount?: number;
  TotalSuccessMessage: number;
  TotalErrorMessage: number;
}

export interface MessageHistoryFSOrderDTO {
  OrderId: number;
  /// Id đơn hàng
  Number: string;
  /// PSId facebook khách hàng
  psid: string;
  LiveCampaignId?: string;
  PartnerId?: number;
  PartnerName: string;
  PhoneNumber: string;
  Address: string;
  MessageCount: number;
  /// Nội dung tin nhắn
  LastMessage: string;
  /// Gửi tin nhắn thành công hay không?
  IsSuccessLastMessage: boolean;
  ErrorLastMessage: string;
  DateCreatedLastMessage: Date;
  TotalAmount?: number;
}

export interface MessageDeliveryHistoryResultDTO {
  Total: number;
  Datas: MessageDeliveryHistoryDTO[];
}

export interface MessageDeliveryHistoryDTO {
  OrderId: string;
  /// Id đơn hàng
  OrderCode: string;
  FSOrderId: number;
  Number: string;
  /// PSId facebook khách hàng
  psid: string;
  LiveCampaignId?: string;
  PartnerId?: number;
  /// Nội dung tin nhắn
  Message: string;
  /// Gửi tin nhắn thành công hay không?
  IsSuccess: boolean;
  ErrorMessage: string;
  DateCreated: Date;
}
