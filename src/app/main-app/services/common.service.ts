import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { TAPIDTO, TApiMethodType, TCommonService, THelperCacheService } from 'src/app/lib';
import { TDSSafeAny } from 'tmt-tang-ui';
import { BaseSevice } from './base.service';

@Injectable()

export class CommonService extends BaseSevice {

  prefix: string = "";
  table: string = "";
  baseRestApi: string = "api/common";
  private readonly __keyCacheTeamId = 'nearestTeamId';

  constructor(private apiService: TCommonService) {
    super(apiService)
  }

  getPartnerStatusReport(): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.baseRestApi}/getpartnerstatusreport`,
        method: TApiMethodType.get,
    }

    return this.apiService.getData<TDSSafeAny>(api,null);
  }

}
