import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { TAPICacheDTO, CoreAPIDTO, TIDictionary } from '../dto';
import { THelperCacheService } from '../utility';
import { CoreApiMethodType } from '../enum';
import { TDSHelperObject, TDSSafeAny } from 'tds-ui/shared/utility';

@Injectable({
    providedIn: 'root'
})

export class TCommonService {
    private _dicData: TIDictionary<Subject<any>>  = {};
    private _dicRunning: TIDictionary<Boolean> = {};

    constructor( private http: HttpClient,
        private cache: THelperCacheService ) {
    }

    public init(): Observable<boolean> {
        let that = this;

        return new Observable<boolean>(o => {
            this.cache.init().subscribe((s: TDSSafeAny) => {
                let keys: Array<string> = this.cache.apiGetKeys();

                keys.forEach(val => {
                    that._dicData[val] = new Subject<any>();
                    that._dicRunning[val] = false;
                });

                o.next(s);
                o.complete();
            });
        });
    }

    //Kết nối server lấy dữ liệu
    public connect<T>(
        pmethod: CoreApiMethodType,
        URL: string,
        data: unknown,
        headers?: HttpHeaders,
        body: TDSSafeAny = null,
        withCredent: boolean = false,
        observe: any = 'body',
        responseType: any = 'json'
    ): Observable<T> {
        let that = this;

        if (!TDSHelperObject.hasValue(headers))
            headers = that.getHeaderJSon();

        let options: {
            headers?: HttpHeaders,
            observe?: any,
            params?: any,
            body?: TDSSafeAny,
            reportProgress?: boolean,
            responseType?: any,
            withCredentials?: boolean
        } = {
            headers: headers,
            withCredentials: withCredent,
            observe: observe,
            responseType: responseType,
            body: body
        };

        let result: Observable<T>;
        switch (pmethod) {
            case CoreApiMethodType.get:
                options.params = data;
                result = that.http.get<T>(URL, options);
                break;
            case CoreApiMethodType.post:
                options.params = null;
                result = this.http.post<T>(URL, data, options)
                break;
            case CoreApiMethodType.put:
                result = this.http.put<T>(URL, data, options)
                break;
            case CoreApiMethodType.delete:
                options.params = data;
                options.body = body;
                result = this.http.delete<T>(URL, options)
                break;
            case CoreApiMethodType.patch:
                options.body = body;
                result = this.http.patch<T>(URL, data, options)
                break;
            default:
                result = this.http.post<T>(URL, JSON.stringify(data), options)
                break;
        }
        return result;
    }

    //Reset lại toàn bộ dữ liệu Data và các key đang running
    public resetData() {
        let that = this;

        that._dicData = {};
        that._dicRunning = {};
    }

    //Lấy dữ liệu
    public getData<T>(api: CoreAPIDTO, param: any): Observable<T> {
        let that = this;
        return that.connect<T>(api.method, api.url, param, that.getHeaderJSon());
    }

    //Tạo mới dữ liệu
    public create<T>(api: CoreAPIDTO, param: any): Observable<T> {
        let that = this;
        return that.connect<T>(api.method, api.url, param, that.getHeaderJSon());
    }

    //Cập nhật dữ liệu
    public updateData<T>(api: CoreAPIDTO, param: any): Observable<T> {
        let that = this;
        return that.connect<T>(api.method, api.url, param, that.getHeaderJSon());
    }

    //Xóa dữ liệu
    public deleteData<T>(api: CoreAPIDTO, param: any, body: TDSSafeAny = null): Observable<T> {
        let that = this;
        return that.connect<T>(api.method, api.url, param, that.getHeaderJSon(), body);
    }

    public getExFile<T>(api: CoreAPIDTO, param: any): Observable<T> {
        let that = this;
        let options = that.getHeaderJSon();

        return that.connect<T>(api.method, api.url, param, options, null, true, 'body', 'text');
    }

    public getFileUpload<T>(api: CoreAPIDTO, param: any): Observable<T> {
        let that = this;
        let options = new HttpHeaders({ 'Access-Control-Allow-Origin': '*' });

        return that.connect<T>(api.method, api.url, param, options);
    }

