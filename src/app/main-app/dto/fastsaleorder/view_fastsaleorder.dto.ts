export interface View_FastSaleOrdersDTO { //  /odata/FastSaleOrder/ODataService.GetView?
  id: number;
  name: string;

  showState: string;
  showShipStatus: string;

  trackingUrl: string;

  fullAddress: string;

  tags: string;
  referenceNumber: string;
  hasTag: string;

  /// Khách hàng: Customer == true
  partnerId: number;
  partnerDisplayName: string;
  partnerFacebookId: string;
  partnerFacebookLink: string;

  address: string;
  phone: string;
  isPendingApprovalCOD: boolean;
  facebookName: string;
  facebookNameNosign: string;
  facebookId: string;
  displayFacebookName: string;
  deliver: string;

  /// Tổng tiền
  amountTotal?: number;

  /// Người bán
  userId: string;
  userName: string;

  /// Ngày hóa đơn
  dateInvoice?: Date;

  /// Trạng thái: Nháp, hoàn thành - draft, done
  state: string;

  companyId: number;

  /// Additional Information
  comment: string;

  residual?: number;

  type: string;
  refundOrderId: number;

  number: string;

  partnerNameNoSign: string;

  /// Phí giao hàng
  deliveryPrice?: number;

  /// Đối tác giao hàng
  carrierId?: number;
  carrierName: string;

  /// Thu hộ COD
  cashOnDelivery?: number;

  /// Mã bưu cục
  trackingRef: string;

  /// Trạng thái giao hàng
  shipStatus: string;

  carrierDeliveryType: string;

  wardName: string;
  districtName: string;
  cityName: string;
  cityCode: string;

  /// tổng khối lượng
  weightTotal?: number;

  /// Khối lượng ship
  shipWeight?: number;

  /// Tiền thuế
  amountTax?: number;

  /// Tiền trước thuế
  amountUntaxed?: number;

  discount?: number;
  discountAmount?: number;
  decreaseAmount?: number;
  shipPaymentStatus: string;
  companyName: string;
  ship_Receiver_Name: string;
  ship_Receiver_Phone: string;
  ship_Receiver_Street: string;
  amountDeposit?: number;
  customerDeliveryPrice?: number;
  createdById: string;
  deliveryNote: string;
  partnerEmail: string;
  isPrintCustom?: boolean;
  warehouseId: number;
  warehouseName: string;
  paymentJournalId?: number;
  paymentJournalName: string;
  printShipCount?: number;
  printDeliveryCount?: number;
  paymentMessageCount?: number;
  isRefund?: boolean;
  invoiceReference: string;

  createByName: string;
  dateCreated?: Date;
  reference: string;

  crmTeamId?: number;
  crmTeamName: string;
}

export interface ViewConversation_FastSaleOrdersDTO {
  Id: number;
  PartnerId: number;
  DateCreated?: Date;
  AmountTotal?: number;
  PaymentJournalName: string;
  CarrierName: string;
  Name: string;
  State: string;
  Type: string;
  Number: string;
  TrackingRef: string;
  DeliveryNote: string;
  ShipPaymentStatus: string;
  Address: string;
  Phone: string;
  ShowState: string;
}
