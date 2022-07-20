import { formatDate } from "@angular/common";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { OperatorEnum, TAPIDTO, TApiMethodType, TCommonService, THelperCacheService } from "src/app/lib";
import { FilterDataRequestDTO } from "src/app/lib/dto/dataRequest.dto";
import { TDSHelperArray, TDSHelperString } from "tds-ui/shared/utility";
import { OdataGetOrderPartnerIdDTO } from "../../dto/saleonlineorder/odata-getorderpartnerid.dto";
import { BaseSevice } from "../base.service";


export interface FilterObjLiveOrderModel {
  searchText: string,
  dateRange?: {
    startDate: Date,
    endDate: Date
  }
}

@Injectable()
export class OdataGetOrderPartnerIdService extends BaseSevice {

  prefix: string = "odata";
  table: string = "SaleOnline_Order";
  baseRestApi: string = "";

  constructor(private apiService: TCommonService,
    public caheApi: THelperCacheService) {
    super(apiService)
  }

  getOrdersByPartner(partnerId: number, params: string): Observable<OdataGetOrderPartnerIdDTO> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.GetOrdersByPartnerId?$orderby=DateCreated%20desc&PartnerId=${partnerId}&$count=true&${params}`,
      method: TApiMethodType.get,
    }

    return this.apiService.getData<OdataGetOrderPartnerIdDTO>(api, null);
  }



  public buildFilter(filterObj: FilterObjLiveOrderModel) {
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
    }

    if (TDSHelperString.hasValueString(filterObj?.searchText)) {
      let value = TDSHelperString.stripSpecialChars(filterObj.searchText.toLowerCase().trim())
      dataFilter.filters.push({
        filters: [
          { field: "Code", operator: OperatorEnum.contains, value: value },
          { field: "StatusText", operator: OperatorEnum.contains, value: value },
          { field: "UserName", operator: OperatorEnum.contains, value: value },
          { field: "CRMTeamName", operator: OperatorEnum.contains, value: value }
        ],
        logic: 'or'
      })
    }

    return dataFilter;
  }



}
