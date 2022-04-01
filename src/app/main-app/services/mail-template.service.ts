import { Injectable } from '@angular/core';
import { da } from 'date-fns/locale';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { OperatorEnum, TAPIDTO, TApiMethodType, TCommonService, THelperCacheService } from 'src/app/lib';
import { DataRequestDTO } from 'src/app/lib/dto/dataRequest.dto';
import { TDSHelperObject, TDSSafeAny, TDSHelperString } from 'tmt-tang-ui';
import { MailTemplateUpdateDTO } from '../dto/mailtemplate/mail-template.dto';
import { PagedList2 } from '../dto/pagedlist2.dto';
import { CRMTeamDTO } from '../dto/team/team.dto';
import { BaseSevice } from './base.service';

@Injectable({
  providedIn: 'root'
})

export class MailTemplateService extends BaseSevice {

  prefix: string = "odata";
  table: string = "MailTemplate";
  baseRestApi: string = "rest/v1.0/mailtemplate";

  constructor(private apiService: TCommonService) {
    super(apiService)
  }

  getFilter(filter: string): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}?filter=${filter}${OperatorEnum.eq}true`,
      method: TApiMethodType.get
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  insert(data: MailTemplateUpdateDTO, filter?: string): Observable<any> {

    let paramFilter = ""
    if(TDSHelperString.hasValueString(filter)) {
      paramFilter = `?filter=${filter}${OperatorEnum.eq}true`;
    }

    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}${paramFilter}`,
      method: TApiMethodType.post
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }

}
