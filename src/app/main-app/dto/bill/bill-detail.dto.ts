export interface City {
  name: string;
  code: string;
}

export interface District {
  name: string;
  code: string;
}

export interface Ward {
  name: string;
  code: string;
}

export interface ShipReceiver {
  Name: string;
  Phone: string;
  Street: string;
  City: City;
  District: District;
  Ward: Ward;
}

export interface Partner {
  Id: number;
  Name: string;
  DisplayName?: any;
  Street?: any;
  Website?: any;
  Phone?: any;
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

export interface Warehouse {
  Id: number;
  Code: string;
  Name: string;
  CompanyId: number;
  NameGet: string;
  CompanyName?: any;
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
  DepositAccountId?: any;
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

export interface PriceList {
  Id: number;
  Name: string;
  CurrencyId: number;
  CurrencyName: string;
  Active: boolean;
  CompanyId: number;
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

export interface Journal {
  Id: number;
  Code?: any;
  Name: string;
  Type: string;
  TypeGet: string;
  UpdatePosted: boolean;
  CurrencyId?: any;
  DefaultDebitAccountId?: any;
  DefaultCreditAccountId?: any;
  CompanyId: number;
  CompanyName?: any;
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
  Code?: any;
  Name: string;
  Type: string;
  TypeGet: string;
  UpdatePosted: boolean;
  CurrencyId?: any;
  DefaultDebitAccountId?: any;
  DefaultCreditAccountId?: any;
  CompanyId: number;
  CompanyName?: any;
  JournalUser: boolean;
  ProfitAccountId?: any;
  LossAccountId?: any;
  AmountAuthorizedDiff: number;
  MerchantId?: any;
  MerchantCode?: any;
  DedicatedRefund: boolean;
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

export interface OrderLine {
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
  ProductName: string;
  ProductUOMName: string;
  SaleLineIds: any[];
  ProductNameGet: string;
  SaleLineId?: any;
  Type: string;
  PromotionProgramId?: any;
  Note: string;
  ProductBarcode: string;
  CompanyId: number;
  PartnerId: number;
  PriceSubTotalSigned: number;
  PromotionProgramComboId?: any;
  Product: Product;
  ProductUOM: ProductUOM;
  Account: Account;
  SaleLine?: any;
  User: User;
}

export interface Team {
  Id: number;
  Name: string;
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

export interface BillDetailDTO {
  "@odata.context"?: string;
  Id: number;
  Name?: any;
  PrintShipCount: number;
  PrintDeliveryCount: number;
  PaymentMessageCount: number;
  PartnerId: number;
  PartnerDisplayName: string;
  PartnerEmail: string;
  PartnerFacebookId: string;
  PartnerFacebook: string;
  PartnerPhone: string;
  Reference?: any;
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
  DateInvoice: Date;
  DateCreated: Date;
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
  CustomerDeliveryPrice: number;
  CarrierId?: any;
  CarrierName?: any;
  CarrierDeliveryType?: any;
  DeliveryNote?: any;
  ReceiverName: string;
  ReceiverPhone: string;
  ReceiverAddress: string;
  ReceiverDate: Date;
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
  DisplayFacebookName: string;
  Deliver: string;
  ShipWeight: number;
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
  Ship_ServiceId: string;
  Ship_ServiceName: string;
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
  DateOrderRed?: any;
  ApplyPromotion?: any;
  TimeLock?: any;
  PageName: string;
  Ship_Receiver: ShipReceiver;
  Ship_Extras?: any;
  PaymentInfo: any[];
  Search?: any;
  Partner: Partner;
  User: User;
  Warehouse: Warehouse;
  Company: Company;
  PriceList: PriceList;
  RefundOrder?: any;
  Account: Account;
  Journal: Journal;
  PaymentJournal: PaymentJournal;
  Carrier?: any;
  Tax?: any;
  SaleOrder?: any;
  OrderLines: OrderLine[];
  Ship_ServiceExtras: any[];
  Team: Team;
}
