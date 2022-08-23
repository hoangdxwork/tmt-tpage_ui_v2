import { CoreAPIDTO } from './../../../lib/dto/api.dto';
import { CoreApiMethodType } from './../../../lib/enum/api.methodtype';
import { Observable } from 'rxjs';
import { TCommonService } from './../../../lib/services/common.service';
import { Injectable } from "@angular/core";
import { BaseSevice } from "../base.service";
import { get as _get } from 'lodash';
import { set as _set } from 'lodash';
import { ChatomniMessageFacade } from "../chatomni-facade/chatomni-message.facade";
import { TDSSafeAny } from 'tds-ui/shared/utility';

@Injectable()

export class ChatomniSendMessageService extends BaseSevice  {

  prefix: string = "odata";
  table: string = "";
  baseRestApi: string = "rest/v2.0/chatomni";

  constructor(private apiService: TCommonService,
    private omniFacade: ChatomniMessageFacade) {
      super(apiService)
  }

  sendMessage(teamId: number, userId: any, data: any): Observable<TDSSafeAny> {

    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/${teamId}_${userId}/messages`,
      method: CoreApiMethodType.post,
    }
    return this.apiService.getData<any>(api, data);
  }

  sendMessageManyPeople(teamId: number, data: any): Observable<TDSSafeAny> {

    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/${teamId}/messagesmanypeople`,
      method: CoreApiMethodType.post,
    }
    return this.apiService.getData<any>(api, data);
  }
}