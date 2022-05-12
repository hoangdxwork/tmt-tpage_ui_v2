import { FastSaleOrder_ReceiverDTO, FastSaleOrder_ServiceExtraDTO } from '../fastsaleorder/fastsaleorder.dto';
import { ProductDTO } from '../product/product.dto';

export interface DeliveryCarrierDTO {
  IsPrintCustom: boolean;
  Id: number;

  Name: string;
  SenderName: string;

  Sequence?: number;
  Active: boolean;
  DeliveryType: string;

  DeliveryTypeGet: string;

  ProductId?: number;
  Product: ProductDTO;

  FixedPrice?: number;
  CompanyId?: number;
  Amount?: number;

  FreeOver?: boolean;

  //This percentage will be added to the shipping price.
  Margin?: number;
  hcmPTConfigId?: number;

  GHN_ApiKey: string;
  GHN_ClientId: string;
  GHN_NoteCode: string;
  GHN_PaymentTypeId?: number;
  GHN_PackageWidth?: number;
  GHN_PackageLength?: number;
  GHN_PackageHeight?: number;
  GHN_ServiceId: string;

  ViettelPost_UserName: string;
  ViettelPost_Password: string;
  ViettelPost_Token: string;
  ViettelPost_ServiceId: string;
  ViettelPost_ProductType: string;
  ViettelPost_OrderPayment?: number;

  ShipChung_ServiceId: string;
  ShipChung_PaymentTypeID?: number;
  ShipChung_ApiKey: string;

  HCMPost_sI: string;
  HCMPost_sK: string;
  HCMPost_ShopID: string;
  HCMPost_ShopName: string;
  HCMPost_ServiceId: string;

  tokenShip: string;

  VNPost_ClientId: string;
  VNPost_ServiceId: string;
  VNPost_IsContracted: boolean;
  VNPost_PickupType: string;

  GHTK_Token: string;
  GHTK_ClientId: string;
  GHTK_IsFreeShip?: number;

  SuperShip_Token: string;
  SuperShip_ClientId: string;
  SuperShip_Config: string;

  Config_TransportId: string;
  Config_TransportName: string;

  EMS_Service: string;
  EMS_Inventory: string;
  EMS_Token: string;

  TinToc_Service: string;
  TinToc_ServiceCode: string;

  NinjaVan_ClientId: string;
  NinjaVan_ClientSecret: string;
  NinjaVan_ServiceType: string;
  NinjaVan_ServiceLevel: string;
  NinjaVan_Token: string;
  NinjaVan_BranchId: string;

  ZTO_PickupType: string;
  ZTO_ProductType: string;
  ZTO_SendWayType: string;
  ZTO_AppCode: string;
  ZTO_SecretKey: string;

  Config_DefaultFee?: number;
  Config_DefaultWeight?: number;

  ExtrasText: string;
  Extras: DeliveryCarrier_ExtraDTO;
}

export interface DeliveryCarrier_ExtraDTO {
  PickWorkShift: string;
  PickWorkShiftName: string;
  DeliverWorkShift: string;
  DeliverWorkShiftName: string;

  /// Shop trả/Khách trả
  PaymentTypeId: string;
  PosId: string;
  IsDropoff: boolean;

  /// Khai giá bảo hiểm
  IsInsurance: boolean;
  InsuranceFee?: number;

  /// Cho xem hàng
  IsPackageViewable: boolean;

  /// Hàng dễ vỡ
  Is_Fragile: boolean;
  PickupAccountId: string;
  SoldToAccountId: string;
  IsPartSign?: boolean;

  /// Cho thử hàng
  IsAllowTryout: boolean;

  /// Cấn trừ tiền COD
  IsDeductCod: boolean;

  /// Thu tiền xem hàng
  IsCollectMoneyGoods: boolean;

  /// Thu tiền xem hàng
  CollectMoneyGoods?: number;

  /// Không cho xem hàng. Cho thử hàng. Cho xem hàng, không cho thử
  ConfirmType: string;

  /// giao hàng 1 phần
  PartialDelivery: string;

  /// Hoàn hàng
  IsRefund?: number;
  ServiceCustoms: Array<ServiceCustomDTO>;

  /// Giá trị tiền bảo hiểm bằng tổng tiền
  IsInsuranceEqualTotalAmount?: boolean;
}

export interface ServiceCustomDTO {
  ServiceId: string;
  Name: string;
  IsDefault: boolean;
}

export interface ShippingCalculateFeeInputDTO {
  PartnerId?: number;
  CompanyId?: number;
  CarrierId: number;
  ServiceId: string;
  InsuranceFee?: number;
  ShipWeight?: number;
  CashOnDelivery?: number;
  Ship_Receiver?: FastSaleOrder_ReceiverDTO;
  ServiceExtras: FastSaleOrder_ServiceExtraDTO[];
}

export interface CalculateFeeResponse_DataDTO {
  TotalFee: number;
  CarrierId: number;
  DeliveryType: string;
  CarrierName: string;
  Costs: CalculateFeeResponse_Data_ServiceDTO[];
  Services: CalculateFeeResponse_Data_ServiceDTO[];
}

export interface CalculateFeeResponse_Data_ServiceDTO {
  ServiceId: string;
  ServiceName: string;
  TotalFee: number;
  Extras: CalculateFeeResponse_Data_Service_ExtraDTO[];
}

export interface CalculateFeeResponse_Data_Service_ExtraDTO {
  ServiceId: string;
  ServiceName: string;
  Fee: number;
  Type: string;
  ExtraMoney?: number;
  IsSelected?: boolean;
}
