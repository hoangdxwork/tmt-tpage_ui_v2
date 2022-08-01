import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CoreAPIDTO, CoreApiMethodType, TCommonService } from 'src/app/lib';
import { BaseSevice } from './base.service';
import { groupBy as _groupBy } from 'lodash';
import { ODataDeliveryCarrierDTOV2 } from '../dto/delivery-carrier.dto';

@Injectable()
export class DeliveryCarrierService extends BaseSevice {

  prefix: string = "odata";
  table: string = "DeliveryCarrier";
  baseRestApi: string = "";

  public dataCarrierActive$ = new BehaviorSubject<any>([]);

  constructor(private apiService: TCommonService) {
      super(apiService);
      this.initialize();
  }

  initialize() {
    this.get().subscribe((res: any) => {
        this.dataCarrierActive$.next(res?.value);
    });
  }

  get(): Observable<any> {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}?$orderby=Name asc&$filter=Active eq true`,
        method: CoreApiMethodType.get,
    }

    return this.apiService.getData<ODataDeliveryCarrierDTOV2>(api,null);
  }

}
