import { Injectable } from "@angular/core";
import { TCommonService } from "@core/services";
import { CoreAPIDTO } from "omnichannel/core/dto";
import { CoreApiMethodType } from "omnichannel/core/enum";
import { BehaviorSubject, Observable } from "rxjs";
import { TDSSafeAny } from "tds-ui/shared/utility";
import { BaseSevice } from "../base.service";
import { FireBaseHttpService } from "./firebase-httpservice.service";

@Injectable({
    providedIn: 'root'
})

export class FirebaseRegisterService extends BaseSevice {

  prefix: string = "api/v2.0/notification";
  table: string = "";
  baseRestApi: string = "";

  constructor(private apiService: TCommonService) {
    super(apiService)
  }

  registerDevice(data: any): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/register-device`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<any>(api, data);
  }

  registerTopics(data: any): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/register-topics`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<any>(api, data);
  }

  topics():  Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/topics`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<any>(api, null);
  }
}
