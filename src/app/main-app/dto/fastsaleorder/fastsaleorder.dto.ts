import { TDSSafeAny } from 'tds-ui/shared/utility';
import { AccountDTO, AccountJournalDTO, AccountTaxDTO } from '../account/account.dto';
import { ApplicationUserDTO } from '../account/application-user.dto';
import { DeliveryCarrierDTO, DeliveryCarrier_ExtraDTO, ServiceCustomDTO } from '../carrier/delivery-carrier.dto';
import { CompanyDTO } from '../company/company.dto';
import { PartnerDTO, ResCurrencyDTO } from '../partner/partner.dto';
import { ProductDTO, ProductUOMDTO, Product_PriceListDTO } from '../product/product.dto';
import { StockWarehouseDTO } from '../product/warehouse.dto';
import { SearchStaffReportDTO } from '../staff/staff.dto';
import { CRMTeamDTO } from '../team/team.dto';

export interface GetSummaryStatusDTO { // /rest/v1.0/fastsaleorder/getsummarystatusfastsaleonline (output)
  total: number;
  type: string;
}

export interface GetSummaryStatusInputDTO {// /rest/v1.0/fastsaleorder/getsummarystatusfastsaleonline (input)
  dateEnd?: Date;
  dateStart?: Date;
  deliveryType: string;
  searchText: string;
  tagIds: string;
  trackingRef: string;
}


export interface HistoryDeliveryStatusDetailDTO {
  Id: number;
  OrderCode: string;
  ShipCode: string;
  OrderAmount: number;
  ShipAmount: number;
  Note: string;
  HistoryId: number;
  IsSuccess: boolean;
  CustomerDeliveryPrice?: number;
  OrderId?: number;
  DeliveryPrice?: number;
  Status: string;
  Date?: Date;
  CarrierName: string;
  DateOrder?: Date;
  State: string;
  ShowState: string;
}

export interface FastSaleOrderInvoiceOpenResDTO { //  /odata/FastSaleOrder/OdataService.ActionInvoiceOpen
  success: boolean;
  warning: string;
  error: string;
  errors: Array<string>;
  orderId?: number;
  ids: Array<number>;
}

export interface FastSaleOrderLineDTO {
  Id: number;

  ProductId: number;
  Product: ProductDTO;

  ProductUOMId: number;
  ProductUOM: ProductUOMDTO;

  PriceUnit: number;
  ProductUOMQty: number;

  /// Nhân viên
  UserId: string;
  User: ApplicationUserDTO;

  /// Chiết khấu %
  Discount?: number;
  Discount_Fixed?: number;

  PriceTotal?: number;
  PriceSubTotal?: number;

  Weight?: number;
  WeightTotal?: number;

  AccountId: number;
  Account: AccountDTO;
  PriceRecent?: number;

  Name: string;
  IsName: boolean;
  ProductName: string;
  ProductUOMName: string;

  SaleLineIds: Array<number>;
  ProductNameGet: string;

  SaleLineId?: number;

  /// percent, fixed
  Type: string;

  PromotionProgramId?: number;
  Note: string;
  ProductBarcode: string;
  CompanyId?: number;
  PartnerId?: number;
  PriceSubTotalSigned?: number;
  PromotionProgramComboId?: number;
}

export interface SaleOrderDTO {
  Id: number;

  DateOrder: Date;

  PartnerId: number;
  Partner: PartnerDTO;
  PartnerDisplayName: string;

  AmountTax?: number;
  AmountDeposit?: number;

  AmountUntaxed?: number;

  AmountTotal?: number;
  TotalQuantity: number;

  Note: string;
  State: string;
  Name: string;

  WarehouseId: number;
  Warehouse: StockWarehouseDTO;

  ProcurementGroupId?: number;

  CompanyId: number;
  Company: CompanyDTO;
  CompanyName: string;

  UserId: string;
  User: ApplicationUserDTO;
  UserName: string;

  OrderPolicy: string;

  PickingPolicy: string;

  DateConfirm?: Date;
  Shipped?: boolean;

  PriceListId: number;
  PriceList: Product_PriceListDTO;

  ShowState: string;
  ShowFastState: string;

  CurrencyId: number;
  Currency: ResCurrencyDTO;

  PaymentJournalId?: number;
  paymentJournal: AccountJournalDTO;

  OrderLines: Array<SaleOrderLineDTO>;

  LoaiDonGia: string;
  DeliveryCount: number;
  InvoiceCount: number;
  InvoiceStatus: string;
  ShowInvoiceStatus: string;
  TongTrongLuong?: number;
  TongTaiTrong?: number;
  DonGiaKg?: number;

  DateExpected?: Date;
  TransportRef: string;

  PartnerInvoiceId: number;
  PartnerInvoice: PartnerDTO;

  PartnerShippingId: number;
  PartnerShipping: PartnerDTO;

  AmountTotalStr: string;

  SearchPartnerId?: number;

  /// Công nợ
  CongNo?: number;
  ProjectId?: number;
  ShippingAddress: string;
  PhoneNumber: string;
  Note2: string;
  DateShipped?: Date;

