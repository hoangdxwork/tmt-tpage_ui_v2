import { TDSSafeAny } from 'tmt-tang-ui';
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

export interface FastSaleOrderDTO { // /odata/FastSaleOrder(10139)?$expand= (GET, PUT, POST)
  Id: number;

  Name: string;
  PrintShipCount?: number;
  PrintDeliveryCount?: number;
  PaymentMessageCount?: number;

  /// Khách hàng: Customer == true
  PartnerId: number;
  Partner: PartnerDTO;
  PartnerDisplayName: string;
  PartnerEmail: string;
  PartnerFacebookId: string;
  PartnerFacebook: string;
  PartnerFacebookLink: string;

  PartnerPhone: string;
  Reference: string;

  /// Bảng giá
  PriceListId: number;
  PriceList: Product_PriceListDTO;

  /// Tổng tiền
  AmountTotal?: number;

  /// Tổng số lượng sp
  TotalQuantity?: number;

  /// Chiết khấu tổng
  Discount?: number;

  /// Tiền chiết khấu
  DiscountAmount?: number;

  /// Tiền giảm
  DecreaseAmount?: number;

  /// Tính tổng tiền giảm
  TotalDiscountAmount?: number;

  /// tổng khối lượng
  WeightTotal?: number;

  /// Tiền thuế
  AmountTax?: number;

  /// Tiền trước thuế
  AmountUntaxed?: number;

  TaxId?: number;

  Tax: AccountTaxDTO;

  /// Người bán
  UserId: string;
  User: ApplicationUserDTO;
  UserName: string;

  /// Ngày hóa đơn
  DateInvoice?: Date;
  DateCreated?: Date;

  /// Trạng thái: Nháp, hoàn thành - draft, done
  State: string;

  ShowState: string;

  CompanyId: number;

  Company: CompanyDTO;

  /// Additional Information
  Comment: string;

  WarehouseId: number;
  Warehouse: StockWarehouseDTO;

  OrderLines: Array<FastSaleOrderLineDTO>;
  SaleOnlineIds: Array<string>;
  SaleOnlineNames: Array<string>;
  Residual?: number;
  Type: string;
  RefundOrderId?: number;
  ReferenceNumber: string;
  RefundOrder: FastSaleOrderDTO;

  /// The partner account used for this invoice.
  AccountId: number;
  Account: AccountDTO;
  JournalId: number;
  Journal: AccountJournalDTO;
  Number: string;
  PartnerNameNoSign: string;

  /// Phí giao hàng
  DeliveryPrice?: number;

  CustomerDeliveryPrice?: number;

  /// Đối tác giao hàng
  CarrierId?: number;
  Carrier: DeliveryCarrierDTO;
  CarrierName: string;
  CarrierDeliveryType: string;

  /// Ghi chú giao hàng
  DeliveryNote: string;

  // Thông tin người nhận
  ReceiverName: string;

  ReceiverPhone: string;

  ReceiverAddress: string;
  //Lịch sử đối soát

  // List<HistoryDeliveryStatusDetailViewModel> HistoryDeliveryDetails = new List<HistoryDeliveryStatusDetailViewModel>();

  /// Ngày giao nhận
  ReceiverDate?: Date;

  /// Ghi chú người nhận
  ReceiverNote: string;

  /// Thu hộ COD
  CashOnDelivery?: number;

  /// Mã bưu cục
  TrackingRef: string;
  TrackingArea: string;
  TrackingUrl: string;
  FullAddress: string;

  /// Hoá đơn sản phẩm mặc định
  IsProductDefault: boolean;

  /// Mã sắp xếp: GHN
  TrackingRefSort: string;

  /// Trạng thái giao hàng
  ShipStatus: string;

  ShowShipStatus: string;

  SaleOnlineName: string;

  /// Địa chỉ giao hàng
  PartnerShippingId?: number;

  PartnerShipping: PartnerDTO;
  PaymentJournalId?: number;
  PaymentJournal: AccountJournalDTO;
  PaymentAmount?: number;
  SaleOrderId?: number;
  SaleOrder: SaleOrderDTO;

  SaleOrderIds: Array<number>;

  FacebookName: string;
  FacebookNameNosign: string;
  FacebookId: string;
  DisplayFacebookName: string;
  Deliver: string;

  ShipWeight?: number;

  ShipPaymentStatus: string;

  /// Nợ cũ
  OldCredit?: number;

  /// Nợ mới = Nợ cũ + tổng tiền hóa đơn
  NewCredit?: number;
  Phone: string;
  Address: string;

  AmountTotalSigned?: number;

  ResidualSigned?: number;

  Origin: string;

  AmountDeposit?: number;
  CompanyName: string;

  /// Nợ trước của tờ hóa đơn này
  PreviousBalance?: number;

  /// Nợ đến tờ hóa đơn này
  ToPay?: number;

  PaymentTotal?: number;

  /// Xác định không được phép chỉnh sửa giá từ đơn đặt hàng hay không?
  NotModifyPriceFromSO?: number;

  Ship_Receiver: FastSaleOrder_ReceiverDTO | null;

  Ship_ServiceId: string;

  Ship_ServiceName: string;

  /// Dịch vụ mở rộng lưu trữ dạng text
  Ship_ServiceExtrasText: string;

  /// Danh sách dịch vụ mở rộng
  Ship_ServiceExtras: Array<FastSaleOrder_ServiceExtraDTO>;

  /// Các thông tin vận đơn bổ sung dạng text
  Ship_ExtrasText: string;

  Ship_Extras: DeliveryCarrier_ExtraDTO;

  /// Khai báo giá trị hàng hóa, để bảo hiểm
  Ship_InsuranceFee?: number;

  CurrencyName: string;

  TeamId?: number;
  Team: CRMTeamDTO;

  TeamOrderCode: string;

  TeamOrderId: string;

  TeamType: string;
  Revenue?: number;

  PaymentInfo: Array<PaymentInfoContentDTO>;
  SaleOrderDeposit?: number;
  //new
  Seri: string;
  NumberOrder: string;
  DateOrderRed?: Date;
  Search: SearchStaffReportDTO;

  Lines: Array<FastSaleOrderDTO>;
  ApplyPromotion?: boolean;
  TimeLock?: number;
  PageName: string;
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
