export interface City {
  name: string | undefined;
  code: string | undefined;
}

export interface District {
  name: string | undefined;
  code: string | undefined;
}

export interface Ward {
  name: string | undefined;
  code: string | undefined;
}

export interface ShipReceiver {
  Name: string;
  Phone: string;
  Street: string;
  City: City;
  District: District;
  Ward: Ward;
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
  DateStart: Date;
  DateEnd: Date;
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

export interface ChangePartnerPriceListDTO {
  Id: number;
  Name?: any;
  PrintShipCount: number;
  PrintDeliveryCount: number;
  PaymentMessageCount: number;
  MessageCount: number;
  PartnerId: number;
  PartnerDisplayName?: any;
  PartnerEmail?: any;
  PartnerFacebookId?: any;
  PartnerFacebook?: any;
  PartnerPhone?: any;
  Reference?: any;
  PriceListId: number;
  AmountTotal?: any;
  TotalQuantity: number;
  Discount: number;
  DiscountAmount: number;
  DecreaseAmount: number;
  WeightTotal?: any;
  AmountTax?: any;
  AmountUntaxed?: any;
  TaxId?: any;
  UserId: string;
  UserName: string;
  DateInvoice: Date;
  DateCreated: Date;
  State: string;
  ShowState: string;
  CompanyId: number;
  Comment?: any;
  WarehouseId: number;
  SaleOnlineIds: any[];
  SaleOnlineNames: any[];
  Residual?: any;
  Type: string;
  RefundOrderId?: any;
  ReferenceNumber?: any;
  AccountId: number;
  JournalId: number;
  Number?: any;
  PartnerNameNoSign?: any;
  DeliveryPrice: number;
  CustomerDeliveryPrice?: any;
  CarrierId: number;
  CarrierName?: any;
  CarrierDeliveryType?: any;
  DeliveryNote: string;
  ReceiverName?: any;
  ReceiverPhone?: any;
  ReceiverAddress?: any;
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
  FacebookName?: any;
  FacebookNameNosign?: any;
  FacebookId?: any;
  DisplayFacebookName?: any;
  Deliver?: any;
  ShipWeight: number;
  ShipPaymentStatus?: any;
  OldCredit: number;
  NewCredit: number;
  Phone?: any;
  Address?: any;
  AmountTotalSigned?: any;
  ResidualSigned?: any;
  Origin?: any;
  AmountDeposit: number;
  CompanyName: string;
  PreviousBalance: number;
  ToPay?: any;
  NotModifyPriceFromSO: boolean;
  Ship_ServiceId?: any;
  Ship_ServiceName?: any;
  Ship_ServiceExtrasText: string;
  Ship_ExtrasText?: any;
  Ship_InsuranceFee: number;
  CurrencyName?: any;
  TeamId?: any;
  TeamOrderCode?: any;
  TeamOrderId?: any;
  TeamType?: any;
  Revenue: number;
  SaleOrderDeposit?: any;
  Seri?: any;
  NumberOrder?: any;
  DateOrderRed?: any;
  ApplyPromotion?: any;
  TimeLock?: any;
  PageName?: any;
  Tags?: any;
  IRAttachmentUrl?: any;
  IsDeposited?: any;
  LiveCampaignName?: any;
  LiveCampaignId?: any;
  FormAction?: any;
  Ship_Receiver: ShipReceiver;
  Ship_Extras?: any;
  PaymentInfo: any[];
  Search?: any;
  Error?: any;
  PartnerShipping?: any;
  PriceList: PriceList;
  Account: Account;
}
