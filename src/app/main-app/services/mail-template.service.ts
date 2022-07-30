import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { OperatorEnum, TAPIDTO, TApiMethodType, TCommonService, THelperCacheService } from 'src/app/lib';
import { TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { MailTemplateUpdateDTO } from '../dto/mailtemplate/mail-template.dto';
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

  get(): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}?%24filter=(Active+eq+true)`,
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
