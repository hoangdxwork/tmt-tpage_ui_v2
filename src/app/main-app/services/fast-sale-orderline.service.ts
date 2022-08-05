import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CoreAPIDTO, CoreApiMethodType, TCommonService } from 'src/app/lib';
import { TDSSafeAny } from 'tds-ui/shared/utility';
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
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.OnChangeProduct?$expand=ProductUOM,Account`,
        method: CoreApiMethodType.post,
    }

    return this.apiService.getData<ODataRegisterPartnerDTO>(api, data);
  }

  onChangeUOMLine(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.OnChangeUOMLine?$expand=ProductUOM`,
        method: CoreApiMethodType.post,
    }

    return this.apiService.getData<ODataRegisterPartnerDTO>(api, data);
  }

  getByLiveCampaignId(detailId: string, productId: string, productUOMId: string): Observable<ODataResponsesDTO<FastSaleOrderLineDTO>> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.GetByLiveCampaignId?key=${detailId}&productId=${productId}&productUOMId=${productUOMId}`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<ODataResponsesDTO<FastSaleOrderLineDTO>>(api, null);
  }

}
