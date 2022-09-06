import { Injectable, OnDestroy } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { map, mergeMap, shareReplay } from "rxjs/operators";
import { CoreAPIDTO, CoreApiMethodType, TCommonService, THelperCacheService } from "src/app/lib";
import { TDSHelperString, TDSSafeAny } from "tds-ui/shared/utility";
import { DataPouchDBDTO, KeyCacheIndexDBDTO, ProductPouchDBDTO } from "../dto/product-pouchDB/product-pouchDB.dto";
import { BaseSevice } from "./base.service";

@Injectable({
  providedIn: 'root'
})

export class ProductIndexDBService extends BaseSevice implements OnDestroy {

  prefix: string = "odata";
  table: string = "ProductTemplateUOMLine";
  baseRestApi: string = "rest/v1.0/product";

  _keyCacheProductIndexDB: string = "_product_UOMLine_V2";
  cacheObject: KeyCacheIndexDBDTO = {
    cacheCount: -1,
    cacheVersion: 0,
    cacheDbStorage: []
  }
  private destroy$ = new Subject<void>();

  constructor(private apiService: TCommonService,
    private cacheApi: THelperCacheService) {
    super(apiService);
  }

  mergeMapCacheDBRequest(): Observable<TDSSafeAny> {
    let keyCache = this._keyCacheProductIndexDB;
    return this.cacheApi.getItem(keyCache).pipe(map((x: any) => {

          if (TDSHelperString.hasValueString(x)) {
              let cache = JSON.parse(x['value']) as TDSSafeAny;
              let cacheDB = JSON.parse(cache['value']) as KeyCacheIndexDBDTO;
              this.cacheObject = Object.assign(this.cacheObject, cacheDB);
          }

          return this.cacheObject;
      }),
      mergeMap((x: KeyCacheIndexDBDTO) => {
          return this.getLastVersionV2(x.cacheCount, x.cacheVersion).pipe(map(a => a));
      }));
  }

  loadProductIndexDBV2(reload?: boolean): Observable<any> {
    return this.mergeMapCacheDBRequest().pipe(map((res: ProductPouchDBDTO) => {

        const data = this.cacheObject;
        if (res.IsDelete === true) {
          (data.cacheDbStorage as any) = [];
        }

        let exist = (data.cacheCount == -1 && data.cacheVersion == 0);
        if (exist) {
            // TODO: trường hợp load lần đầu
            (data.cacheDbStorage as any) = [];
            data.cacheDbStorage = [...res.Datas];

        } else {
            if (!reload) {//TODO: nếu reload = true thì không thêm sp
              // TODO: trường hợp thêm mới hoặc update
              res.Datas?.forEach((x: DataPouchDBDTO) => {
                  data.cacheDbStorage.push(x);
              });
            }
        }

        //TODO: check số version
        let versions = data.cacheDbStorage.map((x: DataPouchDBDTO) => x.Version);
        let lastVersion = Math.max(...versions);

        //TODO: check số lượng
        let countDB = data.cacheDbStorage.length;

        //TODO: lưu cache cho ds sản phẩm
        const items: KeyCacheIndexDBDTO = {
            cacheCount: countDB,
            cacheVersion: lastVersion,
            cacheDbStorage: data.cacheDbStorage
        };

        let keyCache = this._keyCacheProductIndexDB;
        this.cacheApi.setItem(keyCache, JSON.stringify(items));

        return items;

      }, shareReplay({ bufferSize: 1, refCount: true })))
  }

  getLastVersionV2(countIndex: number, version: number): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.GetLastVersionV2?$expand=Datas&countIndexDB=${countIndex}&Version=${version}`,
      method: CoreApiMethodType.get
    }
    return this.apiService.getData<ProductPouchDBDTO>(api, null);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
