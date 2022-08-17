import { Detail_QuickSaleOnlineOrder } from '@app/dto/saleonlineorder/quick-saleonline-order.dto';
import { ODataProductDTO } from 'src/app/main-app/dto/configs/product/config-odata-product.dto';
import { Injectable } from "@angular/core";
import { mergeMap, Observable } from "rxjs";
import { CoreAPIDTO, CoreApiMethodType, TCommonService, THelperCacheService } from "src/app/lib";
import { BaseSevice } from "./base.service";
import { TDSSafeAny } from 'tds-ui/shared/utility';


@Injectable({
  providedIn: 'root'
})
export class ProductTemplateUOMLineService extends BaseSevice {

  prefix: string = "odata";
  table: string = "ProductTemplateUOMLine";
  baseRestApi: string = "";

  private readonly _keyCacheDefaultProduct = '_keycache_default_product';

  constructor(private apiService: TCommonService,
    private cacheApi: THelperCacheService) {
    super(apiService)
  }

  getDefaultProduct(){
    return this.cacheApi.getItem(this._keyCacheDefaultProduct).pipe(mergeMap((res)=>{
      return new Observable<Detail_QuickSaleOnlineOrder>(obs => {
        let cache = JSON.parse(res['value']);
        
        obs.next(JSON.parse(cache['value']));
        obs.complete();
      })
    }));
  }

  setDefaultProduct(product: Detail_QuickSaleOnlineOrder){
    this.cacheApi.setItem(this._keyCacheDefaultProduct, JSON.stringify(product));
  }

  removeApiCache(){
    this.cacheApi.removeItem(this._keyCacheDefaultProduct);
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
