export interface Detail_QuickSaleOnlineOrder {
  Id: string | null;
  Quantity: number;
  Price: number;
  ProductId: number;
  ProductName: string;
  ProductNameGet: string;
  ProductCode: string;
  UOMId: number;
  UOMName: string;
  Note?: any;
  Factor: number;
  OrderId?: string | null;
  Priority: number | null;
  ImageUrl?: any;
  LiveCampaign_DetailId?: string | null;
  IsOrderPriority?: boolean;
  QuantityRegex?: any | null;
  Discount: number;
}

export interface Partner {
  Id: number;
  Name: string;
  DisplayName: string;
  Street: string;
  Website?: any;
  Phone: string;
  PhoneReport?: any;
  Mobile?: any;
  Fax?: any;
  Email?: any;
  Supplier: boolean;
  Customer: boolean;
  IsContact?: any;
  IsCompany: boolean;
  CompanyId?: any;
  Ref: string;
  Comment?: any;
  UserId?: any;
  Active: boolean;
  Employee: boolean;
  TaxCode?: any;
  ParentId?: any;
  PurchaseCurrencyId?: any;
  Credit: number;
  Debit: number;
  TitleId?: any;
  Function?: any;
  Type: string;
  CompanyType: string;
  AccountReceivableId?: any;
  AccountPayableId?: any;
  StockCustomerId?: any;
  StockSupplierId?: any;
  Barcode?: any;
  OverCredit: boolean;
  CreditLimit: number;
  PropertyProductPricelistId?: any;
  Zalo?: any;
  Facebook?: any;
  FacebookId?: any;
  FacebookASIds?: any;
  FacebookPSId?: any;
  Image?: any;
  ImageUrl?: any;
  LastUpdated?: any;
  LoyaltyPoints?: any;
  Discount: number;
  AmountDiscount: number;
  PartnerCategoryId?: any;
  PartnerCategoryName?: any;
  NameNoSign?: any;
  PropertyPaymentTermId?: any;
  PropertySupplierPaymentTermId?: any;
  CategoryId: number;
  DateCreated: Date;
  BirthDay?: any;
  DepositAmount?: any;
  Status: string;
  StatusText: string;
  StatusStyle?: any;
  ZaloUserId?: any;
  ZaloUserName?: any;
  CityCode: string;
  CityName: string;
  DistrictCode: string;
  DistrictName: string;
  WardCode: string;
  WardName: string;
  City?: any;
  District?: any;
  Ward?: any;
}

export interface User {
  Avatar?: any;
  Email?: any;
  Name: string;
  Id: string;
  UserName?: any;
  PasswordNew?: any;
  CompanyId: number;
  CompanyName?: any;
  Image?: any;
  Subffix?: any;
  Active: boolean;
  Barcode?: any;
  PosSecurityPin?: any;
  GroupRefs: any[];
  InGroupPartnerManager: boolean;
  PartnerId?: any;
  LastUpdated?: any;
  Functions: any[];
  Fields: any[];
  PhoneNumber?: any;
  Roles: any[];
}

export interface QuickSaleOnlineOrderModel {
  Id?: string;
  Code?: string;
  Facebook_UserId?: any;
  Facebook_PostId: string;
  Facebook_ASUserId: string;
  Facebook_CommentId: string;
  Facebook_AttachmentId?: any;
  Facebook_UserName: string;
  Facebook_UserAvatar?: any;
  Facebook_Content: string;
  Telephone: string;
  Address: string;
  PartnerPhone: string;
  Name: string;
  Email?: any;
  Note: string;
  Deposit: number;
  LiveCampaignId: string;
  LiveCampaignName: string;
  PartnerId: number;
  PartnerName: string;
  PartnerStatus: string;
  PartnerStatusText: string;
  PartnerCode?: any;
  CityCode: string;
  CityName: string;
  DistrictCode: string;
  DistrictName: string;
  WardCode: string;
  WardName: string;
  TotalAmount: number;
  TotalQuantity: number;
  DateCreated: Date;
  LastUpdated: Date;
  Status: string;
  StatusText: string;
  Facebook_CommentsText?: any;
  StatusStr?: any;
  CommentIds: any[];
  CompanyId: number;
  PartnerNameNosign: string;
  SessionIndex: number;
  Session: number;
  Source: string;
  Source_FacebookUserId?: any;
  Source_FacebookMessageId?: any;
  ZaloOrderCode?: any;
  ZaloOrderId?: any;
  ZaloOAId?: any;
  DeliveryInfo?: any;
  CRMTeamId: number;
  MatchingId?: any;
  IsCreated: boolean;
  IsUpdated: boolean;
  CRMTeamName: string;
  PrintCount: number;
  UserId: string;
  Tags?: any;
  NameNetwork: string;
  UserName: string;
  WarehouseId?: any;
  WarehouseName?: any;
  CompanyName: string;
  FormAction?: any;
  MessageCount: number;
  Details: Detail_QuickSaleOnlineOrder[] | any[];
  Partner: Partner;
  User: User | any;
}
