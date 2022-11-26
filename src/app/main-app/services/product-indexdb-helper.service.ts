import { Injectable, OnDestroy } from "@angular/core";
import { Observable, Subject, ReplaySubject, takeUntil } from "rxjs";
import { CoreAPIDTO, CoreApiMethodType, TCommonService, THelperCacheService } from "src/app/lib";
import { ProductPouchDBDTO } from "../dto/product-pouchDB/product-pouchDB.dto";
import { BaseSevice } from "./base.service";
import { TDSMessageService } from 'tds-ui/message';

@Injectable({
  providedIn: 'root'
})

export class ProductIndexDBHelperService extends BaseSevice {

  prefix: string = "odata";
  table: string = "ProductTemplateUOMLine";
  baseRestApi: string = "rest/v1.0/product";
  _keyCacheProductIndexDB: string = "_product_UOMLine_V2";

  private destroy$ = new Subject<void>();
  private readonly respsoneDbSubject$ = new Subject<any>();

  private respsoneDb: ProductPouchDBDTO = {
    Id: 0,
    IsDelete: false,
    Datas: [],
    Total: 0
  };

  constructor(private apiService: TCommonService,
    private message: TDSMessageService,
    private cacheApi: THelperCacheService) {
    super(apiService);
  }

  setLastVersionV2(countIndex: number, version: number, skip?: number, top?: number) {
    this.apiLastVersionV2(countIndex, version, skip, top).subscribe({
        next: (res: ProductPouchDBDTO) => {

            if(res && res.Datas && res.Datas.length == 0) {
              this.respsoneDb.IsDelete = res.IsDelete;
              this.respsoneDbSubject$.next(this.respsoneDb);
              return;
            }

            this.respsoneDb.Id = res.Id;
            this.respsoneDb.IsDelete = res.IsDelete;
            this.respsoneDb.Datas = [...(this.respsoneDb.Datas || []), ...(res.Datas || [])];
            this.respsoneDb.Total = res.Total;

            if(this.respsoneDb?.Total == this.respsoneDb.Datas?.length && this.respsoneDb?.Total > 0) {
              this.respsoneDbSubject$.next(this.respsoneDb);
              return;
            }

            let exist = this.respsoneDb.Datas?.length > 0 && (this.respsoneDb?.Total > this.respsoneDb.Datas?.length);
            if(exist) {
              skip = (skip || 0) + 1;
              this.setLastVersionV2(countIndex, version, skip, top);
              return;
            }
        },
        error: (err: any) => {
            this.message.error(err?.error?.message);
            this.respsoneDbSubject$.next(this.respsoneDb);
        }
    })
  }

  getLastVersionV2() {
    return this.respsoneDbSubject$.asObservable();
  }

  apiLastVersionV2(countIndex: number, version: number, skip?: number, top?: number): Observable<any> {
    let skipValue = skip || 0;
    let topValue = top || 20000;

    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.GetLastVersionV2?$expand=Datas&countIndexDB=${countIndex}&Version=${version}&$skip=${skipValue * topValue}&$top=${topValue}`,
      method: CoreApiMethodType.get
    }

    return this.apiService.getData<ProductPouchDBDTO>(api, null);
  }

}
