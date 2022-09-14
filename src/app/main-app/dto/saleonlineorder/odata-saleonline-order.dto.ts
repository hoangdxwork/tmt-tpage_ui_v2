export interface ODataSaleOnline_OrderModel {
  Id: string;
  Code?: any;
  Facebook_UserId?: any;
  Facebook_PostId?: any;
  Facebook_ASUserId: string;
  Facebook_CommentId?: any;
  Facebook_UserName: string;
  Facebook_UserAvatar?: any;
  Facebook_Content?: any;
  Telephone: string;
  Address: string;
  Name: string;
  Email?: any;
  Note?: any;
  Deposit: number;
  LiveCampaignId?: any;
  LiveCampaignName?: any;
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
  CompanyId?: any;
  CompanyName?: any;
  WarehouseId?: any;
  WarehouseName?: any;
  PrintCount?: any;
  HasTag: string;
  MessageCount: number;
  PartnerStatus?: any;  // TODO: dùng để hiển thị trạng thái của khách hàng, không có trong dữ liệu trả về
}

export interface ODataSaleOnline_OrderDTOV2 {
  '@odata.context': string;
  '@odata.count': number;
  value: ODataSaleOnline_OrderModel[];
}
