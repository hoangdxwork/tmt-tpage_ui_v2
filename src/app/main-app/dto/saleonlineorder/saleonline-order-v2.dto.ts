export interface SaleOnline_Order_V2DTO {
  Id: string;
  Code: string;
  Facebook_UserId?: any;
  Facebook_PostId: string;
  Facebook_ASUserId: string;
  Facebook_CommentId: string;
  Facebook_UserName: string;
  Facebook_UserAvatar?: any;
  Facebook_Content: string;
  Telephone: string;
  Address: string;
  Name: string;
  Email?: any;
  Note: string;
  Deposit: number;
  LiveCampaignId: string;
  LiveCampaignName: string;
  PartnerId: number;
  PartnerName: string;
  PartnerNameNosign: string;
  TotalAmount: number;
  TotalQuantity: number;
  DateCreated: Date;
  LastUpdated?: Date;
  Status: string;
  StatusText: string;
  Facebook_CommentsText?: any;
  SessionIndex: number;
  CreatedById?: any;
  NameNetwork: string;
  CRMTeamId: number;
  Tags: string;
  CRMTeamName: string;
  UserId: string;
  UserName: string;
  CreateByName?: any;
  CompanyId?: number;
  CompanyName: string;
  WarehouseId?: number;
  WarehouseName: string;
  PrintCount?: any;
  HasTag: string;
  MessageCount: number;
}
