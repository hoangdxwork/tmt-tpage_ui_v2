import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';
import format from 'date-fns/format';
import { da } from 'date-fns/locale';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { OperatorEnum, TAPIDTO, TApiMethodType, TCommonService, THelperCacheService } from 'src/app/lib';
import { DataRequestDTO, FilterDataRequestDTO, FilterItemDataRequestDTO } from 'src/app/lib/dto/dataRequest.dto';
import { TDSHelperObject, TDSHelperString, TDSI18nService, TDSSafeAny } from 'tmt-tang-ui';
import { PagedList2 } from '../../dto/pagedlist2.dto';
import { CRMTeamDTO } from '../../dto/team/team.dto';
import { BaseSevice } from '../base.service';

export interface FilterObjDTO  {
    tags: Array<TDSSafeAny>,
    status: null,
    bill: null,
    deliveryType: TDSSafeAny,
    searchText: "",
    dateRange: {
        startDate: Date,
        endDate: Date
    }
}

@Injectable()
export class OdataFastSaleOrderService extends BaseSevice {

  prefix: string = "odata";
  table: string = "FastSaleOrder";
  baseRestApi: string = "rest/v1.0/fastsaleorder";

  constructor(private apiService: TCommonService,
      public caheApi: THelperCacheService) {
    super(apiService)
  }

  getView(params: string, filterObj: FilterObjDTO): Observable<TDSSafeAny>{

    var tags = null;
    if (filterObj.tags.length > 0) {
        tags = filterObj.tags.map((x: TDSSafeAny) => x.Id);
    }

    var deliveryType = filterObj.deliveryType.value;

    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.GetView?TagIds=${tags != null ? tags : ''}&deliveryType=${deliveryType != null ? deliveryType : ''}&${params}&$count=true`,
        method: TApiMethodType.get,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  public buildFilter(filterObj: FilterObjDTO) {

    let dataFilter: FilterDataRequestDTO = {
        logic: "or",
        filters: [],
    }

    let type: FilterItemDataRequestDTO = { field: "Type", operator: OperatorEnum.eq, value: "invoice" };
    dataFilter.filters.push(type);

    if (filterObj.dateRange && filterObj.dateRange.startDate && filterObj.dateRange.endDate) {

        let startDate: FilterItemDataRequestDTO = { field: "DateInvoice", operator: OperatorEnum.gte, value: new Date(filterObj.dateRange.startDate)};
        let endDate: FilterItemDataRequestDTO = { field: "DateInvoice", operator: OperatorEnum.lte, value: new Date(filterObj.dateRange.endDate) };

        dataFilter.filters.push(startDate);
        dataFilter.filters.push(endDate);
        //TODO: gán logic
        dataFilter.logic = "and";
    }

    if (TDSHelperString.hasValueString(filterObj.searchText)) {

        let displayName: FilterItemDataRequestDTO = { field: "PartnerDisplayName", operator: OperatorEnum.contains, value: filterObj.searchText };
        let address: FilterItemDataRequestDTO = { field: "Address", operator: OperatorEnum.contains, value: filterObj.searchText };
        let number: FilterItemDataRequestDTO = { field: "Number", operator: OperatorEnum.contains, value: filterObj.searchText };
        let state: FilterItemDataRequestDTO = { field: "State", operator: OperatorEnum.contains, value: filterObj.searchText };
        let phone: FilterItemDataRequestDTO = { field: "Phone", operator: OperatorEnum.contains, value: filterObj.searchText };
        let nameNoSign: FilterItemDataRequestDTO = { field: "PartnerNameNoSign", operator: OperatorEnum.contains, value: filterObj.searchText };

        dataFilter.filters.push(displayName);
        dataFilter.filters.push(address);
        dataFilter.filters.push(number);
        dataFilter.filters.push(state);
        dataFilter.filters.push(phone);
        dataFilter.filters.push(nameNoSign);
        //TODO: gán logic
        dataFilter.logic = "or";
    }

    if(filterObj.bill) {
      if(filterObj.bill === "isCode"){

      }
    }

    if (TDSHelperString.hasValueString(filterObj.status)) {
      let status: FilterItemDataRequestDTO = { field: "State", operator: OperatorEnum.eq, value: filterObj.status };
      dataFilter.filters.push(status);
      //TODO: gán logic
      dataFilter.logic = "and";
    }

    return dataFilter;
  }

}
