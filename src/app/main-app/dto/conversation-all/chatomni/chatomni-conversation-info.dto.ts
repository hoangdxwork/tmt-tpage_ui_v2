import { ChatomniConversationDto, ChatomniConversationItemDto } from './chatomni-conversation';
export interface Tag {
  Id: string;
  Name: string;
  Icon?: any;
  ColorClass: string;
  ColorCode?: any;
  CreatedTime: Date;
}

export interface LatestMessage {
  Id: string;
  Message: string;
  MessageType: number;
  ContentType?: any;
  CreatedTime: Date;
}

export interface Address {
  Id: number;
  PartnerId: number;
  Partner?: any;
  CityCode: string;
  CityName: string;
  DistrictCode: string;
  DistrictName: string;
  WardCode: string;
  WardName: string;
  IsDefault: boolean;
  Street: string;
  Address: string;
}

export interface Category {
  Id: number;
  Name: string;
  ParentId?: any;
  Parent?: any;
  CompleteName: string;
  Active: boolean;
  ParentLeft: number;
  ParentRight: number;
  Discount: number;
}

export interface AccountReceivable {
  Id: number;
  Name: string;
  Code: string;
  UserTypeId: number;
  UserType?: any;
  UserTypeName?: any;
  Active: boolean;
  Note?: any;
  CompanyId: number;
  Company?: any;
  CompanyName?: any;
  CurrencyId?: any;
  InternalType?: any;
  NameGet: string;
  Reconcile: boolean;
}

export interface AccountPayable {
  Id: number;
  Name: string;
  Code: string;
  UserTypeId: number;
  UserType?: any;
  UserTypeName?: any;
  Active: boolean;
  Note?: any;
  CompanyId: number;
  Company?: any;
  CompanyName?: any;
  CurrencyId?: any;
  InternalType?: any;
  NameGet: string;
  Reconcile: boolean;
}

export interface City {
  name: string;
  nameNoSign?: any;
  code: string;
}

export interface District {
  name: string;
  nameNoSign?: any;
  code: string;
  cityName: string;
  cityCode: string;
}

export interface Ward {
  name: string;
  nameNoSign?: any;
  code: string;
  cityName: string;
  cityCode: string;
  districtName: string;
  districtCode: string;
}

export interface ExtraProperties {
}

export interface ConversationPartnerDto {
  Id: number;
  Name: string;
  DisplayName: string;
  Street: string | null;
  Website?: any;
  Addresses: Address[];
  Phone: string;
  PhoneReport: boolean;
  Mobile?: any;
  Fax?: any;
  Email?: any;
  Supplier: boolean;
  Customer: boolean;
  IsContact?: any;
  IsCompany: boolean;
  CompanyId: number;
  Ref: string;
  Comment?: any;
  UserId?: any;
  Active: boolean;
  Employee: boolean;
  TaxCode?: any;
  ParentId?: any;
  PurchaseCurrencyId?: any;
  PurchaseCurrency?: any;
  Credit: number;
  Debit: number;
  TitleId?: any;
  Title?: any;
  Function?: any;
  Type: string;
  CompanyType: string;
  Childs: any[];
  Categories: Category[];
  AccountReceivableId?: any;
  AccountReceivable: AccountReceivable;
  AccountPayableId?: any;
  AccountPayable: AccountPayable;
  StockCustomerId?: any;
  StockCustomer?: any;
  StockSupplierId?: any;
  StockSupplier?: any;
  City: City | null;
  District: District | null;
  Ward: Ward | null;
  Barcode?: any;
  OverCredit: boolean;
  CreditLimit: number;
  PropertyProductPricelistId?: any;
  PropertyProductPricelist?: any;
  Zalo?: any;
  Facebook?: any;
  FacebookId?: any;
  FacebookASIds?: any;
  FacebookPSId?: any;
  Image?: any;
  ImageUrl?: any;
  LastUpdated: Date;
  LoyaltyPoints?: any;
  Discount: number;
  AmountDiscount: number;
  CategoryNames: string;
  PartnerCategoryId?: any;
  PartnerCategoryName?: any;
  NameNoSign: string;
  PropertyPaymentTerm?: any;
  PropertyPaymentTermId?: any;
  PropertySupplierPaymentTerm?: any;
  PropertySupplierPaymentTermId?: any;
  CategoryId: number;
  DateCreated: Date;
  BirthDay?: any;
  DepositAmount?: any;
  Status: number;
  StatusText: string;
  StatusStyle: string;
  ZaloUserId?: any;
  ZaloUserName?: any;
  CityCode: string | null;
  CityName: string | null;
  DistrictCode: string | null;
  DistrictName: string | null;
  WardCode: string | null;
  WardName: string | null;
  ExtraProperties: ExtraProperties;
  FullAddress: string;
  Ward_District_City: string;
}

export interface ConversationRevenueDto {
  Revenue: number;
  RevenueBegan: number;
  RevenueTotal: number;
}

