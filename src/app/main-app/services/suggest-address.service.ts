import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TAPIDTO, TApiMethodType, TCommonService } from 'src/app/lib';
import { TDSSafeAny } from 'tmt-tang-ui';
import { BaseSevice } from './base.service';

@Injectable({
  providedIn: 'root'
})

export class SuggestAddressService extends BaseSevice {

  prefix: string = "";
  table: string = "";
  baseRestApi: string = "api/address";

  _keyCacheCities!: "_key_cities";
  _keyCacheDistricts!: "_key_districts";
  _keyCacheWards!: "_key_wards";

  constructor(private apiService: TCommonService) {
    super(apiService)
  }

  getCities(): Observable<any> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/getcities`,
      method: TApiMethodType.post,
    }

    return this.apiService.getCacheData<TDSSafeAny>(api, { provider: "Undefined" });
  }

  removeKeyCities() {
      this.apiService.removeCacheAPI(this._keyCacheCities);
  }

  getDistricts(value: string): Observable<any> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/getdistricts(${value})`,
      method: TApiMethodType.post,
    }

    return this.apiService.getCacheData<TDSSafeAny>(api, { provider: "Undefined" });
  }

  removeKeyDistricts() {
      this.apiService.removeCacheAPI(this._keyCacheDistricts);
  }

  getWards(value: string): Observable<any> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/getwards(${value})`,
      method: TApiMethodType.post,
    }

    return this.apiService.getCacheData<TDSSafeAny>(api, { provider: "Undefined" });
  }

  removeKeyWards() {
      this.apiService.removeCacheAPI(this._keyCacheWards);
  }

}
