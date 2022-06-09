export interface TenantInfoDTO {
  Tenant: AppTenantCacheDTO;
  Features: AppTenantConfig_FeatureCacheDTO;
  Limitations: AppTenantConfig_LimitationCacheDTO;
}

export interface TenantUsedDTO {
  branch: number;
  partner: number;
  product: number;
  account: number;
  facebookUser: number;
  facebookPage: number;
  facebookGroup: number;
  fastSaleOrder: number;
  saleOnlineOrder: number;
}

export enum AppTenantProductEnum {
  TPOS = 0,
  TDENTAL = 1,
}

export interface AppTenantCacheDTO {
  Host: string;
  Product: AppTenantProductEnum;
  PackageCode: string;
  PackageGroup: string;
  IsLocked: boolean;
  LockReason: string;
  CurrentVersion: string;
  DateUpgradedVersion?: Date;
  DateStarted?: Date;
  DateExpired?: Date;
}

export interface AppTenantConfig_FeatureCacheDTO {
  Items: string[];
}

export interface AppTenantConfig_LimitationCacheDTO {
  /// Giới hạn số lượng chi nhanh
  // Số chi nhánh
  Branch: number;
  /// Giới hạn số lượng người dùng
  Account: number;
  FacebookUser: number;
  FacebookPage: number;
  FacebookGroup: number;
  ZaloShop: number;
  ZaloOA: number;
  Shopee: number;
  /// Đơn hàng sale online
  SaleOnlineOrder: number;
  /// Phiếu bán hàng
  FastSaleOrder: number;
  /// Đối tác
  Partner: number;
  /// Sản phẩm
  Product: number;
}
