import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { TAPIDTO, TApiMethodType, TCommonService, THelperCacheService } from 'src/app/lib';
import { TDSSafeAny } from 'tds-ui';
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
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}?$orderby=Name%20asc&$filter=Active%20eq%20true`,
        method: TApiMethodType.get,
    }

    return this.apiService.getData<TDSSafeAny>(api,null);
  }

}
