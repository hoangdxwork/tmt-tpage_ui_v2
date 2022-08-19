import { TDSSafeAny } from 'tds-ui/shared/utility';
import { CoreApiMethodType } from './../../lib/enum/api.methodtype';
import { CoreAPIDTO } from './../../lib/dto/api.dto';
import { Observable } from 'rxjs';
import { ODataStockChangeProductQtyDTO, ODataStockLocationDTO, StockChangeProductQtyDTO } from './../dto/product/stock-change-product-qty.dto';
import { TCommonService } from './../../lib/services/common.service';
import { Injectable } from '@angular/core';
import { BaseSevice } from './base.service';

@Injectable()

export class StockChangeProductQtyService extends BaseSevice {

  prefix: string = "odata";
  table: string = "StockChangeProductQty";
  baseRestApi: string = "";

  constructor(private apiService: TCommonService) {
    super(apiService)
  }

  getStockChangeProductQty(data: TDSSafeAny): Observable<ODataStockChangeProductQtyDTO> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.DefaultGetAll?$expand=ProductTmpl,Product,Location`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<ODataStockChangeProductQtyDTO>(api, data);
  }

  getStockLocation() {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/StockLocation?$orderby=ParentLeft&%24format=json&%24filter=Usage+eq+%27internal%27&%24count=true`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<ODataStockLocationDTO>(api, null);
  }

  postStockChangeProductQty(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.PostChangeQtyProduct?$expand=ProductTmpl,Product,Location`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }
  
  updateStockChangeProductQty(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.ChangeProductQtyIds`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }
}