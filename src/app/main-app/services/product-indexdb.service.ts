import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { CoreAPIDTO, CoreApiMethodType, TCommonService, THelperCacheService } from "src/app/lib";
import { TDSMessageService } from "tds-ui/message";
import { TDSHelperArray, TDSHelperString, TDSSafeAny } from "tds-ui/shared/utility";
import { DataPouchDBDTO, KeyCacheIndexDBDTO, ProductPouchDBDTO, StoragePriceListItemsDto } from "../dto/product-pouchDB/product-pouchDB.dto";
import { BaseSevice } from "./base.service";
import { SocketOnEventService } from "./socket-io/socket-onevent.service";
import { ChatmoniSocketEventName } from "./socket-io/soketio-event";

@Injectable({
  providedIn: 'root'
})

export class ProductIndexDBService extends BaseSevice {

  prefix: string = "odata";
  table: string = "ProductTemplateUOMLine";
  baseRestApi: string = "rest/v1.0/product";

  _keyCacheProductIndexDB: string = "_product_UOMLine_V2";
  _keyCachePriceListItems: string = "_price_List_Items"

  cacheObject: KeyCacheIndexDBDTO = {
    cacheCount: 0,
    cacheVersion: -1,
    cacheDbStorage: []
  }

  private readonly _cacheObject$ = new Subject<KeyCacheIndexDBDTO>();

  constructor(private apiService: TCommonService,
    private message: TDSMessageService,
    private socketOnEventService: SocketOnEventService,
    private cacheApi: THelperCacheService) {
      super(apiService);
      this.onActionSocket();
  }

  onActionSocket() {
    this.socketOnEventService.onActionSocket().subscribe({
      next: (res: any) => {
        if(res && res.Action == ChatmoniSocketEventName.producttemplate_create) {

        }
      }
    })
  }

  removeCacheDBRequest(){
    this.cacheApi.removeItem(this._keyCacheProductIndexDB);
  }

  getCacheDBRequest(): Observable<any> {
    return this._cacheObject$.asObservable();
  }

  setCacheDBRequest() {
    let keyCache = this._keyCacheProductIndexDB;
    this.cacheApi.getItem(keyCache).subscribe({
      next: (x: any) => {
        if (TDSHelperString.hasValueString(x)) {
            let cache = JSON.parse(x['value']) as TDSSafeAny;
            let cacheDB = JSON.parse(cache['value']) as KeyCacheIndexDBDTO;
            this.cacheObject = Object.assign(this.cacheObject, cacheDB);
        } else {
            this.cacheObject = {
                cacheCount: 0,
                cacheVersion: -1,
                cacheDbStorage: []
            };
        }

        this.getLastVersionV2(this.cacheObject.cacheCount, this.cacheObject.cacheVersion).subscribe({
          next: (res: ProductPouchDBDTO) => {

              const data = this.cacheObject;
              if (res.IsDelete === true) {
                  data.cacheDbStorage = [];
              }

              let exist = (data && data.cacheCount == 0 && data.cacheVersion == -1);
              if (exist) {
                  data.cacheDbStorage = [];
                  data.cacheDbStorage = [...res.Datas];
              } else {
                  res.Datas?.map((x: DataPouchDBDTO) => {
                      let index = data.cacheDbStorage?.findIndex(y => y.Id == x.Id && y.UOMId == x.UOMId);
                      if(index >= 0) {
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
              let lastVersion = this.getLastVersion(versions);

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
              this._cacheObject$.next(error);
          }})
      },
      error: (error: any) => {
          this.message.error(error?.error?.message);
      }
    })
  }

  getLastVersion(versions: any[]):number {
    if(versions?.length >= 80000) {

      let lstVersion = versions.splice(0, 80000);
      return Math.max(...lstVersion,...[this.getLastVersion(versions)]);
    } else {
        return Math.max(...versions);
    }
  }

  getLastVersionV2(countIndex: number, version: number): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.GetLastVersionV2?$expand=Datas&countIndexDB=${countIndex}&Version=${version}`,
      method: CoreApiMethodType.get
    }
    return this.apiService.getData<ProductPouchDBDTO>(api, null);
  }

  setStoragePriceListItems(model: StoragePriceListItemsDto): any {
    const _keyCache = this._keyCachePriceListItems;
    sessionStorage.setItem(_keyCache, JSON.stringify(model));
  }

  getStoragePriceListItems(): any {
    const _keyCache = this._keyCachePriceListItems;
    let item = sessionStorage.getItem(_keyCache) as any;

    if(item) {
        return JSON.parse(item);
    } else {
        return null;
    }
  }

  removeStoragePriceListItems() {
    const _keyCache = this._keyCachePriceListItems;
    sessionStorage.removeItem(_keyCache);
  }

}
