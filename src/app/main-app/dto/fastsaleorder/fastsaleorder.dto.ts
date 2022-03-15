import { AccountDTO, AccountJournalDTO, AccountTaxDTO } from '../account/account.dto';
import { ApplicationUserDTO } from '../account/application-user.dto';
import { DeliveryCarrierDTO, DeliveryCarrier_ExtraDTO, ServiceCustomDTO } from '../carrier/delivery-carrier.dto';
import { CompanyDTO } from '../company/company.dto';
import { PartnerDTO, ResCurrencyDTO } from '../partner/partner.dto';
import { ProductDTO, ProductUOMDTO, Product_PriceListDTO } from '../product/product.dto';
import { StockWarehouseDTO } from '../product/warehouse.dto';
import { SearchStaffReportDTO } from '../staff/staff.dto';
import { CRMTeamDTO } from '../team/team.dto';

export interface FastSaleOrderDTO {
  id: number;

  name: string;
  printShipCount?: number;
  printDeliveryCount?: number;
  paymentMessageCount?: number;

  /// Khách hàng: Customer == true
  partnerId: number;
  partner: PartnerDTO;
  partnerDisplayName: string;
  partnerEmail: string;
  partnerFacebookId: string;
  partnerFacebook: string;
  partnerFacebookLink: string;

  partnerPhone: string;
  reference: string;

  /// Bảng giá
  priceListId: number;
  priceList: Product_PriceListDTO;

  /// Tổng tiền
  amountTotal?: number;

  /// Tổng số lượng sp
  totalQuantity?: number;

  /// Chiết khấu tổng
  discount?: number;

  /// Tiền chiết khấu
  discountAmount?: number;

  /// Tiền giảm
  decreaseAmount?: number;

  /// Tính tổng tiền giảm
  totalDiscountAmount?: number;

  /// tổng khối lượng
  weightTotal?: number;

  /// Tiền thuế
  amountTax?: number;

  /// Tiền trước thuế
  amountUntaxed?: number;

  taxId?: number;

  tax: AccountTaxDTO;

  /// Người bán
  userId: string;
  user: ApplicationUserDTO;
  userName: string;

  /// Ngày hóa đơn
  dateInvoice?: Date;
  dateCreated?: Date;

  /// Trạng thái: Nháp, hoàn thành - draft, done
  state: string;

  showState: string;

  companyId: number;

  company: CompanyDTO;

  /// Additional Information
  comment: string;

  warehouseId: number;
  warehouse: StockWarehouseDTO;

  orderLines: Array<FastSaleOrderLineDTO>;
  saleOnlineIds: Array<string>;
  saleOnlineNames: Array<string>;
  residual?: number;
  type: string;
  refundOrderId?: number;
  referenceNumber: string;
  refundOrder: FastSaleOrderDTO;

  /// The partner account used for this invoice.
  accountId: number;
  account: AccountDTO;
  journalId: number;
  journal: AccountJournalDTO;
  number: string;
  partnerNameNoSign: string;

  /// Phí giao hàng
  deliveryPrice?: number;

  customerDeliveryPrice?: number;

  /// Đối tác giao hàng
  carrierId?: number;
  carrier: DeliveryCarrierDTO;
  carrierName: string;
  carrierDeliveryType: string;

  /// Ghi chú giao hàng
  deliveryNote: string;

  // Thông tin người nhận
  receiverName: string;

  receiverPhone: string;

  receiverAddress: string;
  //Lịch sử đối soát

  // List<HistoryDeliveryStatusDetailViewModel> HistoryDeliveryDetails = new List<HistoryDeliveryStatusDetailViewModel>();

  /// Ngày giao nhận
  ReceiverDate?: Date;

  /// Ghi chú người nhận
  receiverNote: string;

  /// Thu hộ COD
  cashOnDelivery?: number;

  /// Mã bưu cục
  trackingRef: string;
  trackingArea: string;
  trackingUrl: string;
  fullAddress: string;

  /// Hoá đơn sản phẩm mặc định
  isProductDefault: boolean;

  /// Mã sắp xếp: GHN
  trackingRefSort: string;

