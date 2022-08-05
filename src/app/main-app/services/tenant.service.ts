import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CoreAPIDTO, CoreApiMethodType, TCommonService } from "src/app/lib";
import { AppPackageDTO, AppTenantConfig_FeatureCacheDTO, TenantInfoDTO, TenantUsedDTO } from "../dto/tenant/tenant.dto";
import { BaseSevice } from "./base.service";

@Injectable()
export class TenantService extends BaseSevice {

  prefix: string = "odata";
  table: string = "Tenant";
  baseRestApi: string = "api/tenant";

  constructor(private apiService: TCommonService) {
    super(apiService)
  }

  getInfo(): Observable<TenantInfoDTO> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/info`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<TenantInfoDTO>(api, null);
  }

  getUsed(): Observable<TenantUsedDTO> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/used`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<TenantUsedDTO>(api, null);
  }

  getPackages(): Observable<AppPackageDTO> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/packages`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<AppPackageDTO>(api, null);
  }

}
