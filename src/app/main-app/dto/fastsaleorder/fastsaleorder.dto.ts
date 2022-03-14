import { AccountDTO, AccountJournalDTO, AccountTaxDTO } from '../account/account.dto';
import { ApplicationUserDTO } from '../account/application-user.dto';
import { DeliveryCarrierDTO, DeliveryCarrier_ExtraDTO, ServiceCustomDTO } from '../carrier/delivery-carrier.dto';
import { CompanyDTO } from '../company/company.dto';
import { PartnerDTO, ResCurrencyDTO } from '../partner/partner.dto';
import { ProductDTO, ProductUOMDTO, Product_PriceListDTO } from '../product/product.dto';
import { StockWarehouseDTO } from '../product/warehouse.dto';
import { SearchStaffReportDTO } from '../staff/staff.dto';
import { CRMTeamDTO } from '../team/team.dto';

export class FastSaleOrderDTO {
  public id: number;

  public name: string;
  public printShipCount?: number;
  public printDeliveryCount?: number;
  public paymentMessageCount?: number;

  /// Khách hàng: Customer == true
  public partnerId: number;
  public partner: PartnerDTO;
  public partnerDisplayName: string;
  public partnerEmail: string;
  public partnerFacebookId: string;
  public partnerFacebook: string;
  public partnerFacebookLink: string;

  public partnerPhone: string;
  public reference: string;

  /// Bảng giá
  public priceListId: number;
  public priceList: Product_PriceListDTO;

  /// Tổng tiền
  public amountTotal?: number;

  /// Tổng số lượng sp
  public totalQuantity?: number;

  /// Chiết khấu tổng
  public discount?: number;

  /// Tiền chiết khấu
  public discountAmount?: number;

  /// Tiền giảm
  public decreaseAmount?: number;

  /// Tính tổng tiền giảm
  public totalDiscountAmount?: number;

  /// tổng khối lượng
  public weightTotal?: number;

  /// Tiền thuế
  public amountTax?: number;

  /// Tiền trước thuế
  public amountUntaxed?: number;

  public taxId?: number;

  public tax: AccountTaxDTO;

  /// Người bán
  public userId: string;
  public user: ApplicationUserDTO;
  public userName: string;

  /// Ngày hóa đơn
  public dateInvoice?: Date;
  public dateCreated?: Date;

  /// Trạng thái: Nháp, hoàn thành - draft, done
  public state: string;

  public showState: string;

  public companyId: number;

  public company: CompanyDTO;

  /// Additional Information
  public comment: string;

  public warehouseId: number;
  public warehouse: StockWarehouseDTO;

  public orderLines: Array<FastSaleOrderLineDTO>;
  public saleOnlineIds: Array<string>;
  public saleOnlineNames: Array<string>;
  public residual?: number;
  public type: string;
  public refundOrderId?: number;
  public referenceNumber: string;
  public refundOrder: FastSaleOrderDTO;

  /// The partner account used for this invoice.
  public accountId: number;
  public account: AccountDTO;
  public journalId: number;
  public journal: AccountJournalDTO;
  public number: string;
  public partnerNameNoSign: string;

  /// Phí giao hàng
  public deliveryPrice?: number;

  public customerDeliveryPrice?: number;

  /// Đối tác giao hàng
  public carrierId?: number;
  public carrier: DeliveryCarrierDTO;
  public carrierName: string;
  public carrierDeliveryType: string;

  /// Ghi chú giao hàng
  public deliveryNote: string;

  // Thông tin người nhận
  public receiverName: string;

  public receiverPhone: string;

  public receiverAddress: string;
  //Lịch sử đối soát

  // public List<HistoryDeliveryStatusDetailViewModel> HistoryDeliveryDetails = new List<HistoryDeliveryStatusDetailViewModel>();

  /// Ngày giao nhận
  public ReceiverDate?: Date;

  /// Ghi chú người nhận
  public receiverNote: string;

  /// Thu hộ COD
  public cashOnDelivery?: number;

  /// Mã bưu cục
  public trackingRef: string;
  public trackingArea: string;
  public trackingUrl: string;
  public fullAddress: string;

  /// Hoá đơn sản phẩm mặc định
  public isProductDefault: boolean;

  /// Mã sắp xếp: GHN
  public trackingRefSort: string;

  /// Trạng thái giao hàng
  public shipStatus: string;

  public showShipStatus: string;

  public saleOnlineName: string;

