import { AshipGetInfoConfigProviderDto } from "../carrierV2/aship-info-config-provider-data.dto";
import { CalculateFeeInsuranceInfoResponseDto } from "../carrierV2/delivery-carrier-response.dto";

export interface Warehouse {
  Id: number;
  Code: string;
  Name: string;
  CompanyId: number;
  NameGet: string;
  CompanyName: string;
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

export interface Company {
  Id: number;
  Name: string;
  Sender?: any;
  MoreInfo?: any;
  ProductId?: any;
  PartnerId: number;
  Email: string;
  Phone: string;
  CurrencyId: number;
  Fax?: any;
  Street: string;
  DepositAccountId: number;
  CurrencyExchangeJournalId?: any;
  IncomeCurrencyExchangeAccountId?: any;
  ExpenseCurrencyExchangeAccountId?: any;
  SecurityLead?: any;
  Logo: string;
  LastUpdated?: any;
  TransferAccountId?: any;
  SaleNote?: any;
  TaxCode?: any;
  WarehouseId?: any;
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
  Weight?: any;
  ShipAmount?: any;
  DeliveryNote?: any;
  City?: any;
  District?: any;
  Ward?: any;
}

export interface Journal {
  Id: number;
  Code: string;
  Name: string;
  Type: string;
  TypeGet: string;
  UpdatePosted: boolean;
  CurrencyId?: any;
  DefaultDebitAccountId: number;
  DefaultCreditAccountId: number;
  CompanyId: number;
  CompanyName: string;
  JournalUser: boolean;
  ProfitAccountId?: any;
  LossAccountId?: any;
  AmountAuthorizedDiff: number;
  MerchantId?: any;
  MerchantCode?: any;
  DedicatedRefund: boolean;
}

export interface PaymentJournal {
  Id: number;
  Code: string;
  Name: string;
  Type: string;
  TypeGet: string;
  UpdatePosted: boolean;
  CurrencyId?: any;
  DefaultDebitAccountId: number;
  DefaultCreditAccountId: number;
  CompanyId: number;
  CompanyName: string;
  JournalUser: boolean;
  ProfitAccountId?: any;
  LossAccountId?: any;
  AmountAuthorizedDiff: number;
  MerchantId?: any;
  MerchantCode?: any;
  DedicatedRefund: boolean;
}

export interface Partner {
  Id: number;
  Name: string;
  DisplayName: string;
  Street: string;
  Website: string;
  Phone: string;
  PhoneReport?: any;
  Mobile?: any;
  Fax?: any;
  Email: string;
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
  Zalo: string;
  Facebook: string;
  FacebookId: string;
  FacebookASIds?: any;
  FacebookPSId?: any;
  Image?: any;
  ImageUrl: string;
  LastUpdated: Date;
  LoyaltyPoints?: any;
  Discount: number;
  AmountDiscount: number;
  PartnerCategoryId?: any;
  PartnerCategoryName?: any;
  NameNoSign: string;
  PropertyPaymentTermId?: any;
  PropertySupplierPaymentTermId?: any;
  CategoryId: number;
  DateCreated: Date;
  BirthDay: Date;
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
  WardCode?: any;
  WardName?: any;
  City?: any;
  District?: any;
  Ward?: any;
}

export interface Tax {
  Id: number;
  Name: string;
  TypeTaxUse: string;
  ShowTypeTaxUse: string;
  AmountType: string;
  Active: boolean;
  Sequence: number;
  Amount: number;
  AccountId: number;
  RefundAccountId: number;
  PriceInclude: boolean;
  Description?: any;
  CompanyId: number;
  CompanyName: string;
}

export interface ShipReceiver {
  Name: string;
  Phone: string;
  Street: string;
  City: City;
  District: District;
  Ward: Ward;
}

export interface City {
  name: string;
  code: string;
}

export interface District {
  name: string;
  code: string;
}

export interface Ward {
  name?: any;
  code?: any;
}

export interface PriceList {
  Id: number;
  Name: string;
  CurrencyId: number;
  CurrencyName: string;
  Active: boolean;
  CompanyId?: any;
  PartnerCateName?: any;
  Sequence: number;
  DateStart?: any;
  DateEnd?: any;
}

export interface Account {
  Id: number;
  Name: string;
  Code: string;
  UserTypeId: number;
  UserTypeName?: any;
  Active: boolean;
  Note?: any;
  CompanyId: number;
  CompanyName?: any;
  CurrencyId?: any;
  InternalType?: any;
  NameGet: string;
  Reconcile: boolean;
}

export interface OrderLineV2 {
  Id: number;
  ProductId: number;
  ProductUOMId: number;
  PriceUnit: number;
  ProductUOMQty: number;
  UserId?: any;
  Discount: number;
  Discount_Fixed: number;
  PriceTotal: number;
  PriceSubTotal: number;
  Weight: number;
  WeightTotal: number;
  AccountId: number;
  PriceRecent?: any;
  Name?: any;
  IsName: boolean;
  LiveCampaign_DetailId: any | null;
  LiveCampaignQtyChange: any | null;
  OrderId: any | null;
  ProductName: string;
  ProductUOMName: string;
  SaleLineIds: any[];
  ProductNameGet: string;
  SaleLineId?: any;
  Type: string;
  PromotionProgramId?: any;
  Note?: any;
  ProductBarcode: string;
  CompanyId?: any;
  PartnerId?: any;
  PriceSubTotalSigned: number;
  PromotionProgramComboId?: any;
  Product?: Product | null;
  ProductUOM?: ProductUOM;
  Account: Account;
  SaleLine?: any;
  User: User | null;
}

export interface Product {
  Id: number;
  EAN13?: any;
  DefaultCode: string;
  NameTemplate: string;
  NameNoSign?: any;
  ProductTmplId: number;
  UOMId: number;
  UOMName: string;
  UOMPOId: number;
  QtyAvailable: number;
  VirtualAvailable: number;
  OutgoingQty?: any;
  IncomingQty?: any;
  NameGet: string;
  POSCategId?: any;
  Price?: any;
  Barcode: string;
  Image?: any;
  ImageUrl: string;
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
  LastUpdated?: any;
  Type: string;
  CategId: number;
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
  DateCreated?: any;
}

export interface ProductUOM {
  Id: number;
  Name: string;
  NameNoSign?: any;
  Rounding: number;
  Active: boolean;
  Factor: number;
  FactorInv: number;
  UOMType: string;
  CategoryId: number;
  CategoryName?: any;
  Description?: any;
  ShowUOMType: string;
  NameGet?: any;
  ShowFactor: number;
}

export interface Team {
  Id: number;
  Name: string;
  // OwnerId?: any;
  // OwnerToken?: any;
  // OwnerAvatar?: any;
  // OwnerUrl?: any;
  // ChannelId?: any;
  // ChannelToken?: any;
  // ChannelAvatar?: any;
  ShopToken?: any;
  Active?: any;
  CompanyId?: any;
  Type?: any;
  CountPage: number;
  CountGroup: number;
  Facebook_UserId?: any;
  Facebook_ASUserId?: any;
  Facebook_UserName?: any;
  Facebook_UserAvatar?: any;
  Facebook_UserCover?: any;
  Facebook_UserToken?: any;
  Facebook_UserPrivateToken?: any;
  Facebook_UserPrivateToken2?: any;
  Facebook_PagePrivateToken?: any;
  Facebook_PageId?: any;
  Facebook_PageName?: any;
  Facebook_PageLogo?: any;
  Facebook_PageCover?: any;
  Facebook_PageToken?: any;
  Facebook_Link?: any;
  IsDefault: boolean;
  IsConverted: boolean;
  Facebook_TokenExpired?: any;
  Facebook_TypeId: string;
  ParentId?: any;
  ParentName?: any;
  ShopId?: any;
  Facebook_Configs?: any;
}

export interface ShipServiceExtra {
  Id: string;
  Name: string;
  Fee: number;
  Type?: any;
  ExtraMoney?: any;
  OrderTime?: any;
  Pickup_Time?: number | undefined;
  Pickup_Time_Range_Id?: number | undefined;
  IsSelected?: boolean | undefined;
}

export interface ShipExtras {
  PickWorkShift?: any;
  PickWorkShiftName?: any;
  DeliverWorkShift?: any;
  DeliverWorkShiftName?: any;
  PaymentTypeId?: any;
  PosId?: any;
  IsDropoff: boolean;
  IsInsurance: boolean;
  InsuranceFee?: any;
  IsPackageViewable: boolean;
  Is_Fragile: boolean;
  PickupAccountId?: any;
  SoldToAccountId?: any;
  IsPartSign?: any;
  IsAllowTryout: boolean;
  IsDeductCod: boolean;
  IsCollectMoneyGoods: boolean;
  CollectMoneyGoods?: any;
  ConfirmType?: any;
  PartialDelivery?: any;
  IsRefund?: any;
  IsInsuranceEqualTotalAmount?: any;
  ServiceCustoms: ServiceCustoms[];
}

export interface ServiceCustoms {
  ServiceId: string;
  Name: string;
  IsDefault: boolean;
}

export interface Carrier {
  IsPrintCustom: boolean;
  Id: number;
  Name: string;
  SenderName?: any;
  Sequence: number;
  Active: boolean;
  DeliveryType: string;
  DeliveryTypeGet: string;
  ProductId?: any;
  FixedPrice?: any;
  CompanyId?: any;
  Amount?: any;
  FreeOver: boolean;
  Margin?: any;
  HCMPTConfigId?: any;
  GHN_ApiKey?: any;
  GHN_ClientId?: any;
  GHN_NoteCode: string;
  GHN_PaymentTypeId: number;
  GHN_PackageWidth: number;
  GHN_PackageLength: number;
  GHN_PackageHeight: number;
  GHN_ServiceId?: any;
  ViettelPost_UserName?: any;
  ViettelPost_Password?: any;
  ViettelPost_Token?: any;
  ViettelPost_ServiceId?: any;
  ViettelPost_ProductType?: any;
  ViettelPost_OrderPayment?: any;
  ShipChung_ServiceId?: any;
  ShipChung_PaymentTypeID?: any;
  ShipChung_ApiKey?: any;
  HCMPost_sI?: any;
  HCMPost_sK?: any;
  HCMPost_ShopID?: any;
  HCMPost_ShopName?: any;
  HCMPost_ServiceId?: any;
  TokenShip?: any;
  VNPost_ClientId?: any;
  VNPost_ServiceId?: any;
  VNPost_IsContracted: boolean;
  VNPost_PickupType?: any;
  GHTK_Token?: any;
  GHTK_ClientId?: any;
  GHTK_IsFreeShip: number;
  SuperShip_Token?: any;
  SuperShip_ClientId?: any;
  SuperShip_Config: string;
  Config_TransportId?: any;
  Config_TransportName?: any;
  EMS_Service?: any;
  EMS_Inventory?: any;
  EMS_Token?: any;
  TinToc_Service?: any;
  TinToc_ServiceCode?: any;
  NinjaVan_ClientId?: any;
  NinjaVan_ClientSecret?: any;
  NinjaVan_ServiceType?: any;
  NinjaVan_ServiceLevel?: any;
  NinjaVan_Token?: any;
  NinjaVan_BranchId?: any;
  ZTO_PickupType?: any;
  ZTO_ProductType?: any;
  ZTO_SendWayType?: any;
  ZTO_AppCode?: any;
  ZTO_SecretKey?: any;
  Config_DefaultFee?: any;
  Config_DefaultWeight?: any;
  ExtrasText?: any;
  Extras?: any;
  ExtraProperties: string;
}

export interface FastSaleOrder_DefaultDTOV2 {
    Id?: number;
    Name?: any;
    PrintShipCount: number;
    PrintDeliveryCount: number;
    PaymentMessageCount: number;
    PaymentMethod?: string;
    PartnerId: number;
    PartnerDisplayName: string;
    PartnerEmail: string;
    PartnerFacebookId: string;
    PartnerFacebook: string;
    PartnerPhone: string;
    Reference: string;
    PriceListId: number;
    AmountTotal: number;
    TotalQuantity: number;
    Discount: number;
    DiscountAmount: number;
    DecreaseAmount: number;
    WeightTotal: number;
    AmountTax: number;
    AmountUntaxed: number;
    TaxId?: any;
    UserId: string;
    UserName: string;
    DateInvoice: Date | any;
    DateCreated: Date | any;
    State: string;
    ShowState: string;
    CompanyId: number;
    Comment: string;
    WarehouseId: number;
    SaleOnlineIds: string[];
    SaleOnlineNames: any[];
    Residual: number;
    Type: string;
    RefundOrderId?: any;
    ReferenceNumber?: any;
    AccountId: number;
    JournalId: number;
    Number: string;
    PartnerNameNoSign: string;
    DeliveryPrice: number;
    CustomerDeliveryPrice?: any;
    CarrierId?: any;
    CarrierName?: any;
    CarrierDeliveryType?: any;
    DeliveryNote?: any;
    ReceiverName: string;
    ReceiverPhone: string;
    ReceiverAddress: string;
    ReceiverDate?: Date | any;
    ReceiverNote?: any;
    CashOnDelivery: number;
    TrackingRef?: any;
    TrackingArea?: any;
    IsProductDefault: boolean;
    TrackingRefSort?: any;
    ShipStatus: string;
    ShowShipStatus: string;
    SaleOnlineName: string;
    PartnerShippingId?: any;
    PaymentJournalId: number;
    PaymentAmount: number;
    SaleOrderId?: any;
    SaleOrderIds: any[];
    FacebookName: string;
    FacebookNameNosign: string;
    FacebookId: string;
    LiveCampaignId: string | null; // bổ sung 14/07/2022
    LiveCampaignName: string | null; // bổ sung 14/07/2022
    DisplayFacebookName: string;
    Deliver: string;
    ShipWeight: number ;
    ShipPaymentStatus?: any;
    OldCredit: number;
    NewCredit: number;
    Phone?: any;
    Address?: any;
    AmountTotalSigned: number;
    ResidualSigned: number;
    Origin?: any;
    AmountDeposit: number;
    CompanyName: string;
    PreviousBalance: number;
    ToPay?: any;
    NotModifyPriceFromSO: boolean;
    Ship_ServiceId?: any;
    Ship_ServiceName?: any;
    Ship_ServiceExtrasText?: any;
    Ship_ExtrasText?: any;
    Ship_InsuranceFee: number;
    CurrencyName: string;
    TeamId: number;
    TeamOrderCode?: any;
    TeamOrderId?: any;
    TeamType: string;
    Revenue: number;
    SaleOrderDeposit: number;
    Seri?: any;
    NumberOrder?: any;
    DateOrderRed?: Date | any;
    ApplyPromotion?: any;
    TimeLock?: any;
    PageName: string;
    Ship_Receiver: ShipReceiver;
    Ship_Extras: ShipExtras | null;
    PaymentInfo: any[];
    Search?: any;
    Partner: Partner;
    User: User | any;
    Warehouse: Warehouse;
    Company: Company;
    PriceList: PriceList;
    RefundOrder?: any;
    Account: Account;
    Journal: Journal;
    PaymentJournal: PaymentJournal;
    Carrier: Carrier | null;
    Tax: any;
    SaleOrder?: any;
    OrderLines?: OrderLineV2[];
    Ship_ServiceExtras: ShipServiceExtra[];
    Team: Team;
    ShipmentDetailsAship?: ShipmentDetailsAshipDTO;
    MessageCount: number;
    MoveId?: any;
    Tags?: any;
    IRAttachmentUrl?: any;
    IsDeposited?: any;
    Source?: any;
    FormAction?: any;
    Error?: any;
    // HistoryDeliveryDetails?: any[];
    // OutstandingInfo?: any;
}

export interface OrderSendShipDTO {
  Id: number;
  Number: string;
  DateInvoice: Date;
  CarrierId: number;
  CarrierName: string;
  CashOnDelivery: number;
  TotalAmount: number;
  Partner: Partner;
}

export interface ShipmentDetailsAshipDTO{
  ConfigsProvider: AshipGetInfoConfigProviderDto[];
  InsuranceInfo: CalculateFeeInsuranceInfoResponseDto
}
