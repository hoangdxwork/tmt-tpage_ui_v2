import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TAPIDTO, TApiMethodType, TCommonService } from 'src/app/lib';
import { TDSSafeAny } from 'tmt-tang-ui';
import { PartnerBirthdayDTO } from '../dto/partner/partner-birthday.dto';
import { ODataPartnerCategoryDTO } from '../dto/partner/partner-category.dto';
import { PartnerDetailDTO } from '../dto/partner/partner-detail.dto';
import { BaseSevice } from './base.service';
// import { groupBy as _groupBy } from 'lodash';
import { ODataDeliveryCarrierDTOV2 } from '../dto/delivery-carrier.dto';

@Injectable()
export class DeliveryCarrierService extends BaseSevice {

  prefix: string = "odata";
  table: string = "DeliveryCarrier";
  baseRestApi: string = "";

  private delivery_types: any = ["fixed", "base_on_rule", "VNPost", "NinjaVan"];
  // Đối tác có phí báo hiểm
  private carrierTypeInsurance: any = ["MyVNPost", "GHN", "GHTK", "ViettelPost", "NinjaVan"];
  // Danh sách đối tác hỗ trợ tính phí
  private apiDeliveries: any = ['GHTK', 'ViettelPost', 'GHN', 'TinToc', 'SuperShip', 'FlashShip', 'OkieLa', 'MyVNPost', 'DHL', 'FulltimeShip', 'JNT', 'BEST', 'EMS', 'AhaMove', 'Snappy', 'NhatTin', "HolaShip"];

  public dataCarrierActive: any;
  public dataCarrierActive$ = new BehaviorSubject<any>([]);

  constructor(private apiService: TCommonService) {
      super(apiService);
      this.initialize();
  }

  initialize() {
    if (this.dataCarrierActive) {
        this.dataCarrierActive$.next(this.dataCarrierActive);
    } else {
      this.get().subscribe((res: any) => {
          this.dataCarrierActive = res.value;
          this.dataCarrierActive$.next(this.dataCarrierActive);

          // let deliveriesTypes = _groupBy(res.value, 'DeliveryType');
          // this.apiDeliveries = Object.keys(deliveriesTypes);
      });
    }
  }

  get(): Observable<any> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}?$orderby=Name asc&$filter=Active eq true`,
        method: TApiMethodType.get,
    }

    return this.apiService.getData<ODataDeliveryCarrierDTOV2>(api,null);
  }

}
