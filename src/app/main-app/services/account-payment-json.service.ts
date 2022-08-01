import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { CoreAPIDTO, CoreApiMethodType, TCommonService } from 'src/app/lib';
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
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.DefaultGetFastSaleOrder?$expand=Currency,FastSaleOrders`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<any>(api, orderId);
  }

  actionCreatePost(data: any) {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.ActionCreatePost`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<any>(api, data);
  }

  getPaymentInfoJson(id: any) {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/FastSaleOrder(${id})/ODataService.GetPaymentInfoJson`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<any>(api, null);
  }

  onChangeJournal(id: any) {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.OnChangeJournal?$expand=Currency&journalId=${id}&paymentType=inbound`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<any>(api, null);
  }


}
