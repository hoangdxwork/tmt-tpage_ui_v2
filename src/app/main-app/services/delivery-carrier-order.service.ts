import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { CoreAPIDTO, CoreApiMethodType, TCommonService, THelperCacheService } from 'src/app/lib';
import { TDSSafeAny } from 'tds-ui/shared/utility';
import { BaseSevice } from './base.service';

@Injectable()

export class DeliveryCarrierService extends BaseSevice {

  prefix: string = "odata";
  table: string = "DeliveryCarrier";
  baseRestApi: string = "rest/v1.0/";
  private readonly __keyCacheTeamId = 'nearestTeamId';

  constructor(private apiService: TCommonService) {
    super(apiService)
  }

  get(): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}?$orderby=Name%20asc&$filter=Active%20eq%20true`,
        method: CoreApiMethodType.get,
    }

    return this.apiService.getData<TDSSafeAny>(api,null);
  }

}
