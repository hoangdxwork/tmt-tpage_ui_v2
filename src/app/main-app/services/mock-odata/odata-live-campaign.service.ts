import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { OperatorEnum, TAPIDTO, TApiMethodType, TCommonService, THelperCacheService } from 'src/app/lib';
import { FilterDataRequestDTO, FilterItemDataRequestDTO } from 'src/app/lib/dto/dataRequest.dto';
import { TDSHelperString } from 'tds-ui/shared/utility';
import { LiveCampaignFSOrderDTO, LiveCampaignSOOrderDTO, ReportLiveCampaignProductDataDTO, SaleOnline_LiveCampaignDTO } from '../../dto/live-campaign/live-campaign.dto';
import { FilterLiveCampaignDTO, FilterLiveCampaignProductDTO, ODataResponsesDTO } from '../../dto/odata/odata.dto';
import { BaseSevice } from '../base.service';

@Injectable()
export class ODataLiveCampaignService extends BaseSevice {

  prefix: string = "odata";
  table: string = "SaleOnline_LiveCampaign";
  baseRestApi: string = "";

  constructor(
      private apiService: TCommonService,
      public caheApi: THelperCacheService
  ) {
    super(apiService)
  }

  get(params: string): Observable<ODataResponsesDTO<SaleOnline_LiveCampaignDTO>>{
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}?${params}&$count=true`,
        method: TApiMethodType.get,
    }

    return this.apiService.getData<ODataResponsesDTO<SaleOnline_LiveCampaignDTO>>(api, null);
  }

  getView(params: string): Observable<ODataResponsesDTO<SaleOnline_LiveCampaignDTO>>{
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.GetViewCampaign?${params}&$count=true${params}&$count=true`,
        method: TApiMethodType.get,
    }

    return this.apiService.getData<ODataResponsesDTO<SaleOnline_LiveCampaignDTO>>(api, null);
  }

  getProduct(liveCampaignId: string, params: string): Observable<ODataResponsesDTO<ReportLiveCampaignProductDataDTO>> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.ReportLiveCampaignProduct?key=${liveCampaignId}&${params}&$count=true`,
        method: TApiMethodType.get,
    }

    return this.apiService.getData<ODataResponsesDTO<ReportLiveCampaignProductDataDTO>>(api, null);
  }

  getSOOrder(liveCampaignId: string, productId: number, params: string) {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.GetLiveCampaignSOOrder?key=${liveCampaignId}&product_id=${productId}&${params}&$count=true`,
        method: TApiMethodType.get,
    }

    return this.apiService.getData<ODataResponsesDTO<LiveCampaignSOOrderDTO>>(api, null);
  }

  getSOOrderCancel(liveCampaignId: string, productId: number, params: string) {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.GetLiveCampaignSOOrderCancel?key=${liveCampaignId}&product_id=${productId}&${params}&$count=true`,
        method: TApiMethodType.get,
    }

    return this.apiService.getData<ODataResponsesDTO<LiveCampaignSOOrderDTO>>(api, null);
  }

  getFSOrder(liveCampaignId: string, productId: number, params: string) {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.GetLiveCampaignFSOrder?key=${liveCampaignId}&product_id=${productId}&${params}&$count=true`,
        method: TApiMethodType.get,
    }

    return this.apiService.getData<ODataResponsesDTO<LiveCampaignFSOrderDTO>>(api, null);
  }

  getFSOrderCancel(liveCampaignId: string, productId: number, params: string) {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.GetLiveCampaignFSOrderCancel?key=${liveCampaignId}&product_id=${productId}&${params}&$count=true`,
        method: TApiMethodType.get,
    }

    return this.apiService.getData<ODataResponsesDTO<LiveCampaignFSOrderDTO>>(api, null);
  }

  public buildFilter(filterObj: FilterLiveCampaignDTO) {

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
        dataFilter.filters.push( {
            filters: [
              { field: "Name", operator: OperatorEnum.contains, value: filterObj.searchText },
              { field: "NameNoSign", operator: OperatorEnum.contains, value: filterObj.searchText },
              { field: "Facebook_UserName", operator: OperatorEnum.contains, value: filterObj.searchText },
            ],
            logic: 'or'
        })
    }

    if (TDSHelperString.hasValueString(filterObj.status)) {
      dataFilter.filters.push({ field: "IsActive", operator: OperatorEnum.eq, value: filterObj.status })
      dataFilter.logic = "and";
    }

    return dataFilter;
  }

  buildFilterProduct(filterObj: FilterLiveCampaignProductDTO) {
    let dataFilter: FilterDataRequestDTO = {
        logic: "and",
        filters: [],
    }

    if (TDSHelperString.hasValueString(filterObj?.searchText)) {
        dataFilter.filters.push( {
            filters: [
              { field: "ProductName", operator: OperatorEnum.contains, value: filterObj.searchText },
              { field: "ProductNameNoSign", operator: OperatorEnum.contains, value: filterObj.searchText }
            ],
            logic: 'or'
        })
    }

    return dataFilter;
  }

}
