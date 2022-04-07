import { EventEmitter, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { shareReplay } from "rxjs/operators";
import { TAPIDTO, TApiMethodType, TCommonService } from "src/app/lib";
import { TDSSafeAny } from "tmt-tang-ui";
import { ProductPouchDBDTO } from "../dto/product-pouchDB/product-pouchDB.dto";
import { BaseSevice } from "./base.service";

@Injectable({
  providedIn: 'root'
})

export class ProductIndexDBService extends BaseSevice {

  prefix: string = "odata";
  table: string = "ProductTemplateUOMLine";
  baseRestApi: string = "rest/v1.0/product";

  _keyCacheProductIndexDB: string = "_product_UOMLine_V2";
  public productIndexDB$!: Observable<any>;

  constructor(private apiService: TCommonService) {
      super(apiService);
  }

  getLastVersionV2(countIndex: number, version: number): Observable<any> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.GetLastVersionV2?$expand=Datas&countIndexDB=${countIndex}&Version=${version}`,
      method: TApiMethodType.get,
    }

    return this.apiService.getData<ProductPouchDBDTO>(api, null);
  }

  facadeLastVersionV2(countIndex: number, version: number) {
    if(!this.productIndexDB$) {
        this.productIndexDB$ = this.getLastVersionV2(countIndex, version).pipe(shareReplay(1));
    }

    return this.productIndexDB$;
  }

}
