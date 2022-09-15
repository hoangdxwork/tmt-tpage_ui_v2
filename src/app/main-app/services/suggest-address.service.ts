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

  private readonly _districts = new ReplaySubject<any[]>();
  public lstDistrict: any = {};

  private readonly _wards = new ReplaySubject<any[]>();
  public lstWard: any = {};

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

  getDistrict(): Observable<any> {
      return this._districts.asObservable();
  }

  setDistrict(code: string) {
    if(TDSHelperArray.hasListValue(this.lstDistrict[code])) {
        this._districts.next(this.lstDistrict[code]);
    } else {
      this.apiDistrict(code).subscribe({
        next: (res: any) => {
            this._districts.next(res);
        }
      })
    }
  }

  apiDistrict(code: string): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/getdistricts(${code})`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api, { provider: "Undefined" });
  }

  getWard(): Observable<any> {
      return this._wards.asObservable();
  }

  setWard(code: string) {
    if(TDSHelperArray.hasListValue(this.lstWard[code])) {
        this._districts.next(this.lstWard[code]);
    } else {
      this.apiWard(code).subscribe({
        next: (res: any) => {
            this._wards.next(res);
        }
      })
    }
  }

  apiWard(code: string): Observable<any> {
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
