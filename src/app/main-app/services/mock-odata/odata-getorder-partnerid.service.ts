import { formatDate } from "@angular/common";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { OperatorEnum, TAPIDTO, TApiMethodType, TCommonService, THelperCacheService } from "src/app/lib";
import { FilterDataRequestDTO } from "src/app/lib/dto/dataRequest.dto";
import { TDSHelperString } from "tds-ui/shared/utility";
import { OdataGetOrderPartnerIdDTO } from "../../dto/saleonlineorder/odata-getorderpartnerid.dto";
import { BaseSevice } from "../base.service";


export interface FilterObjSOOrderModel  {
  searchText: '',
  dateRange: {
    startDate: Date,
    endDate:  Date
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


  getOrdersByPartner(partnerId: any, params: string ): Observable<OdataGetOrderPartnerIdDTO>{
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.GetOrdersByPartnerId?$orderby=DateCreated%20desc&PartnerId=${partnerId}&$count=true&${params}`,
        method: TApiMethodType.get,
    }

    return this.apiService.getData<OdataGetOrderPartnerIdDTO>(api, null);
  }



}
