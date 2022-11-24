import { Injectable, OnDestroy } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { CoreAPIDTO, CoreApiMethodType, TCommonService, THelperCacheService } from "src/app/lib";
import { ProductPouchDBDTO } from "../dto/product-pouchDB/product-pouchDB.dto";
import { BaseSevice } from "./base.service";

@Injectable({
  providedIn: 'root'
})

export class IndexDBHelperService extends BaseSevice implements OnDestroy {

  prefix: string = "odata";
  table: string = "ProductTemplateUOMLine";
  baseRestApi: string = "rest/v1.0/product";

  cacheData: ProductPouchDBDTO = {
    Id: 0,
    IsDelete: false,
    Datas: [],
    Total: 0,
    LastVersion: 0
  };

  currentSkip: number = 0;
  currentTop: number = 20000;

  private destroy$ = new Subject<void>();
  private readonly _cacheProduct$ = new Subject<ProductPouchDBDTO>();

  constructor(private apiService: TCommonService,
    private cacheApi: THelperCacheService) {
    super(apiService);
  }

  apiLastVersionV2(countIndex: number, version: number, skip?: number, top?: number): Observable<ProductPouchDBDTO> {
    let uri = `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.GetLastVersionV2?$expand=Datas&countIndexDB=${countIndex}&Version=${version}`;
    let exist1 = version == -1 && countIndex == 0;
    let skipValue = Number(skip || 0) * Number(top || 0);

    if (exist1) {
      uri = `${uri}&$skip=0&$top=20000`;
    } else {
      uri = `${uri}&$skip=${skipValue}&$top=${top}`;
    }

    const api: CoreAPIDTO = {
      url: uri,
      method: CoreApiMethodType.get
    }
    return this.apiService.getData<ProductPouchDBDTO>(api, null);
  }

  loadLastVersionV2(countIndex: number, version: number) {
    this.apiLastVersionV2(countIndex, version, this.currentSkip, this.currentTop).subscribe({
      next: (res) => {
        let datas = this.cacheData?.Datas.concat(res.Datas);

        this.cacheData = {
          Id: res.Id,
          IsDelete: res.IsDelete,
          Datas: [...datas]
        }

        // TODO: cập nhật last version
        let lstVersion = res.Datas?.map(x => x.Version) || [];
        let lastVersion = Number(Math.max(...lstVersion));
        this.cacheData.LastVersion = lastVersion > (this.cacheData.LastVersion || 0) ? lastVersion : this.cacheData.LastVersion;

        let exist = Number(res.Total) > Number(this.cacheData.Datas.length) && Number(this.cacheData.Datas.length) > 0;
        if(exist) {
          this.currentSkip += 1;
          this.loadLastVersionV2(res.Total || countIndex, version);
        } else {
            this._cacheProduct$.next(this.cacheData);

            this.currentSkip = 0;
            this.currentTop = 20000;
            this.cacheData = {
                Id: 0,
                IsDelete: false,
                Datas: [],
                Total: 0,
                LastVersion: 0
            };
        }
      }
    })
  }

  getLastVersionV2() {
    return this._cacheProduct$.asObservable();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
