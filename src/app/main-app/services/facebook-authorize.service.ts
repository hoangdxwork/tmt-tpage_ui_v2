import { TDSSafeAny } from 'tds-ui/shared/utility';
import { FacebookAuth, FacebookAuthResponse, FacebookInitParams } from './../../lib/dto/facebook.dto';
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { TCommonService } from "src/app/lib";
import { BaseSevice } from "./base.service";
import { FacebookLoginService } from "./facebook-login.service";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class FacebookAuthorizeService extends BaseSevice {

    prefix: string = "";
    table: string = "";
    baseRestApi: string = "";

    constructor(private apiService: TCommonService,
        private facebookLoginService: FacebookLoginService) {
        super(apiService);
        this.init().subscribe();
    }

    init() {
      let appId = environment.facebook.appId;
      let appVersion = environment.facebook.appVersion;

      let model: FacebookInitParams = {
        appId: appId,
        xfbml: true,
        version: appVersion,
        status: true
      };

      return this.facebookLoginService.init(model);
    }

    fbGetMe() {
      return new Observable((observer: TDSSafeAny) => {
        this.facebookLoginService.getMe().subscribe({
          next: (me: any) => {
            if(me && me.id) {
                observer.next(me);
                observer.complete();
            } else {
                observer.next();
                observer.complete();
            }
          },
          error: (error: any) => {
            observer.next(error);
            observer.complete();
          }
        })
      })
    }

    fbLoginStatus() {
      return new Observable((observer: TDSSafeAny) => {
        this.facebookLoginService.getLoginStatus().subscribe({
          next: (data: FacebookAuthResponse) => {
            if (data.status === 'connected') {
              observer.next(data);
              observer.complete();
            } else {
              observer.next();
              observer.complete();
            }
          },
          error: (error) => {
            observer.next(error);
            observer.complete();
          }
        })
      })
    }

    fbSignIn() {
      return new Observable((observer: TDSSafeAny) => {
        this.init().subscribe({
          next: (init: any) => {
            this.facebookLoginService.login().subscribe({
              next: (res: FacebookAuth) => {
                observer.next(res);
                observer.complete();
              },
              error: error => {
                observer.next(error);
                observer.complete();
              }
            })
          },
          error: error => {
            observer.next(error);
            observer.complete();
          }
        })
      })
    }

    fbSignOut() {
      return new Observable((observer: TDSSafeAny) => {
        this.facebookLoginService.getLoginStatus().subscribe({
          next: (response : any) => {
            if (response && response.status === 'connected') {
              this.facebookLoginService.logout().subscribe({
                next: (res: FacebookAuth) => {
                  observer.next(res);
                  observer.complete();
                },
                error: error => {
                  observer.next(error);
                  observer.complete();
                }
              })
            } else if(response.status === 'not_authorized') {
                observer.next();
                observer.complete();
            }
          },
          error: (error: any) => {
            observer.next(error);
            observer.complete();
          }
        })
      })
    }
}
