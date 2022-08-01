import { HttpParams, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, pipe, Subject, tap, throwError } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { TDSHelperObject, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { TTokenDTO, UserInitDTO } from '../dto';
import { CoreApiMethodType } from '../enum';
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

    private readonly _userInitObs = new BehaviorSubject<UserInitDTO | undefined>(undefined);
    private readonly _roleObs = new BehaviorSubject<Array<string>>([]);

    constructor(private router: Router,
        @Inject('BASE_API') private _BASE_URL: string,
        private apiService: TCommonService,
        private cacheService: THelperCacheService) {
    }

    //Thực thi việc đăng nhập và lấy token
    signInPassword(username: string, password: string): Observable<TDSSafeAny> {debugger

        let that = this;
        let data = new URLSearchParams();

        data.set("client_id", "tmtWebApp");
        data.set("grant_type", "password");
        data.set("username", username);
        data.set("password", password);
        data.set("scope", "profile");

        return that.apiService.connect<TTokenDTO>(CoreApiMethodType.post, `${this._BASE_URL}` + environment.apiAccount.signInPassword, data,
            this.apiService.getHeaderJSon(false, false), false)
            .pipe(
                this.afterRequestToken()
            );

    }

    //Thực thi việc lấy thông tin userInit
    getUserInit(): Observable<UserInitDTO | undefined> {
        let that = this;
        return that.apiService.connect(CoreApiMethodType.get, `${this._BASE_URL}` + environment.apiAccount.userInit, null,
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

        return that.apiService.connect(CoreApiMethodType.post,
           `${this._BASE_URL}` + environment.apiAccount.refreshToken, formURL, this.apiService.getHeaderJSon(false, true), false)
            .pipe(
                tap((data: TDSSafeAny) => {
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
    setCacheToken(token: TTokenDTO) {
        // return new Observable(obs => {
        //     this.cacheService.setItem(this.__keyBearerToken, token);
        //     obs.next(token);
        //     obs.complete();
        // });

        this.cacheService.setItem(this.__keyBearerToken, token);
    }

    //Thực thi xóa cache token và toàn bộ dữ liệu
    clearToken(logString: string = "auth clearToken"): void {
        this.cacheService.clear().subscribe(f => {
            this.updateIsLogin(false);
            this.setAccessToken(null);
            this.authenObs.next(false);

            this._userInitObs.next(undefined);
            this._roleObs.next([]);
            this.cacheService.clear().subscribe();
        });
    }

    //Thực thi add authen token
    addAuthenticationToken(req: HttpRequest<TDSSafeAny>): HttpRequest<TDSSafeAny> {

        let accessToken = this.getAccessToken();

        if (TDSHelperObject.hasValue(this._isLogin)
            && TDSHelperObject.hasValue(accessToken)
            && TDSHelperString.hasValueString(accessToken?.access_token)) {

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

    getObsUserInit() {
        return this._userInitObs.asObservable();
    }

    afterRequestToken = () => pipe(
        tap<TTokenDTO>((token: TTokenDTO) => {

            this.apiService.resetData();

            this.setCacheToken(token);
            this.setAccessToken(token);

            this.updateIsLogin((TDSHelperObject.hasValue(token) && TDSHelperString.hasValueString(token.access_token)));
        }),
        catchError((err) => {
            this.clearToken();
            return throwError(() => err)
        })
    );

    private updateIsLogin(isLogin: boolean) {
        this._isLogin = isLogin;
        this.authenObs.next(isLogin);
    }

    private setAccessToken(token: TDSSafeAny) {
        this._accessToken = token;
    }
}
