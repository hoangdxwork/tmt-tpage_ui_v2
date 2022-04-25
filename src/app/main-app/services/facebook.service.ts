import { Injectable } from '@angular/core';
import {  Observable, ReplaySubject } from 'rxjs';
import { TAPIDTO, TApiMethodType, TCommonService, THelperCacheService } from 'src/app/lib';
import { TDSHelperObject, TDSSafeAny } from 'tmt-tang-ui';
import { AutoHideCommentDTO, AutoReplyConfigDTO, ChannelFacebookConfigDTO, GreetingDTO, ProfileMessageDTO, QuickQuestionDTO } from '../dto/configs/page-config.dto';
import { PagedList2 } from '../dto/pagedlist2.dto';
import { ODataAllFacebookChildTO } from '../dto/team/all-facebook-child.dto';
import { BaseSevice } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class FacebookService extends BaseSevice {

  prefix: string = "odata";
  table: string = "CRMTeam";
  baseRestApi: string = "rest/v1.0/facebook";

  constructor(private apiService: TCommonService, public caheApi: THelperCacheService) {
    super(apiService)
  }

  getChannelConfig(pageId: string): Observable<ChannelFacebookConfigDTO> {
    let api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/getchannelconfig?pageId=${pageId}`,
      method: TApiMethodType.get
    }

    return this.apiService.getData<ChannelFacebookConfigDTO>(api, null);
  }

  updateProfileMessage(pageId: string, model: ProfileMessageDTO[]): Observable<ChannelFacebookConfigDTO> {
    let api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/updateprofilemessage?pageId=${pageId}`,
      method: TApiMethodType.post
    }

    return this.apiService.getData<ChannelFacebookConfigDTO>(api, model);
  }

  updateQuickQuestion(pageId: string, model: QuickQuestionDTO[]): Observable<ChannelFacebookConfigDTO> {
    let api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/updatequickanswer?pageId=${pageId}`,
      method: TApiMethodType.post
    }

    return this.apiService.getData<ChannelFacebookConfigDTO>(api, model);
  }

  updateGreeting(pageId: string, getStarted: string, greetings: GreetingDTO[]): Observable<ChannelFacebookConfigDTO> {
    let api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/updategreeting?pageId=${pageId}&getStarted=${getStarted}`,
      method: TApiMethodType.post
    }

    return this.apiService.getData<ChannelFacebookConfigDTO>(api, greetings);
  }


}
