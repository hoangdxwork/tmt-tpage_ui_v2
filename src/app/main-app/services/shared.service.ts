import { TransportConfigsDto } from './../dto/configs/transport-config.dto';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { CoreAPIDTO, CoreApiMethodType, TAuthService, TCommonService } from 'src/app/lib';
import { TDSHelperObject, TDSSafeAny, TDSHelperArray, TDSHelperString } from 'tds-ui/shared/utility';
import { CompanyCurrentDTO } from '../dto/configs/company-current.dto';
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

  public settings!: AppSettings;

  public userLogged: any;
  private readonly _userLoggedSubject$ = new ReplaySubject<any>();

  currentCompany!: CompanyCurrentDTO;
  private readonly _currentCompany$ = new ReplaySubject<any>();

  getsaleconfig: any;
  private readonly _getsaleconfigSubject$ = new ReplaySubject<any>();

  transportsConfigs: any;
  private readonly _getTransportsConfigsSubject$ = new ReplaySubject<any>();

  saleOnlineSettings: any;
  private readonly _saleOnlineSettingsSubject$ = new ReplaySubject<any>();

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
     this.setUserLogged();
  }

  getUserLogged() {
    return  this._userLoggedSubject$.asObservable();
  }

  setUserLogged() {
    if(TDSHelperObject.hasValue(this.userLogged)) {
        this._userLoggedSubject$.next(this.userLogged);
    } else {
        this.auth.getUserInit().subscribe({
          next: (res: any) => {
              this.userLogged = res;
              this._userLoggedSubject$.next(res);
          }
        });
    }
  }

  getSaleConfig() {
    return this._getsaleconfigSubject$.asObservable();
  }

  setSaleConfig() {
    if(TDSHelperObject.hasValue(this.getsaleconfig)) {
        this._getsaleconfigSubject$.next(this.getsaleconfig);
    } else {
        this.apiSaleConfig().subscribe({
            next: (res: any) => {
                this.getsaleconfig = res;
                this._getsaleconfigSubject$.next(res);
            }
        })
    }
  }

  apiSaleConfig(): Observable<any> {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/api/common/getsaleconfig`,
        method: CoreApiMethodType.get,
    }

    return this.apiService.getData<any>(api, null);
  }

  getSaleOnlineSettingConfig() {
    return this._saleOnlineSettingsSubject$.asObservable();
  }

  setTransportConfigs() {
    if(this.transportsConfigs) {
      this._getTransportsConfigsSubject$.next(this.transportsConfigs);
    } else {
      this.apiTransportConfigs().subscribe({
          next: (res: any) => {
              this.transportsConfigs = res;
              this._getTransportsConfigsSubject$.next(res);
          }
      })
    }
  }

  getTransportConfigs() {
    return this._getTransportsConfigsSubject$.asObservable();
  }

  setFeeShip(cityCode: any, districtCode: any, lstTransport: TransportConfigsDto[], deliveryType: any) {
    if(!TDSHelperString.hasValueString(cityCode)) return 0;

        let exist1 = lstTransport.filter(x => x.ProvinceId == cityCode);
        if(exist1 && exist1.length == 0) return 0;

        if(exist1 && exist1.length > 0) {
          let exist2 = exist1.filter(x => x.DistrictId == districtCode);

          if(exist2 && exist2.length == 0) {
            let exist3 = exist1.filter(x => !TDSHelperString.hasValueString(x.DistrictId));

            if(exist3 && exist3.length == 0) return 0;
            if(this.checkProviders(exist3[0], deliveryType)) return exist3[0].FeeShip;
            return 0;
          };

          if(exist2 && exist2.length > 0) {
            let feeShip = 0;

            exist2.map(x => {
              if(this.checkProviders(x, deliveryType)) {
                feeShip = x.FeeShip;
                return;
              };
            });
            return feeShip;
          }

          return 0;
        }
        return 0;
  }

  public checkProviders(data: TransportConfigsDto, deliveryType: any) {
    let lstProviders = this.prepareProviders(data?.Providers);
    if(lstProviders.length > 0 && (!TDSHelperString.hasValueString(deliveryType) || !lstProviders.includes(deliveryType))) return false;
    return true;
  }

  prepareProviders(providers: string) {
    let lstProviders: string[] = [];
    if(TDSHelperString.hasValueString(providers)) {
      lstProviders = JSON.parse(providers) as string[];
    }

    return lstProviders;
  }

  setSaleOnlineSettingConfig() {
    if(TDSHelperObject.hasValue(this.saleOnlineSettings)) {
        this._saleOnlineSettingsSubject$.next(this.saleOnlineSettings);
    } else {
        this.apiSaleOnlineSettingConfig().subscribe({
            next: (res: any) => {
                this.saleOnlineSettings = res;
                this._saleOnlineSettingsSubject$.next(res);
            }
        })
    }
  }

  apiSaleOnlineSettingConfig(): Observable<any> {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/odata/SaleOnlineSetting`,
        method: CoreApiMethodType.get,
    }

    return this.apiService.getData<any>(api, null);
  }

  apiTransportConfigs() {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/odata/TransportConfigs`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<any>(api, null);
  }

  getCurrentCompany() {
    return this._currentCompany$.asObservable();
  }

  setCurrentCompany() {
    if(TDSHelperObject.hasValue(this.currentCompany)) {
        this._currentCompany$.next(this.currentCompany);
    } else {
        this.apiCurrentCompany().subscribe({
          next: (company: CompanyCurrentDTO) => {
              this.currentCompany = {...company};
              this._currentCompany$.next(company);
          }
        })
    }
  }

  apiCurrentCompany(): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/api/common/getcompanycurrent`,
        method: CoreApiMethodType.get,
    }

    return this.apiService.getData<CompanyCurrentDTO>(api, null);
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

  postSaleSetting(data: any) {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/odata/SaleSettings`,
        method: CoreApiMethodType.post,
    }

    return this.apiService.getData(api, data);
  }

  excuteSaleSetting(id: any){
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/odata/SaleSettings/ODataService.Excute`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData(api, { id: id});
  }

  checkPrermission() {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/api/common/CheckPermission?function=App.SaleOnline.Facebook.Excel`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData(api, null);
  }

  fbGetShareds(uid: string, objectId: string, teamId: number) {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/api/facebook/getshareds?uid=${uid}&objectId=${objectId}&teamId=${teamId}&isCookie=true`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<any>(api, null);
  }

  getSimpleShareds(objectId: string) {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/api/facebook/getsimpleshareds?postId=${objectId}`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData(api, null);
  }

}
