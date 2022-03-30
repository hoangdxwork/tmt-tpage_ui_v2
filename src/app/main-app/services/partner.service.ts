import { Injectable } from '@angular/core';
import { da } from 'date-fns/locale';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { TAPIDTO, TApiMethodType, TCommonService, THelperCacheService } from 'src/app/lib';
import { DataRequestDTO } from 'src/app/lib/dto/dataRequest.dto';
import { TDSHelperObject, TDSSafeAny } from 'tmt-tang-ui';
import { PagedList2 } from '../dto/pagedlist2.dto';
import { CRMTeamDTO } from '../dto/team/team.dto';
import { BaseSevice } from './base.service';

@Injectable()
export class PartnerService extends BaseSevice {

  prefix: string = "odata";
  table: string = "Partner";
  baseRestApi: string = "rest/v1.0/partner";

  public _keyCacheGrid: string = 'partner-page:grid_partner:settings';

  constructor(private apiService: TCommonService) {
    super(apiService)
  }

  delete(id: TDSSafeAny): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}(${id})`,
        method: TApiMethodType.delete,
    }

    return this.apiService.getData<TDSSafeAny>(api,null);
  }

  assignTagPartner(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/TagPartner/ODataService.AssignTagPartner`,
        method: TApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api,data);
  }

  resetLoyaltyPoint(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.ResetLoyaltyPoint`,
        method: TApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api,data);
  }

  transferPartner(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.TransferPartner`,
        method: TApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api,data);
  }

  setActive(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.SetActive`,
        method: TApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api,data);
  }


}
