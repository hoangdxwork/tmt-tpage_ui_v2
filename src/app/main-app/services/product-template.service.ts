import { EventEmitter, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { TAPIDTO, TApiMethodType, TCommonService } from "src/app/lib";
import { TDSSafeAny } from "tmt-tang-ui";
import { PagedList2 } from "../dto/pagedlist2.dto";
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

  getDefault(): Observable<any> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.DefaultGet?$expand=UOM,Categ,UOMPO`,
      method: TApiMethodType.get,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  insert(data: TDSSafeAny): Observable<any> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}?$expand=UOM`,
      method: TApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  getImageProduct(param: any): Observable<any> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/api/upload/saveimagev2`,
      method: TApiMethodType.post,
    }

    return this.apiService.getExFile(api, param);
  }


}
