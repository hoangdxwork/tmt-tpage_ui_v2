import { HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TDSHelperObject, TDSHelperString, TDSSafeAny } from 'tmt-tang-ui';
import { FacebookTokenDTO, GoogleTokenDTO, TTokenDTO, UserInitDTO } from '../dto';
import { TApiMethodType } from '../enum';
import { THelperCacheService } from '../utility';
import { TCommonService } from './common.service';
import { TGlobalConfig } from './global-config';


@Injectable({
    providedIn: 'root'
})
export class TAuthService {
    constructor(
        private apiService: TCommonService,
        private cacheService: THelperCacheService
    ) {
    }
    //Thực thi việc đăng nhập và lấy token
    signInPassword(phoneNumber: string, password: string): Observable<TDSSafeAny> {
        let that = this;
        return new Observable(obs => {
            const data = new HttpParams({
                fromObject: {
                    phoneNumber: phoneNumber,
                    password: password
                }
            });
            that.apiService.connect(TApiMethodType.post, environment.apiApp + environment.apiAccount.signInPassword, {
                phoneNumber: phoneNumber,
                password: password
            },
                this.apiService.getHeaderJSon(false, false), false).subscribe((res: TDSSafeAny) => {
                    if (TDSHelperObject.hasValue(res)) {
                        that.signInSuccess(res).subscribe(
                            s => {
                                obs.next(true);
                                obs.complete();
                            },
                            f => {
                                obs.error(f);
                                obs.complete();
                            }
                        )
                    }
                }, f => {
                    obs.error(f);
                    obs.complete();
                });
        });
    }

    //Thực thi việc lấy thông tin userInit
    getUserInit(): Observable<UserInitDTO | undefined> {
        let that = this;
        return new Observable(obs => {
            that.apiService.connect(TApiMethodType.get, environment.apiApp + environment.apiAccount.userInit, null,
                this.apiService.getHeaderJSon(true), false).subscribe((res: TDSSafeAny) => {
                    if (TDSHelperObject.hasValue(res)) {
                        obs.next(res as UserInitDTO);
                        obs.complete();
                    } else {
                        obs.next(undefined);
                        obs.complete();
                    }
                }, f => {
                    obs.error(f);
                    obs.complete();
                });
        });
    }
    //Thực thi việc gọi về Server để refresh token
    refreshToken(token: TTokenDTO | null): Observable<TDSSafeAny> {
        let that = this;
        return new Observable(observer => {
            const formURL = new HttpParams({
                fromObject: {
                    "refreshToken": token?.refreshToken ? token?.refreshToken : ''
                }
            });
            that.apiService.connect(TApiMethodType.post,
                environment.apiApp + environment.apiAccount.refreshToken, formURL, this.apiService.getHeaderJSon(false, true), false).subscribe(data => {
                    if (TDSHelperObject.hasValue(data)) {
                        that.setCacheToken(data as TTokenDTO).subscribe(() => {
                            observer.next(data);
                            observer.complete();
                        }, err => {
                            that.clearToken("auth refreshTokenOnServer")
                            observer.next(null);
                            observer.complete();
                        }
                        );
                    } else {
                        that.clearToken("auth refreshTokenOnServer")
                        observer.next(null);
                        observer.complete();
                    }
                }, error => {
                    observer.error(error);
                    observer.complete()
                });

        });
    }
    //Thực thi get token vào cache theo function đã được định nghĩa trong authen.service.xxxx.ts
    getCacheToken(): Observable<TDSSafeAny> {

        return new Observable(obs => {
            let token: TTokenDTO;
            this.cacheService.getItem("bearerToken").subscribe(ops => {
                if (TDSHelperObject.hasValue(ops)) {
                    token = JSON.parse(ops.value).value;
                }
                TGlobalConfig.Authen.token = token;
                TGlobalConfig.Authen.isLogin = (TDSHelperObject.hasValue(token) &&
                    TDSHelperString.hasValueString(token.accessToken));
                obs.next(token);
                obs.complete();
            });
        });
    }
    //Thực thi set token vào cache theo function đã được định nghĩa trong authen.service.xxxx.ts
    setCacheToken(token: TTokenDTO): Observable<TDSSafeAny> {
        return new Observable(obs => {
            this.cacheService.setItem("bearerToken", token);
            obs.next(token);
            obs.complete();
        });
    }
    //Thực thi xóa cache token và toàn bộ dữ liệu
    clearToken(logString: string = "auth clearToken"): void {
        this.cacheService.clear().subscribe(f => {
            TGlobalConfig.Authen.isLogin = false;
            TGlobalConfig.Authen.token = null;
        });
    }
    //Thực thi thiết lập mật khẩu người dùng
    // setPassword(params: TDSSafeAny): Observable<TDSSafeAny> {
    //     if (TDSHelperObject.hasValue(TCoreFunction.setPassword)) {
    //         return TCoreFunction.setPassword(params);
    //     } else {
    //         throw "setPassword no implement";
    //     }
    // }
    //Thực thi thay đổi mật khẩu người dùng
    // changePassword(params: TDSSafeAny): Observable<TDSSafeAny> {
    //     if (TDSHelperObject.hasValue(TCoreFunction.changePassword)) {
    //         return TCoreFunction.changePassword(params);
    //     } else {
    //         throw "changePassword no implement";
    //     }
    // }
    //Thực thi add authen token
    addAuthenticationToken(req: HttpRequest<TDSSafeAny>): HttpRequest<TDSSafeAny> {
        if (TDSHelperObject.hasValue(TGlobalConfig.Authen)
            && TDSHelperObject.hasValue(TGlobalConfig.Authen.token)
            && TDSHelperString.hasValueString(TGlobalConfig.Authen.token?.accessToken)
        ) {
            req = req.clone({
                setHeaders:
                {
                    Authorization: "Bearer " + TGlobalConfig.Authen.token?.accessToken,
                }
            });
        }
        return req;
    }
    //đăng xuất
    logout(urlLogin: string): void {
        let that = this;
        that.clearToken();
        that.redirectLogin(urlLogin);
    }
    private signInSuccess(token: TTokenDTO) {
        let that = this;
        return new Observable(obs => {
            that.setCacheToken(token).subscribe(s => {
                TGlobalConfig.Authen.isLogin = true;
                that.apiService.resetData();
                obs.next(true);
                obs.complete();
            }, f => {
                obs.error(f);
                obs.complete();
            }
            )
        });
    }
 
    redirectLogin(urlLogin: string= environment.urlLogin) {
        setTimeout(() => {
            window.location.href = urlLogin;
        }, 1);
    };
}