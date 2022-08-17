import { ODataProductDTO } from 'src/app/main-app/dto/configs/product/config-odata-product.dto';
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CoreAPIDTO, CoreApiMethodType, TCommonService } from "src/app/lib";
import { BaseSevice } from "./base.service";
import { TDSSafeAny } from 'tds-ui/shared/utility';


@Injectable({
  providedIn: 'root'
})
export class ProductTemplateUOMLineService extends BaseSevice {

  prefix: string = "odata";
  table: string = "ProductTemplateUOMLine";
  baseRestApi: string = "";

  public readonly _keyCacheDefaultProduct = '_keycache_default_product';

  constructor(private apiService: TCommonService) {
    super(apiService)
  }

  getOUMs(): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/ProductUOM`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  getProductUOMLine(skip: number, top: number, keyword?: string): Observable<any> {
    let filter = ""

    if (keyword) {
      filter = `&$filter=(contains(NameNoSign,'${keyword}')+or+contains(NameGet,'${keyword}')+or+contains(Barcode,'${keyword}'))`;
    }

    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}?$skip=${skip}&$top=${top}&$orderby=Name asc${filter}&$count=true`,
      method: CoreApiMethodType.get,
  }
  return this.apiService.getData<ODataProductDTO>(api, null);
  }
}
