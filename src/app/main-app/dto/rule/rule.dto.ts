import { StockLocationDTO, StockPickingTypeDTO } from "../product/warehouse.dto";

export class ProcurementRuleDTO {
  public id: number;
  public name: string;
  public action: string;
  public procureMethod: string;
  public sequence?: number;
  public active?: boolean;

  public locationId?: number;
  public location: StockLocationDTO;

  public locationSrcId?: number;
  public locationSrc: StockLocationDTO;

  public pickingTypeId?: number;
  public pickingType: StockPickingTypeDTO;

  public warehouseId?: number;
  public routeId?: number;
  public companyId?: number;

  constructor() {
    this.procureMethod = "make_to_stock";
    this.action = "move";
    this.active = true;
    this.sequence = 20;
  }
}
