import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { TAPIDTO, TApiMethodType, TCommonService } from "src/app/lib";
import { TDSSafeAny } from "tmt-tang-ui";
import { PagedList2 } from "../dto/pagedlist2.dto";
import { BaseSevice } from "./base.service";








@Injectable({
  providedIn: 'root'
})
export class SaleOnline_OrderService extends BaseSevice {
  prefix: string = "odata";
  table: string = "SaleOnline_Order";
  baseRestApi: string = "rest/v1.0/saleonline_order";

  constructor(private apiService: TCommonService) {
    super(apiService)
  }

  getView(): Observable<TDSSafeAny> {
    let api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.GetView?$skip=0&$top=20`,
      method: TApiMethodType.get
    }
    return this.apiService.getData<TDSSafeAny>(api, null);
  }

}
