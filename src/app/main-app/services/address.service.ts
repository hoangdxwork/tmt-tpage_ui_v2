import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { TAPIDTO, TApiMethodType, TCommonService, THelperCacheService } from 'src/app/lib';
import { TDSSafeAny } from 'tmt-tang-ui';
import { BaseSevice } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class AddressService extends BaseSevice {

  prefix: string = "odata";
  table: string = "Address";
  baseRestApi: string = "api/address";

  constructor(private apiService: TCommonService) {
    super(apiService)
  }

  getActive(): Observable<any> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}?$filter=Active eq true`,
      method: TApiMethodType.get,
    }

    return this.apiService.getData<TDSSafeAny>(api,null);
  }

  getCities(): Observable<any> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/getcities`,
      method: TApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api, null)
      .pipe(shareReplay(1));
  }

  getDistricts(cityCode: number | undefined): Observable<any> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/getdistricts(${cityCode})`,
      method: TApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api, null)
      .pipe(shareReplay(1));
  }

  getWards(districtCode: number | undefined): Observable<any> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/getwards(${districtCode})`,
      method: TApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api, null)
      .pipe(shareReplay(1));
  }

  checkAddress(street: string): Observable<any> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/checkaddress?address=${street}`,
      method: TApiMethodType.get,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }
}