  /// Trạng thái giao hàng
  shipStatus: string;

  showShipStatus: string;

  saleOnlineName: string;

  /// Địa chỉ giao hàng
  partnerShippingId?: number;

  partnerShipping: PartnerDTO;
  paymentJournalId?: number;
  paymentJournal: AccountJournalDTO;
  paymentAmount?: number;
  saleOrderId?: number;
  saleOrder: SaleOrderDTO;

  saleOrderIds: Array<number>;

  facebookName: string;
  facebookNameNosign: string;
  facebookId: string;
  displayFacebookName: string;
  deliver: string;

  shipWeight?: number;

  shipPaymentStatus: string;

  /// Nợ cũ
  oldCredit?: number;

  /// Nợ mới = Nợ cũ + tổng tiền hóa đơn
  newCredit?: number;
  phone: string;
  address: string;

  amountTotalSigned?: number;

  residualSigned?: number;

  origin: string;

  amountDeposit?: number;
  companyName: string;

  /// Nợ trước của tờ hóa đơn này
  previousBalance?: number;

  /// Nợ đến tờ hóa đơn này
  toPay?: number;

  paymentTotal?: number;

  /// Xác định không được phép chỉnh sửa giá từ đơn đặt hàng hay không?
  notModifyPriceFromSO?: number;

  ship_Receiver: FastSaleOrder_ReceiverDTO;

  ship_ServiceId: string;

  ship_ServiceName: string;

  /// Dịch vụ mở rộng lưu trữ dạng text
  ship_ServiceExtrasText: string;

  /// Danh sách dịch vụ mở rộng
  ship_ServiceExtras: Array<FastSaleOrder_ServiceExtraDTO>;

  /// Các thông tin vận đơn bổ sung dạng text
  ship_ExtrasText: string;

  ship_Extras: DeliveryCarrier_ExtraDTO;

  /// Khai báo giá trị hàng hóa, để bảo hiểm
  ship_InsuranceFee?: number;

  currencyName: string;

  teamId?: number;
  team: CRMTeamDTO;

  teamOrderCode: string;

  teamOrderId: string;

  teamType: string;
  revenue?: number;

  paymentInfo: Array<PaymentInfoContentDTO>;
  saleOrderDeposit?: number;
  //new
  seri: string;
  numberOrder: string;
  dateOrderRed?: Date;
  search: SearchStaffReportDTO;

  lines: Array<FastSaleOrderDTO>;
  applyPromotion?: boolean;
  timeLock?: number;
  pageName: string;
}

export interface FastSaleOrderLineDTO {
  id: number;

  productId: number;
  product: ProductDTO;

  productUOMId: number;
  productUOM: ProductUOMDTO;

  priceUnit: number;
  productUOMQty: number;

  /// Nhân viên
  userId: string;
  user: ApplicationUserDTO;

  /// Chiết khấu %
  discount?: number;
  discount_Fixed?: number;

  priceTotal?: number;
  priceSubTotal?: number;

  weight?: number;
  weightTotal?: number;

  accountId: number;
  account: AccountDTO;
  priceRecent?: number;

  name: string;
  isName: boolean;
  productName: string;
  productUOMName: string;

  saleLineIds: Array<number>;
  productNameGet: string;

  saleLineId?: number;

  /// percent, fixed
  type: string;

  promotionProgramId?: number;
  note: string;
  productBarcode: string;
  companyId?: number;
  partnerId?: number;
  priceSubTotalSigned?: number;
  promotionProgramComboId?: number;
}

export interface SaleOrderDTO {
  id: number;

  dateOrder: Date;

  partnerId: number;
  partner: PartnerDTO;
  partnerDisplayName: string;

  amountTax?: number;
  amountDeposit?: number;

  amountUntaxed?: number;

  amountTotal?: number;
  totalQuantity: number;

  note: string;
  state: string;
  name: string;

  warehouseId: number;
  warehouse: StockWarehouseDTO;

  procurementGroupId?: number;

  companyId: number;
  company: CompanyDTO;
  companyName: string;

  userId: string;
  user: ApplicationUserDTO;
  userName: string;

