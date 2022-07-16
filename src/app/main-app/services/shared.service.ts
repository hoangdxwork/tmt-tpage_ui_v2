import { GreetingDTO } from 'src/app/main-app/dto/configs/page-config.dto';
import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { TAPIDTO, TApiMethodType, TAuthService, TCommonService } from 'src/app/lib';
import { TDSSafeAny } from 'tds-ui/shared/utility';
import { CompanyCurrentDTO } from '../dto/configs/company-current.dto';
import { InitSaleDTO } from '../dto/setting/setting-sale-online.dto';
import { ODataStockWarehouseDTO } from '../dto/setting/stock-warehouse.dto';
import { BaseSevice } from './base.service';

interface AppSettings {
  appName: string;
  appVersion: string;
}

@Injectable({
  providedIn: 'root'
})

export class SharedService extends BaseSevice {

  public userLogged: any;
  public settings!: AppSettings;
  prefix: string = "";
  table: string = "";
  baseRestApi: string = "";
  _keyCacheConfigs = "_keycache_configs";

  constructor(private apiService: TCommonService,
    private auth: TAuthService) {
    super(apiService);
    this.settings = <AppSettings>{
        appName: "T-Page",
        appVersion: "1.06.1.7"
    };
    //TODO: xử lý userLogged\
    this.loadUserLogged();
  }

  loadUserLogged() {
    this.auth.getUserInit().subscribe(res => {
      this.userLogged = res;
    });
  }

  getConfigs(): Observable<InitSaleDTO> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/api/common/getsaleconfig`,
        method: TApiMethodType.get,
    }

    return this.apiService.getCacheData<InitSaleDTO>(api, null);
  }

  getSaleOnineSettingConfig(): Observable<any> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/odata/SaleOnlineSetting`,
        method: TApiMethodType.get,
    }

    return this.apiService.getCacheData<InitSaleDTO>(api, null);
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
        url: `${this._BASE_URL}/odata/StockWarehouse/OdataService.GetByCompany`,
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
