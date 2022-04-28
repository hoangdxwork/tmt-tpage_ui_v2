import { ProductDTO } from './../dto/product/product.dto';
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { TAPIDTO, TApiMethodType, TCommonService } from "src/app/lib";
import { TDSSafeAny } from "tmt-tang-ui";
import { BaseSevice } from "./base.service";

@Injectable({
  providedIn: 'root'
})

export class ProductService extends BaseSevice {

  prefix: string = "odata";
  table: string = "Product";
  baseRestApi: string = "rest/v1.0/product";

  constructor(private apiService: TCommonService) {
    super(apiService)
  }

  getById(key: number): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}(${key})?$expand=UOM,Categ,UOMPO,POSCateg,Images`,
        method: TApiMethodType.get,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  getInventoryWarehouseId(warehouseId: number): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.baseRestApi}/getinventory?WarehouseId=${warehouseId}`,
        method: TApiMethodType.get,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  checkExitProductOnPageFB(data: any): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.CheckExitProductOnPageFacebook`,
        method: TApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  getImagesSentPageFacebook(variant_teamId: any): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.baseRestApi}/${variant_teamId}/getimagessentpagefacebook`,
        method: TApiMethodType.get,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  deleteImagePageFacebook(key: any): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.baseRestApi}/${key}/deleteimagepagefacebook`,
        method: TApiMethodType.delete,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  addProductToFacebookPage(data: any): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.AddProductOnFacebookPage`,
        method: TApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  getProductCategory(): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/odata/ProductCategory?$orderby=ParentLeft&%24format=json&%24filter=contains(tolower(CompleteName)%2C%27%27)&%24count=true`,
        method: TApiMethodType.get,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  getProductAttributeValue(): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/odata/ProductAttributeValue?$format=json&$count=true`,
        method: TApiMethodType.get,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  getSetActive(data: string): Observable<any> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.SetActive`,
      method: TApiMethodType.post,
    }
    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  insertProduct(data: string): Observable<any>{
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}`,
      method: TApiMethodType.post,
    }
    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  updateProduct(key: any,data: string): Observable<any>{
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}(${key})`,
      method: TApiMethodType.put,
    }
    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  getDefault(): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.DefaultGet?$expand=UOM,Categ,UOMPO`,
      method: TApiMethodType.get,
    }

    return this.apiService.getData<ProductDTO>(api, null);
  }

  delete_product(key: any): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}(${key})`,
      method: TApiMethodType.delete,
    }

    return this.apiService.getData<ProductDTO>(api, null);
  }
}
