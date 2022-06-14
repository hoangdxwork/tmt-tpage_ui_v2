import { ODataProductInventoryDTO } from './../dto/configs/product/config-odata-product.dto';
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { TAPIDTO, TApiMethodType, TCommonService } from "src/app/lib";
import { ProductTemplateV2DTO } from "../dto/producttemplate/product-tempalte.dto";
import { BaseSevice } from "./base.service";
import { TDSSafeAny } from 'tds-ui/shared/utility';


@Injectable({
  providedIn: 'root'
})
export class ProductTemplateOUMLineService extends BaseSevice {

  prefix: string = "odata";
  table: string = "ProductTemplateUOMLine";
  baseRestApi: string = "";

  constructor(private apiService: TCommonService) {
    super(apiService)
  }

  getOUMs(): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/ProductUOM`,
      method: TApiMethodType.get,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }
}
