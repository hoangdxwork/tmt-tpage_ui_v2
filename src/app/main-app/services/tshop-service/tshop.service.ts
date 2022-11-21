import { TDSHelperObject, TDSHelperString } from 'tds-ui/shared/utility';
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

  private _currentToken!: string | null;
  private _userTShopLogin!: TUserDto | null;
  private readonly currentUser$ = new ReplaySubject<TUserDto | null>(1);
  // private readonly cacheTShopUser = '_cache_TShop_user';

  constructor(
    private message: TDSMessageService
  ) {
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

  // setCacheTShopUser(user: TUserDto) {
  //   let data = JSON.stringify(user);
  //   localStorage.setItem(this.cacheTShopUser, data);
  // }

  // getCacheTShopUser(): TUserDto | null {
  //   let data = localStorage.getItem(this.cacheTShopUser);

  //   if(data) {
  //     let user = JSON.parse(data);
  //     return user;
  //   } else {
  //     return null;
  //   }
  // }

  // removeCacheTshopUser() {
  //   localStorage.removeItem(this.cacheTShopUser);
  // }
}
