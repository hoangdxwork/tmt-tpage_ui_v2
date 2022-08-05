import { FilterObjDTO } from './../tag-product-template.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OperatorEnum, CoreAPIDTO, CoreApiMethodType, TCommonService, THelperCacheService } from 'src/app/lib';
import { FilterDataRequestDTO } from 'src/app/lib/dto/dataRequest.dto';
import { ODataCRMTagDTO } from '../../dto/crm-tag/odata-crmtag.dto';
import { BaseSevice } from '../base.service';
import { TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';

@Injectable()
export class OdataCRMTagService extends BaseSevice {

  prefix: string = "odata";
  table: string = "CRMTag";
  baseRestApi: string = "";

  constructor(private apiService: TCommonService,
      public caheApi: THelperCacheService
  ) {
    super(apiService)
  }

  getView(params: string, filterObj?: FilterObjDTO): Observable<TDSSafeAny>{
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}?${params}&$count=true`,
        method: CoreApiMethodType.get,
    }

    return this.apiService.getData<ODataCRMTagDTO>(api, null);
  }

  public buildFilter(filterObj: any) {
    let dataFilter: FilterDataRequestDTO = {
        logic: "and",
        filters: []
    }

    if (TDSHelperString.hasValueString(filterObj?.searchText)) {
        dataFilter.filters.push( {
            filters: [
              { field: "Name", operator: OperatorEnum.contains, value: filterObj.searchText }
            ],
            logic: 'or'
        })
    }

    return dataFilter;
  }

}
