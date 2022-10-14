import { TDSHelperObject } from 'tds-ui/shared/utility';
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Message } from '@core/consts/message.const';
import { TUserDto } from '@core/dto/tshop.dto';
import { ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TDSMessageService } from 'tds-ui/message';

@Injectable({
  providedIn: 'root'
})

export class TShopService  {

  private _currentToken!: string | undefined;
  private _userTShopLogin!: TUserDto | undefined;
  private readonly currentUser$ = new ReplaySubject<TUserDto | undefined>(1);

  constructor(
    private message: TDSMessageService
  ) {
      this.eventLogin();
  }

  eventLogin()
  {
    window.addEventListener("message", (event: MessageEvent<any>) => {
      if(TDSHelperObject.hasValue(event?.data))
      {
        let data = JSON.parse(event.data);

        this.message.success(Message.TShop.LoginSuccess);

        if(data?.access_token && data?.user) {
          this.setCurrentToken(data?.access_token);
          this.onUpdateUser(data?.user);
        }
      }
    });
  }

  getCurrentToken(): string | undefined {
    return this._currentToken;
  }

  setCurrentToken(token: string) {
    this._currentToken = token;
  }

  getCurrentUser(): TUserDto | undefined {
    return this._userTShopLogin;
  }

  setCurrentUser(token: TUserDto) {
    this._userTShopLogin = token;
  }

  getAuthentication(fragment: string) {
    let hostname = location.href.replace("/" + location.hash, "");;
    return `${environment.tShopUrl}?redirect_url=${hostname}&fragment=${fragment}`;
  }

  onUpdateUser(data: TUserDto | undefined) {
    this._userTShopLogin = data;

    if(data == null)
      this._currentToken = undefined;

    this.currentUser$.next(data);
  }

  onChangeUser() {
    return this.currentUser$.asObservable();
  }

  logout() {
    this.onUpdateUser(undefined);
  }

}
