import { Injectable } from '@angular/core';
import {  Observable, ReplaySubject } from 'rxjs';
import { TAPIDTO, TApiMethodType, TCommonService, THelperCacheService } from 'src/app/lib';
import { AutoHideCommentDTO, AutoReplyConfigDTO, ChannelFacebookConfigDTO, GreetingDTO, ProfileMessageDTO, QuickQuestionDTO } from '../dto/configs/page-config.dto';
import { BaseSevice } from './base.service';

@Injectable({
  providedIn: 'root'
})

export class FacebookPostService extends BaseSevice {

  prefix: string = "odata";
  table: string = "";
  baseRestApi: string = "rest/v1.0/facebookpost";

  constructor(private apiService: TCommonService, public caheApi: THelperCacheService) {
    super(apiService)
  }

  getByIds(data: any): Observable<any> {
    let api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/get_by_ids`,
      method: TApiMethodType.post
    }

    return this.apiService.getData<any>(api, data);
  }


}
