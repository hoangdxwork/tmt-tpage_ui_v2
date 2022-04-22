import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OperatorEnum, TAPIDTO, TApiMethodType, TCommonService, THelperCacheService } from 'src/app/lib';
import { FilterDataRequestDTO } from 'src/app/lib/dto/dataRequest.dto';
import { TDSHelperString,  TDSSafeAny } from 'tmt-tang-ui';
import { ODataCRMTagDTO } from '../../dto/crm-tag/odata-crmtag.dto';
import { ODataPartnerDTO } from '../../dto/partner/partner.dto';
import { ODataQuickReplyDTO } from '../../dto/quick-reply.dto.ts/quick-reply.dto';
import { BaseSevice } from '../base.service';

export interface FilterObjDTO  {
    searchText: '',
}

@Injectable()
export class OdataQuickReplyService extends BaseSevice {

  prefix: string = "odata";
  table: string = "MailTemplate";
  baseRestApi: string = "";

  constructor(private apiService: TCommonService,
      public caheApi: THelperCacheService) {
    super(apiService);
  }

  get(params: string): Observable<TDSSafeAny>{
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}?${params}&$count=true`,
        method: TApiMethodType.get,
    }
    return this.apiService.getData<ODataQuickReplyDTO>(api, null);
  }

  public buildFilter(filterObj: FilterObjDTO) {
    let dataFilter: FilterDataRequestDTO = {
        logic: "and",
        filters: []
    }

    if (TDSHelperString.hasValueString(filterObj.searchText)) {
      let key = TDSHelperString.stripSpecialChars(filterObj.searchText.toLowerCase().trim())
        dataFilter.filters.push( {
            filters: [
              { field: "Name", operator: OperatorEnum.contains, value: key },
              { field: "BodyHtml", operator: OperatorEnum.contains, value: key },
              { field: "BodyPlain", operator: OperatorEnum.contains, value: key },
              { field: "Subject", operator: OperatorEnum.contains, value: key },
              { field: "TypeName", operator: OperatorEnum.contains, value: key },
            ],
            logic: 'or'
        })
    }

    return dataFilter;
  }

}
