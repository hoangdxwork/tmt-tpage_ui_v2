import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CoreAPIDTO, CoreApiMethodType, TCommonService } from "src/app/lib";
import { TDSSafeAny } from "tds-ui/shared/utility";
import { ODataResponsesDTO } from "../dto/odata/odata.dto";
import { ODataProductCategoryDTOV2, ProductCategoryDTO } from "../dto/product/product-category.dto";
import { BaseSevice } from "./base.service";

@Injectable({
  providedIn: 'root'
})

export class ProductCategoryService extends BaseSevice {

  prefix: string = "odata";
  table: string = "ProductCategory";
  baseRestApi: string = "";

  constructor(private apiService: TCommonService) {
    super(apiService)
  }

  get(): Observable<ODataResponsesDTO<ProductCategoryDTO>> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}?%24format=json&%24orderby=ParentLeft&%24count=true`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<ODataResponsesDTO<ProductCategoryDTO>>(api, null);
  }

  getDefault(): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.DefaultGet`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  getParent(): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}?$orderby=ParentLeft&$count=true`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  insert(data: TDSSafeAny): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }

}
