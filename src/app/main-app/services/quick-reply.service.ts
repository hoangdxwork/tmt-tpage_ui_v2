import { map } from 'rxjs/operators';
import { CreateQuickReplyDTO, QuickReplyDTO } from './../dto/quick-reply.dto.ts/quick-reply.dto';
import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject} from 'rxjs';
import { CoreAPIDTO, CoreApiMethodType, TCommonService } from 'src/app/lib';
import { BaseSevice } from './base.service';
import { TDSHelperArray } from 'tds-ui/shared/utility';

@Injectable()
export class QuickReplyService extends BaseSevice {

  prefix: string = "odata";
  table: string = "MailTemplate";
  baseRestApi: string = "";

  public lstDataActive: any = [];
  private readonly _lstDataActive$ = new ReplaySubject<any>();

  public onChangeQuickReply = new EventEmitter<any>();

  constructor(private apiService: TCommonService) {
      super(apiService);
  }

  getDataActive() {
    return this._lstDataActive$.asObservable();
  }

  setDataActive() {
    if(TDSHelperArray.hasListValue(this.lstDataActive)) {
        this._lstDataActive$.next(this.lstDataActive);
    } else {
        this.getOnlyActive().subscribe({
          next: (res: any) => {
            this.lstDataActive = [...res.value];
            this._lstDataActive$.next(res.value);
          }
        });
    }
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
    let filter ='$filter=(Active%20eq%20true)&$count=true';
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}?${filter}`,
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
