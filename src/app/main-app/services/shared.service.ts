import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TAPIDTO, TApiMethodType, TCommonService } from 'src/app/lib';
import { TDSSafeAny } from 'tmt-tang-ui';
import { CompanyCurrentDTO } from '../dto/configs/company-current.dto';
import { SaleConfigsDTO } from '../dto/configs/sale-config.dto';
import { ODataStockWarehouseDTO } from '../dto/setting/stock-warehouse.dto';
import { BaseSevice } from './base.service';

@Injectable()

export class SharedService extends BaseSevice {

  prefix: string = "";
  table: string = "";
  baseRestApi: string = "";
  _keyCacheConfigs = "_keycache_configs";

  constructor(private apiService: TCommonService) {
    super(apiService)
  }

  getConfigs(): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/api/common/getsaleconfig`,
        method: TApiMethodType.get,
    }

    return this.apiService.getCacheData<SaleConfigsDTO>(api, null);
  }

  getCurrentCompany(): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/api/common/getcompanycurrent`,
        method: TApiMethodType.get,
    }

    return this.apiService.getCacheData<CompanyCurrentDTO>(api, null);
  }

  deleteKeyCacheConfigs() {
    this.apiService.removeCacheAPI(this._keyCacheConfigs);
  }

  saveImageV2(param: any): Observable<any> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/api/upload/saveimagev2`,
      method: TApiMethodType.post,
    }

    return this.apiService.getFileUpload(api, param);
  }

  getStockWarehouse(): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/odata/StockWarehouse//OdataService.getByCompany`,
        method: TApiMethodType.get,
    }

    return this.apiService.getData<ODataStockWarehouseDTO>(api, null);
  }

  uploadImage(data:TDSSafeAny){
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/api/common/uploadimagebtn`,
      method: TApiMethodType.post,
    }

    return this.apiService.getFileUpload(api, data);
  }
}
