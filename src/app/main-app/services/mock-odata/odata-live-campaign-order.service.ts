import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { OperatorEnum, TAPIDTO, TApiMethodType, TCommonService, THelperCacheService } from 'src/app/lib';
import { FilterDataRequestDTO, FilterItemDataRequestDTO } from 'src/app/lib/dto/dataRequest.dto';
import { TDSHelperString,  TDSSafeAny } from 'tmt-tang-ui';
import { SaleOnline_LiveCampaignDTO } from '../../dto/live-campaign/live-campaign.dto';
import { FilterLiveCampaignOrderDTO, ODataResponsesDTO } from '../../dto/odata/odata.dto';
import { BaseSevice } from '../base.service';

@Injectable()
export class ODataLiveCampaignOrderService extends BaseSevice {

  prefix: string = "odata";
  table: string = "SaleOnline_Order";
  baseRestApi: string = "";

  constructor(
      private apiService: TCommonService,
      public caheApi: THelperCacheService
  ) {
    super(apiService)
  }

  getView(params: string, filterObj: FilterLiveCampaignOrderDTO, liveCampaignId: string): Observable<ODataResponsesDTO<SaleOnline_LiveCampaignDTO>>{
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.GetViewCampaign?TagIds=${filterObj.tags}&liveCampaignId=${liveCampaignId}&${params}&$count=true`,
        method: TApiMethodType.get,
    }

    return this.apiService.getData<ODataResponsesDTO<SaleOnline_LiveCampaignDTO>>(api, null);
  }

  public buildFilter(filterObj: FilterLiveCampaignOrderDTO) {

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
