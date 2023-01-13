import { TDSHelperArray } from 'tds-ui/shared/utility';
import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OperatorEnum, CoreAPIDTO, CoreApiMethodType, TCommonService, THelperCacheService } from 'src/app/lib';
import { FilterDataRequestDTO } from 'src/app/lib/dto/dataRequest.dto';
import { TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { BaseSevice } from '../base.service';
import { ODataSaleOnline_OrderDTOV2 } from '../../dto/saleonlineorder/odata-saleonline-order.dto';
import { Guid } from 'guid-typescript';

export interface FilterObjSOOrderModel {
  Tags: string[],
  StatusTexts: string[],
  SearchText: string,
  DateRange: {
    StartDate: Date,
    EndDate: Date
  },
  LiveCampaignId: string | any,
  TeamId?: string | any,
  HasTelephone: boolean | any,
  PriorityStatus: string | any
}

export const enum PriorityStatus {
  PriorityAll = 'PriorityAll', // Ưu tiên
  PreliminaryAPart = 'PreliminaryAPart', // Dự bị một phần
  PreliminaryAll = 'PreliminaryAll', // Dự bị toàn phần
}

export interface TabNavsDTO {
  Name: string,
  Index: number,
  Total: number
}

@Injectable()
export class OdataSaleOnline_OrderService extends BaseSevice {

  prefix: string = "odata";
  table: string = "SaleOnline_Order";
  baseRestApi: string = "rest/v1.0/saleonlineorder";

  constructor(private apiService: TCommonService,
    public caheApi: THelperCacheService) {
    super(apiService)
  }

  getView(params: string, filterObj: FilterObjSOOrderModel): Observable<ODataSaleOnline_OrderDTOV2> {

    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.GetView?TagIds=${filterObj.Tags || ''}&${params}&$count=true`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<ODataSaleOnline_OrderDTOV2>(api, null);
  }

  getViewByPost(postId: string, params: string, filterObj: FilterObjSOOrderModel): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.GetOrdersByPostId?PostId=${postId}&TagIds=${filterObj.Tags || ''}&${params}&$count=true`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  getOrdersChannelByPostId(teamId: number, postId: string, params: string, filterObj: FilterObjSOOrderModel): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.GetOrdersChannelByPostId?PostId=${postId}&CRMTeamId=${teamId}&TagIds=${filterObj.Tags ||''}&${params}&$count=true`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  removeIds(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.RemoveIds`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  public buildFilter(filterObj: FilterObjSOOrderModel) {

    let dataFilter: FilterDataRequestDTO = {
      logic: "and",
      filters: [],
    }

    if (filterObj?.DateRange && filterObj?.DateRange?.StartDate && filterObj?.DateRange?.EndDate) {

      let startDate = new Date(filterObj?.DateRange?.StartDate.setHours(0, 0, 0, 0)).toISOString();
      let endDate = new Date(filterObj?.DateRange?.EndDate).toISOString();

      let date1 = formatDate(new Date(), 'dd-MM-yyyy', 'en-US');
      let date2 = formatDate(filterObj?.DateRange?.EndDate, 'dd-MM-yyyy', 'en-US');
      if (date1 != date2) {
        endDate = new Date(filterObj?.DateRange?.EndDate.setHours(23, 59, 59, 0)).toISOString();
      }

      dataFilter.filters.push({
        filters: [
          { field: "DateCreated", operator: OperatorEnum.gte, value: new Date(startDate) },
          { field: "DateCreated", operator: OperatorEnum.lte, value: new Date(endDate) }
        ],
        logic: 'and'
      })
    }

    if(filterObj.HasTelephone != null) {
      dataFilter.filters.push({
        filters: [
        { field: "Telephone", operator: (filterObj.HasTelephone ?  OperatorEnum.gt :  OperatorEnum.eq), value: (filterObj.HasTelephone ? "" : null) }
      ],
      logic: 'and'
      })
    }

    if (filterObj && Number(filterObj?.TeamId)) {
      dataFilter.filters.push({
          filters: [
            { field: "CRMTeamId", operator: OperatorEnum.eq, value: filterObj?.TeamId },
          ],
          logic: 'and'
      })
    }

    if (filterObj && filterObj?.LiveCampaignId) {
      dataFilter.filters.push({
          filters: [
            { field: "LiveCampaignId", operator: OperatorEnum.eq, value: Guid.parse(filterObj?.LiveCampaignId) },
          ],
          logic: 'and'
      })
    }

    if (filterObj && filterObj?.PriorityStatus) {
      dataFilter.filters.push({
          filters: [
            { field: "PriorityStatus", operator: OperatorEnum.eq, value: filterObj.PriorityStatus },
          ],
          logic: 'and'
      })
    }


    if (TDSHelperString.hasValueString(filterObj?.SearchText)) {
      let value = TDSHelperString.stripSpecialChars(filterObj.SearchText.toLowerCase().trim())
      dataFilter.filters.push({
        filters: [
          { field: "Code", operator: OperatorEnum.contains, value: value },
          { field: "Name", operator: OperatorEnum.contains, value: value },
          { field: "Telephone", operator: OperatorEnum.contains, value: value },
          { field: "Address", operator: OperatorEnum.contains, value: value },
          { field: "PartnerName", operator: OperatorEnum.contains, value: value },
          { field: "PartnerNameNosign", operator: OperatorEnum.contains, value: value },
          { field: "CRMTeamName", operator: OperatorEnum.contains, value: value },
          { field: "UserName", operator: OperatorEnum.contains, value: value }
        ],
        logic: 'or'
      })
    }

    if (TDSHelperArray.hasListValue(filterObj.StatusTexts)) {
      dataFilter.filters.push({
        filters: filterObj.StatusTexts?.map((x) => ({
          field: "StatusText",
          operator: "eq",
          value: x,
        })) || [],

        logic: "or"
      })
    }

    return dataFilter;
  }

  public buildFilterByPartner(filterObj: FilterObjSOOrderModel, partnerId: TDSSafeAny) {

    let dataFilter: FilterDataRequestDTO = {
      logic: "and",
      filters: [],
    }

    if (TDSHelperString.hasValueString(partnerId)) {
      dataFilter.filters.push({
        filters: [
          { field: "PartnerId", operator: OperatorEnum.eq, value: partnerId }
        ],
        logic: 'and'
      })
    }

    if (filterObj?.DateRange && filterObj.DateRange.StartDate && filterObj.DateRange.EndDate) {
      let startDate = new Date(filterObj?.DateRange.StartDate.setHours(0, 0, 0, 0)).toISOString();
      let endDate = new Date(filterObj?.DateRange.EndDate).toISOString();

      let date1 = formatDate(new Date(), 'dd-MM-yyyy', 'en-US');
      let date2 = formatDate(filterObj?.DateRange.EndDate, 'dd-MM-yyyy', 'en-US');
      if (date1 != date2) {
        endDate = new Date(filterObj?.DateRange.EndDate.setHours(23, 59, 59, 0)).toISOString();
      }

      dataFilter.filters.push({
        filters: [
          { field: "DateCreated", operator: OperatorEnum.gte, value: new Date(startDate) },
          { field: "DateCreated", operator: OperatorEnum.lte, value: new Date(endDate) }
        ],
        logic: 'and'
      })
    }

    if (TDSHelperString.hasValueString(filterObj?.SearchText)) {
      let value = TDSHelperString.stripSpecialChars(filterObj?.SearchText.toLocaleLowerCase().trim());
      dataFilter.filters.push({
        filters: [
          { field: "Code", operator: OperatorEnum.contains, value: value },
          { field: "Name", operator: OperatorEnum.contains, value: value },
          { field: "Telephone", operator: OperatorEnum.contains, value: value },
          { field: "Address", operator: OperatorEnum.contains, value: value },
          { field: "PartnerName", operator: OperatorEnum.contains, value: value },
          { field: "PartnerNameNosign", operator: OperatorEnum.contains, value: value },
          { field: "CRMTeamName", operator: OperatorEnum.contains, value: value },
          { field: "UserName", operator: OperatorEnum.contains, value: value }
        ],
        logic: 'or'
      })
    }

    if (TDSHelperString.hasValueString(filterObj?.StatusTexts?.[0])) {
      dataFilter.filters.push({ field: "StatusText", operator: OperatorEnum.eq, value: filterObj.StatusTexts[0] })
      dataFilter.logic = "and";
    }

    return dataFilter;
  }

  public buildFilterByPost(filterObj: FilterObjSOOrderModel) {

    let dataFilter: FilterDataRequestDTO = {
      logic: "and",
      filters: [],
    }

    if (filterObj?.DateRange && filterObj.DateRange?.StartDate && filterObj.DateRange?.EndDate) {
      dataFilter.filters.push({
        filters: [
          { field: "DateCreated", operator: OperatorEnum.gte, value: new Date(filterObj.DateRange.StartDate) },
          { field: "DateCreated", operator: OperatorEnum.lte, value: new Date(filterObj.DateRange.EndDate) }
        ],
        logic: 'and'
      })
    }

    if (TDSHelperString.hasValueString(filterObj?.SearchText)) {
      let value = TDSHelperString.stripSpecialChars(filterObj?.SearchText.toLocaleLowerCase().trim());
      dataFilter.filters.push({
        filters: [
          { field: "Code", operator: OperatorEnum.contains, value: value },
          { field: "Name", operator: OperatorEnum.contains, value: value },
          { field: "Telephone", operator: OperatorEnum.contains, value: value },
          { field: "Address", operator: OperatorEnum.contains, value: value },
          { field: "PartnerName", operator: OperatorEnum.contains, value: value },
          { field: "PartnerNameNosign", operator: OperatorEnum.contains, value: value },
          { field: "UserName", operator: OperatorEnum.contains, value: value }
        ],
        logic: 'or'
      })
    }

    if (TDSHelperString.hasValueString(filterObj?.StatusTexts?.[0])) {
      dataFilter.filters.push({ field: "StatusText", operator: OperatorEnum.eq, value: filterObj.StatusTexts[0] })
      dataFilter.logic = "and";
    }

    return dataFilter;
  }

}
