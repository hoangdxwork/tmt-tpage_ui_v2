import { EventEmitter, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CoreAPIDTO, CoreApiMethodType, TCommonService } from "src/app/lib";
import { TDSSafeAny } from "tds-ui/shared/utility";
import { SaleOnline_OrderDTO } from "../dto/saleonlineorder/sale-online-order.dto";
import { BaseSevice } from "./base.service";

@Injectable({
  providedIn: 'root'
})

export class SaleOnline_OrderService extends BaseSevice {

  prefix: string = "odata";
  table: string = "SaleOnline_Order";
  baseRestApi: string = "rest/v1.0/saleonline_order";

  public _keyCacheGrid: string = 'saleonline_order-page:grid_saleonline_order:settings';
  public _keyCreateBillOrder: string = 'saleonline_order:create_bill_order';
  public _keyCacheFilter: string = 'saleonline_order:filter_cache';
  public onSetCommentOrders: EventEmitter<any> = new EventEmitter();

  constructor(private apiService: TCommonService) {
    super(apiService)
  }

  getById(id: string): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}(${id})?$expand=Details,User,Partner`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<any>(api, null);
  }

  getDetails(data:TDSSafeAny){
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.GetDetails?$expand=orderLines($expand=Product,ProductUOM),partner,warehouse`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api,data);
  }

  getLines(id: string): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.GetLines?key=${id}`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  getSummaryStatus(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/getsummarystatussaleonline`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  getUpdateUIds() {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.UpdateUIds`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  getDefaultOrderIds(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.GetDefaultOrderIds?$expand=Lines($expand=Partner),Carrier`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  assignSaleOnlineOrder(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/TagSaleOnlineOrder/ODataService.AssignTag`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  updateStatusTextSaleOnline(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.UpdateStatusTextSaleOnline`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  update(key: string, data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}(${key})`,
      method: CoreApiMethodType.put,
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  remove(id: string): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}(${id})`,
      method: CoreApiMethodType.delete,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }


  previewMessages(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/previewmessages`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  insertFromMessage(data: any): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.InsertFromMessage?$expand=Details,User`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<any>(api, data);
  }

  insertFromPost(data: SaleOnline_OrderDTO, isIncrease: boolean = false): Observable<SaleOnline_OrderDTO> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}?IsIncrease=${isIncrease}&$expand=Details,User`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<SaleOnline_OrderDTO>(api, data);
  }

  createUpdatePartner(data: any): Observable<any> {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.CreateUpdatePartner`,
        method: CoreApiMethodType.post
    }

    return this.apiService.getData<any>(api, data);
  }

  setCommentOrder(data: any, fbid: string) {
    this.onSetCommentOrders.emit({ data: data, fbid: fbid });
  }

  updateStatusSaleOnline(idOrder: any, value: any): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.UpdateStatusSaleOnline?Id=${idOrder}&Status=${value}`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  getStatusPartner(partnerId: number, carrierId: number): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/api/common/getstatusreportdeliverybypartner?partnerId=${partnerId}&carrierId=${carrierId}`,
      method: CoreApiMethodType.get,
    }
    return this.apiService.getData<TDSSafeAny>(api, null);
  }

}
