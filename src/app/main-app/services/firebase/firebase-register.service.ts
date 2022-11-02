import { Injectable } from "@angular/core";
import { TCommonService } from "@core/services";
import { CoreAPIDTO } from "omnichannel/core/dto";
import { CoreApiMethodType } from "omnichannel/core/enum";
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

  registerDevice(data: any) {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/register-device`,
      method: CoreApiMethodType.post
    }

    return this.apiService.getData<any>(api, data);
  }

  registerTopics(data: any) {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/register-topics`,
      method: CoreApiMethodType.post
    }

    return this.apiService.getData<any>(api, data);
  }

  topics() {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/topics`,
      method: CoreApiMethodType.get
    }

    return this.apiService.getData<any>(api, null);
  }
}
