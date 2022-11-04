import { DeliveryCarrierDTO } from "../carrier/delivery-carrier.dto";

export interface ConversationOrderForm {
  Id?: string;
  Code: string | undefined;
  LiveCampaignId: string;
  Facebook_UserId: string;
  Facebook_ASUserId: string;
  Facebook_UserName: string;
  Facebook_CommentId: string;
  Facebook_PostId: string;
  PartnerId?: number;
  PartnerName: string;
  Name: string;
  Email: string;
  TotalAmount: number;
  TotalQuantity: number;
  Street: string;
  City?: Object;
  District?: Object;
  Ward?: Object;
  UserId?: string;
  User?: Object;
  Telephone: string;
  Note: string;
  CRMTeamId?: number;
  PrintCount: number;
  Session: number,
  SessionIndex: number,
  AmountUntaxed: number,
  TotalAmountBill: number,
  DecreaseAmount: number,
  PaymentAmount: number,
  DiscountAmount: number,
  Discount: number,
  Tax: Object,
  AmountTax: number,
  StatusText: string;
  Carrier?: DeliveryCarrierDTO;
  Details: ConversationOrderProductDefaultDTO[]
}

export interface ConversationOrderDTO {
  Id: string;
  Code: string;
  Facebook_UserId?: any;
  Facebook_PostId: string;
  Facebook_ASUserId: string;
  Facebook_CommentId: string;
  Facebook_AttachmentId?: any;
  Facebook_UserName: string;
  Facebook_UserAvatar?: any;
  Facebook_Content?: any;
  Telephone: string;
  Address?: any;
  PartnerPhone?: any;
  Name: string;
  Email?: any;
  Note: string;
  Deposit: number;
  LiveCampaignId?: any;
  LiveCampaignName?: any;
  PartnerId: number;
  PartnerName: string;
  PartnerStatus: string;
  PartnerStatusText?: any;
  PartnerCode?: any;
  CityCode?: any;
  CityName?: any;
  DistrictCode?: any;
  DistrictName?: any;
  WardCode?: any;
  WardName?: any;
  TotalAmount: number;
  TotalQuantity: number;
  DateCreated: Date;
  LastUpdated?: any;
  Status?: any;
  StatusText: string;
  Facebook_CommentsText?: any;
  StatusStr?: any;
  CommentIds: any[];
  CompanyId?: any;
  PartnerNameNosign: string;
  SessionIndex: number;
  Session: number;
  Source?: any;
  Source_FacebookUserId?: any;
  Source_FacebookMessageId?: any;
  ZaloOrderCode?: any;
  ZaloOrderId?: any;
  ZaloOAId?: any;
  DeliveryInfo?: any;
  MatchingId?: any;
  IsCreated: boolean;
  IsUpdated: boolean;
  CRMTeamId?: any;
  CRMTeamName: string;
  PrintCount: number;
  UserId: string;
  Tags?: any;
  NameNetwork: string;
  UserName: string;
  WarehouseId?: any;
  WarehouseName?: any;
  CompanyName?: any;
  FormAction?: any;
  MessageCount: number;
  PriorityStatus?: string;
}

export interface ConversationOrderProductDefaultDTO {
  Note: string | null,
  Price: number,
  ProductCode: string,
  ProductId?: number;
  ProductName: string,
  ProductNameGet: string,
  Quantity: number,
  UOMId: number,
  UOMName: string,
  Discount?: number;
}

export interface SaleOnline_Facebook_CommentFilterResultDTO {
  id: string;
  post_id: string;
  message: string;
  like_count: number;
  comment_count: number;
  created_time: string;
  selected?: boolean;
}

