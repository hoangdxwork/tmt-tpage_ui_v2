export interface OrderStatusDTO {
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

export interface FilterObjDTO  {
  searchText: string,
}

export interface OdataOrderStatusDTO {
  "@odata.context": string;
  "@odata.count": number;
  value: OrderStatusDTO[];
}
