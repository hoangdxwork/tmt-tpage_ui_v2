import { map } from 'rxjs/operators';
import { CreateQuickReplyDTO, QuickReplyDTO } from './../dto/quick-reply.dto.ts/quick-reply.dto';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable} from 'rxjs';
import { CoreAPIDTO, CoreApiMethodType, TCommonService } from 'src/app/lib';
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
      this.makeOnlyActive();
  }

  makeOnlyActive() {
    if(this.dataActive) {
      this.dataActive$.next(this.dataActive);
    } else {
      this.getOnlyActive().pipe(map(res => res)).subscribe((res: any) => {
        this.dataActive = res;
        this.dataActive$.next(this.dataActive?.value);
      })
    }
  }
  addDataActive(data: any) {
    if(data && data.Id && data.Active){
      if(!this.dataActive || !this.dataActive.value) {
        this.dataActive["value"] = [];
      }
      this.dataActive.value.push(data);
    }

    this.dataActive$.next(this.dataActive);
  }

  get(): Observable<any> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}`,
      method: CoreApiMethodType.get
    }

    return this.apiService.getData<any>(api, null);
  }

  getById(key: string): Observable<any> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}(${key})`,
      method: CoreApiMethodType.get
    }

    return this.apiService.getData<QuickReplyDTO>(api, null);
  }

  getOnlyActive(): Observable<any> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}?$filter=Active eq true`,
      method: CoreApiMethodType.get
    }

    return this.apiService.getData<any>(api, null);
  }

  insert(data: CreateQuickReplyDTO): Observable<any> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}`,
      method: CoreApiMethodType.post
    }

    return this.apiService.getData<any>(api, data);
  }

  update(key :any, data: CreateQuickReplyDTO): Observable<any> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}(${key})`,
      method: CoreApiMethodType.put
    }

    return this.apiService.getData<any>(api, data);
  }

  updateStatus(key: any): Observable<any> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}(${key})/ODataService.UpdateStatus`,
      method: CoreApiMethodType.post
    }

    return this.apiService.getData<any>(api, null);
  }

  updateDefaultForOrder(key: any): Observable<any> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}(${key})/ODataService.UpdateDefaultForOrder`,
      method: CoreApiMethodType.post
    }

    return this.apiService.getData<any>(api, null);
  }

  updateDefaultForBill(key: any): Observable<any> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}(${key})/ODataService.UpdateDefaultForBill`,
      method: CoreApiMethodType.post
    }

    return this.apiService.getData<any>(api, null);
  }

  delete(key: any): Observable<any> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}(${key})`,
      method: CoreApiMethodType.delete
    }

    return this.apiService.getData<any>(api, null);
  }

}
