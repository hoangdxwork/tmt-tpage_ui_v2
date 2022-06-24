import { FastSaleOrder_ReceiverDTO, FastSaleOrder_ServiceExtraDTO } from '../fastsaleorder/fastsaleorder.dto';

export interface DeliveryCarrierDTO {
  IsPrintCustom: boolean;
  Id: number;
  Name: string;
  SenderName?: any;
  Sequence: number;
  Active: boolean;
  DeliveryType: string;
  DeliveryTypeGet: string;
  ProductId?: any;
  FixedPrice?: any;
  CompanyId?: any;
  Amount?: any;
  FreeOver: boolean;
  Margin?: any;
  HCMPTConfigId?: any;
  GHN_ApiKey?: any;
  GHN_ClientId?: any;
  GHN_NoteCode: string;
  GHN_PaymentTypeId: number;
  GHN_PackageWidth: number;
  GHN_PackageLength: number;
  GHN_PackageHeight: number;
  GHN_ServiceId?: any;
  ViettelPost_UserName?: any;
  ViettelPost_Password?: any;
  ViettelPost_Token?: any;
  ViettelPost_ServiceId: string;
  ViettelPost_ProductType?: any;
  ViettelPost_OrderPayment?: any;
  ShipChung_ServiceId?: any;
  ShipChung_PaymentTypeID?: any;
  ShipChung_ApiKey?: any;
  HCMPost_sI?: any;
  HCMPost_sK?: any;
  HCMPost_ShopID?: any;
  HCMPost_ShopName?: any;
  HCMPost_ServiceId?: any;
  TokenShip?: any;
  VNPost_ClientId?: any;
  VNPost_ServiceId?: any;
  VNPost_IsContracted: boolean;
  VNPost_PickupType?: any;
  GHTK_Token?: any;
  GHTK_ClientId?: any;
  GHTK_IsFreeShip: number;
  SuperShip_Token?: any;
  SuperShip_ClientId?: any;
  SuperShip_Config: string;
  Config_TransportId?: any;
  Config_TransportName?: any;
  EMS_Service?: any;
  EMS_Inventory?: any;
  EMS_Token?: any;
  TinToc_Service?: any;
  TinToc_ServiceCode?: any;
  NinjaVan_ClientId?: any;
  NinjaVan_ClientSecret?: any;
  NinjaVan_ServiceType: string;
  NinjaVan_ServiceLevel: string;
  NinjaVan_Token?: any;
  NinjaVan_BranchId: string;
  ZTO_PickupType?: any;
  ZTO_ProductType?: any;
  ZTO_SendWayType?: any;
  ZTO_AppCode?: any;
  ZTO_SecretKey?: any;
  Config_DefaultFee?: number;
  Config_DefaultWeight?: number;
  ExtrasText: string;
  Extras?: any;
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

export interface ShipProviderCreateChatbotDTO {
  type: string;
  shopid: string;
  shoptoken: string;
}
