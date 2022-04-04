import { StockLocationDTO, StockPickingTypeDTO } from "../product/warehouse.dto";

export interface ProcurementRuleDTO {
  Id: number;
  Name: string;
  Action: string;
  ProcureMethod: string;
  Sequence?: number;
  Active?: boolean;

  LocationId?: number;
  Location: StockLocationDTO;

  LocationSrcId?: number;
  LocationSrc: StockLocationDTO;

  PickingTypeId?: number;
  PickingType: StockPickingTypeDTO;

  WarehouseId?: number;
  RouteId?: number;
  CompanyId?: number;
}
