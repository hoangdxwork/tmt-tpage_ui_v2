import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { TUserDto } from '@core/dto/tshop.dto';
import { ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class TShopService  {

  private _currentToken!: string | undefined;
  private _userTShopLogin!: TUserDto | undefined;
  private readonly currentUser$ = new ReplaySubject<TUserDto | undefined>(1);

  constructor(
    @Inject(DOCUMENT) private document: Document) {
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
    let hostname = this.document.location.origin;
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