  CarrierId?: number;
  Carrier: DeliveryCarrierDTO;

  DeliveryPrice?: number;
  InvoiceShippingOnDelivery?: boolean;
  DeliveryRatingSuccess?: boolean;

  DeliveryRatingMessage: string;
  PartnerNameNoSign: string;
  PriceListName: string;

  PaymentTermId?: number;
  // AccountPaymentTermModel PaymentTerm
  IsFast: boolean;
  TableSearch: string;
  NameTypeOrder: string;
  Residual: number;
  PartnerPhone: string;
  PartnerAddress: string;
}

export interface SaleOrderLineDTO {
  Id: number;

  ProductUOSQty?: number;

  ProductUOMId: number;
  ProductUOM: ProductUOMDTO;

  InvoiceUOMId?: number;
  InvoiceUOM: ProductUOMDTO;

  InvoiceQty?: number;
  Sequence?: number;
  PriceUnit: number;
  ProductUOMQty: number;

  Name: string;
  State: string;

  OrderPartnerId?: number;
  OrderId: number;

  /// %
  Discount?: number;

  //Discount_Fixed
  Discount_Fixed?: number;
  DiscountType: string;

  ProductId?: number;
  Product: ProductDTO;

  Invoiced?: boolean;
  CompanyId?: number;

  PriceTax?: number;
  PriceSubTotal?: number;

  PriceTotal?: number;
  PriceRecent?: number;

  Barem?: number;
  Tai?: number;

  VirtualAvailable?: number;
  QtyAvailable?: number;
  PriceOn: string;
  KhoiLuongDelivered?: number;

  QtyDelivered?: number;
  QtyInvoiced?: number;

  KhoiLuong?: number;
  Note: string;
  HasProcurements: boolean;
  WarningMessage: string;
  CustomerLead?: number;

  // SaleLineUOMDomainVM UOMDomain

  ProductUOMName: string;
  Type: string;
  POSId?: number;
  FastId?: number;
  ProductNameGet: string;
  ProductName: string;
}

export interface FastSaleOrder_ReceiverDTO {
  Name: string;
  Phone: string;
  Street: string;
  City: FastSaleOrder_Receiver_NameCodeDTO;
  District: FastSaleOrder_Receiver_NameCodeDTO;
  Ward: FastSaleOrder_Receiver_NameCodeDTO;
  FullAddress: string;
}

export interface FastSaleOrder_Receiver_NameCodeDTO {
  Name: string;
  Code: TDSSafeAny;
}

export interface FastSaleOrder_ServiceExtraDTO {
  /// Id dịch vụ
  Id: string;
  /// Tên dịch vụ
  Name: string;
  /// Phí dịch vụ
  Fee: number;
  /// Loại dịch vụ
  Type: string;
  /// Phí xem hàng
  ExtraMoney?: number;
  /// Thời gian lấy hàng
  OrderTime?: Date;
}

//

export interface PaymentInfoContentDTO { // /odata/FastSaleOrder(10139)/OdataService.GetPaymentInfoJson
  Name: string;
  JournalName: string;
  Amount?: number;
  Currency: string;
  Date: Date;
  PaymentId: number;
  MoveId: number;
  Ref: string;
  AccountPaymentId?: number;
  PaymentPartnerType: string;
}

export interface HistoryFastSaleOrderDTO { // /odata/FastSaleOrder(51122)/ODataService.Histories
  id?: number;
  objectType: string;
  objectName: string;
  objectAction: string;
  objectId: string;
  content: string;
  jsonData: string;
  userName: string;
  avatar: string;
  name: string;
  dateCreated?: Date;
}


export interface ODataFastSaleOrderDTO {
  "@odata.context"?: string,
  "@odata.count"?: number;
  value: Array<FastSaleOrderDTO>
}

export interface FastSaleOrderDTO {
  ShowState: string;
  ShowShipStatus: string;
  TrackingUrl: string;
  FullAddress: string;
  Tags: string;
  ReferenceNumber?: any;
  HasTag: string;
  Id: number;
  Name?: any;
  PartnerId: number;
  PartnerDisplayName: string;
  PartnerFacebookId: string;
  Address: string;
  Phone: string;
  IsPendingApprovalCOD: boolean;
  FacebookName: string;
  FacebookNameNosign: string;
  FacebookId: string;
  DisplayFacebookName: string;
  Deliver: string;
  AmountTotal: number;
  UserId: string;
  UserName: string;
  DateInvoice: Date;
  State: string;
  CompanyId: number;
  Comment: string;
  Residual: number;
  Type: string;
  RefundOrderId?: any;
  Number: string;
  PartnerNameNoSign: string;
  DeliveryPrice: number;
  CarrierId?: number;
  CarrierName: string;
  CashOnDelivery: number;
  TrackingRef: string;
  ShipStatus: string;
  CarrierDeliveryType: string;
  WardName: string;
  DistrictName: string;
  CityName: string;
  CityCode?: any;
  WeightTotal: number;
  ShipWeight: number;
  AmountTax: number;
  AmountUntaxed: number;
  Discount?: number;
  DiscountAmount: number;
  DecreaseAmount?: number;
  ShipPaymentStatus: string;
  CompanyName: string;
  Ship_Receiver_Name: string;
  Ship_Receiver_Phone: string;
  Ship_Receiver_Street: string;
  AmountDeposit: number;
  CustomerDeliveryPrice?: number;
  CreatedById: string;
  DeliveryNote: string;
  PartnerEmail: string;
  IsPrintCustom?: boolean;
  WarehouseId: number;
  WarehouseName: string;
  PaymentJournalId: number;
  PaymentJournalName: string;
  PrintShipCount: number;
  PrintDeliveryCount: number;
  PaymentMessageCount: number;
  IsRefund?: boolean;
  InvoiceReference?: any;
  CreateByName: string;
  DateCreated: Date;
  Reference?: any;
  CRMTeamId?: number;
  CRMTeamName: string;
  SaleOnlineIds: string[];
  Partner: PartnerDTO;
  PartnerName: string;
  IRAttachmentUrl: string;
  PartnerPhone: string;
}

