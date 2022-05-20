import { HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { TDSHelperObject, TDSHelperString, TDSSafeAny } from 'tmt-tang-ui';
import { TTokenDTO, UserInitDTO } from '../dto';
import { TApiMethodType } from '../enum';
import { THelperCacheService } from '../utility';
import { TCommonService } from './common.service';


@Injectable({
    providedIn: 'root'
})

export class TAuthService {
    private readonly __keyBearerToken = 'TpageBearerToken';
    private _accessToken!: TTokenDTO;
    private readonly authenObs = new Subject<boolean>();
    private _isLogin: boolean = false;

    constructor(private router: Router,
        private apiService: TCommonService,
        private cacheService: THelperCacheService) {
    }

    //Thực thi việc đăng nhập và lấy token
    signInPassword(username: string, password: string): Observable<TDSSafeAny> {
        let that = this;
        let data = new URLSearchParams();
        data.set("client_id", "tmtWebApp");
        data.set("grant_type", "password");
        data.set("username", username);
        data.set("password", password);
        data.set("scope", "profile");
        return that.apiService.connect(TApiMethodType.post, environment.apiApp + environment.apiAccount.signInPassword, data,
            this.apiService.getHeaderJSon(false, true), false)
            .pipe(
                mergeMap((data: TDSSafeAny) => {
                    return this.setCacheToken(data);
                })
            );

    }

    //Thực thi việc lấy thông tin userInit
    getUserInit(): Observable<UserInitDTO | undefined> {
        let that = this;
        return that.apiService.connect(TApiMethodType.get, environment.apiApp + environment.apiAccount.userInit, null,
            this.apiService.getHeaderJSon(true), false);
    }
    //Thực thi việc gọi về Server để refresh token
    refreshToken(token: TTokenDTO | null): Observable<TDSSafeAny> {
        let that = this;
        const formURL = new HttpParams({
            fromObject: {
                "refreshToken": token?.refresh_token ? token?.refresh_token : ''
            }
        });
        return that.apiService.connect(TApiMethodType.post,
            environment.apiApp + environment.apiAccount.refreshToken, formURL, this.apiService.getHeaderJSon(false, true), false)
            .pipe(
                mergeMap((data: TDSSafeAny) => {
                    return that.setCacheToken(data);
                })
            )

    }
    //Thực thi get token vào cache theo function đã được định nghĩa trong authen.service.xxxx.ts
    getCacheToken(): Observable<TDSSafeAny> {
        return this.cacheService.getItem(this.__keyBearerToken)
            .pipe(map((ops: TDSSafeAny) => {
                let token: TTokenDTO | null = null;
                if (TDSHelperObject.hasValue(ops)) {
                    token = JSON.parse(ops.value).value;
                }
                this.setAccessToken(token);
                this.updateIsLogin((TDSHelperObject.hasValue(token) &&
                    TDSHelperString.hasValueString(token?.access_token)));
                return token
            }));


    }
    //Thực thi set token vào cache theo function đã được định nghĩa trong authen.service.xxxx.ts
    setCacheToken(token: TTokenDTO): Observable<TDSSafeAny> {
        return new Observable(obs => {
            this.cacheService.setItem(this.__keyBearerToken, token);
            obs.next(token);
            obs.complete();
        });
    }
    //Thực thi xóa cache token và toàn bộ dữ liệu
    clearToken(logString: string = "auth clearToken"): void {
        this.cacheService.clear().subscribe(f => {
            this.updateIsLogin(false);
            this.setAccessToken(null);
            this.authenObs.next(false);
        });
    }

    //Thực thi add authen token
    addAuthenticationToken(req: HttpRequest<TDSSafeAny>): HttpRequest<TDSSafeAny> {

        let accessToken = this.getAccessToken();
        if (TDSHelperObject.hasValue(this._isLogin)
            && TDSHelperObject.hasValue(accessToken)
            && TDSHelperString.hasValueString(accessToken?.access_token)
        ) {
            req = req.clone({
                setHeaders:
                {
                    Authorization: "Bearer " + accessToken.access_token,
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

    redirectLogin(urlLogin: string = environment.urlLogin) {
      setTimeout(() => {
         this.router.navigateByUrl(urlLogin);
      }, 500);
    };
    getAuthenIsLogin() {
        return this.authenObs.asObservable();
    }
    getAccessToken() {
        return this._accessToken;
    }
    isLogin() {
        return this._isLogin;
    }
    private updateIsLogin(isLogin: boolean) {
        this._isLogin = isLogin;
        this.authenObs.next(isLogin);
    }
    private setAccessToken(token: TDSSafeAny) {
        this._accessToken = token;
    }
}
