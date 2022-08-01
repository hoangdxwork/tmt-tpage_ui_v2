import { Injectable } from '@angular/core';
import { da } from 'date-fns/locale';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { CoreAPIDTO, CoreApiMethodType, TCommonService, THelperCacheService } from 'src/app/lib';
import { DataRequestDTO } from 'src/app/lib/dto/dataRequest.dto';
import { TDSSafeAny } from 'tds-ui/shared/utility';
import { PagedList2 } from '../dto/pagedlist2.dto';
import { ODataTagsPartnerDTO } from '../dto/partner/partner-tags.dto';
import { CRMTeamDTO } from '../dto/team/team.dto';
import { BaseSevice } from './base.service';

@Injectable()

export class RestSMSService extends BaseSevice {

  prefix: string = "";
  table: string = "restsms";
  baseRestApi: string = "rest/v1.0";

  constructor(private apiService: TCommonService) {
    super(apiService)
  }

  get(): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.baseRestApi}/${this.table}`,
        method: CoreApiMethodType.get,
    }
    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  getById(key: any): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.baseRestApi}/${this.table}/${key}`,
        method: CoreApiMethodType.get,
    }
    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  getListSMS(): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.baseRestApi}/${this.table}/getlistsms`,
        method: CoreApiMethodType.get
    }

    return this.apiService.getData<ODataTagsPartnerDTO>(api, null);
  }

  insert(data: any): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.baseRestApi}/${this.table}`,
        method: CoreApiMethodType.post,
    }
    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  update(key: any, data: any): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.baseRestApi}/${this.table}/${key}`,
        method: CoreApiMethodType.put,
    }
    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  sendMessageSMS(data: any): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.baseRestApi}/${this.table}/sendmessagesms`,
        method: CoreApiMethodType.post,
    }
    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  generateMessageByPhone(data: any): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.baseRestApi}/${this.table}/generatemessagebyphone`,
        method: CoreApiMethodType.post,
    }
    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  generateMailMessage(data: any): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/generatemailmessage`,
        method: CoreApiMethodType.post,
    }
    return this.apiService.getData<TDSSafeAny>(api, data);
  }

}
