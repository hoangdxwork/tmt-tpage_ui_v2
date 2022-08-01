import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CoreAPIDTO, CoreApiMethodType, TCommonService } from 'src/app/lib';
import { TDSSafeAny } from 'tds-ui/shared/utility';
import { AccountRegisterPaymentDTO } from '../dto/fastsaleorder/payment.dto';
import { ODataAccountJournalPaymentDTO } from '../dto/register-payment/register-payment.dto';
import { BaseSevice } from './base.service';

@Injectable()
export class AccountRegisterPaymentService extends BaseSevice {

  prefix: string = "odata";
  table: string = "AccountRegisterPayment";
  baseRestApi: string = "";

  constructor(private apiService: TCommonService) {
    super(apiService)
  }

  createMultip(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.CreateMulti`,
        method: CoreApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api,data);
  }

  registerPayment(data: TDSSafeAny): Observable<TDSSafeAny> { // AccountRegisterPaymentDTO
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}`,
        method: CoreApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api,data);
  }

  insertV2(data: AccountRegisterPaymentDTO): Observable<AccountRegisterPaymentDTO> {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}`,
        method: CoreApiMethodType.post,
    }

    return this.apiService.getData<AccountRegisterPaymentDTO>(api, data);
  }

  onchangeJournal(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.OnchangeJournal`,
        method: CoreApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api,data);
  }

  createPayment(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.CreatePayment`,
        method: CoreApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api,data);
  }

  getWithCompanyPayment(): Observable<any> {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/AccountJournal/OdataService.GetWithCompany?format=json&$filter=(Type eq 'bank') or (Type eq 'cash')`,
        method: CoreApiMethodType.get
    }
    return this.apiService.getData<ODataAccountJournalPaymentDTO>(api, null);
  }

}
