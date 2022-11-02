import { GenerateMessageDTO } from './../dto/conversation/inner.dto';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { CoreAPIDTO, CoreApiMethodType, TCommonService } from 'src/app/lib';
import { TDSSafeAny } from 'tds-ui/shared/utility';
import { ODataPaymentJsonDTO } from '../dto/bill/payment-json.dto';
import { CalculateFeeResponse_DataDTO, DeliveryCarrierDTO, ShippingCalculateFeeInputDTO } from '../dto/carrier/delivery-carrier.dto';
import { ConversationOrderBillByPartnerDTO } from '../dto/conversation/conversation.dto';
import { ODataCalculatorListFeeDTO } from '../dto/fastsaleorder/calculate-listFee.dto';

import { FastSaleOrder_DefaultDTOV2 } from '../dto/fastsaleorder/fastsaleorder-default.dto';
import { ListUpdateDepositDTO } from '../dto/fastsaleorder/fastsaleorder.dto';
import { AccountRegisterPaymentDTO } from '../dto/fastsaleorder/payment.dto';
import { ODataIdsDTO, ODataModelDTO } from '../dto/odata/odata.dto';
import { ChangePartnerPriceListDTO } from '../dto/partner/change-partner-pricelist.dto';
import { BaseSevice } from './base.service';
import { CaculateFeeResponseDto, DeliveryResponseDto } from '../dto/carrierV2/delivery-carrier-response.dto';

@Injectable()
export class FastSaleOrderService extends BaseSevice {

  prefix: string = "odata";
  table: string = "FastSaleOrder";
  baseRestApi: string = "rest/v1.0/fastsaleorder";

  public readonly _keyCacheGrid = 'orderbill-page:grid_orderbill:settings';
  public readonly _keyCacheDefaultGetV2 = '_keycache_default_getV2';
  public readonly _keyCacheDHSDetails = '_keycache_dhs_details';
  public readonly _keyCacheCopyInvoice = '_keycache_copy_invoice';

  fastsaleorderDefault!: FastSaleOrder_DefaultDTOV2;
  public readonly fsDefaultSubject$ = new ReplaySubject<FastSaleOrder_DefaultDTOV2>();

  public onLoadPage$: EventEmitter<string> = new EventEmitter<string>();

  constructor(private apiService: TCommonService) {
    super(apiService)
  }

