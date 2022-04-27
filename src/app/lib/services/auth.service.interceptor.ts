import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, pipe, throwError } from 'rxjs';
import { TAuthService } from './auth.service';
import { TCommonService } from './common.service';
import { environment } from 'src/environments/environment';
import { TDSHelperObject, TDSHelperString, TDSSafeAny } from 'tmt-tang-ui';
import { catchError, filter, switchMap, take } from "rxjs/operators";
import { TGlobalConfig } from './global-config';

@Injectable()
export class TAuthInterceptorService implements HttpInterceptor {

    constructor(public auth: TAuthService,
        public libcommon: TCommonService
    ) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<TDSSafeAny> {
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
                    if (TDSHelperObject.hasValue(err.error) &&
                        TDSHelperObject.hasValue(err.error.Message)) {
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
                    that.auth.refreshToken(this.auth.getAccessToken())
                    .subscribe((data) => {
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
        let accessToken =this.auth.getAccessToken();
        if (TDSHelperObject.hasValue(this.auth.isLogin())
            && TDSHelperObject.hasValue(accessToken)
            && TDSHelperString.hasValueString(accessToken?.access_token)
        ) {
            
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


