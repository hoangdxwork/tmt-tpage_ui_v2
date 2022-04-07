import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { TAPIDTO, TApiMethodType, TCommonService, THelperCacheService } from 'src/app/lib';
import { TDSSafeAny } from 'tmt-tang-ui';
import { ODataPartnerCategoryDTO } from '../dto/partner/partner-category.dto';
import { PartnerStatusReport } from '../dto/partner/partner-status-report.dto';
import { StatusDTO } from '../dto/partner/partner.dto';
import { BaseSevice } from './base.service';

@Injectable()

export class CommonService extends BaseSevice {

  prefix: string = "odata";
  table: string = "";
  baseRestApi: string = "api/common";
  private readonly __keyCacheTeamId = 'nearestTeamId';

  constructor(private apiService: TCommonService) {
    super(apiService)
  }

  getPartnerStatusReport(): Observable<any> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.baseRestApi}/getpartnerstatusreport`,
        method: TApiMethodType.get,
    }

    return this.apiService.getData<PartnerStatusReport>(api,null);
  }

  getPartnerStatus(): Observable<any> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.baseRestApi}/GetPartnerStatus`,
        method: TApiMethodType.get,
    }

    return this.apiService.getData<Array<StatusDTO>>(api,null);
  }

  getPriceListAvailable(date: any): Observable<any> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/Product_PriceList/OdataService.GetPriceListAvailable?date=${date}`,
        method: TApiMethodType.get,
    }

    return this.apiService.getData<ODataPartnerCategoryDTO>(api,null);
  }

  getConfigs(): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/getsaleconfig`,
      method: TApiMethodType.get,
    }

    return this.apiService.getData<TDSSafeAny>(api,null);
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

}
