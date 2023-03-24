import { TCommonService } from './../../lib/services/common.service';
import { Injectable } from "@angular/core";
import { CoreAPIDTO } from "@core/dto";
import { CoreApiMethodType } from "@core/enum";
import { BaseSevice } from "./base.service";
import { SearchProductOnShopCartDto } from '@app/dto/configs/product/config-product-shopcart-v2.dto';

@Injectable({
  providedIn: 'root'
})

export class ApiShopAppv2Service extends BaseSevice {

  prefix: string = "";
  table: string = "";
  baseRestApi: string = "api-shopapp/v2/shared";

  constructor(private apiService: TCommonService) {
    super(apiService)
  }

  getProductTemplateOnShopCart(queryObj: SearchProductOnShopCartDto | any) {
    let queryString = Object.keys(queryObj).map((key: any) => {
        return key + '=' + queryObj[key]
    }).join('&');

    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.baseRestApi}/getproductteamplateonshopcart?${queryString}`,
        method: CoreApiMethodType.get,
    }

    return this.apiService.getData<any>(api, null);
  }

  getShopCartProductCategories() {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.baseRestApi}/getproductcategories`,
        method: CoreApiMethodType.get,
    }

    return this.apiService.getData<any>(api, null);
  }

  getVariantByProductTemplateId(id: number) {
    let url =  `${this._BASE_URL}/${this.baseRestApi}/getvariantbyproducttemplateid`

    if (Number(id) > 0) {
        url = `${url}?id=${id}`;
    }
    const api: CoreAPIDTO = {
      url: url,
      method: CoreApiMethodType.get
    }
    return this.apiService.getData<any>(api, null);
  }
}
