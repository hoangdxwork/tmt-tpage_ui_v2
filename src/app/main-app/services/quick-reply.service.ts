import { CreateQuickReplyDTO, QuickReplyDTO } from './../dto/quick-reply.dto.ts/quick-reply.dto';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable} from 'rxjs';
import { TAPIDTO, TApiMethodType, TCommonService } from 'src/app/lib';
import { BaseSevice } from './base.service';

@Injectable()
export class QuickReplyService extends BaseSevice {

  prefix: string = "odata";
  table: string = "MailTemplate";
  baseRestApi: string = "";

  public dataActive: any;
  public dataActive$ = new BehaviorSubject<any>(null);

  constructor(private apiService: TCommonService) {
      super(apiService);
  }

  get(): Observable<any> {
    let api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}`,
      method: TApiMethodType.get
    }

    return this.apiService.getData<any>(api, null);
  }

  getById(key: string): Observable<any> {
    let api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}(${key})`,
      method: TApiMethodType.get
    }

    return this.apiService.getData<QuickReplyDTO>(api, null);
  }

  getOnlyActive(): Observable<any> {
    let api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}?$filter=Active eq true`,
      method: TApiMethodType.get
    }

    return this.apiService.getData<any>(api, null);
  }

  insert(data: CreateQuickReplyDTO): Observable<any> {
    let api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}`,
      method: TApiMethodType.post
    }
    
    return this.apiService.getData<any>(api, data);
  }

  update(key :any, data: CreateQuickReplyDTO): Observable<any> {
    let api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}(${key})`,
      method: TApiMethodType.put
    }

    return this.apiService.getData<any>(api, data);
  }

  updateStatus(key: any): Observable<any> {
    let api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}(${key})/ODataService.UpdateStatus`,
      method: TApiMethodType.post
    }

    return this.apiService.getData<any>(api, null);
  }

  updateDefaultForOrder(key: any): Observable<any> {
    let api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}(${key})/ODataService.UpdateDefaultForOrder`,
      method: TApiMethodType.post
    }

    return this.apiService.getData<any>(api, null);
  }

  updateDefaultForBill(key: any): Observable<any> {
    let api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}(${key})/ODataService.UpdateDefaultForBill`,
      method: TApiMethodType.post
    }

    return this.apiService.getData<any>(api, null);
  }

  delete(key: any): Observable<any> {
    let api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}(${key})`,
      method: TApiMethodType.delete
    }

    return this.apiService.getData<any>(api, null);
  }

}
