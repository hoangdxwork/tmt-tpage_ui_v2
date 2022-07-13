import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { OperatorEnum, TAPIDTO, TApiMethodType, TCommonService, THelperCacheService } from 'src/app/lib';
import { FilterDataRequestDTO, FilterItemDataRequestDTO } from 'src/app/lib/dto/dataRequest.dto';
import { TDSHelperArray, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { ODataCreditDebitDTO } from '../../dto/partner/partner-creditdebit.dto';
import { ODataPartnerInvoiceDTO } from '../../dto/partner/partner-invocie.dto';
import { ODataPartnerDTO } from '../../dto/partner/partner.dto';
import { BaseSevice } from '../base.service';

export interface FilterObjPartnerModel  {
    tags: string[],
    status: string[],
    searchText: ''
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

  getView(params: string, filterObj: FilterObjPartnerModel): Observable<TDSSafeAny>{
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.GetView?TagIds=${filterObj.tags}&${params}&$count=true`,
        method: TApiMethodType.get,
    }
    return this.apiService.getData<ODataPartnerDTO>(api, null);
  }

  public buildFilter(filterObj: FilterObjPartnerModel) {
    let dataFilter: FilterDataRequestDTO = {
        logic: "and",
        filters: [],
    }

    dataFilter.filters.push({ field: "Customer", operator: OperatorEnum.eq, value: true})
    dataFilter.logic = "and";

    if (TDSHelperString.hasValueString(filterObj?.searchText)) {
        let value = TDSHelperString.stripSpecialChars(filterObj.searchText.toLowerCase().trim());
        dataFilter.filters.push( {
            filters: [
              { field: "DisplayName", operator: OperatorEnum.contains, value: value },
              { field: "Name", operator: OperatorEnum.contains, value: value },
              { field: "NameNoSign", operator: OperatorEnum.contains, value: value },
              { field: "Phone", operator: OperatorEnum.contains, value: value },
              { field: "Email", operator: OperatorEnum.contains, value: value },
              { field: "Street", operator: OperatorEnum.contains, value: value },
              { field: "Zalo", operator: OperatorEnum.contains, value: value }
            ],
            logic: 'or'
        })
    }

    if (TDSHelperArray.hasListValue(filterObj.status)) {
      dataFilter.filters.push({
          filters: filterObj.status.map((x) => ({
              field: "StatusText",
              operator: "eq",
              value: x,
          })),

          logic: "or"
      })
    }

    return dataFilter;
  }

  getCreditDebitPartner(partnerId: any, params: any): Observable<TDSSafeAny> {
      const api: TAPIDTO = {
          url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.CreditDebitCustomerDetail?partnerId=${partnerId}&${params}&$count=true`,
          method: TApiMethodType.get,
      }

      return this.apiService.getData<ODataCreditDebitDTO>(api, null);
  }

  getInvoicePartner(partnerId: any, params: any): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/AccountInvoice/OdataService.GetInvoicePartner?partnerId=${partnerId}&${params}&$count=true`,
        method: TApiMethodType.get,
    }

    return this.apiService.getData<ODataPartnerInvoiceDTO>(api, null);
  }

}