export interface Product {
  Id: number;
  EAN13?: any;
  DefaultCode: string;
  NameTemplate: string;
  NameNoSign?: any;
  ProductTmplId: number;
  ProductTmpl?: any;
  UOMId: number;
  UOM?: any;
  UOMName?: any;
  UOMPOId: number;
  UOMPO?: any;
  QtyAvailable: number;
  VirtualAvailable: number;
  OutgoingQty?: any;
  IncomingQty?: any;
  NameGet: string;
  POSCategId?: any;
  POSCateg?: any;
  Price?: any;
  Barcode: string;
  Image?: any;
  Images: any[];
  ImageUrl?: any;
  PriceVariant: number;
  SaleOK: boolean;
  PurchaseOK: boolean;
  DisplayAttributeValues?: any;
  LstPrice: number;
  Active: boolean;
  ListPrice: number;
  PurchasePrice?: any;
  DiscountSale?: any;
  DiscountPurchase?: any;
  StandardPrice: number;
  Weight: number;
  Volume?: any;
  OldPrice?: any;
  IsDiscount: boolean;
  ProductTmplEnableAll: boolean;
  Version: number;
  Description?: any;
  AttributeValues: any[];
  LastUpdated: Date;
  Type: string;
  UOMLines: any[];
  CategId: number;
  Categ?: any;
  CostMethod?: any;
  InvoicePolicy: string;
  Variant_TeamId: number;
  Name: string;
  PropertyCostMethod?: any;
  PropertyValuation?: any;
  PurchaseMethod: string;
  SaleDelay: number;
  Tracking?: any;
  Valuation?: any;
  AvailableInPOS: boolean;
  CompanyId?: any;
  IsCombo?: any;
  NameTemplateNoSign: string;
  TaxesIds: any[];
  StockValue?: any;
  SaleValue?: any;
  PosSalesCount?: any;
  Factor?: any;
  CategName?: any;
  AmountTotal?: any;
  NameCombos: any[];
  RewardName?: any;
  Product_UOMId?: any;
  Tags?: any;
  DateCreated: Date;
}


export interface UOM {
  Id: number;
  Name: string;
  NameNoSign?: any;
  Rounding: number;
  Active: boolean;
  Factor: number;
  FactorInv: number;
  UOMType: string;
  CategoryId: number;
  Category: Category;
  CategoryName: string;
  Description?: any;
  ShowUOMType: string;
  NameGet: string;
  ShowFactor: number;
  DateCreated: Date;
}

export interface Detail {
  Id: string;
  Quantity: number;
  Price: number;
  ProductId: number;
  Product: Product;
  ProductName: string;
  ProductNameGet: string;
  ProductCode: string;
  UOM: UOM;
  UOMId: number;
  UOMName: string;
  Note?: any;
  Factor?: any;
  OrderId: string;
  Priority: number;
  ImageUrl?: any;
  LiveCampaign_DetailId?: any;
  LiveCampaign?: any;
  IsOrderPriority?: any;
  QuantityRegex?: any;
}

export interface FacebookConfigs {
  Message_Enable: boolean;
  EnableAutoMapWithPhone: boolean;
  Message_IsEnabled: boolean;
  SendLogin_Enable: boolean;
  SendLogin_Message?: any;
  SendLogin_Url: string;
  AutoReply_Enable: boolean;
  AutoReply_MessageDefault?: any;
  QuickReply_Enable: boolean;
  QuickReply_Message?: any;
  greeting: any[];
  QuickReply_Options: any[];
}

export interface CRMTeam {
  Id: number;
  Name: string;
  OwnerId: string;
  OwnerToken: string;
  OwnerAvatar: string;
  OwnerUrl?: any;
  ChannelId: string;
  ChannelToken: string;
  ChannelAvatar: string;
  ShopToken?: any;
  Active: boolean;
  CompanyId?: any;
  Type: string;
  CountPage: number;
  CountGroup: number;
  Facebook_UserId: string;
  Facebook_ASUserId: string;
  Facebook_UserName: string;
  Facebook_UserAvatar: string;
  Facebook_UserCover?: any;
  Facebook_UserToken: string;
  Facebook_UserPrivateToken?: any;
  Facebook_UserPrivateToken2?: any;
  Facebook_PagePrivateToken?: any;
  Facebook_PageId: string;
  Facebook_PageName: string;
  Facebook_PageLogo: string;
  Facebook_PageCover?: any;
  Facebook_PageToken: string;
  Facebook_Link: string;
  IsDefault: boolean;
  IsConverted: boolean;
  Facebook_TokenExpired?: any;
  Facebook_TypeId: number;
  ParentId: number;
  ParentName: string;
  Facebook_Configs: FacebookConfigs;
  Childs: any[];
  ShopId?: any;
  Facebook_AccountId: string;
}

