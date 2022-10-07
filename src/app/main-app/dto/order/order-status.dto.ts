export interface orderStatusDTO {
  Id: number;
  Index?: any;
  Name: string;
  Type: string;
  StyleCSS: string;
  Default: boolean;
  IsNotOrder: boolean;
}

export interface OrderStatusModalDTO {
  Name: string;
  StyleCSS: string;
}

export interface OdataOrderStatusDTO {
  "@odata.context": string;
  value: orderStatusDTO[];
}
