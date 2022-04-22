import { ODataProductTemplateDTO } from '../../dto/configs/product/config-odata-product.dto';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OperatorEnum, TAPIDTO, TApiMethodType, TCommonService, THelperCacheService } from 'src/app/lib';
import { FilterDataRequestDTO } from 'src/app/lib/dto/dataRequest.dto';
import { TDSHelperString,  TDSSafeAny } from 'tmt-tang-ui';
import { BaseSevice } from '../base.service';

export interface FilterObjDTO  {
    searchText: string,
}

@Injectable()
export class OdataProductTemplateService extends BaseSevice {

  prefix: string = "odata";
  table: string = "ProductTemplate";
  baseRestApi: string = "";

  constructor(private apiService: TCommonService,
      public caheApi: THelperCacheService) {
    super(apiService)
  }

  getView(params:string): Observable<any>{
    const api: TAPIDTO = {
    url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.GetView?${params}&$count=true`,
    method: TApiMethodType.get,
    }

    return this.apiService.getData<ODataProductTemplateDTO>(api, null);
  }
  
  public buildFilter(filterObj: FilterObjDTO) {
    let dataFilter: FilterDataRequestDTO = {
        logic: "and",
        filters: []
    }

    dataFilter.filters.push({ field: "Active", operator: OperatorEnum.eq, value: true})
    dataFilter.logic = "and";

    if (TDSHelperString.hasValueString(filterObj.searchText)) {
        dataFilter.filters.push( {
            filters: [
              { field: "NameGet", operator: OperatorEnum.contains, value: filterObj.searchText },
              { field: "UOMName", operator: OperatorEnum.contains, value: filterObj.searchText },
              { field: "DefaultCode", operator: OperatorEnum.contains, value: filterObj.searchText }
            ],
            logic: 'or'
        })
    }

    return dataFilter;
  }

}
