import { CompanyDTO } from '../company/company.dto';
import { ProcurementRuleDTO } from '../rule/rule.dto';

export class StockWarehouseDTO {
  public id: number;
  public code: string;
  public name: string;
  public companyId: number;
  public company: CompanyDTO;

  public get nameGet(): string {
    return `[${this.code}] ${this.name}`;
  }

  public set nameGet(str: string) {
    this.nameGet = str;
  }

  public companyName: string;
}

export class StockLocationDTO {
  public id: number;
  public usage: string;
  public scrapLocation: boolean;
  public name: string;
  public completeName: string;
  public parentLocationId?: number;
  public parentLocation: StockLocationDTO;
  public active: boolean;
  public parentLeft?: number;
  public companyId?: number;
  public company: CompanyDTO;
  public companyName: string;

  public get showUsage(): string {
    switch (this.usage) {
      case 'supplier':
        return 'Địa điểm nhà cung cấp';
      case 'view':
        return 'Địa điểm khung nhìn';
      case 'internal':
        return 'Địa điểm nội bộ';
      case 'customer':
        return 'Địa điểm khách hàng';
      case 'inventory':
        return 'Địa điểm điều chỉnh';
      case 'procurement':
        return 'Địa điểm cung ứng';
      case 'production':
        return 'Địa điểm sản xuất';
      case 'transit':
        return 'Địa điểm chuyển tiếp';
      default:
        return '';
    }
  }

  public set showUsage(str: string) {
    this.showUsage = str;
  }

  public nameGet: string;
  public nameWarehouse: string;

  constructor() {
    this.usage = 'internal';
    this.active = true;
    this.scrapLocation = false;
  }
}

export class StockLocationRouteDTO {
  public id: number;
  public name: string;
  public sequence?: number;
  public productSelectable?: boolean;
  public productCategSelectable?: boolean;
  public warehouseSelectable?: boolean;
  public active?: boolean;
  public supplierWhId?: number;
  public companyId?: number;
  public warehouses: Array<StockWarehouseDTO>;

  public pushRules: Array<StockLocationPathDTO>;
  public pullRules: Array<ProcurementRuleDTO>;

  constructor() {}
}

export class StockLocationPathDTO {
  public id: number;
  public name: string;
  public routeId?: number;

  public locationFromId: number;
  public locationFrom: StockLocationDTO;

  public locationDestId: number;
  public locationDest: StockLocationDTO;

  public pickingTypeId: number;
  public pickingType: StockPickingTypeDTO;

  public auto: string;
  public active?: boolean;

  public warehouseId?: number;
  public warehouse: StockWarehouseDTO;

  public sequence?: number;
  public companyId?: number;

  constructor() {}
}

export class StockPickingTypeDTO {
  public id: number;
  public code: string;
  public sequence: number;

  public defaultLocationDestId?: number;
  public defaultLocationDest: StockLocationDTO;

  public warehouseId?: number;
  public warehouse: StockWarehouseDTO;

  public warehouseName: string;
  public iRSequenceId: number;

  // public IRSequenceModel IRSequence

  public active: boolean;

  public name: string;
  public defaultLocationSrcId?: number;
  public defaultLocationSrc: StockLocationDTO;

  public returnPickingTypeId?: number;
  public returnPickingType: StockPickingTypeDTO;
  public useCreateLots?: boolean;
  public useExistingLots?: boolean;
  public inverseOperation?: boolean;
  public nameGet: string;

  public countPickingReady: number;
  public countPickingDraft: number;
  public countPicking: number;
  public countPickingWaiting: number;
  public countPickingLate: number;
  public countPickingBackOrders: number;

  constructor() {
    this.active = true;
    this.useCreateLots = true;
    this.useExistingLots = true;
    this.inverseOperation = false;
  }
}
