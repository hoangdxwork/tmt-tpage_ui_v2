import { EventEmitter, Injectable } from "@angular/core";
import { DeletedOrderHistoriesDTO } from "@app/dto/order/order-deletedHistories.dto";
import { paramsOrderDeteledHistoriesDTO } from "@app/dto/order/order-order-deleted.dto";
import { FilterObjDTO, OrderStatusDTO, OrderStatusModalDTO } from "@app/dto/order/order-status.dto";
import { QuickSaleOnlineOrderModel } from "@app/dto/saleonlineorder/quick-saleonline-order.dto";
import { CRMTeamType } from "@app/dto/team/chatomni-channel.dto";
import { CRMTeamDTO } from "@app/dto/team/team.dto";
import { FilterDataRequestDTO } from "@core/dto/dataRequest.dto";
import { map, Observable } from "rxjs";
import { CoreAPIDTO, CoreApiMethodType, OperatorEnum, TCommonService } from "src/app/lib";
import { TDSHelperString, TDSSafeAny } from "tds-ui/shared/utility";
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

  getOrderByPostId(postId: string, userId: string): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/getorderbypostid?postId=${postId}&userId=${userId}`,
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

  apiInsertFromMessage(data: any, type: string) {
      switch(type) {
        case CRMTeamType._TShop:
          return this.insertFromChannelMessage(data);
        default:
          return this.insertFromMessage(data);
      }
  }

  insertFromMessage(data: any): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.InsertFromMessage?$expand=Details,User`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<any>(api, data);
  }

  insertFromChannelMessage(data: any): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.InsertFromChannelMessage?$expand=Details,User`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<any>(api, data);
  }

  apiInsertFromComment(data: any, isIncrease: boolean = false, type: string) {
    switch(type) {
      case CRMTeamType._TShop:
        return  this.insertFromChannelComment(data, isIncrease);
      default:
        return this.insertFromPost(data, isIncrease);
    }
  }

  insertFromPost(data: any, isIncrease: boolean = false): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}?IsIncrease=${isIncrease}&$expand=Details,User`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<any>(api, data);
  }

  insertFromChannelComment(data: any, isIncrease: boolean = false): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.InsertFromChannelComment?IsIncrease=${isIncrease}&$expand=Details,User`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<any>(api, { model: data });
  }

  createUpdatePartner(data: any): Observable<any> {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.CreateUpdatePartner`,
        method: CoreApiMethodType.post
    }

    return this.apiService.getData<any>(api, data);
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

  getCheckDuplicatePhone(data: any) {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.GetCheckDuplicatePhone?$expand=Values`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  getStatusExtra(params: string) {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/StatusExtra?${params}&$count=true`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  public buildFilter(filterObj: FilterObjDTO) {
    let dataFilter: FilterDataRequestDTO = {
        logic: "and",
        filters: []
    }

    if (TDSHelperString.hasValueString(filterObj?.searchText)) {
        dataFilter.filters.push( {
            filters: [
              { field: "Name", operator: OperatorEnum.contains, value: filterObj.searchText }
            ],
            logic: 'or'
        })
    }

    return dataFilter;
  }

  deleteStatusExtra(key: number): Observable<any> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/StatusExtra(${key})`,
      method: CoreApiMethodType.delete
    }

    return this.apiService.getData<any>(api, null);
  }

  insertOrderStatusExtra(data: OrderStatusModalDTO): Observable<any> {
    let api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/StatusExtra`,
        method: CoreApiMethodType.post
    }
    return this.apiService.getData<any>(api, data);
  }

  updateOrderStatusExtra(data: OrderStatusDTO): Observable<any> {
    let api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/StatusExtra(${data.Id})`,
        method: CoreApiMethodType.put
    }
    return this.apiService.getData<any>(api, data);
  }

  getOrderDeteledHistoriesV1(liveCampaignId: string, skip: number, take: number): Observable<DeletedOrderHistoriesDTO> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/getorderdeteledhistories?liveCampaignId=${liveCampaignId}&skip=${skip}&take=${take}`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<DeletedOrderHistoriesDTO>(api, null);
  }

  getOrderDeteledHistories(model: paramsOrderDeteledHistoriesDTO): Observable<any> {
    let api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.baseRestApi}/getorderdeteledhistories?liveCampaignId=${model.liveCampaignId}&skip=${model.skip}&take=${model.take}`,
        method: CoreApiMethodType.get
    }
    return this.apiService.getData<any>(api, null);
  }

}
