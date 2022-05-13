import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable} from 'rxjs';
import { TAPIDTO, TApiMethodType, TCommonService } from 'src/app/lib';
import { CRMTagDTO } from '../dto/crm-tag/odata-crmtag.dto';
import { BaseSevice } from './base.service';

@Injectable()
export class CRMTagService extends BaseSevice {

  prefix: string = "odata";
  table: string = "CRMTag";
  baseRestApi: string = "";

  public dataActive$ = new BehaviorSubject<any>([]);

  constructor(private apiService: TCommonService) {
    super(apiService);
    this.initialize();
  }

  initialize() {
    this.getOnlyActive().subscribe((res: any) => {
      this.dataActive$.next(res.value);
    });
  }

  getById(key: string): Observable<any> {
    let api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}(${key})`,
      method: TApiMethodType.get
    }

    return this.apiService.getData<CRMTagDTO>(api, null);
  }

  getOnlyActive(): Observable<any> {
    let api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}?$filter=IsDeleted eq false`,
      method: TApiMethodType.get
    }

    return this.apiService.getData<CRMTagDTO>(api, null);
  }

  insert(data: CRMTagDTO): Observable<any> {
    let api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}`,
      method: TApiMethodType.post
    }

    return this.apiService.getData<any>(api, data);
  }

  update(key: string, data: CRMTagDTO, isForce: boolean = false): Observable<any> {
    let api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}(${key})?isForce=${isForce}`,
      method: TApiMethodType.put
    }

    return this.apiService.getData<any>(api, data);
  }

  updateStatus(key: string): Observable<any> {
    let api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}(${key})/ODataService.UpdateStatus`,
      method: TApiMethodType.post
    }

    return this.apiService.getData<any>(api, null);
  }

  delete(key: string): Observable<any> {
    let api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}(${key})`,
      method: TApiMethodType.delete
    }

    return this.apiService.getData<any>(api, null);
  }

  getTagLocalStorage() {
    // var nearestTags = JSON.parse(localStorage.getItem("nearestTags") || "{}");
    // return nearestTags;
  }


}
