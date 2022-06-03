export interface StockWarehouseDTO {
  Id: number;
  Code: string;
  Name: string;
  CompanyId: number;
  NameGet: string;
  CompanyName: string;
}

export interface ODataStockWarehouseDTO {
  "@odata.context": string;
  value: StockWarehouseDTO[];
}
