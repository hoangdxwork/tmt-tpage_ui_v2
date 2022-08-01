import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { OperatorEnum, CoreAPIDTO, CoreApiMethodType, TCommonService, THelperCacheService } from 'src/app/lib';
import { FilterDataRequestDTO, FilterItemDataRequestDTO } from 'src/app/lib/dto/dataRequest.dto';
import { TDSHelperString } from 'tds-ui/shared/utility';
import { ODataResponsesDTO } from '../../dto/odata/odata.dto';
import { BaseSevice } from '../base.service';

@Injectable()
export class ODataLiveCampaignOrderService extends BaseSevice {

  prefix: string = "odata";
  table: string = "SaleOnline_Order";
  baseRestApi: string = "";

  constructor( private apiService: TCommonService,
      public caheApi: THelperCacheService) {
      super(apiService)
  }

  getView(params: string, filterObj: any, liveCampaignId: string): Observable<ODataResponsesDTO<any>>{
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.GetViewCampaign?TagIds=${filterObj.tags}&liveCampaignId=${liveCampaignId}&${params}&$count=true`,
        method: CoreApiMethodType.get,
    }

    return this.apiService.getData<ODataResponsesDTO<any>>(api, null);
  }

  public buildFilter(filterObj: any) {

    let dataFilter: FilterDataRequestDTO = {
        logic: "and",
        filters: [],
    }

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
        dataFilter.filters.push( {
            filters: [
              { field: "Code", operator: OperatorEnum.contains, value: filterObj.searchText },
              { field: "Name", operator: OperatorEnum.contains, value: filterObj.searchText },
              { field: "Telephone", operator: OperatorEnum.contains, value: filterObj.searchText },
              { field: "Address", operator: OperatorEnum.contains, value: filterObj.searchText },
              { field: "PartnerName", operator: OperatorEnum.contains, value: filterObj.searchText },
              { field: "PartnerNameNosign", operator: OperatorEnum.contains, value: filterObj.searchText },
              { field: "StatusText", operator: OperatorEnum.contains, value: filterObj.searchText },
              { field: "CRMTeamName", operator: OperatorEnum.contains, value: filterObj.searchText},
              { field: "UserName", operator: OperatorEnum.contains, value: filterObj.searchText}
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
