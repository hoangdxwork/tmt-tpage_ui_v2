import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { TAPIDTO, TApiMethodType, TCommonService, THelperCacheService } from 'src/app/lib';
import { TDSSafeAny } from 'tmt-tang-ui';
import { BaseSevice } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class ApplicationUserService extends BaseSevice {

  prefix: string = "odata";
  table: string = "ApplicationUser";
  baseRestApi: string = "api/applicationuser";

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

}
