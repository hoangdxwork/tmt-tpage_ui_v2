import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TAPIDTO, TApiMethodType, TCommonService } from 'src/app/lib';
import { TDSSafeAny } from 'tmt-tang-ui';
import { CompanyCurrentDTO } from '../dto/configs/company-current.dto';
import { SaleConfigsDTO } from '../dto/configs/sale-config.dto';
import { BaseSevice } from './base.service';

@Injectable()

export class SharedService extends BaseSevice {

  prefix: string = "";
  table: string = "";
  baseRestApi: string = "";

  constructor(private apiService: TCommonService) {
    super(apiService)
  }

  getConfigs(): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/api/common/getsaleconfig`,
        method: TApiMethodType.get,
    }

    return this.apiService.getCacheData<SaleConfigsDTO>(api, null);
  }

  getCurrentCompany(): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/api/common/getcompanycurrent`,
        method: TApiMethodType.get,
    }

    return this.apiService.getCacheData<CompanyCurrentDTO>(api, null);
  }

}
