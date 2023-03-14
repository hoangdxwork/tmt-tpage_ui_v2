import { Observable } from 'rxjs';
import { TiktokUserDto } from './../../../lib/dto/tiktok.dto';
import { CRMTeamType } from '@app/dto/team/chatomni-channel.dto';
import { CoreAPIDTO, CoreApiMethodType, TCommonService } from 'src/app/lib';
import { Injectable } from '@angular/core';
import { TDSMessageService } from 'tds-ui/message';
import { BaseSevice } from '../base.service';

@Injectable({
  providedIn: 'root'
})

export class TiktokService extends BaseSevice {
  prefix: string = "odata";
  table: string = "";
  baseRestApi: string = "";

  private readonly cacheLoginUser = '_cache_login_user';

  constructor(private apiService: TCommonService,
    private message: TDSMessageService) {
    super(apiService)
  }

  login(id: string, sessionId: string) {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/rest/v2.0/chatomni/unofficialtiktokcheck?sessionId=${sessionId}&id=${id}`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<any>(api, null);
  }

  refreshListen(id: string) {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/rest/v2.0/chatomni/unofficialtiktok?id=${id}`,
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

  refreshUnofficialTiktok(id: any, sessionId: any): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/rest/v2.0/chatomni/${id}/refreshunofficialtiktok?sessionId=${sessionId}`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<any>(api, null);
  }

  setCacheLoginUser(cacheData: TiktokUserDto) {
    let model = {
      data: cacheData,
      type: CRMTeamType._UnofficialTikTok
    }

    let data = JSON.stringify(model);
    localStorage.setItem(this.cacheLoginUser, data);
  }

  getCacheLoginUser(): TiktokUserDto | null {
    let data = localStorage.getItem(this.cacheLoginUser);

    if (data) {
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
