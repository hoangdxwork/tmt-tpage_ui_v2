import { ProductDTO } from '../product/product.dto';

export class DeliveryCarrierDTO {
  public isPrintCustom: boolean;
  public id: number;

  public name: string;
  public senderName: string;

  public sequence?: number;
  public active: boolean;
  public deliveryType: string;

  public deliveryTypeGet: string;

  public productId?: number;
  public product: ProductDTO;

  public fixedPrice?: number;
  public companyId?: number;
  public amount?: number;

  public freeOver?: boolean;

  //This percentage will be added to the shipping price.
  public margin?: number;
  public hcmPTConfigId?: number;

  public ghn_ApiKey: string;
  public ghn_ClientId: string;
  public ghn_NoteCode: string;
  public ghn_PaymentTypeId?: number;
  public ghn_PackageWidth?: number;
  public ghn_PackageLength?: number;
  public ghn_PackageHeight?: number;
  public ghn_ServiceId: string;

  public viettelPost_UserName: string;
  public viettelPost_Password: string;
  public viettelPost_Token: string;
  public viettelPost_ServiceId: string;
  public viettelPost_ProductType: string;
  public viettelPost_OrderPayment?: number;

  public shipChung_ServiceId: string;
  public shipChung_PaymentTypeID?: number;
  public shipChung_ApiKey: string;

  public hcmPost_sI: string;
  public hcmPost_sK: string;
  public hcmPost_ShopID: string;
  public hcmPost_ShopName: string;
  public hcmPost_ServiceId: string;

  public tokenShip: string;

  public vnPost_ClientId: string;
  public vnPost_ServiceId: string;
  public vnPost_IsContracted: boolean;
  public vnPost_PickupType: string;

  public ghtk_Token: string;
  public ghtk_ClientId: string;
  public ghtk_IsFreeShip?: number;

  public superShip_Token: string;
  public superShip_ClientId: string;
  public superShip_Config: string;

  public config_TransportId: string;
  public config_TransportName: string;

  public ems_Service: string;
  public ems_Inventory: string;
  public ems_Token: string;

  public tinToc_Service: string;
  public tinToc_ServiceCode: string;

  public ninjaVan_ClientId: string;
  public ninjaVan_ClientSecret: string;
  public ninjaVan_ServiceType: string;
  public ninjaVan_ServiceLevel: string;
  public ninjaVan_Token: string;
  public ninjaVan_BranchId: string;

  public zto_PickupType: string;
  public zto_ProductType: string;
  public zto_SendWayType: string;
  public zto_AppCode: string;
  public zto_SecretKey: string;

  public config_DefaultFee?: number;
  public config_DefaultWeight?: number;

  public extrasText: string;
  public extras: DeliveryCarrier_ExtraDTO;

  constructor() {
    this.ghtk_IsFreeShip = 1;
    this.superShip_Config = '1';
    this.ghn_PaymentTypeId = 1;
  }
}

export class DeliveryCarrier_ExtraDTO {
  public pickWorkShift: string;
  public pickWorkShiftName: string;
  public deliverWorkShift: string;
  public deliverWorkShiftName: string;

  /// Shop trả/Khách trả
  public paymentTypeId: string;
  public posId: string;
  public isDropoff: boolean;

  /// Khai giá bảo hiểm
  public isInsurance: boolean;
  public insuranceFee?: number;

  /// Cho xem hàng
  public isPackageViewable: boolean;

  /// Hàng dễ vỡ
  public is_Fragile: boolean;
  public pickupAccountId: string;
  public soldToAccountId: string;
  public isPartSign?: boolean;

  /// Cho thử hàng
  public isAllowTryout: boolean;

  /// Cấn trừ tiền COD
  public isDeductCod: boolean;

  /// Thu tiền xem hàng
  public isCollectMoneyGoods: boolean;

  /// Thu tiền xem hàng
  public collectMoneyGoods?: number;

  /// Không cho xem hàng. Cho thử hàng. Cho xem hàng, không cho thử
  public confirmType: string;

  /// giao hàng 1 phần
  public partialDelivery: string;

  /// Hoàn hàng
  public isRefund?: number;
  public serviceCustoms: Array<ServiceCustomDTO>;

  /// Giá trị tiền bảo hiểm bằng tổng tiền
  public isInsuranceEqualTotalAmount?: boolean;

  constructor() {
    this.serviceCustoms = new Array<ServiceCustomDTO>();
    this.isDropoff = false;
    this.isInsurance = false;
    this.isPackageViewable = false;
    this.is_Fragile = false;
    this.isAllowTryout = false;
    this.isDeductCod = false;
    this.isCollectMoneyGoods = false;
  }
}

export class ServiceCustomDTO {
  public serviceId: string;
  public name: string;
  public isDefault: boolean;
}
