import { FacebookCacheDto } from './../../lib/dto/facebook.dto';
import { FacebookUser } from 'src/app/lib/dto/facebook.dto';
import { FacebookVerifyResultDto } from './../dto/team/team.dto';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CoreAPIDTO, CoreApiMethodType, TCommonService, THelperCacheService } from 'src/app/lib';
import { TDSSafeAny } from 'tds-ui/shared/utility';
import { ChannelFacebookConfigDTO, GreetingDTO, ProfileMessageDTO, QuickQuestionDTO } from '../dto/configs/page-config.dto';
import { BaseSevice } from './base.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FacebookService extends BaseSevice {

  prefix: string = "odata";
  table: string = "CRMTeam";
  baseRestApi: string = "rest/v1.0/facebook";

  private readonly cacheLoginUser = '_cache_login_user';

  constructor(private apiService: TCommonService, public caheApi: THelperCacheService) {
    super(apiService)
  }

  getChannelConfig(pageId: string): Observable<ChannelFacebookConfigDTO> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/getchannelconfig?pageId=${pageId}`,
      method: CoreApiMethodType.get
    }

    return this.apiService.getData<ChannelFacebookConfigDTO>(api, null);
  }

  updateProfileMessage(pageId: string, model: ProfileMessageDTO[]): Observable<ChannelFacebookConfigDTO> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/updateprofilemessage?pageId=${pageId}`,
      method: CoreApiMethodType.post
    }

    return this.apiService.getData<ChannelFacebookConfigDTO>(api, model);
  }

  updateQuickQuestion(pageId: string, model: QuickQuestionDTO[]): Observable<ChannelFacebookConfigDTO> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/updatequickanswer?pageId=${pageId}`,
      method: CoreApiMethodType.post
    }

    return this.apiService.getData<ChannelFacebookConfigDTO>(api, model);
  }

  updateGreeting(pageId: string, getStarted: string, greetings: GreetingDTO[]): Observable<ChannelFacebookConfigDTO> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/updategreeting?pageId=${pageId}&getStarted=${getStarted}`,
      method: CoreApiMethodType.post
    }

    return this.apiService.getData<ChannelFacebookConfigDTO>(api, greetings);
  }

  verifyConect(model: TDSSafeAny){
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/api/facebook/verify`,
      method: CoreApiMethodType.post
    }

    return this.apiService.getData<FacebookVerifyResultDto>(api, model);
  }

  verifyConectGraphFacebook(token: any){
    let version = environment.facebook.appVersion;
    let api: CoreAPIDTO = {
      url: `https://z-p3-graph.facebook.com/${version}/me?access_token=${token}&fields=id%2Cname%2Cpicture&method=get&pretty=0&sdk=joey&suppress_http_code=1`,
      method: CoreApiMethodType.get
    }

    return this.apiService.getData<any>(api, null);
  }

  setCacheLoginUser(user: FacebookCacheDto, type: string) {
    let model = {
      data: user,
      type: type
    }

    let data = JSON.stringify(model);
    localStorage.setItem(this.cacheLoginUser, data);
  }

  getCacheLoginUser(): FacebookCacheDto | null {
    let data = localStorage.getItem(this.cacheLoginUser);

    if(data) {
      let model = JSON.parse(data);
      return model;
    } else {
      return null;
    }
  }

  removeCacheLoginUser() {
    localStorage.removeItem(this.cacheLoginUser);
  }
}
