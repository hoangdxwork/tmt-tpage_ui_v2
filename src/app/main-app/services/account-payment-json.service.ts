import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { TAPIDTO, TApiMethodType, TCommonService } from 'src/app/lib';
import { BaseSevice } from './base.service';

@Injectable()
export class AccountPaymentJsonService extends BaseSevice {

  prefix: string = "odata";
  table: string = "AccountPayment";
  baseRestApi: string = "";

  constructor(private apiService: TCommonService) {
    super(apiService);
  }

  defaultGetFastSaleOrder(orderId: any): Observable<any> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.DefaultGetFastSaleOrder?$expand=Currency,FastSaleOrders`,
      method: TApiMethodType.post,
    }

    return this.apiService.getData<any>(api, orderId);
  }

  actionCreatePost(data: any) {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.ActionCreatePost`,
      method: TApiMethodType.post,
    }

    return this.apiService.getData<any>(api, data);
  }

  getPaymentInfoJson(id: any) {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/FastSaleOrder(${id})/ODataService.GetPaymentInfoJson`,
      method: TApiMethodType.get,
    }

    return this.apiService.getData<any>(api, null);
  }

  onChangeJournal(id: any) {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.OnChangeJournal?$expand=Currency&journalId=${id}&paymentType=inbound`,
      method: TApiMethodType.get,
    }

    return this.apiService.getData<any>(api, null);
  }


}
