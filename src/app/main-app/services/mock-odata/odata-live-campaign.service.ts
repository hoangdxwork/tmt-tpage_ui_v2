import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OperatorEnum, CoreAPIDTO, CoreApiMethodType, TCommonService, THelperCacheService } from 'src/app/lib';
import { FilterDataRequestDTO } from 'src/app/lib/dto/dataRequest.dto';
import { TDSHelperArray, TDSHelperString } from 'tds-ui/shared/utility';
import { ODataLiveCampaignModelDTO } from '../../dto/live-campaign/odata-live-campaign-model.dto';
import { BaseSevice } from '../base.service';
import { Guid } from "guid-typescript";

export interface FilterObjLiveCampaignDTO  {
    ids: string[],
    searchText: string,
    isActive: boolean | null,
    dateRange: {
      startDate: Date | null,
      endDate: Date | null
    }
}

@Injectable()
export class ODataLiveCampaignService extends BaseSevice {

  prefix: string = "odata";
  table: string = "SaleOnline_LiveCampaign";
  baseRestApi: string = "";

  constructor(private apiService: TCommonService,
      public caheApi: THelperCacheService) {
      super(apiService)
  }

  getView(params: string): Observable<ODataLiveCampaignModelDTO>{
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}?${params}&$count=true`,
        method: CoreApiMethodType.get,
    }

    return this.apiService.getData<ODataLiveCampaignModelDTO>(api, null);
  }

  public buildFilter(filterObj: FilterObjLiveCampaignDTO, isFilterActive?: boolean) {

    let dataFilter: FilterDataRequestDTO = {
        logic: "and",
        filters: [],
    }

    if (TDSHelperString.hasValueString(filterObj.isActive)) {
        dataFilter.filters.push({ field: "IsActive", operator: OperatorEnum.eq, value: filterObj.isActive })
        dataFilter.logic = "and";
    }

    if (filterObj?.dateRange && filterObj?.dateRange.startDate && filterObj?.dateRange.endDate && isFilterActive != false) {

        let startDate = new Date(filterObj?.dateRange.startDate.setHours(0, 0, 0, 0)).toISOString();
        let endDate = new Date(filterObj?.dateRange.endDate).toISOString();

        let date1 = formatDate(new Date(), 'dd-MM-yyyy', 'en-US');
        let date2 = formatDate(filterObj?.dateRange.endDate, 'dd-MM-yyyy', 'en-US');
        if(date1 != date2) {
            endDate = new Date(filterObj?.dateRange.endDate.setHours(23, 59, 59, 59)).toISOString();
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
        let value = filterObj.searchText.trim();
        dataFilter.filters.push( {
            filters: [
              { field: "Name", operator: OperatorEnum.contains, value: value },
              { field: "Facebook_UserName", operator: OperatorEnum.contains, value: value }
            ],
            logic: 'or'
        })
    }

    if (TDSHelperArray.hasListValue(filterObj.ids)) {

        dataFilter.filters.push({
            filters: filterObj.ids.map((x: string) => ({
                field: "Id",
                operator: OperatorEnum.eq,
                value: Guid.parse(x)
            })),

            logic: "or"
        })
    }

    return dataFilter;
  }

  public buildFilterReportProduct(filterObj: FilterObjLiveCampaignDTO) {

    let dataFilter: FilterDataRequestDTO = {
        logic: "and",
        filters: [],
    }

    if (TDSHelperString.hasValueString(filterObj?.searchText)) {
        let value = TDSHelperString.stripSpecialChars(filterObj.searchText.toLowerCase().trim());
        dataFilter.filters.push( {
            filters: [
              { field: "ProductName", operator: OperatorEnum.contains, value: value },
              { field: "ProductNameNoSign", operator: OperatorEnum.contains, value: value }
            ],
            logic: 'or'
        })
    }

    return dataFilter;
  }

}
