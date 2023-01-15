import { Injectable } from "@angular/core";
import { CoreAPIDTO } from "@core/dto";
import { CoreApiMethodType } from "@core/enum";
import { TCommonService } from "@core/services";
import { Observable } from "rxjs";
import { TDSHelperString, TDSSafeAny } from "tds-ui/shared/utility";
import { BaseSevice } from "../base.service";

@Injectable({
    providedIn: 'root'
})

export class ProductShopCartServiceV2 extends BaseSevice {

    prefix: string = "";
    table: string = "shopcart";
    baseRestApi: string = "rest/v1.0";

    constructor(private apiService: TCommonService) {
        super(apiService)
    }

    initShopCart(): Observable<TDSSafeAny> {
        const api: CoreAPIDTO = {
          url: `${this._BASE_URL}/${this.baseRestApi}/crmteam/initshopcart`,
          method: CoreApiMethodType.post,
        }
    
        return this.apiService.getData<any>(api, null);
    }

    getProductTemplateOnShopCart(queryObj: any): Observable<TDSSafeAny> {
        let queryString = null;
            if (queryObj) {
                queryString = Object.keys(queryObj).map(key => {
                    return key + '=' + queryObj[key]
                }).join('&');
            }

        let url = `${this._BASE_URL}/${this.baseRestApi}/${this.table}/getproductteamplateonshopcart`

        if (TDSHelperString.hasValueString(queryString)) {
            url = `${url}?${queryString}`;
        }
        
        const api: CoreAPIDTO = {
          url: url,
          method: CoreApiMethodType.get
        }
        return this.apiService.getData<TDSSafeAny>(api, null);
    }

    addProductTemplateOnShopCart(data: any): Observable<TDSSafeAny> {
        const api: CoreAPIDTO = {
          url: `${this._BASE_URL}/${this.baseRestApi}/${this.table}/addproductteamplateonshopcart`,
          method: CoreApiMethodType.post
        }
        return this.apiService.getData<TDSSafeAny>(api, data);
    }

    deleteProductTemplateOnShopCart(data: any): Observable<TDSSafeAny> {
        const api: CoreAPIDTO = {
          url: `${this._BASE_URL}/${this.baseRestApi}/${this.table}/deleteproducttemplateonshopcart`,
          method: CoreApiMethodType.post
        }
        return this.apiService.getData<TDSSafeAny>(api, data);
    }

    getVariantByProductTemplateId(): Observable<TDSSafeAny> {
        const api: CoreAPIDTO = {
          url: `${this._BASE_URL}/${this.baseRestApi}/${this.table}/getvariantbyproducttemplateid`,
          method: CoreApiMethodType.get
        }
        return this.apiService.getData<TDSSafeAny>(api, null);
    }

    addProductOnShopCart(data: any): Observable<TDSSafeAny> {
        const api: CoreAPIDTO = {
          url: `${this._BASE_URL}/${this.baseRestApi}/${this.table}/addproductonshopcart`,
          method: CoreApiMethodType.post
        }
        return this.apiService.getData<TDSSafeAny>(api, data);
    }

    deleteProductOnShopCart(data: any): Observable<TDSSafeAny> {
        const api: CoreAPIDTO = {
          url: `${this._BASE_URL}/${this.baseRestApi}/${this.table}/deleteproductonshopcart`,
          method: CoreApiMethodType.post
        }
        return this.apiService.getData<TDSSafeAny>(api, data);
    }

    updateQuantityProductOnShopCart(data: any): Observable<TDSSafeAny> {
        const api: CoreAPIDTO = {
          url: `${this._BASE_URL}/${this.baseRestApi}/${this.table}/updatequantityproductonshopcart`,
          method: CoreApiMethodType.post
        }
        return this.apiService.getData<TDSSafeAny>(api, data);
    }
    
}