export interface User {
  Avatar?: any;
  Email?: any;
  Name: string;
  Id: string;
  UserName?: any;
  PasswordNew?: any;
  CompanyId: number;
  Company?: any;
  CompanyName?: any;
  Image?: any;
  Subffix?: any;
  Companies: any[];
  Active: boolean;
  Modules: any[];
  Groups: any[];
  Barcode?: any;
  PosSecurityPin?: any;
  GroupRefs: any[];
  Roles?: any;
  UserShifts?: any;
  CRMTeam_Users: any[];
  InGroupPartnerManager: boolean;
  PartnerId?: any;
  LastUpdated?: any;
  Functions: any[];
  Fields: any[];
  PhoneNumber?: any;
}

export interface Company {
  Id: number;
  Name: string;
  Sender?: any;
  MoreInfo?: any;
  ProductId?: any;
  Product?: any;
  PartnerId: number;
  Partner?: any;
  Email?: any;
  Phone?: any;
  CurrencyId: number;
  Currency?: any;
  Fax?: any;
  Street?: any;
  DepositAccountId?: any;
  CurrencyExchangeJournalId?: any;
  CurrencyExchangeJournal?: any;
  IncomeCurrencyExchangeAccountId?: any;
  IncomeCurrencyExchangeAccount?: any;
  ExpenseCurrencyExchangeAccountId?: any;
  ExpenseCurrencyExchangeAccount?: any;
  SecurityLead?: any;
  Logo?: any;
  LastUpdated?: any;
  TransferAccountId?: any;
  TransferAccount?: any;
  AllowSaleNegative?: any;
  City?: any;
  District?: any;
  Ward?: any;
  SaleNote?: any;
  TaxCode?: any;
  TaxId?: any;
  Tax?: any;
  WarehouseId?: any;
  Warehouse?: any;
  SOFromPO?: any;
  POFromSO?: any;
  AutoValidation?: any;
  Customer?: any;
  Supplier?: any;
  Active: boolean;
  PeriodLockDate?: any;
  QuatityDecimal?: any;
  ExtRegexPhone?: any;
  ImageUrl?: any;
  SalePartnerId?: any;
  SalePartner?: any;
  DeliveryCarrier?: any;
  DeliveryCarrierId?: any;
  Weight?: any;
  ShipAmount?: any;
  DeliveryNote?: any;
}

export interface ConversationOrderDto {
  Id: string;
  Code: string;
  Facebook_UserId?: any;
  Facebook_PostId?: any;
  Facebook_ASUserId: string;
  Facebook_CommentId?: any;
  Facebook_AttachmentId?: any;
  Facebook_UserName: string;
  Facebook_UserAvatar?: any;
  Facebook_Content?: any;
  Telephone: string;
  Address: string;
  PartnerPhone?: any;
  Name: string;
  Email?: any;
  Note: string;
  Deposit: number;
  LiveCampaignId?: any;
  LiveCampaignName?: any;
  PartnerId: number;
  Partner: ConversationPartnerDto;
  PartnerName: string;
  PartnerStatus: number;
  PartnerStatusText: string;
  PartnerCode: string;
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
  Status: number;
  StatusText: string;
  Facebook_CommentsText?: any;
  Facebook_Comments: any[];
  Details: Detail[];
  StatusStr?: any;
  CommentIds: any[];
  CompanyId: number;
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
  CRMTeamId: number;
  CRMTeamName: string;
  CRMTeam: CRMTeam;
  PrintCount: number;
  UserId: string;
  User: User;
  Tags?: any;
  NameNetwork: string;
  UserName: string;
  WarehouseId?: any;
  WarehouseName?: any;
  Warehouse?: any;
  Company: Company;
  CompanyName: string;
  FormAction?: any;
  MessageCount: number;
}

export interface Conversation_LastBillDto {
  Id: number;
  PartnerId: number;
  DateCreated: Date;
  AmountTotal: number;
  PaymentJournalName: string;
  CarrierName: string;
  Name: string;
  State: string;
  Type?: any;
  Number: string;
  TrackingRef?: any;
  DeliveryNote: string;
  ShipPaymentStatus?: any;
  Address: string;
  Phone: string;
  ShowState: string;
}

// export interface Value {
//   Id: number;
//   PartnerId: number;
//   DateCreated: Date;
//   AmountTotal: number;
//   PaymentJournalName: string;
//   CarrierName: string;
//   Name: string;
//   State: string;
//   Type?: any;
//   Number: string;
//   TrackingRef?: any;
//   DeliveryNote: string;
//   ShipPaymentStatus?: any;
//   Address: string;
//   Phone: string;
//   ShowState: string;
// }

export interface GroupBy_ConversationBillDto {
  Type: string;
  Value: Conversation_LastBillDto[];
  Total: number;
}

export interface Conversation_FastSaleOrderDto {
  LastBill: Conversation_LastBillDto;
  Data: GroupBy_ConversationBillDto[];
}

export interface ChatomniConversationInfoDto {
  Conversation: ChatomniConversationItemDto;
  Partner: ConversationPartnerDto;
  Revenue: ConversationRevenueDto;
  Order: ConversationOrderDto;
  Bill: Conversation_FastSaleOrderDto;
}
