import { ProductDTO } from './../dto/product/product.dto';
import { Injectable } from "@angular/core";
import { Observable, ReplaySubject } from "rxjs";
import { CoreAPIDTO, CoreApiMethodType, TCommonService } from "src/app/lib";
import { BaseSevice } from "./base.service";
import { TDSSafeAny } from 'tds-ui/shared/utility';

@Injectable({
  providedIn: 'root'
})

export class ProductService extends BaseSevice {

  prefix: string = "odata";
  table: string = "Product";
  baseRestApi: string = "rest/v1.0/product";

  lstInventory: any;
  private readonly _inventorySubject$ = new ReplaySubject<any>();

  constructor(private apiService: TCommonService) {
    super(apiService)
  }

  getById(key: number): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}(${key})?$expand=UOM,Categ,UOMPO,POSCateg,Images,AttributeValues`,
        method: CoreApiMethodType.get,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  getInventoryWarehouseId(){
    return this._inventorySubject$.asObservable();
  }

  setInventoryWarehouseId(warehouseId: number) {
    if(this.lstInventory) {
        this._inventorySubject$.next(this.lstInventory);
    } else {
        this.apiInventoryWarehouseId(warehouseId).subscribe({
          next: (res: any) => {
            if(res) {
                this.lstInventory = {...res};
                this._inventorySubject$.next(this.lstInventory);
            }
          }
        })
    }
  }

  apiInventoryWarehouseId(warehouseId: number): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.baseRestApi}/getinventory?WarehouseId=${warehouseId}`,
        method: CoreApiMethodType.get,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  checkExitProductOnPageFB(data: any): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.CheckExitProductOnPageFacebook`,
        method: CoreApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  getImagesSentPageFacebook(variant_teamId: any): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.baseRestApi}/${variant_teamId}/getimagessentpagefacebook`,
        method: CoreApiMethodType.get,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  deleteImagePageFacebook(key: any): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.baseRestApi}/${key}/deleteimagepagefacebook`,
        method: CoreApiMethodType.delete,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  addProductToFacebookPage(data: any): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.AddProductOnFacebookPage`,
        method: CoreApiMethodType.post,
    }
    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  deleteProductToFacebookPage(data: any): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.DeleteListProductOnFacebookPage`,
        method: CoreApiMethodType.post,
    }
    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  getProductAttributeValue(): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/odata/ProductAttributeValue?$format=json&$count=true`,
        method: CoreApiMethodType.get,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  setActive(data: any): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.SetActive`,
      method: CoreApiMethodType.post,
    }
    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  insertProduct(data: any): Observable<any>{
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}`,
      method: CoreApiMethodType.post,
    }
    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  updateProduct(key: any, data: any): Observable<any>{
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}(${key})`,
      method: CoreApiMethodType.put,
    }
    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  getDefault(): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.DefaultGet?$expand=UOM,Categ,UOMPO`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<ProductDTO>(api, null);
  }

  deleteProduct(key: any): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}(${key})`,
      method: CoreApiMethodType.delete,
    }

    return this.apiService.getData<ProductDTO>(api, null);
  }

  getAttributeValuesById(productId: number): Observable<ProductDTO> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}(${productId})?$expand=UOM,Categ,UOMPO,POSCateg,AttributeValues`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<ProductDTO>(api, null);
  }

  getAttributeValuesByIdV2(productId: number): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}(${productId})?$expand=AttributeValues,ProductTmpl`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<any>(api, null);
  }

  getProductsByPageFacebook(key: any, data: any): Observable<any>{
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/rest/v1.0/product/${key}/getproductsbypagefacebook`,
      method: CoreApiMethodType.post,
    }
    return this.apiService.getData<TDSSafeAny>(api, data);
  }
}
