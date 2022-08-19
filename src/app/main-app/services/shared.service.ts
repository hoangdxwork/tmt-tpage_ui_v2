import { GreetingDTO } from 'src/app/main-app/dto/configs/page-config.dto';
import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { CoreAPIDTO, CoreApiMethodType, TAuthService, TCommonService } from 'src/app/lib';
import { TDSSafeAny } from 'tds-ui/shared/utility';
import { CompanyCurrentDTO } from '../dto/configs/company-current.dto';
import { InitSaleDTO, SaleOnlineSettingDTO } from '../dto/setting/setting-sale-online.dto';
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

  prefix: string = "";
  table: string = "";
  baseRestApi: string = "";

  public userLogged: any;
  public settings!: AppSettings;
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
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/api/common/getsaleconfig`,
        method: CoreApiMethodType.get,
    }

    return this.apiService.getCacheData<InitSaleDTO>(api, null);
  }

  getSaleOnineSettingConfig(): Observable<any> {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/odata/SaleOnlineSetting`,
        method: CoreApiMethodType.get,
    }

    return this.apiService.getCacheData<InitSaleDTO>(api, null);
  }

  getCurrentCompany(): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/api/common/getcompanycurrent`,
        method: CoreApiMethodType.get,
    }

    return this.apiService.getCacheData<CompanyCurrentDTO>(api, null);
  }

  deleteKeyCacheConfigs() {
    this.apiService.removeCacheAPI(this._keyCacheConfigs);
  }

  saveImageV2(param: any): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/api/upload/saveimagev2`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getFileUpload(api, param);
  }

  getStockWarehouse(): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/odata/StockWarehouse/OdataService.GetByCompany`,
        method: CoreApiMethodType.get,
    }

    return this.apiService.getData<ODataStockWarehouseDTO>(api, null);
  }

  uploadImage(data:TDSSafeAny){
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/api/common/uploadimagebtn`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getFileUpload(api, data);
  }

}
