import { TDSSafeAny } from 'tmt-tang-ui';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TAPIDTO, TApiMethodType, TCommonService, THelperCacheService } from 'src/app/lib';
import { BaseSevice } from './base.service';


export interface FilterObjDTO  {
    searchText: string,
}

@Injectable()
export class TagProductTemplateService extends BaseSevice {
    prefix: string = "odata";
    table: string = "TagProductTemplate";
    baseRestApi: string = "";

    constructor(private apiService: TCommonService,
        public caheApi: THelperCacheService) {
        super(apiService)
    }
    
    assignTag(data:TDSSafeAny): Observable<any>{
        const api: TAPIDTO = {
            url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.AssignTagProductTemplate`,
            method: TApiMethodType.post,
        }

        return this.apiService.getData<TDSSafeAny>(api,data);
    }
}