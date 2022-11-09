import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { TAuthService } from './auth.service';
import { TCommonService } from './common.service';
import { environment } from 'src/environments/environment';
import { catchError, filter, switchMap, take } from "rxjs/operators";
import { TGlobalConfig } from './global-config';
import { TDSHelperObject, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';

@Injectable()
export class TAuthInterceptorService implements HttpInterceptor {

    constructor(public auth: TAuthService, public libcommon: TCommonService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<TDSSafeAny>> {
        let that = this;

        let lstUrlLogin = [
            environment.apiAccount.signInPassword,
            environment.apiAccount.signInFacebook,
            environment.apiAccount.signInGoogle,
            environment.apiAccount.signInVerifyOtpsms,
        ];

        req = this.addAuthenticationToken(req)
        return next.handle(req).pipe(catchError(err => {

            //Lỗi do đăng nhập chưa xóa dữ liệu trên cache
            if (lstUrlLogin.indexOf(req.url) > -1) {
                //console.log("checkLinkIDServer: true")
                that.auth.clearToken("checkLinkIDServer");

                let error = "";
                if (TDSHelperObject.hasValue(err)) {
                    if (TDSHelperObject.hasValue(err.error) && TDSHelperObject.hasValue(err.error.Message)) {

                        error = err.error.Message;

                    } else {
                        if (TDSHelperObject.hasValue(err.statusText))
                            error = err.statusText;
                        else {
                            error = err;
                        }
                    }
                }
                return throwError(err);
            }

            //Lỗi khác lỗi 401
            else if (err.status !== 401) {
                let error = "";
                if (TDSHelperObject.hasValue(err)) {
                    if (TDSHelperObject.hasValue(err.error)) {
                        error = err.error;
                    } else {
                        if (TDSHelperObject.hasValue(err.statusText))
                            error = err.statusText;
                        else {
                            error = err;
                        }
                    }
                }
                return throwError(error);
            }

            //Lỗi 401
            else {

                if (!TGlobalConfig.Authen.refreshTokenInProgress) {

                    TGlobalConfig.Authen.refreshTokenInProgress = true;
                    TGlobalConfig.Authen.refreshTokenSubject.next(null);

                    that.auth.refreshToken(this.auth.getAccessToken()).subscribe((data) => {

                        TGlobalConfig.Authen.refreshTokenInProgress = false;
                        TGlobalConfig.Authen.refreshTokenSubject.next(data);

                        return next.handle(that.auth.addAuthenticationToken(req));
                    },
                        error => {
                             that.auth.clearToken("AuthInterceptor");
                            that.auth.redirectLogin();
                            return throwError(error);
                        });
                }

                return TGlobalConfig.Authen.refreshTokenSubject.pipe(
                    filter(token => token !== null),
                    take(1),
                    switchMap((token) => next.handle(that.auth.addAuthenticationToken(req)))
                );
            }
        }));
    }

    addAuthenticationToken = (req: HttpRequest<any>): HttpRequest<any> => {

        let showt = req.url.indexOf("/print/html") > -1;

        if (!showt) {
            if (!req.headers.has('Content-Type')) {
                req = req.clone({
                  setHeaders:
                  {
                      'Cache-Control': 'no-cache',
                      Pragma: 'no-cache',
                      Expires: 'Sat, 01 Jan 2000 00:00:00 GMT',
                      TPOSAppVersion: '1.06.1.7'
                  }
                });
            }
        } else {
            req = req.clone({
                headers: new HttpHeaders({})
            });
        }

        let accessToken = this.auth.getAccessToken();

        if (TDSHelperObject.hasValue(this.auth.isLogin())
            && TDSHelperObject.hasValue(accessToken)
            && TDSHelperString.hasValueString(accessToken?.access_token)) {

            req = req.clone({
                setHeaders:
                {
                    Authorization: "Bearer " + accessToken?.access_token,
                }
            });

        }
        return req;
    }
}


