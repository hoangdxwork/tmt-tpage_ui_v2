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

  public _keyCacheGrid: string = 'saleonline_order-page:grid_saleonline_order:settings';

  constructor(private apiService: TCommonService) {
    super(apiService)
  }

  getSummaryStatus(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.baseRestApi}/getsummarystatussaleonline`,
        method: TApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  assignSaleOnlineOrder(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/TagSaleOnlineOrder/ODataService.AssignTag`,
        method: TApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  updateStatusTextSaleOnline(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.UpdateStatusTextSaleOnline`,
      method: TApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }

}