  get(id: number) {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}(${id})`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<FastSaleOrder_DefaultDTOV2>(api, null);
  }

  getDefaultV2() {
    return this.fsDefaultSubject$.asObservable();
  }

  setDefaultV2(data: any) {
    if(this.fastsaleorderDefault) {
        this.fsDefaultSubject$.next(this.fastsaleorderDefault);
    } else {
        this.apiDefaultGetV2(data).subscribe({
          next: (res: any) => {
              delete data['@odata.context'];
              this.fastsaleorderDefault = {...res};
              this.fsDefaultSubject$.next(res);
          }
        })
    }
  }

  apiDefaultGetV2(data: any): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.DefaultGet?$expand=Warehouse,User,PriceList,Company,Journal,PaymentJournal,Partner,Carrier,Tax,SaleOrder`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<FastSaleOrder_DefaultDTOV2>(api, data);
  }

  insert(data: FastSaleOrder_DefaultDTOV2): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  update(key: TDSSafeAny, data: FastSaleOrder_DefaultDTOV2): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}(${key})`,
      method: CoreApiMethodType.put,
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  delete(key: TDSSafeAny): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}(${key})`,
      method: CoreApiMethodType.delete,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  getById(key: TDSSafeAny): Observable<FastSaleOrder_DefaultDTOV2> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}(${key})?$expand=Partner,User,Warehouse,Company,PriceList,RefundOrder,Account,Journal,PaymentJournal,Carrier,Tax,SaleOrder,OrderLines($expand=Product,ProductUOM,Account,SaleLine,User),Ship_ServiceExtras,Team`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<FastSaleOrder_DefaultDTOV2>(api, null);
  }

  getSummaryStatus(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/getsummarystatusfastsaleonline`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  getListOrderIds(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.GetListOrderIds?$expand=OrderLines,Partner,Carrier`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  insertListOrderModel(data: TDSSafeAny, isForce = false) {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.InsertListOrderModel?isForce=${isForce}&$expand=DataErrorFast($expand=Partner,%20OrderLines)`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  insertOrderProductDefault(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.InsertOrderProductDefault?$expand=DataErrorDefault($expand=Partner)`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  insertOrderProductDefaultWithForce(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/InsertOrderProductDefault?isForce=true`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  assignTagFastSaleOrder(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/TagFastSaleOrder/ODataService.AssignTagFastSaleOrder`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  cancelShipIds(data: TDSSafeAny): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.CancelShipIds`,
      method: CoreApiMethodType.post
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  cancelInvoice(data: TDSSafeAny): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.ActionCancel`,
      method: CoreApiMethodType.post
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  unLink(data: TDSSafeAny): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.Unlink`,
      method: CoreApiMethodType.post
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  sendPaymentRequest(data: TDSSafeAny): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/sendpaymentrequest`,
      method: CoreApiMethodType.post
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  getOrderSendShipIds(data: TDSSafeAny): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.GetOrderSendShipIds?$expand=Partner`,
      method: CoreApiMethodType.post
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  actionSendDelivery(data: TDSSafeAny): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/actionSendDelivery`,
      method: CoreApiMethodType.post
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  actionInvoiceOpen(data: TDSSafeAny): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.ActionInvoiceOpen`,
      method: CoreApiMethodType.post
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  getRegisterPaymentMulti(data: TDSSafeAny): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.GetRegisterPaymentMulti?$expand=Partner`,
      method: CoreApiMethodType.post
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  calculateListFee(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.CalculateListFee`,
      method: CoreApiMethodType.post
    }
    return this.apiService.getData<ODataCalculatorListFeeDTO>(api, data);
  }

  calculateFeeV2(data: ShippingCalculateFeeInputDTO): Observable<CalculateFeeResponse_DataDTO> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/calculatefee`,
      method: CoreApiMethodType.post
    }
    return this.apiService.getData<CalculateFeeResponse_DataDTO>(api, data);
  }

  getPaymentInfoJson(key: TDSSafeAny): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}(${key})/OdataService.GetPaymentInfoJson`,
      method: CoreApiMethodType.get
    }
    return this.apiService.getData<ODataPaymentJsonDTO>(api, null);
  }

  getActionCancel(data: TDSSafeAny): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.ActionCancel`,
      method: CoreApiMethodType.post
    }
    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  getActionRefund(data: TDSSafeAny): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.ActionRefund`,
      method: CoreApiMethodType.post
    }
    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  getSendToShipper(data: TDSSafeAny): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.SendToShipper`,
      method: CoreApiMethodType.post
    }
    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  getRegisterPayment(data: TDSSafeAny): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.getRegisterPayment?$expand=Partner`,
      method: CoreApiMethodType.post
    }
    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  getRegisterPaymentV2(data: ODataIdsDTO<number[]>): Observable<AccountRegisterPaymentDTO> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.GetRegisterPayment?$expand=Partner`,
      method: CoreApiMethodType.post
    }
    return this.apiService.getData<AccountRegisterPaymentDTO>(api, data);
  }

  getTokenTrackingOrderGHN(data: TDSSafeAny): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.GetTokenTrackingOrderGHN`,
      method: CoreApiMethodType.post
    }
    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  getTrackingOrderAhaMove(data: TDSSafeAny): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.GetTrackingOrderAhaMove`,
      method: CoreApiMethodType.post
    }
    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  onChangePartnerPriceList(data: TDSSafeAny) : Observable<ChangePartnerPriceListDTO> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.OnChangePartner_PriceList?$expand=PartnerShipping,PriceList,Account`,
      method: CoreApiMethodType.post,
    }
    return this.apiService.getData<ChangePartnerPriceListDTO>(api, data);
  }

  getConversationOrderBillByPartner(id: number): Observable<ConversationOrderBillByPartnerDTO> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/get_conversationorderbill_bypartner(${id})`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<ConversationOrderBillByPartnerDTO>(api, null);
  }

  // NOTE: BE trả về FastSaleOrderDTO nhưng FE sử dụng FastSaleOrderRestDTO tránh convert dữ liệu
  getDefault(data: ODataModelDTO<TDSSafeAny>): Observable<any> {
    let expand = "Warehouse,User,PriceList,Company,Journal,PaymentJournal,Partner,Carrier,Tax,SaleOrder";

    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.DefaultGet?$expand=${expand}`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<any>(api, data);
  }

  saveV2(data: any): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/rest/v2.0/fastsaleorder/create`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  getOrderLineData(key: TDSSafeAny): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}(${key})/OrderLines?$expand=Product,ProductUOM,Account,SaleLine,User`,
      method: CoreApiMethodType.get
    }
    return this.apiService.getData<ODataPaymentJsonDTO>(api, null);
  }

  updateShipStatus(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.table}/UpdateShipStatus`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  getHistoryDeliveryStatus(params: string): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/HistoryDeliveryStatus?&%24${params}&%24orderby=Date+desc&%24count=true`,
      method: CoreApiMethodType.get
    }
    return this.apiService.getData<ODataPaymentJsonDTO>(api, null);
  }

  getHistoryDeliveryStatusById(key: TDSSafeAny): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/HistoryDeliveryStatus(${key})?$expand=Details`,
      method: CoreApiMethodType.get
    }
    return this.apiService.getData<ODataPaymentJsonDTO>(api, null);
  }

  postManualCrossChecking(model: TDSSafeAny): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.ManualCrossChecking`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api, model);
  }

  checkTrackingRefIsExist(trackingRef: string, status: string, carrierId?: number): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.CheckTrackingRefIsExisted?tracking_ref=${trackingRef}&status=${status}&carrier_id=${carrierId ?? ''}`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  deleteCrossChecking(key: TDSSafeAny): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/HistoryDeliveryStatus(${key})`,
      method: CoreApiMethodType.delete,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  listUpdateDeposit(data: ListUpdateDepositDTO): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/rest/v1.0/fastsaleorder/listupdatedeposit`,
      method: CoreApiMethodType.post
    }

    return this.apiService.getData<any>(api, data);
  }

  generateMessages(data: GenerateMessageDTO): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.GenerateMessages?$expand=CRMTeam`,
      method: CoreApiMethodType.post
    }

    return this.apiService.getData<undefined>(api, data);
  }

  getFastSaleOrderIds(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.GetFastSaleOrderIds?$expand=Partner`,
      method: CoreApiMethodType.post
    }
    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  actionBatchRefund(data: TDSSafeAny): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.ActionBatchRefund`,
      method: CoreApiMethodType.post
    }
    return this.apiService.getData<TDSSafeAny>(api, data);
  }
  //TODO: mẫu mã vận đơn
  urlSampleShipCodeExcel(): any {
    let url = `${this._BASE_URL}/Content/files/template_excels/vi/template_update_trackingcode_delivery.xlsx?v2`;
    return url;
  }
  // TODO: mẫu đối soát GH
  urlSampleShipStatusDelivery () {
    let url = `${this._BASE_URL}/Content/files/template_excels/vi/template_update_delivery_status.xlsx?v2`;
    return url;
  }
  // TODO: mẫu trạng thái GH
  urlSampleDeliveryStatusUpdateExcel() {
    var url = `${this._BASE_URL}/Content/files/template_excels/vi/template_update_delivery_info.xlsx?v2`;
    return url;
  }
  // TODO: cập nhật mã vận đơn từ file, data = {file:string}
  updateShipCodeExcel(data: any): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.UpdateShipCodeExcel`,
      method: CoreApiMethodType.post
    }
    return this.apiService.getData<any>(api, data);
  }
  // TODO: cập nhật phiếu đã có mã vận đơn từ file, data = {datas:[]}
  updateExistShipCode(data: any): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.UpdateExistShipCode`,
      method: CoreApiMethodType.post
    }
    return this.apiService.getData<any>(api, data);
  }
  // TODO: cập nhật trạng thái giao hàng từ file, data = {file:string}
  updateDeliveryExcel(data: any): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.UpdateDeliveryExcel`,
      method: CoreApiMethodType.post
    }
    return this.apiService.getData<any>(api, data);
  }
  // TODO: cập nhật đối soát giao hàng từ file, data = {carrierId:number, file:string, isNoteOrder:boolean, note:string, payment:boolean}
  updateShipStatusExcel(data: any): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.UpdateShipStatusExcel`,
      method: CoreApiMethodType.post
    }
    return this.apiService.getData<any>(api, data);
  }

  getMappings(data: any): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/getmappings`,
      method: CoreApiMethodType.post
    }
    return this.apiService.getData<any>(api, data);
  }

  getHistoryEditOrder(orderId: any): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}(${orderId})/ODataService.Histories`,
      method: CoreApiMethodType.get,
    }
    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  getOrderHtmlToImage(id: number) {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/getorderhtmltoimage?id=${id}`,
      method: CoreApiMethodType.get,
    }
    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  updateStatusDeliveryPayment(data:any){
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.updateStatusDeliveryPayment`,
      method: CoreApiMethodType.post
    }
    return this.apiService.getData<any>(api, data);
  }

  calculateFeeAship(data: any): Observable<DeliveryResponseDto<CaculateFeeResponseDto>> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/calculatefee-aship`,
      method: CoreApiMethodType.post
    }
    return this.apiService.getData<DeliveryResponseDto<CaculateFeeResponseDto>>(api, data);
  }

  checkPrermissionBill() {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/api/common/CheckPermission?function=App.Sale.Fast.Order.ExportExcel`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getFileUpload(api, null);
  }

  checkPermissionCreateFSO(): Observable<boolean> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/api/common/CheckPermission?function=App.SaleOnline.Order.CreateFSO`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getFileUpload(api, null);
  }

  checkPermissionQuickCreateFSO(): Observable<boolean> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/api/common/CheckPermission?function=App.SaleOnline.Order.QuickCreateFSO`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getFileUpload(api, null);
  }
}
