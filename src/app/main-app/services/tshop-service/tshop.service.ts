import { CRMTeamType } from '@app/dto/team/chatomni-channel.dto';
import { TUserCacheDto } from './../../../lib/dto/tshop.dto';
import { FacebookUser } from 'src/app/lib/dto/facebook.dto';
import { CoreAPIDTO, CoreApiMethodType, TCommonService } from 'src/app/lib';

import { TDSHelperString } from 'tds-ui/shared/utility';
import { Injectable } from '@angular/core';
import { TUserDto } from '@core/dto/tshop.dto';
import { ReplaySubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TDSMessageService } from 'tds-ui/message';
import { BaseSevice } from '../base.service';

@Injectable({
  providedIn: 'root'
})

export class TShopService extends BaseSevice {

  prefix: string = "odata";
  table: string = "";
  baseRestApi: string = "";

  private readonly tshopUser$ = new Subject<any>();
  private readonly cacheLoginUser = '_cache_login_user';

  constructor(private apiService: TCommonService,
    private message: TDSMessageService) {
    super(apiService)
      this.windowLoginTShop();
  }

  windowLoginTShop() {
    window.addEventListener("message", (event: MessageEvent<any>) => {
      if(!event || !event.data) return;

      if(!TDSHelperString.isString(event.data)) return;

      let data = event.data;
      let model = JSON.parse(data) as TUserCacheDto;
      let exist = model && model.access_token && model.user;

      if(exist) {
        this.tshopUser$.next(model);
      }
    });
  }

  getTShopUser() {
    return this.tshopUser$.asObservable();
  }

  refreshUserToken(id: any, accessToken: any): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/rest/v2.0/chatomni/${id}/refreshusertoken?id=${id}&accessToken=${accessToken}`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<any>(api, null);
  }

  refreshChannelToken(id: any, channelId: any, accessToken: any): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/rest/v2.0/chatomni/${id}/refreshchanneltoken?id=${id}&channelId=${channelId}&accessToken=${accessToken}`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<any>(api, null);
  }

  getlonglivetoken(id:any,	accessToken: any, type: string = CRMTeamType._TShop): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/rest/v2.0/chatomni/getlonglivetoken/${id}?accessToken=${accessToken}&type=${type}`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<any>(api, null);
  }

  getAuthentication(fragment: string) {
    let hostname = location.href.replace("/" + location.hash, "");;
    return `${environment.tShopUrl}?redirect_url=${hostname}&fragment=${fragment}`;
  }

  setCacheLoginUser(user: TUserCacheDto) {

    let model = {
      data: user,
      type: CRMTeamType._TUser
    }

    let data = JSON.stringify(model);
    localStorage.setItem(this.cacheLoginUser, data);
  }

  getCacheLoginUser(): TUserCacheDto | null {
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
