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

  constructor(private apiService: TCommonService,
    private fireBaseHttp: FireBaseHttpService) {
    super(apiService)
  }

  registerDevice(data: any): Observable<TDSSafeAny>{
    let url = `${this._BASE_URL}/${this.prefix}/${this.table}/register-device`;
    return this.fireBaseHttp.post(url, JSON.stringify(data)).pipe((res: any) => { return res });
  }

  registerTopics(data: any) {
    let url = `${this._BASE_URL}/${this.prefix}/${this.table}/register-topics`;
    return this.fireBaseHttp.post(url, JSON.stringify(data)).pipe((res: any) => { return res });
  }

  topics() {
    let url = `${this._BASE_URL}/${this.prefix}/${this.table}/topics`;
    return this.fireBaseHttp.get(url).pipe((res: any) => { return res });
  }
}
