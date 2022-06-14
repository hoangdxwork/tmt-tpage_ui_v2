import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { OperatorEnum, TAPIDTO, TApiMethodType, TCommonService, THelperCacheService } from 'src/app/lib';
import { FilterDataRequestDTO, FilterItemDataRequestDTO } from 'src/app/lib/dto/dataRequest.dto';
import { TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { ODataFastSaleOrderDTO } from '../../dto/fastsaleorder/fastsaleorder.dto';
import { BaseSevice } from '../base.service';

export interface FilterObjDTO  {
    tags: Array<TDSSafeAny>,
    status: '',
    bill: null,
    deliveryType: '',
    searchText: '',
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
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.GetView?TagIds=${filterObj.tags}&deliveryType=${filterObj.deliveryType}&${params}&$count=true`,
        method: TApiMethodType.get,
    }
    return this.apiService.getData<ODataFastSaleOrderDTO>(api, null);
  }

  public buildFilter(filterObj: FilterObjDTO) {
    let dataFilter: FilterDataRequestDTO = {
        logic: "or",
        filters: [],
    }

    dataFilter.filters.push({ field: "Type", operator: OperatorEnum.eq, value: "invoice"})
    dataFilter.logic = "and";

    if (filterObj?.dateRange && filterObj?.dateRange.startDate && filterObj?.dateRange.endDate) {
        dataFilter.filters.push({
            filters: [
              { field: "DateInvoice", operator: OperatorEnum.gte, value: new Date(filterObj.dateRange.startDate) },
              { field: "DateInvoice", operator: OperatorEnum.lte, value: new Date(filterObj.dateRange.endDate) }
            ],
            logic: 'and'
        })
    }

    if (TDSHelperString.hasValueString(filterObj?.searchText)) {
        let value =  TDSHelperString.stripSpecialChars(filterObj.searchText.toLowerCase().trim())
        dataFilter.filters.push( {
            filters: [
              { field: "PartnerDisplayName", operator: OperatorEnum.contains, value: value },
              { field: "Phone", operator: OperatorEnum.contains, value: value },
              { field: "Address", operator: OperatorEnum.contains, value: value },
              { field: "Number", operator: OperatorEnum.contains, value: value },
              { field: "State", operator: OperatorEnum.contains, value: value },
              { field: "Phone", operator: OperatorEnum.contains, value: value },
              { field: "PartnerNameNoSign", operator: OperatorEnum.contains, value: value },
              { field: "CarrierName", operator: OperatorEnum.contains, value: value},
              { field: "TrackingRef", operator: OperatorEnum.contains, value: value}
            ],
            logic: 'or'
        })
    }

    if(TDSHelperString.hasValueString(filterObj.bill)) {
      if(filterObj.bill === "isCode"){
          dataFilter.filters.push({ field: "TrackingRef", operator: OperatorEnum.neq, value: null })
          dataFilter.logic = "and";
      }
      if(filterObj.bill === "noCode"){
        dataFilter.filters.push({ field: "TrackingRef", operator: OperatorEnum.eq, value: null })
        dataFilter.logic = "and";
      }
    }

    if (TDSHelperString.hasValueString(filterObj.status)) {
      dataFilter.filters.push({ field: "State", operator: OperatorEnum.eq, value: filterObj.status })
      dataFilter.logic = "and";
    }

    return dataFilter;
  }

}
