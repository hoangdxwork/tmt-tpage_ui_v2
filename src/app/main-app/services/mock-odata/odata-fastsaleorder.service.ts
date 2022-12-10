import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { Observable } from 'rxjs';
import { OperatorEnum, CoreAPIDTO, CoreApiMethodType, TCommonService, THelperCacheService } from 'src/app/lib';
import { FilterDataRequestDTO } from 'src/app/lib/dto/dataRequest.dto';
import { TDSHelperArray, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { BaseSevice } from '../base.service';

export interface FilterObjFastSaleModel  {
    tags: string[];
    status: string[];
    hasTracking: string | null;
    deliveryId: number;
    carrierDeliveryType: '';
    searchText: '';
    dateRange: {
      startDate: Date,
      endDate: Date
    };
    shipPaymentStatus: string | null;
    liveCampaignId: string | any,
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
    params = this.setParams(params, filterObj);

    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.GetView?${params}&$count=true`,
        method: CoreApiMethodType.get,
    }
    return this.apiService.getData<any>(api, null);
  }

  getViewV2(params: string, filterObj: FilterObjFastSaleModel): Observable<TDSSafeAny>{
    params = this.setParams(params, filterObj);

    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.GetViewV2?${params}&$count=true`,
        method: CoreApiMethodType.get,
    }
    return this.apiService.getData<any>(api, null);
  }

  setParams(params: string, filterObj: FilterObjFastSaleModel){
    if (TDSHelperArray.hasListValue(filterObj.tags)) {
      params += '&'
      params += `TagIds=${filterObj.tags}`
    }

    if (filterObj && filterObj?.liveCampaignId) {
      params += '&'
      params += `liveCampaignId=${filterObj.liveCampaignId}`
    }

    // if (TDSHelperString.hasValueString(filterObj.carrierDeliveryType)) {
    //   params += '&'
    //   params += `CarrierDeliveryType=${filterObj.carrierDeliveryType}`
    // }

    // if (filterObj.deliveryId && filterObj.deliveryId >= 0) {
    //   params += '&'
    //   params += `DeliveryId=${filterObj.deliveryId}`
    // }

    return params;
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

    if(TDSHelperString.hasValueString(filterObj.shipPaymentStatus)) {
        dataFilter.filters.push({ field: "ShipPaymentStatus", operator: OperatorEnum.eq, value: filterObj.shipPaymentStatus })
          dataFilter.logic = "and";
    }

    // if (filterObj && filterObj?.liveCampaignId) {
    //   dataFilter.filters.push({
    //       filters: [
    //         { field: "LiveCampaignId", operator: OperatorEnum.eq, value: Guid.parse(filterObj.liveCampaignId) },
    //       ],
    //       logic: 'and'
    //   })
    // }

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

    if(TDSHelperString.hasValueString(filterObj.carrierDeliveryType)) {
      dataFilter.filters.push({ field: "CarrierDeliveryType", operator: OperatorEnum.eq, value: filterObj.carrierDeliveryType })
        dataFilter.logic = "and";
    }

    if(filterObj.deliveryId && filterObj.deliveryId >= 0) {
      dataFilter.filters.push({ field: "CarrierId", operator: OperatorEnum.eq, value: filterObj.deliveryId })
        dataFilter.logic = "and";
    }

    return dataFilter;
  }

}
