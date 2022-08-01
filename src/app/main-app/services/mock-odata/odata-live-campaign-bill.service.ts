import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { OperatorEnum, CoreAPIDTO, CoreApiMethodType, TCommonService, THelperCacheService } from 'src/app/lib';
import { FilterDataRequestDTO, FilterItemDataRequestDTO } from 'src/app/lib/dto/dataRequest.dto';
import { TDSHelperArray, TDSHelperString } from 'tds-ui/shared/utility';
import { FastSaleOrderModelDTO, ODataFastSaleOrderDTO } from '../../dto/fastsaleorder/fastsaleorder.dto';
import { ODataResponsesDTO } from '../../dto/odata/odata.dto';
import { BaseSevice } from '../base.service';

@Injectable()
export class ODataLiveCampaignBillService extends BaseSevice {

  prefix: string = "odata";
  table: string = "FastSaleOrder";
  baseRestApi: string = "";

  constructor(
      private apiService: TCommonService,
      public caheApi: THelperCacheService
  ) {
    super(apiService)
  }

  getView(params: string, filterObj: any): Observable<ODataResponsesDTO<FastSaleOrderModelDTO>>{
    params += this.buildParams(filterObj);

    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.GetViewCampaign?${params}&$count=true`,
        method: CoreApiMethodType.get,
    }
    return this.apiService.getData<ODataResponsesDTO<FastSaleOrderModelDTO>>(api, null);
  }

  public buildFilter(filterObj: any) {
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
          endDate = new Date(filterObj?.dateRange.endDate.setHours(23, 59, 59, 0)).toISOString();
        }

        dataFilter.filters.push({
            filters: [
              { field: "DateCreated", operator: OperatorEnum.gte, value: new Date(startDate) },
              { field: "DateCreated", operator: OperatorEnum.lte, value: new Date(endDate) }
            ],
            logic: 'and'
        })
    }

    if (TDSHelperString.hasValueString(filterObj?.searchText)) {
        let value =  TDSHelperString.stripSpecialChars(filterObj.searchText.toLowerCase().trim())
        dataFilter.filters.push( {
            filters: [
              { field: "PartnerDisplayName", operator: OperatorEnum.contains, value: value },
              { field: "Address", operator: OperatorEnum.contains, value: value },
              { field: "Number", operator: OperatorEnum.contains, value: value },
              { field: "State", operator: OperatorEnum.contains, value: value },
              { field: "PartnerNameNoSign", operator: OperatorEnum.contains, value: value },
              { field: "TrackingRef", operator: OperatorEnum.contains, value: value},
              { field: "PartnerPhone", operator: OperatorEnum.contains, value: value}
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

  public buildParams(filterObj: any) {
    let str = '';

    if(TDSHelperString.hasValueString(filterObj.liveCampaignId)) {
      str += `&liveCampaignId=${filterObj.liveCampaignId}`;
    }

    if(TDSHelperString.hasValueString(filterObj.deliveryType)) {
      str += `&deliveryType=${filterObj.deliveryType}`;
    }

    if(typeof filterObj.isWaitPayment === "boolean") {
      str += `&isWaitPayment=${filterObj.isWaitPayment}`;
    }

    if(TDSHelperArray.hasListValue(filterObj.tags)) {
      str += `TagIds=${filterObj.tags}`;
    }

    return str;
  }

}
