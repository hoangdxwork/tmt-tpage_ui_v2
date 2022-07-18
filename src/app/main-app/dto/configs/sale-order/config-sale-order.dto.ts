export interface ConfigSaleOrderDTO {
  IsEnableShipping: boolean;
  ShippingStatues: string[];
  ShippingTemplate: string;
  IsEnableOrder: boolean;
  OrderTemplate: string;
  IsOrderReplyOnlyOnce: boolean;
  IsEnableShopLink: boolean;
  ShopLabel: string;
  ShopLabel2: string;
  IsEnableBill: boolean;
  IsUsingProviderTemplate: boolean;
  BillTemplate: string;
}
