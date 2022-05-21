import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { OperatorEnum, TAPIDTO, TApiMethodType, TCommonService, THelperCacheService } from 'src/app/lib';
import { FilterDataRequestDTO, FilterItemDataRequestDTO } from 'src/app/lib/dto/dataRequest.dto';
import { TDSHelperString,  TDSSafeAny } from 'tmt-tang-ui';
import { BaseSevice } from '../base.service';

export interface FilterObjDTO  {
    tags: Array<TDSSafeAny>,
    status: '',
    searchText: '',
    dateRange: {
      startDate: Date,
      endDate: Date
  }
}

@Injectable()
export class OdataSaleOnline_OrderService extends BaseSevice {

  prefix: string = "odata";
  table: string = "SaleOnline_Order";
  baseRestApi: string = "rest/v1.0/saleonlineorder";

  constructor(
      private apiService: TCommonService,
      public caheApi: THelperCacheService
  ) {
    super(apiService)
  }

  getView(params: string, filterObj: FilterObjDTO): Observable<TDSSafeAny>{
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.GetView?TagIds=${filterObj.tags}&${params}&$count=true`,
        method: TApiMethodType.get,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  removeIds(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.RemoveIds`,
      method: TApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  public buildFilter(filterObj: FilterObjDTO) {

    let dataFilter: FilterDataRequestDTO = {
        logic: "and",
        filters: [],
    }

    if (filterObj?.dateRange && filterObj?.dateRange.startDate && filterObj?.dateRange.endDate) {
        dataFilter.filters.push({
            filters: [
              { field: "DateCreated", operator: OperatorEnum.gte, value: new Date(filterObj.dateRange.startDate) },
              { field: "DateCreated", operator: OperatorEnum.lte, value: new Date(filterObj.dateRange.endDate) }
            ],
            logic: 'and'
        })
    }

    if (TDSHelperString.hasValueString(filterObj?.searchText)) {
        dataFilter.filters.push( {
            filters: [
              { field: "Code", operator: OperatorEnum.contains, value: filterObj.searchText },
              { field: "Name", operator: OperatorEnum.contains, value: filterObj.searchText },
              { field: "Telephone", operator: OperatorEnum.contains, value: filterObj.searchText },
              { field: "Address", operator: OperatorEnum.contains, value: filterObj.searchText },
              { field: "PartnerName", operator: OperatorEnum.contains, value: filterObj.searchText },
              { field: "PartnerNameNosign", operator: OperatorEnum.contains, value: filterObj.searchText },
              { field: "StatusText", operator: OperatorEnum.contains, value: filterObj.searchText },
              { field: "CRMTeamName", operator: OperatorEnum.contains, value: filterObj.searchText},
              { field: "UserName", operator: OperatorEnum.contains, value: filterObj.searchText}
            ],
            logic: 'or'
        })
    }

    if (TDSHelperString.hasValueString(filterObj.status)) {
      dataFilter.filters.push({ field: "StatusText", operator: OperatorEnum.eq, value: filterObj.status })
      dataFilter.logic = "and";
    }

    return dataFilter;
  }

  public buildFilterByPartner(filterObj: FilterObjDTO, partnerId: TDSSafeAny) {

    let dataFilter: FilterDataRequestDTO = {
        logic: "and",
        filters: [],
    }

    if (TDSHelperString.hasValueString(partnerId)) {
        dataFilter.filters.push( {
            filters: [
              { field: "PartnerId", operator: OperatorEnum.eq, value: partnerId}

            ],
            logic: 'and'
        })
    }

    if (filterObj.dateRange && filterObj.dateRange.startDate && filterObj.dateRange.endDate) {
        dataFilter.filters.push({
            filters: [
              { field: "DateCreated", operator: OperatorEnum.gte, value: new Date(filterObj.dateRange.startDate) },
              { field: "DateCreated", operator: OperatorEnum.lte, value: new Date(filterObj.dateRange.endDate) }
            ],
            logic: 'and'
        })
    }

    if (TDSHelperString.hasValueString(filterObj.searchText)) {
        dataFilter.filters.push( {
            filters: [
              { field: "Code", operator: OperatorEnum.contains, value: filterObj.searchText },
              { field: "Name", operator: OperatorEnum.contains, value: filterObj.searchText },
              { field: "Telephone", operator: OperatorEnum.contains, value: filterObj.searchText },
              { field: "Address", operator: OperatorEnum.contains, value: filterObj.searchText },
              { field: "PartnerName", operator: OperatorEnum.contains, value: filterObj.searchText },
              { field: "PartnerNameNosign", operator: OperatorEnum.contains, value: filterObj.searchText },
              { field: "StatusText", operator: OperatorEnum.contains, value: filterObj.searchText },
              { field: "CRMTeamName", operator: OperatorEnum.contains, value: filterObj.searchText},
              { field: "UserName", operator: OperatorEnum.contains, value: filterObj.searchText}
            ],
            logic: 'or'
        })
    }

    if (TDSHelperString.hasValueString(filterObj.status)) {
      dataFilter.filters.push({ field: "StatusText", operator: OperatorEnum.eq, value: filterObj.status })
      dataFilter.logic = "and";
    }

    return dataFilter;
  }

}
