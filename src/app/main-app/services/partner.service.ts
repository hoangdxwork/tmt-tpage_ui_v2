import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TAPIDTO, TApiMethodType, TCommonService } from 'src/app/lib';
import { TDSSafeAny } from 'tmt-tang-ui';
import { BaseSevice } from './base.service';

@Injectable()
export class PartnerService extends BaseSevice {

  prefix: string = "odata";
  table: string = "Partner";
  baseRestApi: string = "rest/v1.0/partner";

  public _keyCacheGrid: string = 'partner-page:grid_partner:settings';

  constructor(private apiService: TCommonService) {
    super(apiService)
  }

  getById(id: TDSSafeAny): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}(${id})?$expand=PurchaseCurrency,Categories,AccountPayable,AccountReceivable,StockCustomer,StockSupplier,Title,PropertyProductPricelist,PropertySupplierPaymentTerm,PropertyPaymentTerm,Addresses`,
        method: TApiMethodType.get,
    }

    return this.apiService.getData<TDSSafeAny>(api,null);
  }

  insert(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}`,
        method: TApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api,data);
  }


  update(key: number, data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}(${key})`,
        method: TApiMethodType.put,
    }

    return this.apiService.getData<TDSSafeAny>(api,data);
  }

  delete(id: TDSSafeAny): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}(${id})`,
        method: TApiMethodType.delete,
    }

    return this.apiService.getData<TDSSafeAny>(api,null);
  }

  assignTagPartner(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/TagPartner/ODataService.AssignTagPartner`,
        method: TApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api,data);
  }

  resetLoyaltyPoint(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.ResetLoyaltyPoint`,
        method: TApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api,data);
  }

  transferPartner(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.TransferPartner`,
        method: TApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api,data);
  }

  setActive(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.SetActive`,
        method: TApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api,data);
  }

  getPartnerRevenueById(key: TDSSafeAny): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.GetPartnerRevenueById?key=${key}`,
        method: TApiMethodType.get,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  getRegisterPaymentPartner(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.GetRegisterPaymentPartner?$expand=Partner`,
        method: TApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  getPartnerBirthday(type: string): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/api/common/getpartnerbirthday?type=${type}`,
        method: TApiMethodType.get,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  getPartnerCategory(): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/PartnerCategory?$orderby=ParentLeft&$count=true`,
        method: TApiMethodType.get,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }

}
