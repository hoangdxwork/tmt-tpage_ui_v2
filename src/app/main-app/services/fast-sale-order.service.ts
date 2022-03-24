import { Injectable } from '@angular/core';
import { da } from 'date-fns/locale';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { TAPIDTO, TApiMethodType, TCommonService, THelperCacheService } from 'src/app/lib';
import { TDSHelperObject, TDSSafeAny } from 'tmt-tang-ui';
import { PagedList2 } from '../dto/pagedlist2.dto';
import { CRMTeamDTO } from '../dto/team/team.dto';
import { BaseSevice } from './base.service';

@Injectable()

export class FastSaleOrderService extends BaseSevice {

  prefix: string = "odata";
  table: string = "FastSaleOrder";
  baseRestApi: string = "rest/v1.0/fastsaleorder";
  private readonly __keyCacheTeamId = 'nearestTeamId';


  constructor(private apiService: TCommonService, private caheApi: THelperCacheService) {
    super(apiService)
  }

  getSummaryStatus(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/getsummarystatusfastsaleonline`,
      method: TApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api,data);
  }

}
