import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable} from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { TAPIDTO, TApiMethodType, TCommonService, THelperCacheService } from 'src/app/lib';
import { TDSSafeAny } from 'tmt-tang-ui';
import { MessageDeliveryHistoryLiveCampaignParamsDTO, MessageHistoryFSOrderResultDTO, MessageHistorySaleOnlineResultDTO } from '../dto/common/table.dto';
import { ODataParamsDTO } from '../dto/odata/odata.dto';
import { ODataPartnerCategoryDTO } from '../dto/partner/partner-category.dto';
import { PartnerStatusReport } from '../dto/partner/partner-status-report.dto';
import { ListItemStatusDTO, StatusDTO } from '../dto/partner/partner.dto';
import { InitSaleDTO } from '../dto/setting/setting-sale-online.dto';
import { BaseSevice } from './base.service';

@Injectable()

export class CommonService extends BaseSevice {

  prefix: string = "odata";
  table: string = "";
  baseRestApi: string = "api/common";

  // Dữ liệu bảng giá
  public shopPaymentProviders$ = new BehaviorSubject<any>({ });
  public priceListItems$ = new BehaviorSubject<any>([]);

  constructor(private apiService: TCommonService) {
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
       mergeMap((item: any) => { return this.getPriceListItems(item.Id)}))
        .subscribe((res: any) => {
          this.priceListItems$.next(res);
      })
  }

  getPartnerStatusReport(): Observable<PartnerStatusReport> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.baseRestApi}/getpartnerstatusreport`,
        method: TApiMethodType.get,
    }
    return this.apiService.getData<PartnerStatusReport>(api,null);
  }

  getPartnerStatus(): Observable<ListItemStatusDTO[]> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.baseRestApi}/GetPartnerStatus`,
        method: TApiMethodType.get,
    }

    return this.apiService.getData<ListItemStatusDTO[]>(api,null);
  }

  getPriceListAvailable(date: any): Observable<ODataPartnerCategoryDTO> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/Product_PriceList/OdataService.GetPriceListAvailable?date=${date}`,
        method: TApiMethodType.get,
    }

    return this.apiService.getData<ODataPartnerCategoryDTO>(api,null);
  }

  getInventoryByIds(warehouseId: number, ids: any): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/rest/v1.0/product/getinventorybyids?WarehouseId=${warehouseId}&ProductIds=${ids}`,
        method: TApiMethodType.get,
    }

    return this.apiService.getData<TDSSafeAny>(api,null);
  }

  getInventoryWarehouseId(warehouseId: number): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/rest/v1.0/product/getinventory?WarehouseId=${warehouseId}`,
        method: TApiMethodType.get,
    }

    return this.apiService.getData<TDSSafeAny>(api,null);
  }

  getPriceListItems(id: number): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/api/common/getpricelistitems?id=${id}`,
        method: TApiMethodType.get,
    }

    return this.apiService.getData<TDSSafeAny>(api,null);
  }

  getShopPaymentProviders(): Observable<any> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/rest/v1.0/common/shop-payment-providers`,
      method: TApiMethodType.get,
    }

    return this.apiService.getData<TDSSafeAny>(api,null);
  }

  getHistoryMessageSentSaleOnline(data: ODataParamsDTO<MessageDeliveryHistoryLiveCampaignParamsDTO>): Observable<MessageHistorySaleOnlineResultDTO> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/gethistorymessagesentsaleonline`,
      method: TApiMethodType.get,
    }

    return this.apiService.getData<MessageHistorySaleOnlineResultDTO>(api, data);
  }

  getHistoryMessageSentFSOrder(data: ODataParamsDTO<MessageDeliveryHistoryLiveCampaignParamsDTO>) {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/gethistorymessagesentfsorder`,
      method: TApiMethodType.get,
    }

    return this.apiService.getData<MessageHistoryFSOrderResultDTO>(api, data);
  }

}