export interface FastSaleOrderModelDTO {
  Id: number;
  Name?: string;
  PrintShipCount?: number;
  PrintDeliveryCount?: number;
  PaymentMessageCount?: number;
  MessageCount?: number;
  PartnerId: number;
  Partner: PartnerDTO;
  PartnerDisplayName: string;
  PartnerEmail: string;
  PartnerFacebookId: string;
  PartnerFacebook: string;
  PartnerPhone: string;
  Reference: string;
  PriceListId: number;
  AmountTotal?: number;
  TotalQuantity: number;
  Discount?: number;
  DiscountAmount?: number;
  DecreaseAmount?: number;
  WeightTotal: number;
  AmountTax?: number;
  AmountUntaxed?: number;
  TaxId?: number;
  Tax?: AccountTaxDTO;
  UserId: string;
  UserName: string;
  DateInvoice?: Date;
  DateCreated?: Date;
  State: string;
  ShowState: string;
  CompanyId: number;
  Comment: string;
  WarehouseId: number;
  SaleOnlineIds: string[];
  SaleOnlineNames: string[];
  Residual: number;
  Type: string;
  RefundOrderId?: number;
  ReferenceNumber?: string;
  AccountId: number;
  JournalId: number;
  Number: string;
  PartnerNameNoSign: string;
  DeliveryPrice?: number;
  CustomerDeliveryPrice?: number;
  CarrierId?: number;
  CarrierName: string;
  CarrierDeliveryType: string;
  DeliveryNote: string;
  ReceiverName: string;
  ReceiverPhone: string;
  ReceiverAddress: string;
  ReceiverDate?: Date;
  ReceiverNote: string;
  CashOnDelivery?: number;
  TrackingRef: string;
  TrackingArea: string;
  IsProductDefault: boolean;
  TrackingRefSort: string;
  ShipStatus: string;
  ShowShipStatus: string;
  SaleOnlineName: string;
  PartnerShippingId?: number;
  PaymentJournalId?: number;
  PaymentAmount: number;
  SaleOrderId?: number;
  SaleOrderIds: number[];
  FacebookName: string;
  FacebookNameNosign: string;
  FacebookId: string;
  DisplayFacebookName: string;
  Deliver: string;
  ShipWeight: number;
  ShipPaymentStatus: string;
  OldCredit: number;
  NewCredit: number;
  Phone: string;
  Address: string;
  AmountTotalSigned?: number;
  ResidualSigned?: number;
  Origin: string;
  AmountDeposit: number;
  CompanyName: string;
  PreviousBalance?: number;
  ToPay?: number;
  NotModifyPriceFromSO: boolean;
  Ship_ServiceId: string;
  Ship_ServiceName: string;
  Ship_ServiceExtrasText: string;
  Ship_ExtrasText: string;
  Ship_InsuranceFee?: number;
  CurrencyName: string;
  TeamId?: number;
  TeamOrderCode: string;
  TeamOrderId: string;
  TeamType: string;
  Revenue?: number;
  SaleOrderDeposit?: number;
  Seri: string;
  NumberOrder: string;
  DateOrderRed?: Date;
  ApplyPromotion?: boolean;
  TimeLock?: number;
  PageName: string;
  Tags: string;
  IRAttachmentUrl: string;
  IsDeposited?: boolean;
  LiveCampaignName: string;
  LiveCampaignId?: string;
  Ship_Receiver: FastSaleOrder_ReceiverDTO;
  Ship_Extras?: DeliveryCarrier_ExtraDTO;
  PaymentInfo: PaymentInfoContentDTO[];
  Search?: SearchStaffReportDTO;
}

export interface ListUpdateDepositDTO {
  IsConfirmed: boolean;
  List: UpdateDepositDTO[];
}

export interface UpdateDepositDTO {
  Id: number;
  AmountDeposit: number;
  IsConfirmed: boolean;
}
