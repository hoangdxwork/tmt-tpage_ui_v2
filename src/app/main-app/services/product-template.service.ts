import { ODataComboProductTemplateDTO } from './../dto/product/product-combo.dto';
import { ODataProductInventoryDTO } from './../dto/configs/product/config-odata-product.dto';
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CoreAPIDTO, CoreApiMethodType, TCommonService } from "src/app/lib";
import { ProductTemplateV2DTO } from "../dto/product-template/product-tempalte.dto";
import { BaseSevice } from "./base.service";
import { TDSSafeAny } from 'tds-ui/shared/utility';


@Injectable({
  providedIn: 'root'
})
export class ProductTemplateService extends BaseSevice {

  prefix: string = "odata";
  table: string = "ProductTemplate";
  baseRestApi: string = "rest/v1.0/product";

  public _keyCacheGrid: string = 'product-page:grid_product:settings';

  constructor(private apiService: TCommonService) {
    super(apiService)
  }

  getDefault(): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.DefaultGet?$expand=UOM,Categ,UOMPO`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<ProductTemplateV2DTO>(api, null);
  }

  getProductTemplateById(key: TDSSafeAny): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}(${key})?$expand=UOM,UOMCateg,Categ,UOMPO,POSCateg,Images,UOMView,Distributor,Importer,Producer,OriginCountry,ProductVariants($expand%3DUOM,Categ,UOMPO,POSCateg,AttributeValues)`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<ProductTemplateV2DTO>(api, null);
  }

  insert(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.InsertV2`,
        method: CoreApiMethodType.post
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  delete(key: number):Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}(${key})`,
      method: CoreApiMethodType.delete,
    }

    return this.apiService.getData<ODataProductInventoryDTO>(api, null);
  }

  getInventoryProduct(key:number,params:string): Observable<TDSSafeAny>{
    const api: CoreAPIDTO = {
    url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.GetInventoryProduct?productTmplId=${key}&${params}&$count=true`,
    method: CoreApiMethodType.get,
    }

    return this.apiService.getData<ODataProductInventoryDTO>(api, null);
  }

  setActive(data: TDSSafeAny):Observable<TDSSafeAny>{
    const api: CoreAPIDTO = {
    url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.SetActive`,
    method: CoreApiMethodType.post,
    }

    return this.apiService.getData<ODataProductInventoryDTO>(api,data);
  }

  getRemoveIds(data: TDSSafeAny):Observable<TDSSafeAny>{
    const api: CoreAPIDTO = {
    url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.RemoveIds`,
    method: CoreApiMethodType.post,
    }

    return this.apiService.getData<ODataProductInventoryDTO>(api,data);
  }

  getProductAttributeValue(): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/odata/ProductAttributeValue?$format=json&$count=true`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  getProductAttributeLine(id:TDSSafeAny): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/odata/ProductTemplate(${id})/AttributeLines?$expand=Attribute,Values`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  getProductVariants(id:TDSSafeAny): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/odata/ProductTemplate(${id})/ODataService.GetVariants?%24format=json&%24top=30&%24count=true`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  getProductUOMLine(id:TDSSafeAny): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/odata/ProductTemplate(${id})/UOMLines?$expand=UOM`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  getComboProducts(id:TDSSafeAny){
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}(${id})/ComboProducts?$expand=Product`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<ODataComboProductTemplateDTO>(api, null);
  }

  getProductUOM():Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
    url: `${this._BASE_URL}/${this.prefix}/ProductUOM?%24format=json&%24count=true`,
    method: CoreApiMethodType.get,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  getProductCategoryDefault():Observable<TDSSafeAny>{
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/ProductCategory/ODataService.DefaultGet`,
      method: CoreApiMethodType.get,
      }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  postProductCategoryDefault(data:TDSSafeAny):Observable<TDSSafeAny>{
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/ProductCategory`,
      method: CoreApiMethodType.post,
      }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  getOriginCountry():Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/OriginCountry?%24format=json&%24filter=(contains(NameNoSign%2C%27%27)+or+contains(Code%2C%27%27))&%24count=true`,
      method: CoreApiMethodType.get,
      }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  getUOMAddType():Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/PartnerExt?%24format=json&%24filter=(contains(NameNoSign%2C%27%27)+or+contains(Code%2C%27%27)+or+contains(Phone%2C%27%27))&%24count=true`,
      method: CoreApiMethodType.get,
      }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  getPOSCategory(): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/POS_Category?$orderby=Sequence&%24format=json&%24filter=contains(tolower(NameGet)%2C%27%27)&%24count=true`,
        method: CoreApiMethodType.get,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  insertProductTemplate(data:TDSSafeAny):Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.InsertV2`,
      method: CoreApiMethodType.post,
      }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  updateProductTemplate(data:TDSSafeAny) :Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.UpdateV2`,
      method: CoreApiMethodType.post,
      }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  insertPartnerExt(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/PartnerExt`,
      method: CoreApiMethodType.post,
      }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  insertOriginCountry(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/OriginCountry `,
      method: CoreApiMethodType.post,
      }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  suggestVariants(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.SuggestionsVariant?$expand=AttributeValues`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  stockChangeProductQty(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/odata/StockChangeProductQty/ODataService.DefaultGetAll?$expand=ProductTmpl,Product,Location`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  postChangeQtyProduct(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/odata/StockChangeProductQty/ODataService.PostChangeQtyProduct`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  changeProductQtyIds(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/odata/StockChangeProductQty/ODataService.ChangeProductQtyIds`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }
}
