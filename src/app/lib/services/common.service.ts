import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { TAPICacheDTO, TAPIDTO, TIDictionary } from '../dto';
import { THelperCacheService } from '../utility';
import { TApiMethodType } from '../enum';
import { TDSHelperObject, TDSSafeAny } from 'tmt-tang-ui';


@Injectable({
    providedIn: 'root'
})

export class TCommonService {
    private _dicData: TIDictionary<Subject<any>> = {};
    private _dicRunning: TIDictionary<Boolean> = {};

    constructor(
        private http: HttpClient,
        private cache: THelperCacheService
    ) { }
    public init(): Observable<boolean> {
        let that = this;
        return new Observable<boolean>(o => {
            this.cache.init().subscribe((s:TDSSafeAny )=> {
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
        pmethod: TApiMethodType,
        URL: string,
        data: unknown,
        headers?: HttpHeaders,
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
            reportProgress?: boolean,
            responseType?: any,
            withCredentials?: boolean
        } = {
            headers: headers,
            withCredentials: withCredent,
            observe: observe,
            responseType: responseType
        };
        let result: Observable<T>;
        switch (pmethod) {
            case TApiMethodType.get:
                options.params = data;
                result = that.http.get<T>(URL, options);
                break;
            case TApiMethodType.post:
                result = this.http.post<T>(URL, data, options)
                break;
            case TApiMethodType.put:
                result = this.http.put<T>(URL, data, options)
                break;
            case TApiMethodType.delete:
                result = this.http.delete<T>(URL, options)
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
    public getData<T>(api: TAPIDTO, param: any): Observable<T> {
        let that = this;
        return that.connect<T>(api.method, api.url, param,that.getHeaderJSon());
    }

    //Tạo mới dữ liệu
    public create<T>(api: TAPIDTO, param: any): Observable<T> {
        let that = this;
        return that.connect<T>(api.method, api.url, param, that.getHeaderJSon());
    }
    //Cập nhật dữ liệu
    public updateData<T>(api: TAPIDTO, param: any): Observable<T> {
        let that = this;
        return that.connect<T>(api.method, api.url, param, that.getHeaderJSon());
    }
    //Xóa dữ liệu
    public deleteData<T>(api: TAPIDTO, param: any): Observable<T> {
        let that = this;
        return that.connect<T>(api.method, api.url, param, that.getHeaderJSon());
    }


    public getExFile<T>(api: TAPIDTO, param: any): Observable<T> {
        let that = this;
        let options = that.getHeaderJSon();

        return that.connect<T>(api.method, api.url, param,options,true,'body','text');
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
    private connectWithAuthFormURL<T>(
        pmethod: TApiMethodType,
        URL: string,
        data: any,
    ): Observable<T> {
        let that = this;
        let strkey: string = JSON.stringify(pmethod) + JSON.stringify(data) + URL;
        let headers = this.getHeaderJSon();
        if (TDSHelperObject.hasValue(that._dicData[strkey])) {

            if (that._dicRunning[strkey]) {
                return that._dicData[strkey];
            } else {
                that.cache.apiGet(strkey).subscribe((obs:TDSSafeAny) => {
                    let flag: Boolean = false;
                    if (obs != null) {
                        let itemCache: TAPICacheDTO = Object.assign(new TAPICacheDTO(), obs);
                        if (itemCache.Expire > (new Date()).getTime()) {
                            flag = true;
                            that._dicData[strkey].next(itemCache.Data);
                            that._dicData[strkey].complete();
                            that._dicData[strkey] = new Subject<T>();
                        }
                    }
                    if (flag == false && that._dicRunning[strkey] == false) {
                        that._dicRunning[strkey] = true;
                        that.connect<T>(pmethod, URL, data, headers).subscribe(res => {
                            that._dicData[strkey].next(res);
                            that._dicRunning[strkey] = false;
                            that._dicData[strkey].complete();
                            that._dicData[strkey] = new Subject<T>();
                            let item: TAPICacheDTO = new TAPICacheDTO();
                            if (item.build(res) == true) {
                                that.cache.apiSet(strkey, item).subscribe(() => { });
                            }
                        },
                            f => {
                                that._dicData[strkey].error(f);
                                that._dicRunning[strkey] = false;
                                that._dicData[strkey].complete();
                                that._dicData[strkey] = new Subject<T>();
                            });
                    }
                }
                );
                return that._dicData[strkey];
            }
        } else {
            that._dicData[strkey] = new Subject<T>();
            that._dicRunning[strkey] = true;
            that.connect<T>(pmethod, URL, data, headers).subscribe(
                res => {
                    that._dicData[strkey].next(res);
                    that._dicRunning[strkey] = false;
                    that._dicData[strkey].complete();
                    that._dicData[strkey] = new Subject<T>();
                    let item: TAPICacheDTO = new TAPICacheDTO();
                    if (item.build(res) == true) {
                        that.cache.apiSet(strkey, item).subscribe(() => { });
                    }
                },
                f => {
                    that._dicData[strkey].error(f);
                    that._dicRunning[strkey] = false;
                    that._dicData[strkey].complete();
                    that._dicData[strkey] = new Subject<T>();
                }
            );
            return that._dicData[strkey];
        }
    }
}
