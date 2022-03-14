import { CompanyDTO } from '../company/company.dto';
import { ProcurementRuleDTO } from '../rule/rule.dto';

export interface StockWarehouseDTO {
  id: number;
  code: string;
  name: string;
  companyId: number;
  company: CompanyDTO;

  nameGet: string;

  companyName: string;
}

export interface StockLocationDTO {
  id: number;
  usage: string;
  scrapLocation: boolean;
  name: string;
  completeName: string;
  parentLocationId?: number;
  parentLocation: StockLocationDTO;
  active: boolean;
  parentLeft?: number;
  companyId?: number;
  company: CompanyDTO;
  companyName: string;

  showUsage: string;

  nameGet: string;
  nameWarehouse: string;
}

export interface StockLocationRouteDTO {
  id: number;
  name: string;
  sequence?: number;
  productSelectable?: boolean;
  productCategSelectable?: boolean;
  warehouseSelectable?: boolean;
  active?: boolean;
  supplierWhId?: number;
  companyId?: number;
  warehouses: Array<StockWarehouseDTO>;

  pushRules: Array<StockLocationPathDTO>;
  pullRules: Array<ProcurementRuleDTO>;
}

export interface StockLocationPathDTO {
  id: number;
  name: string;
  routeId?: number;

  locationFromId: number;
  locationFrom: StockLocationDTO;

  locationDestId: number;
  locationDest: StockLocationDTO;

  pickingTypeId: number;
  pickingType: StockPickingTypeDTO;

  auto: string;
  active?: boolean;

  warehouseId?: number;
  warehouse: StockWarehouseDTO;

  sequence?: number;
  companyId?: number;
}

export interface StockPickingTypeDTO {
  id: number;
  code: string;
  sequence: number;

  defaultLocationDestId?: number;
  defaultLocationDest: StockLocationDTO;

  warehouseId?: number;
  warehouse: StockWarehouseDTO;

  warehouseName: string;
  iRSequenceId: number;

  // IRSequenceModel IRSequence

  active: boolean;

  name: string;
  defaultLocationSrcId?: number;
  defaultLocationSrc: StockLocationDTO;

  returnPickingTypeId?: number;
  returnPickingType: StockPickingTypeDTO;
  useCreateLots?: boolean;
  useExistingLots?: boolean;
  inverseOperation?: boolean;
  nameGet: string;

  countPickingReady: number;
  countPickingDraft: number;
  countPicking: number;
  countPickingWaiting: number;
  countPickingLate: number;
  countPickingBackOrders: number;
}