  /// Địa chỉ giao hàng
  public partnerShippingId?: number;

  public partnerShipping: PartnerDTO;
  public paymentJournalId?: number;
  public paymentJournal: AccountJournalDTO;
  public paymentAmount?: number;
  public saleOrderId?: number;
  public saleOrder: SaleOrderDTO;

  public saleOrderIds: Array<number>;

  public facebookName: string;
  public facebookNameNosign: string;
  public facebookId: string;
  public displayFacebookName: string;
  public deliver: string;

  public shipWeight?: number;

  public shipPaymentStatus: string;

  /// Nợ cũ
  public oldCredit?: number;

  /// Nợ mới = Nợ cũ + tổng tiền hóa đơn
  public newCredit?: number;
  public phone: string;
  public address: string;

  public amountTotalSigned?: number;

  public residualSigned?: number;

  public origin: string;

  public amountDeposit?: number;
  public companyName: string;

  /// Nợ trước của tờ hóa đơn này
  public previousBalance?: number;

  /// Nợ đến tờ hóa đơn này
  public toPay?: number;

  public paymentTotal?: number;

  /// Xác định không được phép chỉnh sửa giá từ đơn đặt hàng hay không?
  public notModifyPriceFromSO?: number;

  public ship_Receiver: FastSaleOrder_ReceiverDTO;

  public ship_ServiceId: string;

  public ship_ServiceName: string;

  /// Dịch vụ mở rộng lưu trữ dạng text
  public ship_ServiceExtrasText: string;

  /// Danh sách dịch vụ mở rộng
  public ship_ServiceExtras: Array<FastSaleOrder_ServiceExtraDTO>;

  /// Các thông tin vận đơn bổ sung dạng text
  public ship_ExtrasText: string;

  public ship_Extras: DeliveryCarrier_ExtraDTO;

  /// Khai báo giá trị hàng hóa, để bảo hiểm
  public ship_InsuranceFee?: number;

  public currencyName: string;

  public teamId?: number;
  public team: CRMTeamDTO;

  public teamOrderCode: string;

  public teamOrderId: string;

  public teamType: string;
  public revenue?: number;

  public paymentInfo: Array<PaymentInfoContentDTO>;
  public saleOrderDeposit?: number;
  //new
  public seri: string;
  public numberOrder: string;
  public dateOrderRed?: Date;
  public search: SearchStaffReportDTO;

  public lines: Array<FastSaleOrderDTO>;
  public applyPromotion?: boolean;
  public timeLock?: number;
  public pageName: string;

  constructor() {
    this.lines = new Array<FastSaleOrderDTO>();
    this.ship_ServiceExtras = Array<FastSaleOrder_ServiceExtraDTO>();
  }
}

export class FastSaleOrderLineDTO {
  public id: number;

  public productId: number;
  public product: ProductDTO;

  public productUOMId: number;
  public productUOM: ProductUOMDTO;

  public priceUnit: number;
  public productUOMQty: number;

  /// Nhân viên
  public userId: string;
  public user: ApplicationUserDTO;

  /// Chiết khấu %
  public discount?: number;
  public discount_Fixed?: number;

  public priceTotal?: number;
  public priceSubTotal?: number;

  public weight?: number;
  public weightTotal?: number;

  public accountId: number;
  public account: AccountDTO;
  public priceRecent?: number;

  public name: string;
  public isName: boolean;
  public productName: string;
  public productUOMName: string;

  public saleLineIds: Array<number>;
  public productNameGet: string;

  public saleLineId?: number;

  /// percent, fixed
  public type: string;

  public promotionProgramId?: number;
  public note: string;
  public productBarcode: string;
  public companyId?: number;
  public partnerId?: number;
  public priceSubTotalSigned?: number;
  public promotionProgramComboId?: number;

  constructor() {
    this.user = new ApplicationUserDTO();
  }
}

export class SaleOrderDTO {
  public id: number;

  public dateOrder: Date;

  public partnerId: number;
  public partner: PartnerDTO;
  public partnerDisplayName: string;

  public amountTax?: number;
  public amountDeposit?: number;

  public amountUntaxed?: number;

  public amountTotal?: number;
  public totalQuantity: number;

  public note: string;
  public state: string;
  public name: string;

  public warehouseId: number;
  public warehouse: StockWarehouseDTO;

  public procurementGroupId?: number;

  public companyId: number;
  public company: CompanyDTO;
  public companyName: string;

