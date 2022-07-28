import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';
import { isBuffer } from 'lodash';
import { Observable } from 'rxjs';
import { OperatorEnum, TAPIDTO, TApiMethodType, TCommonService, THelperCacheService } from 'src/app/lib';
import { FilterDataRequestDTO } from 'src/app/lib/dto/dataRequest.dto';
import { TDSHelperArray, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { BaseSevice } from '../base.service';

export interface FilterObjFastSaleOrderModel  {
    state: string,
    searchText: '',
    dateRange: {
      startDate: Date,
      endDate: Date
    }
}

@Injectable()
export class OdataFastSaleOrderPartnerIdService extends BaseSevice {

  prefix: string = "odata";
  table: string = "FastSaleOrder";
  baseRestApi: string = "rest/v1.0/fastsaleorder";

  constructor(private apiService: TCommonService,
      public caheApi: THelperCacheService) {
      super(apiService)
  }

  getOrdersByPartnerId(partnerId: number, params: string): Observable<TDSSafeAny>{
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.GetOrdersByPartnerId?PartnerId=${partnerId}&${params}&$count=true`,
        method: TApiMethodType.get,
    }
    return this.apiService.getData<any>(api, null);
  }

  getOverviewOrdersByPartnerId(partnerId: number, DateFrom: string, DateTo: string): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.GetOverviewOrdersByPartnerId?PartnerId=${partnerId}&DateFrom=${DateFrom}&DateTo=${DateTo}`,
      method: TApiMethodType.get,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }


  public buildFilter(filterObj: FilterObjFastSaleOrderModel) {
    let dataFilter: FilterDataRequestDTO = {
        logic: "and",
        filters: [],
    }

    if(TDSHelperString.hasValueString(filterObj.state)){
        dataFilter.filters.push({ field: "State", operator: OperatorEnum.eq, value: filterObj.state})
        dataFilter.logic = "and";
    }

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


    return dataFilter;
  }

}
