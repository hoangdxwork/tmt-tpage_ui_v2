import { ODataProductTagDTO } from './../dto/configs/product/config-odata-product.dto';
import { Injectable } from '@angular/core';
import { da } from 'date-fns/locale';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { CoreAPIDTO, CoreApiMethodType, TCommonService, THelperCacheService } from 'src/app/lib';
import { DataRequestDTO } from 'src/app/lib/dto/dataRequest.dto';
import { PagedList2 } from '../dto/pagedlist2.dto';
import { ODataTagsPartnerDTO } from '../dto/partner/partner-tags.dto';
import { CRMTeamDTO } from '../dto/team/team.dto';
import { BaseSevice } from './base.service';
import { TDSSafeAny } from 'tds-ui/shared/utility';

@Injectable()

export class TagService extends BaseSevice {

  prefix: string = "odata";
  table: string = "Tag";
  baseRestApi: string = "";

  constructor(private apiService: TCommonService) {
    super(apiService)
  }

  get(): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}`,
        method: CoreApiMethodType.get,
    }
    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  getByType(type: string): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.GetByType?type=${type}`,
        method: CoreApiMethodType.get
    }
    return this.apiService.getData<ODataTagsPartnerDTO>(api, null);
  }

  getProductTagList(): Observable<any>{
    const api: CoreAPIDTO = {
    url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.GetByType?type=producttemplate`,
    method: CoreApiMethodType.get,
    }

    return this.apiService.getData<ODataProductTagDTO>(api, null);
  }
}
