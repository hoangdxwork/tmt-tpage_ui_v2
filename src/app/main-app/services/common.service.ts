import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable} from 'rxjs';
import { TAPIDTO, TApiMethodType, TCommonService, THelperCacheService } from 'src/app/lib';
import { TDSSafeAny } from 'tmt-tang-ui';
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
  public dataPriceLists$ = new BehaviorSubject<any>({ currentId: null });

  constructor(private apiService: TCommonService) {
    super(apiService);
    this.initialize();
  }

  initialize() {
    this.getShopPaymentProviders().subscribe((res: any) => {
      this.dataPriceLists$.next(res);
    });
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

}
