import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { TAPIDTO, TApiMethodType, TCommonService } from "src/app/lib";
import { TDSSafeAny } from "tmt-tang-ui";
import { BaseSevice } from "./base.service";


@Injectable({
  providedIn: 'root'
})
export class CRMActivityCampaignService extends BaseSevice {

  prefix: string = "odata";
  table: string = "CRMActivityCampaign";
  baseRestApi: string = "rest/v1.0";

  constructor(private apiService: TCommonService) {
    super(apiService)
  }

  saveOrderCampaign(data: TDSSafeAny): Observable<TDSSafeAny> {

    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/${this.table}/order-campaign`,
      method: TApiMethodType.post
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  generateMessagePartners(data: TDSSafeAny): Observable<TDSSafeAny>{
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/${this.table}/generatemessagepartners`,
      method: TApiMethodType.post
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  insertOdata(data: TDSSafeAny): Observable<TDSSafeAny>{
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}?$expand=Details,GroupDetails($expand=CRMTeam,Details)`,
      method: TApiMethodType.post
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }
}
