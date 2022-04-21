import { Injectable } from '@angular/core';
import { da } from 'date-fns/locale';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { TAPIDTO, TApiMethodType, TCommonService, THelperCacheService } from 'src/app/lib';
import { DataRequestDTO } from 'src/app/lib/dto/dataRequest.dto';
import { TDSHelperObject, TDSSafeAny } from 'tmt-tang-ui';
import { FastSaleOrderSummaryStatusDTO } from '../dto/bill/bill.dto';
import { ODataPaymentJsonDTO } from '../dto/bill/payment-json.dto';
import { CalculatorFeeV2DTO } from '../dto/fastsaleorder/calculate-feeV2.dto';
import { ODataCalculatorListFeeDTO } from '../dto/fastsaleorder/calculate-listFee.dto';
import { FastSaleOrder_DefaultDTOV2 } from '../dto/fastsaleorder/fastsaleorder-default.dto';
import { PagedList2 } from '../dto/pagedlist2.dto';
import { CRMTeamDTO } from '../dto/team/team.dto';
import { BaseSevice } from './base.service';

@Injectable()
export class FastSaleOrderService extends BaseSevice {

  prefix: string = "odata";
  table: string = "FastSaleOrder";
  baseRestApi: string = "rest/v1.0/fastsaleorder";

  public _keyCacheGrid: string = 'orderbill-page:grid_orderbill:settings';
  public _keyCacheDefaultGetV2: string = '_keycache_default_getV2';

  constructor(private apiService: TCommonService) {
    super(apiService)
  }

  defaultGet(): Observable<any> {
    let typeInvoice = { "model": { "Type": "invoice" } };
    let expand = `Warehouse,User,PriceList,Company,Journal,PaymentJournal,Partner,Carrier,Tax,SaleOrder`;

    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.DefaultGet?$expand=${expand}`,
      method: TApiMethodType.post,
    }

    return this.apiService.getData<any>(api, typeInvoice);
  }

  defaultGetV2(data: any): Observable<any> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.DefaultGet?$expand=Warehouse,User,PriceList,Company,Journal,PaymentJournal,Partner,Carrier,Tax,SaleOrder`,
        method: TApiMethodType.post,
    }

    return this.apiService.getCacheData<FastSaleOrder_DefaultDTOV2>(api, data);
  }

  deleteKeyCacheDefaultGetV2() {
    this.apiService.removeCacheAPI(this._keyCacheDefaultGetV2);
  }

  insert(data: FastSaleOrder_DefaultDTOV2): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}`,
        method: TApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  update(key: TDSSafeAny, data: FastSaleOrder_DefaultDTOV2): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}(${key})`,
        method: TApiMethodType.put,
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
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

    return this.apiService.getData<FastSaleOrder_DefaultDTOV2>(api,null);
  }

  getSummaryStatus(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.baseRestApi}/getsummarystatusfastsaleonline`,
        method: TApiMethodType.post,
    }

    return this.apiService.getData<Array<FastSaleOrderSummaryStatusDTO>>(api,data);
  }

  getListOrderIds(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.GetListOrderIds?$expand=OrderLines,Partner,Carrier`,
        method: TApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  create(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.baseRestApi}/create`,
        method: TApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  insertListOrderModel(data: TDSSafeAny, isForce = false) {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.InsertListOrderModel?isForce=${isForce}&$expand=DataErrorFast($expand=Partner,%20OrderLines)`,
      method: TApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  insertOrderProductDefault(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.InsertOrderProductDefault?$expand=DataErrorDefault($expand=Partner)`,
        method: TApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  insertOrderProductDefaultWithForce(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/InsertOrderProductDefault?isForce=true`,
        method: TApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
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

  calculateListFee(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.CalculateListFee`,
        method: TApiMethodType.post
    }
    return this.apiService.getData<ODataCalculatorListFeeDTO>(api, data);
  }

  calculateFeeV2(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.baseRestApi}/calculatefee`,
        method: TApiMethodType.post
    }
    return this.apiService.getData<CalculatorFeeV2DTO>(api, data);
  }

  getPaymentInfoJson(key: TDSSafeAny): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}(${key})/OdataService.GetPaymentInfoJson`,
        method: TApiMethodType.get
    }
    return this.apiService.getData<ODataPaymentJsonDTO>(api, null);
  }

  getActionCancel(data: TDSSafeAny): Observable<any> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.ActionCancel`,
        method: TApiMethodType.post
    }
    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  getActionRefund(data: TDSSafeAny): Observable<any> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.ActionRefund`,
        method: TApiMethodType.post
    }
    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  getSendToShipper(data: TDSSafeAny): Observable<any> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.SendToShipper`,
        method: TApiMethodType.post
    }
    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  getRegisterPayment(data: TDSSafeAny): Observable<any> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.getRegisterPayment?$expand=Partner`,
        method: TApiMethodType.post
    }
    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  getTokenTrackingOrderGHN(data: TDSSafeAny): Observable<any> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.GetTokenTrackingOrderGHN`,
        method: TApiMethodType.post
    }
    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  getTrackingOrderAhaMove(data: TDSSafeAny): Observable<any> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.GetTrackingOrderAhaMove`,
        method: TApiMethodType.post
    }
    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  onChangePartnerPriceList(data: TDSSafeAny) : Observable<TDSSafeAny> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.onChangePartner_PriceList?$expand=PartnerShipping,PriceList,Account`,
      method: TApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }

}
