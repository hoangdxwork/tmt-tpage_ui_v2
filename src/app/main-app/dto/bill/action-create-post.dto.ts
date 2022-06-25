export interface Currency {
  Id: number;
  Name: string;
  Rounding: number;
  Symbol: string;
  Active: boolean;
  Position: string;
  Rate: number;
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

export interface FastSaleOrder {
  Id: number;
  Name: string;
  PrintShipCount: number;
  PrintDeliveryCount: number;
  PaymentMessageCount: number;
  MessageCount: number;
  PartnerId: number;
  PartnerDisplayName: string;
  PartnerEmail?: any;
  PartnerFacebookId: string;
  PartnerFacebook?: any;
  PartnerPhone?: any;
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
  CarrierId: number;
  CarrierName: string;
  CarrierDeliveryType: string;
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
  PreviousBalance?: any;
  ToPay?: any;
  NotModifyPriceFromSO: boolean;
  Ship_ServiceId: string;
  Ship_ServiceName: string;
  Ship_ServiceExtrasText?: any;
  Ship_ExtrasText: string;
  Ship_InsuranceFee: number;
  CurrencyName: string;
  TeamId: number;
  TeamOrderCode?: any;
  TeamOrderId?: any;
  TeamType: string;
  Revenue?: any;
  SaleOrderDeposit: number;
  Seri?: any;
  NumberOrder?: any;
  DateOrderRed?: any;
  ApplyPromotion?: any;
  TimeLock?: any;
  PageName: string;
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
}

export interface DefaultGetFastSaleOrderDTO {
  Id: number;
  CompanyId?: any;
  CurrencyId: number;
  PartnerId: number;
  ApproveUserId?: any;
  ApproveUserName?: any;
  CreatedUserName?: any;
  CreatedUserId?: any;
  PartnerDisplayName?: any;
  ContactId?: any;
  ContactName?: any;
  PaymentMethodId: number;
  PartnerType: string;
  PaymentDate: Date;
  DateCreated: Date;
  JournalId: number;
  JournalName?: any;
  JournalType?: any;
  State: string;
  Name?: any;
  PaymentType: string;
  Amount: number;
  AmountStr?: any;
  Communication: string;
  SearchDate?: any;
  StateGet: string;
  PaymentType2?: any;
  Description?: any;
  PaymentDifferenceHandling: string;
  WriteoffAccountId?: any;
  PaymentDifference: number;
  SenderReceiver?: any;
  Phone?: any;
  Address?: any;
  AccountId?: any;
  AccountName?: any;
  CompanyName?: any;
  OrderCode?: any;
  SaleOrderId?: any;
  Currency: Currency;
  FastSaleOrders: FastSaleOrder[];
}
