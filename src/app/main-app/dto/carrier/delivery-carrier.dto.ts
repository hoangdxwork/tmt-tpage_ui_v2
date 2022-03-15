import { ProductDTO } from '../product/product.dto';

export interface DeliveryCarrierDTO {
  isPrintCustom: boolean;
  id: number;

  name: string;
  senderName: string;

  sequence?: number;
  active: boolean;
  deliveryType: string;

  deliveryTypeGet: string;

  productId?: number;
  product: ProductDTO;

  fixedPrice?: number;
  companyId?: number;
  amount?: number;

  freeOver?: boolean;

  //This percentage will be added to the shipping price.
  margin?: number;
  hcmPTConfigId?: number;

  ghn_ApiKey: string;
  ghn_ClientId: string;
  ghn_NoteCode: string;
  ghn_PaymentTypeId?: number;
  ghn_PackageWidth?: number;
  ghn_PackageLength?: number;
  ghn_PackageHeight?: number;
  ghn_ServiceId: string;

  viettelPost_UserName: string;
  viettelPost_Password: string;
  viettelPost_Token: string;
  viettelPost_ServiceId: string;
  viettelPost_ProductType: string;
  viettelPost_OrderPayment?: number;

  shipChung_ServiceId: string;
  shipChung_PaymentTypeID?: number;
  shipChung_ApiKey: string;

  hcmPost_sI: string;
  hcmPost_sK: string;
  hcmPost_ShopID: string;
  hcmPost_ShopName: string;
  hcmPost_ServiceId: string;

  tokenShip: string;

  vnPost_ClientId: string;
  vnPost_ServiceId: string;
  vnPost_IsContracted: boolean;
  vnPost_PickupType: string;

  ghtk_Token: string;
  ghtk_ClientId: string;
  ghtk_IsFreeShip?: number;

  superShip_Token: string;
  superShip_ClientId: string;
  superShip_Config: string;

  config_TransportId: string;
  config_TransportName: string;

  ems_Service: string;
  ems_Inventory: string;
  ems_Token: string;

  tinToc_Service: string;
  tinToc_ServiceCode: string;

  ninjaVan_ClientId: string;
  ninjaVan_ClientSecret: string;
  ninjaVan_ServiceType: string;
  ninjaVan_ServiceLevel: string;
  ninjaVan_Token: string;
  ninjaVan_BranchId: string;

  zto_PickupType: string;
  zto_ProductType: string;
  zto_SendWayType: string;
  zto_AppCode: string;
  zto_SecretKey: string;

  config_DefaultFee?: number;
  config_DefaultWeight?: number;

  extrasText: string;
  extras: DeliveryCarrier_ExtraDTO;
}

export interface DeliveryCarrier_ExtraDTO {
  pickWorkShift: string;
  pickWorkShiftName: string;
  deliverWorkShift: string;
  deliverWorkShiftName: string;

  /// Shop trả/Khách trả
  paymentTypeId: string;
  posId: string;
  isDropoff: boolean;

  /// Khai giá bảo hiểm
  isInsurance: boolean;
  insuranceFee?: number;

  /// Cho xem hàng
  isPackageViewable: boolean;

  /// Hàng dễ vỡ
  is_Fragile: boolean;
  pickupAccountId: string;
  soldToAccountId: string;
  isPartSign?: boolean;

  /// Cho thử hàng
  isAllowTryout: boolean;

  /// Cấn trừ tiền COD
  isDeductCod: boolean;

  /// Thu tiền xem hàng
  isCollectMoneyGoods: boolean;

  /// Thu tiền xem hàng
  collectMoneyGoods?: number;

  /// Không cho xem hàng. Cho thử hàng. Cho xem hàng, không cho thử
  confirmType: string;

  /// giao hàng 1 phần
  partialDelivery: string;

  /// Hoàn hàng
  isRefund?: number;
  serviceCustoms: Array<ServiceCustomDTO>;

  /// Giá trị tiền bảo hiểm bằng tổng tiền
  isInsuranceEqualTotalAmount?: boolean;
}

export interface ServiceCustomDTO {
  serviceId: string;
  name: string;
  isDefault: boolean;
}
