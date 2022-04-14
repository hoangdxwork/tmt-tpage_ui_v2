export interface AutoInteractionDTO {
  IsEnableShipping: boolean;
  ShippingStatues: Array<string>;
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

export interface ShippingStatuesDTO {
  Code: string;
  Name: string;
}

export interface GeneralConfigUpdateDTO<T> {
  Name: string;
  Value: T;
}