  orderPolicy: string;

  pickingPolicy: string;

  dateConfirm?: Date;
  shipped?: boolean;

  priceListId: number;
  priceList: Product_PriceListDTO;

  showState: string;
  showFastState: string;

  currencyId: number;
  currency: ResCurrencyDTO;

  paymentJournalId?: number;
  paymentJournal: AccountJournalDTO;

  orderLines: Array<SaleOrderLineDTO>;

  loaiDonGia: string;
  deliveryCount: number;
  invoiceCount: number;
  invoiceStatus: string;
  showInvoiceStatus: string;
  tongTrongLuong?: number;
  tongTaiTrong?: number;
  donGiaKg?: number;

  dateExpected?: Date;
  transportRef: string;

  partnerInvoiceId: number;
  partnerInvoice: PartnerDTO;

  partnerShippingId: number;
  partnerShipping: PartnerDTO;

  amountTotalStr: string;

  searchPartnerId?: number;

  /// Công nợ
  congNo?: number;
  projectId?: number;
  shippingAddress: string;
  phoneNumber: string;
  note2: string;
  dateShipped?: Date;

  carrierId?: number;
  carrier: DeliveryCarrierDTO;

  deliveryPrice?: number;
  invoiceShippingOnDelivery?: boolean;
  deliveryRatingSuccess?: boolean;

  deliveryRatingMessage: string;
  partnerNameNoSign: string;
  priceListName: string;

  paymentTermId?: number;
  // AccountPaymentTermModel PaymentTerm
  isFast: boolean;
  tableSearch: string;
  nameTypeOrder: string;
  residual: number;
  partnerPhone: string;
  partnerAddress: string;
}

export interface SaleOrderLineDTO {
  id: number;

  productUOSQty?: number;

  productUOMId: number;
  productUOM: ProductUOMDTO;

  invoiceUOMId?: number;
  invoiceUOM: ProductUOMDTO;

  invoiceQty?: number;
  sequence?: number;
  priceUnit: number;
  productUOMQty: number;

  name: string;
  state: string;

  orderPartnerId?: number;
  orderId: number;

  /// %
  discount?: number;

  //Discount_Fixed
  discount_Fixed?: number;
  discountType: string;

  productId?: number;
  product: ProductDTO;

  invoiced?: boolean;
  companyId?: number;

  priceTax?: number;
  priceSubTotal?: number;

  priceTotal?: number;
  priceRecent?: number;

  barem?: number;
  tai?: number;

  virtualAvailable?: number;
  qtyAvailable?: number;
  priceOn: string;
  khoiLuongDelivered?: number;

  qtyDelivered?: number;
  qtyInvoiced?: number;

  khoiLuong?: number;
  note: string;
  hasProcurements: boolean;
  warningMessage: string;
  customerLead?: number;

  // SaleLineUOMDomainVM UOMDomain

  productUOMName: string;
  type: string;
  pOSId?: number;
  fastId?: number;
  productNameGet: string;
  productName: string;
}

export interface PaymentInfoContentDTO {
  name: string;
  journalName: string;
  amount?: number;
  currency: string;
  date: Date;
  paymentId: number;
  moveId: number;
  ref: string;
  accountPaymentId?: number;
  paymentPartnerType: string;
}

export interface FastSaleOrder_ReceiverDTO {
  name: string;
  phone: string;
  street: string;
  city: FastSaleOrder_Receiver_NameCodeDTO;
  district: FastSaleOrder_Receiver_NameCodeDTO;
  ward: FastSaleOrder_Receiver_NameCodeDTO;
  fullAddress: string;
}

export interface FastSaleOrder_Receiver_NameCodeDTO {
  name: string;
  code: string;
}

export interface FastSaleOrder_ServiceExtraDTO {
  /// Id dịch vụ
  id: string;
  /// Tên dịch vụ
  name: string;
  /// Phí dịch vụ
  fee: number;
  /// Loại dịch vụ
  type: string;
  /// Phí xem hàng
  extraMoney?: number;
  /// Thời gian lấy hàng
  orderTime?: Date;
}
