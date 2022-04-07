export interface CompanyCurrentDTO {
  CompanyId: number;
  PartnerId: number;
  ProductId: number;
  CompanyName: string;
  QuantityDecimal: number;
  DateServer: Date;
  Configs: string;
  BaseUrlShip: string;
  RequestLimit: number;
  SymbolPrice: string;
  RoundingPrice: number;
  IsMultiCompany: boolean;
  DefaultWarehouseId: number;
  ShipDefault: number;
  WeightDefault: number;
  DefaultWarehouseName: string;
}
