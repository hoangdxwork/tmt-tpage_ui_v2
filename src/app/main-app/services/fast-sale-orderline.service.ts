import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TAPIDTO, TApiMethodType, TCommonService } from 'src/app/lib';
import { TDSSafeAny } from 'tmt-tang-ui';
import { FastSaleOrderLineDTO } from '../dto/fastsaleorder/fastsaleorder.dto';
import { ODataResponsesDTO } from '../dto/odata/odata.dto';
import { ODataRegisterPartnerDTO } from '../dto/partner/partner-register-payment.dto';
import { BaseSevice } from './base.service';

@Injectable()
export class FastSaleOrderLineService extends BaseSevice {

  prefix: string = "odata";
  table: string = "FastSaleOrderLine";
  baseRestApi: string = "";

  constructor(private apiService: TCommonService) {
    super(apiService)
  }

  onChangeProduct(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.OnChangeProduct?$expand=ProductUOM,Account`,
        method: TApiMethodType.post,
    }

    return this.apiService.getData<ODataRegisterPartnerDTO>(api, data);
  }

  onChangeUOMLine(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.OnChangeUOMLine?$expand=ProductUOM`,
        method: TApiMethodType.post,
    }

    return this.apiService.getData<ODataRegisterPartnerDTO>(api, data);
  }

  getByLiveCampaignId(detailId: string, productId: string, productUOMId: string): Observable<ODataResponsesDTO<FastSaleOrderLineDTO>> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.GetByLiveCampaignId?key=${detailId}&productId=${productId}&productUOMId=${productUOMId}`,
      method: TApiMethodType.get,
    }

    return this.apiService.getData<ODataResponsesDTO<FastSaleOrderLineDTO>>(api, null);
  }

}
