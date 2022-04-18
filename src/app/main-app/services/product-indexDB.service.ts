import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { TAPIDTO, TApiMethodType, TCommonService } from "src/app/lib";
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
  _keyCacheLastVersionDB: string = "product_latest_version";

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

}
