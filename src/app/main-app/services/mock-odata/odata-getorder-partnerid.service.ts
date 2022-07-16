import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { TAPIDTO, TApiMethodType, TCommonService, THelperCacheService } from "src/app/lib";
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


  getOrdersByPartner(partnerId: number, params: string, filterObj: FilterObjSOOrderModel): Observable<OdataGetOrderPartnerIdDTO>{
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.GetOrdersByPartnerId?PartnerId=${partnerId}&${params}&$orderby=DateCreated%20desc&$count=true`,
        method: TApiMethodType.get,
    }

    return this.apiService.getData<OdataGetOrderPartnerIdDTO>(api, null);
  }

}
