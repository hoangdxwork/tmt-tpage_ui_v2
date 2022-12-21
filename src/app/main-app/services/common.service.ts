import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { CoreAPIDTO, CoreApiMethodType, TCommonService } from 'src/app/lib';
import { TDSMessageService } from 'tds-ui/message';
import { TDSSafeAny } from 'tds-ui/shared/utility';
import { MessageDeliveryHistoryLiveCampaignParamsDTO, MessageDeliveryHistoryResultDTO, MessageHistoryFSOrderResultDTO, MessageHistorySaleOnlineResultDTO } from '../dto/common/table.dto';
import { ODataPartnerCategoryDTO } from '../dto/partner/partner-category.dto';
import { PartnerStatusReport } from '../dto/partner/partner-status-report.dto';
import { ListItemStatusDTO } from '../dto/partner/partner.dto';
import { BaseSevice } from './base.service';

@Injectable()

export class CommonService extends BaseSevice {

  prefix: string = "odata";
  table: string = "";
  baseRestApi: string = "api/common";

  // Dữ liệu bảng giá
  public shopPaymentProviders$ = new BehaviorSubject<any>({});
  public priceListItems$ = new BehaviorSubject<any>([]);

  lstPartnerStatus: any;
  private readonly _partnerStatusSubject$ = new ReplaySubject<any>();


  constructor(private apiService: TCommonService,
    private message: TDSMessageService,) {
    super(apiService);
    this.initialize();
  }

  initialize() {
    this.getShopPaymentProviders().subscribe((res: any) => {
      this.shopPaymentProviders$.next(res);
    });

    let date = formatDate(new Date(), 'yyyy-MM-ddTHH:mm:ss', 'en-US');

    this.getPriceListAvailable(date)
      .pipe(map((x: any) => { return x.value[0] }),
        mergeMap((item: any) => { return this.getPriceListItems(item.Id) }))
      .subscribe((res: any) => {
        this.priceListItems$.next(res);
      })
  }

  getPartnerStatusReport(): Observable<PartnerStatusReport> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/getpartnerstatusreport`,
      method: CoreApiMethodType.get,
    }
    return this.apiService.getData<PartnerStatusReport>(api, null);
  }

  getPartnerStatus(){
    return this._partnerStatusSubject$.asObservable();
  }

  setPartnerStatus() {
    if(this.lstPartnerStatus) {
        this._partnerStatusSubject$.next(this.lstPartnerStatus);
    } else {
        this.get().subscribe({
          next: (res: any) => {
            if(res) {
                this.lstPartnerStatus = [...res];
                this._partnerStatusSubject$.next(this.lstPartnerStatus);
            }
          },
          error: error =>{
            this._partnerStatusSubject$.next(error)
          }
        })
    }
  }

  get(): Observable<ListItemStatusDTO[]> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/GetPartnerStatus`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<ListItemStatusDTO[]>(api, null);
  }

  getPriceListAvailable(date: any): Observable<ODataPartnerCategoryDTO> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/Product_PriceList/OdataService.GetPriceListAvailable?date=${date}`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<ODataPartnerCategoryDTO>(api, null);
  }

  getInventoryByIds(warehouseId: number, ids: any): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/rest/v1.0/product/getinventorybyids?warehouseId=${warehouseId}&productIds=${ids}`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  getPriceListItems(id: number): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/getpricelistitems?id=${id}`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  getShopPaymentProviders(): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/rest/v1.0/common/shop-payment-providers`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  getHistoryMessageSentSaleOnline(data: MessageDeliveryHistoryLiveCampaignParamsDTO): Observable<MessageHistorySaleOnlineResultDTO> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/gethistorymessagesentsaleonline`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<MessageHistorySaleOnlineResultDTO>(api, data);
  }

  getHistoryMessageSentFSOrder(data: MessageDeliveryHistoryLiveCampaignParamsDTO) {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/gethistorymessagesentfsorder`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<MessageHistoryFSOrderResultDTO>(api, data);
  }

  getHistoryMessageSentSO(liveCampaignId: string, orderId: string, skip: number, take: number): Observable<MessageDeliveryHistoryResultDTO> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/gethistorymessagesentsaleonlinedetail?liveCampaignId=${liveCampaignId}&orderId=${orderId}&skip=${skip}&take=${take}`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<MessageDeliveryHistoryResultDTO>(api, null);
  }

  getHistoryMessageSentFSOrderDetail(liveCampaignId: string, orderId: string, skip: number, take: number): Observable<MessageDeliveryHistoryResultDTO> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/gethistorymessagesentfsorderdetail?liveCampaignId=${liveCampaignId}&fsOrderId=${orderId}&skip=${skip}&take=${take}`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<MessageDeliveryHistoryResultDTO>(api, null);
  }

  getStatusTypeExt(): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/rest/v1.0/common/statusTypeExt`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  checkAddressByPhone(phone: string): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/checkAddressByPhone?phone=${phone}`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  getHistoryMessageSent(params?: any): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/gethistorymessagesentsaleonlinedetail`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<TDSSafeAny>(api, params);
  }

  getPartnersById(params?: any): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/getpartnersbyid`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api, params);
  }

}
