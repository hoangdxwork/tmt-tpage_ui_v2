import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CoreAPIDTO, CoreApiMethodType, TCommonService, THelperCacheService } from 'src/app/lib';
import { TDSSafeAny } from 'tds-ui/shared/utility';
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
        const api: CoreAPIDTO = {
            url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.AssignTagProductTemplate`,
            method: CoreApiMethodType.post,
        }

        return this.apiService.getData<TDSSafeAny>(api,data);
    }
}
