import { ODataStokeMoveDTO } from '../dto/configs/product/config-odata-product.dto';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TAPIDTO, TApiMethodType, TCommonService, THelperCacheService } from 'src/app/lib';
import { BaseSevice } from './base.service';


export interface FilterObjDTO  {
    searchText: string,
}

@Injectable()
export class StockMoveService extends BaseSevice {
    prefix: string = "odata";
    table: string = "StockMove";
    baseRestApi: string = "";

    constructor(private apiService: TCommonService,
        public caheApi: THelperCacheService) {
        super(apiService)
    }
    
    getStockMoveProduct(productKey:number,params:string): Observable<any>{
        const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.GetStockMove_Product?productTmplId=${productKey}&${params}&$count=true`,
        method: TApiMethodType.get,
        }

        return this.apiService.getData<ODataStokeMoveDTO>(api, null);
    }
}