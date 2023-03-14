import { Injectable } from "@angular/core";
import { FireBaseNotificationDto, NotificationItemDto } from "@app/dto/firebase/firebase-notification.dto";
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


  // TODO: danh sách topic đã đăng kí
  subscribedTopics(): Observable<TDSSafeAny>  {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/subscribeds`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<any>(api, null);
  }

  // TODO: danh sách thông báo
  notifications(params?: any): Observable<any>{
    let url = `${this._BASE_URL}/${this.prefix}/`;

    if(params){
      let queryString = Object.keys(params).map(key => {
        return key + '=' + params[key]
      }).join('&');

      url += `?${queryString}`;
    }

    const api: CoreAPIDTO = {
      url: url,
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


  notificationDetail(id: string): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${id}`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<any>(api, null);
  }

}
