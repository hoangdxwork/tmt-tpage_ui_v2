import { District } from './../dto/partner/partner-register-payment.dto';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { shareReplay, map } from 'rxjs/operators';
import { TAPIDTO, TApiMethodType, TCommonService, THelperCacheService } from 'src/app/lib';
import { TDSSafeAny } from 'tmt-tang-ui';
import { BaseSevice } from './base.service';
import { CityDTO, DistrictDTO, WardDTO } from '../dto/address/address.dto';
import { City, Ward } from '../dto/partner/partner-detail.dto';

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
      .pipe(shareReplay(1), map((res: Array<City>) => {
        let result = res.map((x: City) => {
          let item: CityDTO = {
            Code: x.code,
            Name: x.name,
          };
          return item;
        });

        return result;
      }));
  }

  getDistricts(cityCode: string | undefined): Observable<any> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/getdistricts(${cityCode})`,
      method: TApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api, null)
      .pipe(shareReplay(1), map((res: Array<District>) => {
        let result = res.map((x: District) => {
          let item: DistrictDTO = {
            CityCode: x.cityCode,
            CityName: x.cityName,
            Code: x.code,
            Name: x.name,
          };
          return item;
        });

        return result;
      }));
  }

  getWards(districtCode: string | undefined): Observable<any> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/getwards(${districtCode})`,
      method: TApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api, null)
      .pipe(shareReplay(1), map((res: Array<Ward>) => {
        let result = res.map((x: Ward) => {
          let item: WardDTO = {
            Code: x.code,
            Name: x.name,
            DistrictCode: x.districtCode,
            DistrictName: x.districtName,
            CityCode: x.cityCode,
            CityName: x.cityName
          };
          return item;
        });

        return result;
      }));
  }

  checkAddress(street: string): Observable<any> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/checkaddress?address=${street}`,
      method: TApiMethodType.get,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }
}
