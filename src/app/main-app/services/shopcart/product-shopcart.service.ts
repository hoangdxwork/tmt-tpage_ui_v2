import { Injectable } from "@angular/core";
import { TCommonService } from "@core/services";
import { CoreAPIDTO } from "omnichannel/core/dto";
import { CoreApiMethodType } from "omnichannel/core/enum";
import { Observable } from "rxjs";
import { TDSSafeAny } from "tds-ui/shared/utility";
import { BaseSevice } from "../base.service";

@Injectable({
    providedIn: 'root'
})

export class ProductShopCartService extends BaseSevice {

  prefix: string = "";
  table: string = "";
  baseRestApi: string = "";

  constructor(private apiService: TCommonService) {
    super(apiService)
  }

  initShopCart(): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/rest/v1.0/crmteam/initshopcart`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<any>(api, null);
  }

  addProductOnShopCart(data: any): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/odata/Product/OdataService.AddProductOnShopCart`,
      method: CoreApiMethodType.post
    }
    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  deleteProductOnShopCart(data: any): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/odata/Product/OdataService.DeleteProductOnShopCart`,
      method: CoreApiMethodType.delete
    }
    return this.apiService.getData<TDSSafeAny>(api, data);
  }

}
