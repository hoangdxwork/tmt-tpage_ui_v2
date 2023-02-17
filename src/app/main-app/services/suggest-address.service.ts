import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { CoreAPIDTO, CoreApiMethodType, TCommonService } from 'src/app/lib';
import { TDSHelperArray, TDSSafeAny } from 'tds-ui/shared/utility';
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

  private readonly _cities = new ReplaySubject<any[]>();
  public lstCity: any[] = [];


  constructor(private apiService: TCommonService) {
    super(apiService)
  }

  getCity(): Observable<any> {
      return this._cities.asObservable();
  }

  setCity() {
    if(TDSHelperArray.hasListValue(this.lstCity)) {
        this._cities.next(this.lstCity);
    } else {
      this.apiCity().subscribe({
        next: (res: any) => {
            this.lstCity = [...res];
            this._cities.next(res);
        }
      })
    }
  }

  apiCity() {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.baseRestApi}/getcities`,
        method: CoreApiMethodType.post,
    }
    return this.apiService.getData<TDSSafeAny>(api, { provider: "Undefined" });
  }


  getDistrict(code: string): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/getdistricts(${code})`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api, { provider: "Undefined" });
  }

  getWard(code: string): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/getwards(${code})`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api, { provider: "Undefined" });
  }

  checkAddress(value: string): Observable<any> {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.baseRestApi}/checkaddress?address=${value}`,
        method: CoreApiMethodType.get
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  suggest(value: string): Observable<any> {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.baseRestApi}/suggest?q=${value}`,
        method: CoreApiMethodType.get
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }

}

export interface SuggestAddressDto {
  Telephone?: any;
  Address: string;
  ShortAddress?: any;
  CityCode: string;
  CityName: string;
  DistrictCode: string;
  DistrictName: string;
  WardCode: string;
  WardName: string;
  Score: number;
}
