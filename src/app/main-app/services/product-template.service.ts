import { ODataProductInventoryDTO } from './../dto/configs/product/config-odata-product.dto';
import { EventEmitter, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { TAPIDTO, TApiMethodType, TCommonService } from "src/app/lib";
import { TDSSafeAny } from "tmt-tang-ui";
import { PagedList2 } from "../dto/pagedlist2.dto";
import { ProductTemplateDTO } from "../dto/product/product.dto";
import { ProductTemplateV2DTO } from "../dto/producttemplate/product-tempalte.dto";
import { BaseSevice } from "./base.service";


@Injectable({
  providedIn: 'root'
})
export class ProductTemplateService extends BaseSevice {

  prefix: string = "odata";
  table: string = "ProductTemplate";
  baseRestApi: string = "rest/v1.0/product";

  constructor(private apiService: TCommonService) {
    super(apiService)
  }

  getDefault(): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.DefaultGet?$expand=UOM,Categ,UOMPO`,
      method: TApiMethodType.get,
    }

    return this.apiService.getData<ProductTemplateV2DTO>(api, null);
  }

  insert(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}?$expand=UOM`,
      method: TApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  getInventoryProduct(productKey:number,params:string): Observable<TDSSafeAny>{
    const api: TAPIDTO = {
    url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.GetInventoryProduct?productTmplId=${productKey}&${params}&$count=true`,
    method: TApiMethodType.get,
    }

    return this.apiService.getData<ODataProductInventoryDTO>(api, null);
  }
  
  setActive(data: any):Observable<TDSSafeAny>{
    const api: TAPIDTO = {
    url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.SetActive`,
    method: TApiMethodType.post,
    }

    return this.apiService.getData<ODataProductInventoryDTO>(api,data);
  }

  getRemoveIds(data: any):Observable<TDSSafeAny>{
    const api: TAPIDTO = {
    url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.RemoveIds`,
    method: TApiMethodType.post,
    }

    return this.apiService.getData<ODataProductInventoryDTO>(api,data);
  }

  getProductUOM():Observable<TDSSafeAny> {
    const api: TAPIDTO = {
    url: `${this._BASE_URL}/${this.prefix}/ProductUOM?%24format=json&%24count=true`,
    method: TApiMethodType.get,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  getProductCategoryDefault():Observable<TDSSafeAny>{
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/ProductCategory/ODataService.DefaultGet`,
      method: TApiMethodType.get,
      }
  
    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  postProductCategoryDefault(data:TDSSafeAny):Observable<TDSSafeAny>{
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/ProductCategory`,
      method: TApiMethodType.post,
      }
  
    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  getOriginCountry():Observable<any> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/OriginCountry?%24format=json&%24filter=(contains(NameNoSign%2C%27%27)+or+contains(Code%2C%27%27))&%24count=true`,
      method: TApiMethodType.get,
      }
  
    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  geUOMAddType():Observable<any> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/PartnerExt?%24format=json&%24filter=(contains(NameNoSign%2C%27%27)+or+contains(Code%2C%27%27)+or+contains(Phone%2C%27%27))&%24count=true`,
      method: TApiMethodType.get,
      }
  
    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  getPOSCategory(): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/POS_Category?$orderby=Sequence&%24format=json&%24filter=contains(tolower(NameGet)%2C%27%27)&%24count=true`,
        method: TApiMethodType.get,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }
}
