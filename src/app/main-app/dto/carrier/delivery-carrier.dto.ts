import { ProductDTO } from '../product/product.dto';

export class DeliveryCarrierDTO {
  public IsPrintCustom: boolean;
  public Id: number;

  public Name: string;
  public SenderName: string;

  public Sequence?: number;
  public Active: boolean;
  public DeliveryType: string;

  public DeliveryTypeGet: string;

  public ProductId?: number;
  public Product: ProductDTO;

  public FixedPrice?: number;
  public CompanyId?: number;
  public Amount?: number;

  public FreeOver?: boolean;

  //This percentage will be added to the shipping price.
  public Margin?: number;
  public HCMPTConfigId?: number;

  public GHN_ApiKey: string;
  public GHN_ClientId: string;
  public GHN_NoteCode: string;
  public GHN_PaymentTypeId?: number;
  public GHN_PackageWidth?: number;
  public GHN_PackageLength?: number;
  public GHN_PackageHeight?: number;
  public GHN_ServiceId: string;

  public ViettelPost_UserName: string;
  public ViettelPost_Password: string;
  public ViettelPost_Token: string;
  public ViettelPost_ServiceId: string;
  public ViettelPost_ProductType: string;
  public ViettelPost_OrderPayment?: number;

  public ShipChung_ServiceId: string;
  public ShipChung_PaymentTypeID?: number;
  public ShipChung_ApiKey: string;

  public HCMPost_sI: string;
  public HCMPost_sK: string;
  public HCMPost_ShopID: string;
  public HCMPost_ShopName: string;
  public HCMPost_ServiceId: string;

  public TokenShip: string;

  public VNPost_ClientId: string;
  public VNPost_ServiceId: string;
  public VNPost_IsContracted: boolean;
  public VNPost_PickupType: string;

  public GHTK_Token: string;
  public GHTK_ClientId: string;
  public GHTK_IsFreeShip?: number;

  public SuperShip_Token: string;
  public SuperShip_ClientId: string;
  public SuperShip_Config: string;

  public Config_TransportId: string;
  public Config_TransportName: string;

  public EMS_Service: string;
  public EMS_Inventory: string;
  public EMS_Token: string;

  public TinToc_Service: string;
  public TinToc_ServiceCode: string;

  public NinjaVan_ClientId: string;
  public NinjaVan_ClientSecret: string;
  public NinjaVan_ServiceType: string;
  public NinjaVan_ServiceLevel: string;
  public NinjaVan_Token: string;
  public NinjaVan_BranchId: string;

  public ZTO_PickupType: string;
  public ZTO_ProductType: string;
  public ZTO_SendWayType: string;
  public ZTO_AppCode: string;
  public ZTO_SecretKey: string;

  public Config_DefaultFee?: number;
  public Config_DefaultWeight?: number;

  public ExtrasText: string;
  public Extras: DeliveryCarrier_ExtraDTO;

  constructor() {
    this.GHTK_IsFreeShip = 1;
    this.SuperShip_Config = '1';
    this.GHN_PaymentTypeId = 1;
  }
}

export class DeliveryCarrier_ExtraDTO {
  public PickWorkShift: string;
  public PickWorkShiftName: string;
  public DeliverWorkShift: string;
  public DeliverWorkShiftName: string;

  /// Shop trả/Khách trả
  public PaymentTypeId: string;
  public PosId: string;
  public IsDropoff: boolean;

  /// Khai giá bảo hiểm
  public IsInsurance: boolean;
  public InsuranceFee?: number;

  /// Cho xem hàng
  public IsPackageViewable: boolean;

  /// Hàng dễ vỡ
  public Is_Fragile: boolean;
  public PickupAccountId: string;
  public SoldToAccountId: string;
  public IsPartSign?: boolean;

  /// Cho thử hàng
  public IsAllowTryout: boolean;

  /// Cấn trừ tiền COD
  public IsDeductCod: boolean;

  /// Thu tiền xem hàng
  public IsCollectMoneyGoods: boolean;

  /// Thu tiền xem hàng
  public CollectMoneyGoods?: number;

  /// Không cho xem hàng. Cho thử hàng. Cho xem hàng, không cho thử
  public ConfirmType: string;

  /// giao hàng 1 phần
  public PartialDelivery: string;

  /// Hoàn hàng
  public IsRefund?: number;
  public ServiceCustoms: Array<ServiceCustomDTO>;

  /// Giá trị tiền bảo hiểm bằng tổng tiền
  public IsInsuranceEqualTotalAmount?: boolean;

  constructor() {
    this.ServiceCustoms = new Array<ServiceCustomDTO>();
    this.IsDropoff = false;
    this.IsInsurance = false;
    this.IsPackageViewable = false;
    this.Is_Fragile = false;
    this.IsAllowTryout = false;
    this.IsDeductCod = false;
    this.IsCollectMoneyGoods = false;
  }
}

export class ServiceCustomDTO {
  public ServiceId: string;
  public Name: string;
  public IsDefault: boolean;
}
