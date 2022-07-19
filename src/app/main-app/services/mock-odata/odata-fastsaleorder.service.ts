import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OperatorEnum, TAPIDTO, TApiMethodType, TCommonService, THelperCacheService } from 'src/app/lib';
import { FilterDataRequestDTO } from 'src/app/lib/dto/dataRequest.dto';
import { TDSHelperArray, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { BaseSevice } from '../base.service';

export interface FilterObjFastSaleModel  {
    tags: string[],
    status: string[],
    hasTracking: string | null,
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

  getView(params: string, filterObj: FilterObjFastSaleModel): Observable<TDSSafeAny>{
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.GetView?TagIds=${filterObj.tags}&deliveryType=${filterObj.deliveryType}&${params}&$count=true`,
        method: TApiMethodType.get,
    }
    return this.apiService.getData<any>(api, null);
  }

  public buildFilter(filterObj: FilterObjFastSaleModel) {
    let dataFilter: FilterDataRequestDTO = {
        logic: "or",
        filters: [],
    }

    dataFilter.filters.push({ field: "Type", operator: OperatorEnum.eq, value: "invoice"})
    dataFilter.logic = "and";

    if (filterObj?.dateRange && filterObj?.dateRange.startDate && filterObj?.dateRange.endDate) {

        let startDate = new Date(filterObj?.dateRange.startDate.setHours(0, 0, 0, 0)).toISOString();
        let endDate = new Date(filterObj?.dateRange.endDate).toISOString();

        let date1 = formatDate(new Date(), 'dd-MM-yyyy', 'en-US');
        let date2 = formatDate(filterObj?.dateRange.endDate, 'dd-MM-yyyy', 'en-US');

        if(date1 != date2) {
          endDate = new Date(filterObj?.dateRange.endDate.setHours(23, 59, 59, 59)).toISOString();
        }

        dataFilter.filters.push({
            filters: [
              { field: "DateInvoice", operator: OperatorEnum.gte, value: new Date(startDate) },
              { field: "DateInvoice", operator: OperatorEnum.lte, value: new Date(endDate) }
            ],
            logic: 'and'
        })
    }

    if (TDSHelperString.hasValueString(filterObj?.searchText)) {
        let value = TDSHelperString.stripSpecialChars(filterObj.searchText.toLowerCase().trim())
        dataFilter.filters.push( {
            filters: [
              { field: "PartnerDisplayName", operator: OperatorEnum.contains, value: value },
              { field: "Phone", operator: OperatorEnum.contains, value: value },
              { field: "Address", operator: OperatorEnum.contains, value: value },
              { field: "Number", operator: OperatorEnum.contains, value: value },
              { field: "Phone", operator: OperatorEnum.contains, value: value },
              { field: "PartnerNameNoSign", operator: OperatorEnum.contains, value: value },
              { field: "CarrierName", operator: OperatorEnum.contains, value: value},
              { field: "TrackingRef", operator: OperatorEnum.contains, value: value}
            ],
            logic: 'or'
        })
    }

    if(TDSHelperString.hasValueString(filterObj.hasTracking)) {
      if(filterObj.hasTracking === "isCode"){
          dataFilter.filters.push({ field: "TrackingRef", operator: OperatorEnum.neq, value: null })
          dataFilter.logic = "and";
      }
      if(filterObj.hasTracking === "noCode"){
        dataFilter.filters.push({ field: "TrackingRef", operator: OperatorEnum.eq, value: null })
        dataFilter.logic = "and";
      }
    }

    if (TDSHelperArray.hasListValue(filterObj.status)) {
      dataFilter.filters.push({
          filters: filterObj.status.map((x) => ({
              field: "State",
              operator: "eq",
              value: x,
          })),

          logic: "or"
      })
    }

    return dataFilter;
  }

}
