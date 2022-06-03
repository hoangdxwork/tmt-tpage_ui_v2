import { CompanyDTO } from '../company/company.dto';
import { ProcurementRuleDTO } from '../rule/rule.dto';

export interface StockWarehouseDTO {
  Id: number;
  Code: string;
  Name: string;
  CompanyId: number;
  Company: CompanyDTO;

  NameGet: string;

  CompanyName: string;
}

export interface StockLocationDTO {
  Id: number;
  Usage: string;
  ScrapLocation: boolean;
  Name: string;
  CompleteName: string;
  ParentLocationId?: number;
  ParentLocation: StockLocationDTO;
  Active: boolean;
  ParentLeft?: number;
  CompanyId?: number;
  Company: CompanyDTO;
  CompanyName: string;

  ShowUsage: string;

  NameGet: string;
  NameWarehouse: string;
}

export interface StockLocationRouteDTO {
  Id: number;
  Name: string;
  Sequence?: number;
  ProductSelectable?: boolean;
  ProductCategSelectable?: boolean;
  WarehouseSelectable?: boolean;
  Active?: boolean;
  SupplierWhId?: number;
  CompanyId?: number;
  Warehouses: Array<StockWarehouseDTO>;

  PushRules: Array<StockLocationPathDTO>;
  PullRules: Array<ProcurementRuleDTO>;
}

export interface StockLocationPathDTO {
  Id: number;
  Name: string;
  RouteId?: number;

  LocationFromId: number;
  LocationFrom: StockLocationDTO;

  LocationDestId: number;
  LocationDest: StockLocationDTO;

  PickingTypeId: number;
  PickingType: StockPickingTypeDTO;

  Auto: string;
  Active?: boolean;

  WarehouseId?: number;
  Warehouse: StockWarehouseDTO;

  Sequence?: number;
  CompanyId?: number;
}

export interface StockPickingTypeDTO {
  Id: number;
  Code: string;
  Sequence: number;

  DefaultLocationDestId?: number;
  DefaultLocationDest: StockLocationDTO;

  WarehouseId?: number;
  Warehouse: StockWarehouseDTO;

  WarehouseName: string;
  IRSequenceId: number;

  // IRSequenceModel IRSequence
  Active: boolean;

  Name: string;
  DefaultLocationSrcId?: number;
  DefaultLocationSrc: StockLocationDTO;

  ReturnPickingTypeId?: number;
  ReturnPickingType: StockPickingTypeDTO;
  UseCreateLots?: boolean;
  UseExistingLots?: boolean;
  InverseOperation?: boolean;
  NameGet: string;

  CountPickingReady: number;
  CountPickingDraft: number;
  CountPicking: number;
  CountPickingWaiting: number;
  CountPickingLate: number;
  CountPickingBackOrders: number;
}
