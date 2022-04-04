import { Injectable } from '@angular/core';
import { da } from 'date-fns/locale';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { TAPIDTO, TApiMethodType, TCommonService, THelperCacheService } from 'src/app/lib';
import { DataRequestDTO } from 'src/app/lib/dto/dataRequest.dto';
import { TDSHelperObject, TDSSafeAny } from 'tmt-tang-ui';
import { PagedList2 } from '../dto/pagedlist2.dto';
import { CRMTeamDTO } from '../dto/team/team.dto';
import { BaseSevice } from './base.service';

@Injectable()
export class FastSaleOrderService extends BaseSevice {

  prefix: string = "odata";
  table: string = "FastSaleOrder";
  baseRestApi: string = "rest/v1.0/fastsaleorder";

  public _keyCacheGrid: string = 'orderbill-page:grid_orderbill:settings';

  constructor(private apiService: TCommonService) {
    super(apiService)
  }

  delete(key: TDSSafeAny): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}(${key})`,
        method: TApiMethodType.delete,
    }

    return this.apiService.getData<TDSSafeAny>(api,null);
  }

  getById(key: TDSSafeAny): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}(${key})?$expand=Partner,User,Warehouse,Company,PriceList,RefundOrder,Account,Journal,PaymentJournal,Carrier,Tax,SaleOrder,OrderLines($expand=Product,ProductUOM,Account,SaleLine,User),Ship_ServiceExtras,Team`,
        method: TApiMethodType.get,
    }

    return this.apiService.getData<TDSSafeAny>(api,null);
  }

  getSummaryStatus(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.baseRestApi}/getsummarystatusfastsaleonline`,
        method: TApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api,data);
  }

  assignTagFastSaleOrder(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/TagFastSaleOrder/ODataService.AssignTagFastSaleOrder`,
        method: TApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api,data);
  }

  cancelShipIds(data: TDSSafeAny): Observable<any> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.CancelShipIds`,
        method: TApiMethodType.post
    }
    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  cancelInvoice(data: TDSSafeAny): Observable<any> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.ActionCancel`,
        method: TApiMethodType.post
    }
    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  unLink(data: TDSSafeAny): Observable<any> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.Unlink`,
        method: TApiMethodType.post
    }
    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  sendPaymentRequest(data: TDSSafeAny): Observable<any> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.baseRestApi}/sendpaymentrequest`,
        method: TApiMethodType.post
    }
    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  getOrderSendShipIds(data: TDSSafeAny): Observable<any> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.GetOrderSendShipIds?$expand=Partner`,
        method: TApiMethodType.post
    }
    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  actionSendDelivery(data: TDSSafeAny): Observable<any> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/actionSendDelivery`,
        method: TApiMethodType.post
    }
    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  actionInvoiceOpen(data: TDSSafeAny): Observable<any> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.ActionInvoiceOpen`,
        method: TApiMethodType.post
    }
    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  getRegisterPaymentMulti(data: TDSSafeAny): Observable<any> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.GetRegisterPaymentMulti?$expand=Partner`,
        method: TApiMethodType.post
    }
    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  getPaymentInfoJson(key: TDSSafeAny): Observable<any> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}(${key})/OdataService.GetPaymentInfoJson`,
        method: TApiMethodType.get
    }
    return this.apiService.getData<TDSSafeAny>(api, null);
  }


}
