import { StockLocationDTO, StockPickingTypeDTO } from "../product/warehouse.dto";

export interface ProcurementRuleDTO {
  id: number;
  name: string;
  action: string;
  procureMethod: string;
  sequence?: number;
  active?: boolean;

  locationId?: number;
  location: StockLocationDTO;

  locationSrcId?: number;
  locationSrc: StockLocationDTO;

  pickingTypeId?: number;
  pickingType: StockPickingTypeDTO;

  warehouseId?: number;
  routeId?: number;
  companyId?: number;
}
