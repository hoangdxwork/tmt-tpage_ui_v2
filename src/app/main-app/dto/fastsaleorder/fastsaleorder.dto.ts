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
  public Id: number;

  public ProductId: number;
  public Product: ProductDTO;

  public ProductUOMId: number;
  public ProductUOM: ProductUOMDTO;

  public PriceUnit: number;
  public ProductUOMQty: number;

  /// Nhân viên
  public UserId: string;
  public User: ApplicationUserDTO;

  /// Chiết khấu %
  public Discount?: number;
  public Discount_Fixed?: number;

  public PriceTotal?: number;
  public PriceSubTotal?: number;

  public Weight?: number;
  public WeightTotal?: number;

  public AccountId: number;
  public Account: AccountDTO;
  public PriceRecent?: number;

  public Name: string;
  public IsName: boolean;
  public ProductName: string;
  public ProductUOMName: string;

  public SaleLineIds: Array<number>;
  public ProductNameGet: string;

  public SaleLineId?: number;

  /// percent, fixed
  public Type: string;

  public PromotionProgramId?: number;
  public Note: string;
  public ProductBarcode: string;
  public CompanyId?: number;
  public PartnerId?: number;
  public PriceSubTotalSigned?: number;
  public PromotionProgramComboId?: number;

  constructor() {
    this.User = new ApplicationUserDTO();
  }
}

export class SaleOrderDTO {
  public Id: number;

  public DateOrder: Date;

  public PartnerId: number;
  public Partner: PartnerDTO;
  public PartnerDisplayName: string;

  public AmountTax?: number;
  public AmountDeposit?: number;

  public AmountUntaxed?: number;

  public AmountTotal?: number;
  public TotalQuantity: number;

  public Note: string;
  public State: string;
  public Name: string;

  public WarehouseId: number;
  public Warehouse: StockWarehouseDTO;

  public ProcurementGroupId?: number;

  public CompanyId: number;
  public Company: CompanyDTO;
  public CompanyName: string;

  public UserId: string;
  public User: ApplicationUserDTO;
  public UserName: string;

  public OrderPolicy: string;

  public PickingPolicy: string;

  public DateConfirm?: Date;
  public Shipped?: boolean;

  public PriceListId: number;
  public PriceList: Product_PriceListDTO;

  public ShowState: string;
  public ShowFastState: string;

  public CurrencyId: number;
  public Currency: ResCurrencyDTO;

  public PaymentJournalId?: number;
  public PaymentJournal: AccountJournalDTO;

  public OrderLines: Array<SaleOrderLineDTO>;

  public LoaiDonGia: string;
  public DeliveryCount: number;
  public InvoiceCount: number;
  public InvoiceStatus: string;
  public ShowInvoiceStatus: string;
  public TongTrongLuong?: number;
  public TongTaiTrong?: number;
  public DonGiaKg?: number;

  public DateExpected?: Date;
  public TransportRef: string;

  public PartnerInvoiceId: number;
  public PartnerInvoice: PartnerDTO;

  public PartnerShippingId: number;
  public PartnerShipping: PartnerDTO;

  public AmountTotalStr: string;

  public SearchPartnerId?: number;

  /// Công nợ
  public CongNo?: number;
  public ProjectId?: number;
  public ShippingAddress: string;
  public PhoneNumber: string;
  public Note2: string;
  public DateShipped?: Date;

  public CarrierId?: number;
  public Carrier: DeliveryCarrierDTO;

  public DeliveryPrice?: number;
  public InvoiceShippingOnDelivery?: boolean;
  public DeliveryRatingSuccess?: boolean;

  public DeliveryRatingMessage: string;
  public PartnerNameNoSign: string;
  public PriceListName: string;

  public PaymentTermId?: number;
  // public AccountPaymentTermModel PaymentTerm
  public IsFast: boolean;
  public TableSearch: string;
  public NameTypeOrder: string;
  public Residual: number;
  public PartnerPhone: string;
  public PartnerAddress: string;
}

export class SaleOrderLineDTO {
  public Id: number;

  public ProductUOSQty?: number;

  public ProductUOMId: number;
  public ProductUOM: ProductUOMDTO;

  public InvoiceUOMId?: number;
  public InvoiceUOM: ProductUOMDTO;

  public InvoiceQty?: number;
  public Sequence?: number;
  public PriceUnit: number;
  public ProductUOMQty: number;

  public Name: string;
  public State: string;

  public OrderPartnerId?: number;
  public OrderId: number;

  /// %
  public Discount?: number;

  //Discount_Fixed
  public Discount_Fixed?: number;
  public DiscountType: string;

  public ProductId?: number;
  public Product: ProductDTO;

  public Invoiced?: boolean;
  public CompanyId?: number;

  public PriceTax?: number;
  public PriceSubTotal?: number;

  public PriceTotal?: number;
  public PriceRecent?: number;

  public Barem?: number;
  public Tai?: number;

  public VirtualAvailable?: number;
  public QtyAvailable?: number;
  public PriceOn: string;
  public KhoiLuongDelivered?: number;

  public QtyDelivered?: number;
  public QtyInvoiced?: number;

  public KhoiLuong?: number;
  public Note: string;
  public HasProcurements: boolean;
  public WarningMessage: string;
  public CustomerLead?: number;

  // public SaleLineUOMDomainVM UOMDomain

  public ProductUOMName: string;
  public Type: string;
  public POSId?: number;
  public FastId?: number;
  public ProductNameGet: string;
  public ProductName: string;
}

export class PaymentInfoContentDTO {
  public Name: string;
  public JournalName: string;
  public Amount?: number;
  public Currency: string;
  public Date: Date;
  public PaymentId: number;
  public MoveId: number;
  public Ref: string;
  public AccountPaymentId?: number;
  public PaymentPartnerType: string;
}

export class FastSaleOrder_ReceiverDTO {
  public Name: string;
  public Phone: string;
  public Street: string;
  public City: FastSaleOrder_Receiver_NameCodeDTO;
  public District: FastSaleOrder_Receiver_NameCodeDTO;
  public Ward: FastSaleOrder_Receiver_NameCodeDTO;
  public FullAddress: string;
}

export class FastSaleOrder_Receiver_NameCodeDTO {
  public name: string;
  public code: string;
}

export class FastSaleOrder_ServiceExtraDTO {
  /// Id dịch vụ
  public Id: string;
  /// Tên dịch vụ
  public Name: string;
  /// Phí dịch vụ
  public Fee: number;
  /// Loại dịch vụ
  public Type: string;
  /// Phí xem hàng
  public ExtraMoney?: number;
  /// Thời gian lấy hàng
  public OrderTime?: Date;
}
