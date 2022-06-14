import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { TAPIDTO, TApiMethodType, TCommonService } from "src/app/lib";
import { TDSSafeAny } from "tds-ui/shared/utility";
import { GeneralConfigUpdateDTO, ShippingStatuesDTO } from "../dto/configs/general-config.dto";
import { BaseSevice } from "./base.service";

@Injectable({
  providedIn: 'root'
})
export class GeneralConfigService extends BaseSevice {

  prefix: string = "odata";
  table: string = "GeneralConfig";
  baseRestApi: string = "rest/v1.0/generalconfig";

  constructor(private apiService: TCommonService) {
    super(apiService)
  }

  getByName(name: string): Observable<any> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/by_name?name=${name}`,
      method: TApiMethodType.get,
    }

    return this.apiService.getData<any>(api, null);
  }

  getShippingStatues(): Observable<Array<ShippingStatuesDTO>> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/shippingstatues`,
      method: TApiMethodType.get,
    }

    return this.apiService.getData<Array<ShippingStatuesDTO>>(api, null);
  }

  update(data: GeneralConfigUpdateDTO<TDSSafeAny>): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/update`,
      method: TApiMethodType.put,
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }

}
