import { number } from 'echarts';
import { Injectable, OnDestroy } from "@angular/core";
import { Observable, Subject, ReplaySubject } from "rxjs";
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
    cacheCount: 0,
    cacheVersion: -1,
    cacheDbStorage: []
  }

  private destroy$ = new Subject<void>();
  private readonly _cacheObject$ = new Subject<KeyCacheIndexDBDTO>()

  constructor(private apiService: TCommonService,
    private cacheApi: THelperCacheService) {
    super(apiService);
  }

  removeCacheDBRequest(){
    this.cacheApi.removeItem(this._keyCacheProductIndexDB);
  }

  getCacheDBRequest(): Observable<any> {
    return this._cacheObject$.asObservable();
  }

  setCacheDBRequest() {
    let keyCache = this._keyCacheProductIndexDB;
    this.cacheApi.getItem(keyCache).pipe(map((x: any) => {
          this.cacheObject = {
              cacheCount: 0,
              cacheVersion: -1,
              cacheDbStorage: []
          };

          if(TDSHelperString.hasValueString(x)) {
              let cache = JSON.parse(x['value']) as TDSSafeAny;
              let cacheDB = JSON.parse(cache['value']) as KeyCacheIndexDBDTO;
              this.cacheObject = Object.assign(this.cacheObject, cacheDB);
          }

          return this.cacheObject;
      }),
      mergeMap((x: KeyCacheIndexDBDTO) => {
          return this.getLastVersionV2(x.cacheCount, x.cacheVersion).pipe(map(a => a));
      }))
      .subscribe({
          next: (res: ProductPouchDBDTO) => {
              const data = this.cacheObject;

              if (res && res.IsDelete === true) {
                  data.cacheDbStorage = [];
              }

              let exist = (data.cacheCount == 0 && data.cacheVersion == -1);
              if (exist) {
                  data.cacheDbStorage = [];
                  data.cacheDbStorage = [...res.Datas];
              } else {
                  res.Datas?.map((x: DataPouchDBDTO) => {
                      let index = data.cacheDbStorage?.findIndex(y => y.Id == x.Id && y.UOMId == x.UOMId);
                      if(Number(index) >= 0){
                          data.cacheDbStorage[index] = {...x};
                      } else {
                          data.cacheDbStorage = [...[x], ...data.cacheDbStorage];
                      }
                  })
              }

              data.cacheDbStorage = [...data.cacheDbStorage];
              data.cacheDbStorage = data.cacheDbStorage?.sort((a: any,b: any) => b.Version - a.Version);

              //TODO: check số version
              let versions = data.cacheDbStorage?.map((x: DataPouchDBDTO) => x.Version);
              let lastVersion = Number(Math.max(...versions)) ;

              //TODO: check số lượng
              let countDB = Number(data.cacheDbStorage.length);

              //TODO: lưu cache cho ds sản phẩm
              const items: KeyCacheIndexDBDTO = {
                  cacheCount: countDB,
                  cacheVersion: lastVersion,
                  cacheDbStorage: data.cacheDbStorage
              };

              let keyCache = this._keyCacheProductIndexDB;
              this.cacheApi.setItem(keyCache, JSON.stringify(items));
              this._cacheObject$.next(items);
          },
          error: (error: any) => {
              console.log(error);
          }
      }
    )
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
