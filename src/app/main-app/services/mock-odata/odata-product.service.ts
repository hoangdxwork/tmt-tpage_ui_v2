import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OperatorEnum, TAPIDTO, TApiMethodType, TCommonService, THelperCacheService } from 'src/app/lib';
import { FilterDataRequestDTO } from 'src/app/lib/dto/dataRequest.dto';
import { TDSHelperString,  TDSSafeAny } from 'tmt-tang-ui';
import { ODataCRMTagDTO } from '../../dto/crm-tag/odata-crmtag.dto';
import { ODataPartnerDTO } from '../../dto/partner/partner.dto';
import { ODataProductDTOV2 } from '../../dto/product/odata-product.dto';
import { BaseSevice } from '../base.service';

export interface FilterObjDTO  {
    searchText: string,
}

@Injectable()
export class OdataProductService extends BaseSevice {

  prefix: string = "odata";
  table: string = "Product";
  baseRestApi: string = "";

  constructor(private apiService: TCommonService,
      public caheApi: THelperCacheService) {
    super(apiService)
  }

  getView(params: string): Observable<TDSSafeAny>{
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}?${params}&$count=true`,
        method: TApiMethodType.get,
    }

    return this.apiService.getData<ODataProductDTOV2>(api, null);
  }

  getProductOnFacebookPage(params: string, pageId: string): Observable<TDSSafeAny>{
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.GetProductOnFacebookPage?pageId=${pageId}&${params}&$count=true`,
      method: TApiMethodType.get,
  }

  return this.apiService.getData<ODataProductDTOV2>(api, null);
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