  public userId: string;
  public user: ApplicationUserDTO;
  public userName: string;

  public orderPolicy: string;

  public pickingPolicy: string;

  public dateConfirm?: Date;
  public shipped?: boolean;

  public priceListId: number;
  public priceList: Product_PriceListDTO;

  public showState: string;
  public showFastState: string;

  public currencyId: number;
  public currency: ResCurrencyDTO;

  public paymentJournalId?: number;
  public paymentJournal: AccountJournalDTO;

  public orderLines: Array<SaleOrderLineDTO>;

  public loaiDonGia: string;
  public deliveryCount: number;
  public invoiceCount: number;
  public invoiceStatus: string;
  public showInvoiceStatus: string;
  public tongTrongLuong?: number;
  public tongTaiTrong?: number;
  public donGiaKg?: number;

  public dateExpected?: Date;
  public transportRef: string;

  public partnerInvoiceId: number;
  public partnerInvoice: PartnerDTO;

  public partnerShippingId: number;
  public partnerShipping: PartnerDTO;

  public amountTotalStr: string;

  public searchPartnerId?: number;

  /// Công nợ
  public congNo?: number;
  public projectId?: number;
  public shippingAddress: string;
  public phoneNumber: string;
  public note2: string;
  public dateShipped?: Date;

  public carrierId?: number;
  public carrier: DeliveryCarrierDTO;

  public deliveryPrice?: number;
  public invoiceShippingOnDelivery?: boolean;
  public deliveryRatingSuccess?: boolean;

  public deliveryRatingMessage: string;
  public partnerNameNoSign: string;
  public priceListName: string;

  public paymentTermId?: number;
  // public AccountPaymentTermModel PaymentTerm
  public isFast: boolean;
  public tableSearch: string;
  public nameTypeOrder: string;
  public residual: number;
  public partnerPhone: string;
  public partnerAddress: string;
}

export class SaleOrderLineDTO {
  public id: number;

  public productUOSQty?: number;

  public productUOMId: number;
  public productUOM: ProductUOMDTO;

  public invoiceUOMId?: number;
  public invoiceUOM: ProductUOMDTO;

  public invoiceQty?: number;
  public sequence?: number;
  public priceUnit: number;
  public productUOMQty: number;

  public name: string;
  public state: string;

  public orderPartnerId?: number;
  public orderId: number;

  /// %
  public discount?: number;

  //Discount_Fixed
  public discount_Fixed?: number;
  public discountType: string;

  public productId?: number;
  public product: ProductDTO;

  public invoiced?: boolean;
  public companyId?: number;

  public priceTax?: number;
  public priceSubTotal?: number;

  public priceTotal?: number;
  public priceRecent?: number;

  public barem?: number;
  public tai?: number;

  public virtualAvailable?: number;
  public qtyAvailable?: number;
  public priceOn: string;
  public khoiLuongDelivered?: number;

  public qtyDelivered?: number;
  public qtyInvoiced?: number;

  public khoiLuong?: number;
  public note: string;
  public hasProcurements: boolean;
  public warningMessage: string;
  public customerLead?: number;

  // public SaleLineUOMDomainVM UOMDomain

  public productUOMName: string;
  public type: string;
  public pOSId?: number;
  public fastId?: number;
  public productNameGet: string;
  public productName: string;
}

export class PaymentInfoContentDTO {
  public name: string;
  public journalName: string;
  public amount?: number;
  public currency: string;
  public date: Date;
  public paymentId: number;
  public moveId: number;
  public ref: string;
  public accountPaymentId?: number;
  public paymentPartnerType: string;
}

export class FastSaleOrder_ReceiverDTO {
  public name: string;
  public phone: string;
  public street: string;
  public city: FastSaleOrder_Receiver_NameCodeDTO;
  public district: FastSaleOrder_Receiver_NameCodeDTO;
  public ward: FastSaleOrder_Receiver_NameCodeDTO;
  public fullAddress: string;
}

export class FastSaleOrder_Receiver_NameCodeDTO {
  public name: string;
  public code: string;
}

export class FastSaleOrder_ServiceExtraDTO {
  /// Id dịch vụ
  public id: string;
  /// Tên dịch vụ
  public name: string;
  /// Phí dịch vụ
  public fee: number;
  /// Loại dịch vụ
  public type: string;
  /// Phí xem hàng
  public extraMoney?: number;
  /// Thời gian lấy hàng
  public orderTime?: Date;
}
