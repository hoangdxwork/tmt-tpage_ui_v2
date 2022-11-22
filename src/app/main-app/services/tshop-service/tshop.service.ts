import { CoreAPIDTO, CoreApiMethodType, TCommonService } from 'src/app/lib';

import { TDSHelperString } from 'tds-ui/shared/utility';
import { Injectable } from '@angular/core';
import { TUserDto } from '@core/dto/tshop.dto';
import { ReplaySubject, Observable } from 'rxjs';
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
  private _currentToken!: string | null;
  private _userTShopLogin!: TUserDto | null;
  private readonly currentUser$ = new ReplaySubject<TUserDto | null>(1);

  constructor(private apiService: TCommonService,
    private message: TDSMessageService) {
    super(apiService)
    this.eventLogin();
  }

  eventLogin() {
    window.addEventListener("message", (event: MessageEvent<any>) => {
      let data = event?.data;

      if(data) {
        let checkString = TDSHelperString.isString(data);
        let model = checkString ? JSON.parse(data) : data;

        if(model?.access_token && model?.user) {
          this.setCurrentToken(model?.access_token);
          this.onUpdateUser(model?.user);
        }
      }
    });
  }

  refreshUserToken(id: any): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/rest/v2.0/chatomni/${id}/refreshusertoken`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<any>(api, null);
  }

  getCurrentToken(): string | null {
    return this._currentToken;
  }

  setCurrentToken(token: string) {
    this._currentToken = token;
  }

  getCurrentUser(): TUserDto | null {
    return this._userTShopLogin;
  }

  setCurrentUser(token: TUserDto) {
    this._userTShopLogin = token;
  }

  getAuthentication(fragment: string) {
    let hostname = location.href.replace("/" + location.hash, "");;
    return `${environment.tShopUrl}?redirect_url=${hostname}&fragment=${fragment}`;
  }

  onUpdateUser(data: TUserDto | null) {
    this._userTShopLogin = data;

    if(data == null)
      this._currentToken = null;

    this.currentUser$.next(data);
  }

  onChangeUser() {
    return this.currentUser$.asObservable();
  }

  logout() {
    this.onUpdateUser(null);
  }
}
