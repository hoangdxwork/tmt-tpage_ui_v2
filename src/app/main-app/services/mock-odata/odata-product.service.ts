import { ODataProductDTOV2 } from './../../dto/product/odata-product.dto';
import { ODataProductDTO } from './../../dto/configs/product/config-odata-product.dto';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OperatorEnum, CoreAPIDTO, CoreApiMethodType, TCommonService, THelperCacheService } from 'src/app/lib';
import { FilterDataRequestDTO } from 'src/app/lib/dto/dataRequest.dto';
import { BaseSevice } from '../base.service';
import { TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';

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
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.GetView?${params}&$orderby=DateCreated%20desc&$count=true`,
        method: CoreApiMethodType.get,
    }
    return this.apiService.getData<ODataProductDTO>(api, null);
  }

  getProductOnFacebookPage(params: string, pageId: string): Observable<TDSSafeAny>{
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.GetProductOnFacebookPage?pageId=${pageId}&${params}&$count=true`,
        method: CoreApiMethodType.get,
    }
    return this.apiService.getData<ODataProductDTO>(api, null);
  }

  getProductOnShopCart(params: string): Observable<TDSSafeAny>{
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.GetProductOnShopCart?${params}&$count=true`,
        method: CoreApiMethodType.get,
    }
    return this.apiService.getData<any>(api, null);
  }

  getProductCombo(params: string): Observable<ODataProductDTOV2> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}?%24format=json&${params}&%24count=true`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<ODataProductDTOV2>(api, null);
  }

  public buildFilter(filterObj: FilterObjDTO) {
    let dataFilter: FilterDataRequestDTO = {
        logic: "and",
        filters: []
    }

    // dataFilter.filters.push({ field: "Active", operator: OperatorEnum.eq, value: true });
    dataFilter.logic = "and";

    if (TDSHelperString.hasValueString(filterObj?.searchText)) {
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
