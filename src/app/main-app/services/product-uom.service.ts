import { EventEmitter, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { TAPIDTO, TApiMethodType, TCommonService } from "src/app/lib";
import { TDSSafeAny } from "tds-ui/shared/utility";
import { PagedList2 } from "../dto/pagedlist2.dto";
import { BaseSevice } from "./base.service";


@Injectable({
  providedIn: 'root'
})
export class ProductUOMService extends BaseSevice {

  prefix: string = "odata";
  table: string = "ProductUOM";
  baseRestApi: string = "";

  constructor(private apiService: TCommonService) {
    super(apiService)
  }

  get(): Observable<any> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}`,
      method: TApiMethodType.get,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  getUOMCateg(): Observable<any> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/ProductUOMCateg`,
      method: TApiMethodType.get,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  insert(data: TDSSafeAny): Observable<any> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}`,
      method: TApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }

}