    public getCacheData<T>(api: CoreAPIDTO, param: any, strKey: string | undefined = undefined): Observable<T> {
        let that = this;
        return that.connectWithCache<T>(api.method, api.url, param, strKey);
    }
    //Thực thi redirect trang login
    // public redirectLogin(urlLogin: string): void {
    //     if (TDSHelperObject.hasValue(TCoreFunction.redirectLogin)) {
    //         return TCoreFunction.redirectLogin(urlLogin);
    //     } else {
    //         throw "Redirect Login no implement";
    //     }
    // }
    //Thực thi lấy header

    getHeaderJSon(isAuthorize: boolean = true, istoken: boolean = false): HttpHeaders {

        if (isAuthorize) {
            return new HttpHeaders({
                'Data-type': 'json',
                'Content-type': 'application/json;charset=utf-8',
                'Accept-Language': 'vi',
                'Access-Control-Allow-Origin': '*',
            })
        } else {
            return istoken ? new HttpHeaders({
                'Content-type': 'application/x-www-form-urlencoded',
                'Accept-Language': 'vi',
                'Access-Control-Allow-Origin': '*'
            }) : new HttpHeaders({
                'Data-type': 'json',
                'Content-type': 'application/json;charset=utf-8',
                'Accept-Language': 'vi',
                'Access-Control-Allow-Origin': '*',
            });
        }
    }

    //lấy dữ liệu trên cache/server với việc truyền vào form để xác nhận phân quyền
    private connectWithCache<T>(
        pmethod: CoreApiMethodType,
        URL: string,
        data: any,
        keyCache: string | undefined = undefined,
    ): Observable<T> {
        let that = this;
        let strkey: string = keyCache || (pmethod.toString() + JSON.stringify(data) + URL);
        // let
        let headers = this.getHeaderJSon();
        if (TDSHelperObject.hasValue(that._dicData[strkey])) {

            if (that._dicRunning[strkey]) {
                return that._dicData[strkey] as Observable<T>;
            } else {
                that.cache.apiGet(strkey).subscribe((obs: TDSSafeAny) => {
                    let flag: Boolean = false;

                    if (obs != null) {
                        let itemCache: TAPICacheDTO = Object.assign(new TAPICacheDTO(), obs);
                        if (!itemCache.checkExpire()) {
                            flag = true;
                            that._dicData[strkey]?.next(itemCache.Data);
                            that._dicData[strkey]?.complete();
                            that._dicData[strkey] = new Subject<T>();
                        }
                    }
                    if (flag == false && that._dicRunning[strkey] == false) {

                        that._dicRunning[strkey] = true;
                        that.connect<T>(pmethod, URL, data, headers).subscribe(res => {
                            that._dicData[strkey]?.next(res);
                            that._dicRunning[strkey] = false;
                            that._dicData[strkey]?.complete();
                            that._dicData[strkey] = new Subject<T>();
                            let item: TAPICacheDTO = new TAPICacheDTO();
                            if (item.build(res) == true) {
                                that.cache.apiSet(strkey, item).subscribe(() => { });
                            }
                        },
                            f => {
                                that._dicData[strkey]?.error(f);
                                that._dicRunning[strkey] = false;
                                that._dicData[strkey]?.complete();
                                that._dicData[strkey] = new Subject<T>();
                            });
                    }
                }
                );
                return that._dicData[strkey] as Observable<T>;
            }
        } else {
            that._dicData[strkey] = new Subject<T>();
            that._dicRunning[strkey] = true;
            that.connect<T>(pmethod, URL, data, headers).subscribe(
                res => {
                    that._dicData[strkey]?.next(res);
                    that._dicRunning[strkey] = false;
                    that._dicData[strkey]?.complete();
                    that._dicData[strkey] = new Subject<T>();
                    let item: TAPICacheDTO = new TAPICacheDTO();
                    if (item.build(res) == true) {
                        that.cache.apiSet(strkey, item).subscribe(() => { });
                    }
                },
                f => {
                    that._dicData[strkey]?.error(f);
                    that._dicRunning[strkey] = false;
                    that._dicData[strkey]?.complete();
                    that._dicData[strkey] = new Subject<T>();
                }
            );
            return that._dicData[strkey] as Observable<T>;
        }
    }

    removeCacheAPI(strKey:string){
        if(this._dicData[strKey])
        {
            this._dicData[strKey] = null;
            this.cache.apiRemove(strKey);
        }
    }
}
