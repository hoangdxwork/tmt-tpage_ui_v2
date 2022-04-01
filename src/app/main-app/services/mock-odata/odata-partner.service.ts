import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { OperatorEnum, TAPIDTO, TApiMethodType, TCommonService, THelperCacheService } from 'src/app/lib';
import { FilterDataRequestDTO, FilterItemDataRequestDTO } from 'src/app/lib/dto/dataRequest.dto';
import { TDSHelperString,  TDSSafeAny } from 'tmt-tang-ui';
import { BaseSevice } from '../base.service';

export interface FilterObjDTO  {
    searchText: '',
    statusText: null
}

@Injectable()
export class OdataPartnerService extends BaseSevice {

  prefix: string = "odata";
  table: string = "Partner";
  baseRestApi: string = "";

  constructor(private apiService: TCommonService,
      public caheApi: THelperCacheService) {
    super(apiService)
  }

  getView(params: string, filterObj: FilterObjDTO): Observable<TDSSafeAny>{
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.GetView?${params}&$count=true`,
        method: TApiMethodType.get,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  public buildFilter(filterObj: FilterObjDTO) {

    let dataFilter: FilterDataRequestDTO = {
        logic: "and",
        filters: [],
    }

    dataFilter.filters.push({ field: "Customer", operator: OperatorEnum.eq, value: true})
    dataFilter.logic = "and";

    if(TDSHelperString.hasValueString(filterObj.statusText)) {
        dataFilter.filters.push({ field: "StatusText", operator: OperatorEnum.eq, value: filterObj.statusText})
        dataFilter.logic = "and";
    }

    if (TDSHelperString.hasValueString(filterObj.searchText)) {
        dataFilter.filters.push( {
            filters: [
              { field: "DisplayName", operator: OperatorEnum.contains, value: filterObj.searchText },
              { field: "Phone", operator: OperatorEnum.contains, value: filterObj.searchText },
              { field: "Email", operator: OperatorEnum.contains, value: filterObj.searchText },
              { field: "Street", operator: OperatorEnum.contains, value: filterObj.searchText },
              { field: "Zalo", operator: OperatorEnum.contains, value: filterObj.searchText }
            ],
            logic: 'or'
        })
    }

    return dataFilter;
  }

  getCreditDebitPartner(partnerId: any, params: any) {
      const api: TAPIDTO = {
          url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.CreditDebitCustomerDetail?partnerId=${partnerId}&${params}&$count=true`,
          method: TApiMethodType.get,
      }

      return this.apiService.getData<TDSSafeAny>(api, null);
  }

  getInvoicePartner(partnerId: any, params: any) {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/AccountInvoice/OdataService.GetInvoicePartner?partnerId=${partnerId}&${params}&$count=true`,
        method: TApiMethodType.get,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
}

}
