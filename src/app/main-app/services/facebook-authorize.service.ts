import { TDSSafeAny } from 'tds-ui/shared/utility';
import { FacebookAuth, FacebookAuthResponse } from './../../lib/dto/facebook.dto';
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { TCommonService } from "src/app/lib";
import { BaseSevice } from "./base.service";
import { FacebookLoginService } from "./facebook-login.service";

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
    }

    fbGetMe() {
        return new Observable((observer: TDSSafeAny) => {
            this.facebookLoginService.init().subscribe({
                next: (init: any) => {
                    this.facebookLoginService.getLoginStatus().subscribe({
                        next: (res: FacebookAuthResponse) => {
                          if (res.status === 'connected') {
                            
                              this.facebookLoginService.getMe().subscribe({
                                next: (me: any) => {
                                    observer.next(me);
                                    observer.complete();
                                },
                                error: (error: any) => {
                                    observer.next(error);
                                    observer.complete();
                                }
                              });
                          }
                        },
                        error: (error) => {
                            observer.next(error);
                            observer.complete();
                        }
                      })
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
        this.facebookLoginService.init().subscribe({
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
              }
            )
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
        this.facebookLoginService.init().subscribe({
          next: (init: any) => {
              this.facebookLoginService.logout().subscribe({
                next: (res: FacebookAuth) => {
                  observer.next(res);
                  observer.complete();
                },
                error: error => {
                  observer.next(error);
                  observer.complete();
                }
              }
            )
          },
          error: error => {
            observer.next(error);
            observer.complete();
          }
        })
      })
    }
}
