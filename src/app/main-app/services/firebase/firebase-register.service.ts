import { Injectable } from "@angular/core";
import { TCommonService } from "@core/services";
import { CoreAPIDTO } from "omnichannel/core/dto";
import { CoreApiMethodType } from "omnichannel/core/enum";
import { BehaviorSubject, Observable } from "rxjs";
import { TDSSafeAny } from "tds-ui/shared/utility";
import { BaseSevice } from "../base.service";

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

  topics(): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/topics`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<any>(api, null);
  }

  subscribedTopics(): Observable<TDSSafeAny>  {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/subscribeds`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<any>(api, null);
  }

  notifications(params?: any): Observable<any>{
    // /api/v2.0/notification/?cursor=6362a0d92f0566ce4b95e17d
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<any>(api, null);
  }

  makeRead(id: string): Observable<TDSSafeAny>  {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${id}/make-read`,
      method: CoreApiMethodType.post
    }

    return this.apiService.getData<any>(api, null);
  }
}
