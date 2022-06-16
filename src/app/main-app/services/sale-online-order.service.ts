import { EventEmitter, Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { TAPIDTO, TApiMethodType, TCommonService } from "src/app/lib";
import { TDSSafeAny } from "tds-ui/shared/utility";
import { ODataModelDTO, ODataModelTeamDTO } from "../dto/odata/odata.dto";
import { PagedList2 } from "../dto/pagedlist2.dto";
import { PartnerTempDTO } from "../dto/partner/partner.dto";
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
  public onSetCommentOrders: EventEmitter<any> = new EventEmitter();

  constructor(private apiService: TCommonService) {
    super(apiService)
  }

  getById(id: string): Observable<SaleOnline_OrderDTO> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}(${id})?$expand=Details,User,Partner`,
      method: TApiMethodType.get,
    }

    return this.apiService.getData<SaleOnline_OrderDTO>(api, null);
  }

  getLines(id: string): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.GetLines?key=${id}`,
      method: TApiMethodType.get,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  getSummaryStatus(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/getsummarystatussaleonline`,
      method: TApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  getUpdateUIds() {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.UpdateUIds`,
      method: TApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  getDefaultOrderIds(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.GetDefaultOrderIds?$expand=Lines($expand=Partner),Carrier`,
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

  update(key: string, data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}(${key})`,
      method: TApiMethodType.put,
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  remove(id: string): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}(${id})`,
      method: TApiMethodType.delete,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }


  previewMessages(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/previewmessages`,
      method: TApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  insertFromMessage(data: ODataModelDTO<SaleOnline_OrderDTO>): Observable<SaleOnline_OrderDTO> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.InsertFromMessage?$expand=Details,User`,
      method: TApiMethodType.post,
    }

    return this.apiService.getData<SaleOnline_OrderDTO>(api, data);
  }

  insertFromPost(data: SaleOnline_OrderDTO, isIncrease: boolean = false): Observable<SaleOnline_OrderDTO> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}?IsIncrease=${isIncrease}&$expand=Details,User`,
      method: TApiMethodType.post,
    }

    return this.apiService.getData<SaleOnline_OrderDTO>(api, data);
  }

  createUpdatePartner(data: ODataModelTeamDTO<PartnerTempDTO>): Observable<PartnerTempDTO> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.CreateUpdatePartner`,
      method: TApiMethodType.post,
    }

    return this.apiService.getData<PartnerTempDTO>(api, data);
  }

  setCommentOrder(data: any, fbid: string) {
    this.onSetCommentOrders.emit({ data: data, fbid: fbid });
  }

  updateStatusSaleOnline(idOrder: any, value: any): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.UpdateStatusSaleOnline?Id=${idOrder}&Status=${value}`,
      method: TApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }

}
