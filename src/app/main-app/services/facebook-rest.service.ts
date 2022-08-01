import { CoreApiMethodType } from './../../lib/enum/api.methodtype';
import { TCommonService } from './../../lib/services/common.service';
import { CoreAPIDTO } from './../../lib/dto/api.dto';
import { Injectable } from '@angular/core';
import { BaseSevice } from './base.service';
import {
  TDSSafeAny } from 'tds-ui/shared/utility';

@Injectable({
  providedIn: 'root'
})
export class FacebookRESTService extends BaseSevice {
  prefix: string = "";
  table: string = "";
  baseRestApi: string = "rest/v1.0/facebook";

  constructor(private apiService: TCommonService) {
    super(apiService)
   }

  public rescan(pageId: string, minusDays: number){
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/rescan?pageId=${pageId}&days=${minusDays}`,
      method: CoreApiMethodType.get
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }
}
