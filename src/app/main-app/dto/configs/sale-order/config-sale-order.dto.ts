export interface ConfigSaleOrderDTO {
  IsEnableShipping: boolean;
  ShippingStatues: string[];
  ShippingTemplate: string;
  IsEnableOrder: boolean;
  OrderTemplate: string;
  IsOrderAutoReplyOnlyOnce: boolean;
  IsEnableShopLink: boolean;
  ShopLabel: string;
  ShopLabel2: string;
  IsEnableBill: boolean;
  IsUsingProviderTemplate: boolean;
  BillTemplate: string;
}
