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
  tags: string[],
  status: string[],
  searchText: string,
  dateRange: {
    startDate: Date,
    endDate: Date
  } | any,
  liveCampaignId: string | any,
  teamId?: string | any,
  Telephone: boolean | any,
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
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.GetView?TagIds=${filterObj.tags}&${params}&$count=true`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<ODataSaleOnline_OrderDTOV2>(api, null);
  }

  getViewByPost(postId: string, params: string, filterObj: FilterObjSOOrderModel): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.GetOrdersByPostId?PostId=${postId}&TagIds=${filterObj.tags}&${params}&$count=true`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  getOrdersChannelByPostId(teamId: number, postId: string, params: string, filterObj: FilterObjSOOrderModel): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.GetOrdersChannelByPostId?PostId=${postId}&CRMTeamId=${teamId}&TagIds=${filterObj.tags}&${params}&$count=true`,
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

    if (filterObj?.dateRange && filterObj?.dateRange.startDate && filterObj?.dateRange.endDate) {

      let startDate = new Date(filterObj?.dateRange.startDate.setHours(0, 0, 0, 0)).toISOString();
      let endDate = new Date(filterObj?.dateRange.endDate).toISOString();

      let date1 = formatDate(new Date(), 'dd-MM-yyyy', 'en-US');
      let date2 = formatDate(filterObj?.dateRange.endDate, 'dd-MM-yyyy', 'en-US');
      if (date1 != date2) {
        endDate = new Date(filterObj?.dateRange.endDate.setHours(23, 59, 59, 0)).toISOString();
      }

      dataFilter.filters.push({
        filters: [
          { field: "DateCreated", operator: OperatorEnum.gte, value: new Date(startDate) },
          { field: "DateCreated", operator: OperatorEnum.lte, value: new Date(endDate) }
        ],
        logic: 'and'
      })

      if(filterObj.Telephone != null) {
        (dataFilter.filters[0] as FilterDataRequestDTO)?.filters?.push(
          { field: "Telephone", operator: (filterObj.Telephone ?  OperatorEnum.gt :  OperatorEnum.eq), value: (filterObj.Telephone ? "" : null) }
        )
      }
    }

    if (filterObj && Number(filterObj?.teamId)) {
      dataFilter.filters.push({
          filters: [
            { field: "CRMTeamId", operator: OperatorEnum.eq, value: filterObj?.teamId },
          ],
          logic: 'and'
      })
    }

    if (filterObj && filterObj?.liveCampaignId) {
      dataFilter.filters.push({
          filters: [
            { field: "LiveCampaignId", operator: OperatorEnum.eq, value: Guid.parse(filterObj.liveCampaignId) },
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


    if (TDSHelperString.hasValueString(filterObj?.searchText)) {
      let value = TDSHelperString.stripSpecialChars(filterObj.searchText.toLowerCase().trim())
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

    if (TDSHelperArray.hasListValue(filterObj.status)) {
      dataFilter.filters.push({
        filters: filterObj.status?.map((x) => ({
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

    if (filterObj.dateRange && filterObj.dateRange.startDate && filterObj.dateRange.endDate) {
      let startDate = new Date(filterObj?.dateRange.startDate.setHours(0, 0, 0, 0)).toISOString();
      let endDate = new Date(filterObj?.dateRange.endDate).toISOString();

      let date1 = formatDate(new Date(), 'dd-MM-yyyy', 'en-US');
      let date2 = formatDate(filterObj?.dateRange.endDate, 'dd-MM-yyyy', 'en-US');
      if (date1 != date2) {
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

    if (TDSHelperString.hasValueString(filterObj.searchText)) {
      dataFilter.filters.push({
        filters: [
          { field: "Code", operator: OperatorEnum.contains, value: filterObj.searchText },
          { field: "Name", operator: OperatorEnum.contains, value: filterObj.searchText },
          { field: "Telephone", operator: OperatorEnum.contains, value: filterObj.searchText },
          { field: "Address", operator: OperatorEnum.contains, value: filterObj.searchText },
          { field: "PartnerName", operator: OperatorEnum.contains, value: filterObj.searchText },
          { field: "PartnerNameNosign", operator: OperatorEnum.contains, value: filterObj.searchText },
          { field: "StatusText", operator: OperatorEnum.contains, value: filterObj.searchText },
          { field: "CRMTeamName", operator: OperatorEnum.contains, value: filterObj.searchText },
          { field: "UserName", operator: OperatorEnum.contains, value: filterObj.searchText }
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

  public buildFilterByPost(filterObj: FilterObjSOOrderModel) {

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
      dataFilter.filters.push({
        filters: [
          { field: "Code", operator: OperatorEnum.contains, value: filterObj.searchText },
          { field: "Name", operator: OperatorEnum.contains, value: filterObj.searchText },
          { field: "Telephone", operator: OperatorEnum.contains, value: filterObj.searchText },
          { field: "Address", operator: OperatorEnum.contains, value: filterObj.searchText },
          { field: "PartnerName", operator: OperatorEnum.contains, value: filterObj.searchText },
          { field: "PartnerNameNosign", operator: OperatorEnum.contains, value: filterObj.searchText },
          { field: "StatusText", operator: OperatorEnum.contains, value: filterObj.searchText },
          // Tạm comment chờ backend update api
          // { field: "CRMTeamName", operator: OperatorEnum.contains, value: filterObj.searchText},
          { field: "UserName", operator: OperatorEnum.contains, value: filterObj.searchText }
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
