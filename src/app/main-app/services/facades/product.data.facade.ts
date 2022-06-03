
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { THelperCacheService } from 'src/app/lib';
import { TDSHelperArray, TDSHelperString, TDSSafeAny, TDSHelperObject } from 'tmt-tang-ui';
import { DataPouchDBDTO, KeyCacheIndexDBDTO, ProductPouchDBDTO } from '../../dto/product-pouchDB/product-pouchDB.dto';
import { ProductTemplateV2DTO } from '../../dto/producttemplate/product-tempalte.dto';
import { ProductIndexDBService } from '../product-indexDB.service';

@Injectable()
export class ProductDataFacade {

  indexDbVersion: number = 0;
  indexDbProductCount: number = -1;
  productTmplItems!: ProductTemplateV2DTO;

  isLoading: boolean = true;
  errorMessage: TDSSafeAny;

  constructor(
    private cacheApi: THelperCacheService,
    private productIndexDBService: ProductIndexDBService) {
    this.initialize();
  }

  initialize() {
    let keyCache = this.productIndexDBService._keyCacheProductIndexDB;
    this.cacheApi.getItem(keyCache).subscribe((obs: TDSSafeAny) => {

      let dbStorage: DataPouchDBDTO[] = [];

      if(TDSHelperString.hasValueString(obs)) {
          let cache = JSON.parse(obs['value']) as TDSSafeAny;
          let cacheDB = JSON.parse(cache['value']) as KeyCacheIndexDBDTO;

          this.indexDbVersion = cacheDB.cacheVersion;
          this.indexDbProductCount = cacheDB.cacheCount;
          dbStorage = cacheDB.cacheDbStorage;
      }

      this.loadProductIndexDB(this.indexDbProductCount, this.indexDbVersion, dbStorage);
    });
  }

  getProduct(innerText: string, lstPriceLists: TDSSafeAny): Observable<DataPouchDBDTO[]> {
    return new Observable(observer => {
      if(this.isLoading || TDSHelperObject.hasValue(this.errorMessage)) {
        let resultError = this.isLoading ? 'Thông tin sản phẩm đang cập nhật. Đợi 1 lát' : this.errorMessage;
        observer.error(resultError);
        observer.complete();
      }
      else {
        this.get().subscribe(res => {
          let result = this.handlerFilter(innerText, lstPriceLists, res);
          observer.next(result);
          observer.complete();
        });
      }
    });
  }

  get(): Observable<DataPouchDBDTO[]> {
    let keyCache = this.productIndexDBService._keyCacheProductIndexDB;
    return this.cacheApi.getItem(keyCache).pipe(map((obs: TDSSafeAny) => {
      let dbStorage: DataPouchDBDTO[] = [];

      if(TDSHelperString.hasValueString(obs)) {
          let cache = JSON.parse(obs['value']) as TDSSafeAny;
          let cacheDB = JSON.parse(cache['value']) as KeyCacheIndexDBDTO;

          dbStorage = cacheDB.cacheDbStorage;
      }

      return dbStorage;
    }));
  }

  handlerFilter(innerText: string, lstPriceLists: TDSSafeAny ,data: DataPouchDBDTO[]): DataPouchDBDTO[] {
    if(TDSHelperString.hasValueString(innerText)) {
      let text = TDSHelperString.stripSpecialChars(innerText.trim());

      data = data.filter((x: DataPouchDBDTO) =>
        (x.DefaultCode && TDSHelperString.stripSpecialChars(x.DefaultCode.toLowerCase()).indexOf(TDSHelperString.stripSpecialChars(text.toLowerCase())) !== -1) ||
        (x.Barcode && TDSHelperString.stripSpecialChars(x.Barcode.toLowerCase()).indexOf(TDSHelperString.stripSpecialChars(text.toLowerCase())) !== -1) ||
        (x.NameNoSign && TDSHelperString.stripSpecialChars(x.NameNoSign.toLowerCase()).indexOf(TDSHelperString.stripSpecialChars(text.toLowerCase())) !== -1) ||
        (x.NameGet && TDSHelperString.stripSpecialChars(x.NameGet.toLowerCase()).indexOf(TDSHelperString.stripSpecialChars(text.toLowerCase())) !== -1));
    }

    if(TDSHelperObject.hasValue(lstPriceLists)) {
      data.forEach((x: DataPouchDBDTO) => {
        if(x.SaleOK && ! x.IsDiscount) {
            let price = lstPriceLists[`${x.ProductTmplId}_${x.UOMId}`];
            if (price) {
              if (!x.OldPrice) {
                  x.OldPrice = x.Price;
              }
              x.Price = price;
            } else {
              if (x.OldPrice >= 0) {
                  x.Price = x.OldPrice;
              }
            }
        }
      });
    }

    return data;
  }

  loadProductIndexDB(productCount: number, version: number, dbStorage: DataPouchDBDTO[]): any {
    this.isLoading = true;
    this.productIndexDBService.getLastVersionV2(productCount, version)
      .subscribe((data: ProductPouchDBDTO) => {

        if(TDSHelperArray.hasListValue(data.Datas)) {
          if(productCount == -1 && version == 0) {
              dbStorage.length = 0;
              dbStorage = data.Datas;
          } else {
            data.Datas.forEach((x: DataPouchDBDTO) => {
              let existIndex = dbStorage.findIndex(dbProduct => dbProduct.Id == x.Id);
              if(existIndex > -1) {
                dbStorage.splice(existIndex, 1);
              }
              dbStorage.push(x);
            });
          }
        }

        //TODO: check số version
        let versions = dbStorage.map((x: DataPouchDBDTO) => x.Version);
        let lastVersion = Math.max(...versions);

        //TODO: check số lượng
        let count = dbStorage.length;

        if(lastVersion != this.indexDbVersion || count != this.indexDbProductCount) {
            this.indexDbVersion = lastVersion;
            this.indexDbProductCount = count;
        }

        this.mappingCacheDB(dbStorage);
        this.isLoading = false;

    }, error => {
        this.isLoading = false;
        this.errorMessage = error;
    });
  }

  mappingCacheDB(dbStorage: DataPouchDBDTO[]) {
    //TODO: lưu cache cho ds sản phẩm
    let objCached: KeyCacheIndexDBDTO = {
        cacheCount: this.indexDbProductCount,
        cacheVersion: this.indexDbVersion,
        cacheDbStorage: dbStorage
    };

    let keyCache = this.productIndexDBService._keyCacheProductIndexDB;
    this.cacheApi.setItem(keyCache, JSON.stringify(objCached));
  }

}
