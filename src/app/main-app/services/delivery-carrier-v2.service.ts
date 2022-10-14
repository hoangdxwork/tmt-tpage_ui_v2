import { ProductDTO } from '../dto/product/product.dto';
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CoreAPIDTO, CoreApiMethodType, TCommonService } from "src/app/lib";
import { BaseSevice } from "./base.service";
import { TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { DeliveryResponseDto } from '../dto/carrierV2/delivery-carrier-response.dto';
import { GetDeliveryResponseDto } from '../dto/carrierV2/get-delivery.dto';
import { DeliveryCarrierDTO } from '../dto/carrier/delivery-carrier.dto';

@Injectable({
  providedIn: 'root'
})

export class DeliveryCarrierV2Service extends BaseSevice {
  prefix: string = "";
  table: string = "";
  baseRestApi: string = "rest/v1.0/deliverycarrierV2";

  constructor(private apiService: TCommonService) {
    super(apiService)
  }

  numberWithCommas = (value: TDSSafeAny) => {
    if (value != null) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    return value
  };

  parserComas = (value: TDSSafeAny) => {
    if (value != null) {
      return TDSHelperString.replaceAll(value, ',', '');
    }
    return value
  };

  getByDeliveryType(type: string): Observable<Array<DeliveryCarrierDTO>> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/get_by-delivery-type?type=${type}`,
      method: CoreApiMethodType.get
    }
    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  getProviderToAship(): Observable<DeliveryResponseDto<GetDeliveryResponseDto>> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/get_provider`,
      method: CoreApiMethodType.get
    }
    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  getConfigProviderToAship(provider: string): Observable<TDSSafeAny> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/get_configs_provider?provider=${provider}`,
      method: CoreApiMethodType.get
    }
    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  getInfoConfigProviderToAship(configId: string): Observable<TDSSafeAny> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/get_configs_provider_info?configId=${configId}`,
      method: CoreApiMethodType.get
    }
    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  getDisplayInfoConfigProviderToAship(configId: string): Observable<TDSSafeAny> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/get-display-config-provider?configId=${configId}`,
      method: CoreApiMethodType.get
    }
    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  create(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/create`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  update(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/update`,
      method: CoreApiMethodType.put,
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  delete(id: number): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.baseRestApi}/${id}`,
        method: CoreApiMethodType.delete,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  getById(id: number): Observable<DeliveryCarrierDTO> {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.baseRestApi}/${id}`,
        method: CoreApiMethodType.get,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  // getViewByDeliveryType(type: string, skip : number, top: number): Observable<DeliveryCarrierDTO> {
  //   const api: CoreAPIDTO = {
  //       url: `${this._BASE_URL}/odata/DeliveryCarrier/OdataService.GetView?%24top=${top}&%24skip=${skip}&%24filter=(Active+eq+true+and+DeliveryType+eq+%27${type}%27)&%24count=true`,
  //       method: CoreApiMethodType.get,
  //   }

  //   return this.apiService.getData<TDSSafeAny>(api, null);
  // }

  // // top=${top}&%24skip=${skip}&%24filter=(Active+eq+true+and+DeliveryType+eq+%27${type}%27)

  getViewByDeliveryType(params: any): Observable<DeliveryCarrierDTO> {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/odata/DeliveryCarrier/OdataService.GetView?%24${params}&%24count=true`,
        method: CoreApiMethodType.get,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }
}

