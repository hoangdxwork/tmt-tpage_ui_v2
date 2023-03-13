import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CoreAPIDTO, CoreApiMethodType, TCommonService } from "src/app/lib";
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
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/by_name?name=${name}`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<any>(api, null);
  }

  getShippingStatues(): Observable<Array<ShippingStatuesDTO>> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/shippingstatues`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<Array<ShippingStatuesDTO>>(api, null);
  }

  update(name: string, data: any): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/update`,
      method: CoreApiMethodType.put,
    }

    return this.apiService.getData<TDSSafeAny>(api, { name: name, value: data });
  }

  getAccountJournal(): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/odata/AccountJournal/OdataService.GetAccountJournalList?&%24top=50&%24filter=(contains(Type%2C%27cash%27)+or+contains(Type%2C%27bank%27))&%24count=true`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<any>(api, null);
  }

  getAccountJournalById(id: any): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/odata/AccountJournal(${id})`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<any>(api, null);
  }

}
