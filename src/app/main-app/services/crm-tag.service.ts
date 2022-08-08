import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import { CoreAPIDTO, CoreApiMethodType, TCommonService, THelperCacheService } from 'src/app/lib';
import { CRMTagDTO, CRMTagModelDTO } from '../dto/crm-tag/odata-crmtag.dto';
import { BaseSevice } from './base.service';

@Injectable()
export class CRMTagService extends BaseSevice {

  prefix: string = "odata";
  table: string = "CRMTag";
  baseRestApi: string = "";

  public data!: any[];
  public dataActive: any;

  public dataSource$ = new BehaviorSubject<any>(null);
  public dataActive$ = new BehaviorSubject<any>([]);
  private _keyCacheNearestTags = "nearestTags";

  constructor(private apiService: TCommonService,
    private cacheApi: THelperCacheService) {
    super(apiService);
    this.initialize();
  }

  initialize() {
    if (this.data) {
      this.dataSource$.next(this.data);
    } else {
      this.get().pipe(map((res: any) => res.value)).subscribe((res: any) => {
        this.data = res;
        this.dataSource$.next(res);
        this.loadDataActive();
      });
    }
  }

  loadDataActive() {
    if(this.data) {
      this.dataActive = this.data.filter(x => x.IsDeleted == false);
      this.dataActive$.next(this.dataActive);
    }
  }

  addData(data: any) {
    if(!this.data) {
      this.data = [];
    }
    this.data.push(data);
    this.dataSource$.next(this.data);
    this.loadDataActive();
  }

  updateData(id: any, data: any) {
    let index = this.data.findIndex(x => x.Id == id);

    this.data[index].Name = data.Name
    this.data[index].ColorClassName = data.ColorClassName
    this.data[index].IsDeleted = data.IsDeleted;

    this.dataSource$.next(this.data);
    this.loadDataActive();
  }

  deleteData(id: any) {
    this.data = this.data.filter(x => x.Id != id);
    this.dataSource$.next(this.data);
    this.loadDataActive();
  }

  updateDataStatus(key: any) {
    let index = this.data.findIndex(x => x.Id == key);
    this.data[index].IsDeleted = !this.data[index].IsDeleted;

    this.dataSource$.next(this.data);
    this.loadDataActive();
  }

  get(): Observable<any> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}`,
      method: CoreApiMethodType.get
    }
    return this.apiService.getData<CRMTagDTO>(api, null);
  }

  getById(key: string): Observable<any> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}(${key})`,
      method: CoreApiMethodType.get
    }

    return this.apiService.getData<CRMTagDTO>(api, null);
  }

  getOnlyActive(): Observable<any> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}?$filter=IsDeleted eq false`,
      method: CoreApiMethodType.get
    }

    return this.apiService.getData<CRMTagDTO>(api, null);
  }

  insert(data: CRMTagModelDTO): Observable<any> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}`,
      method: CoreApiMethodType.post
    }

    return this.apiService.getData<any>(api, data);
  }

  update(key: string, data: CRMTagModelDTO, isForce: boolean): Observable<any> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}(${key})?isForce=${isForce}`,
      method: CoreApiMethodType.put
    }

    return this.apiService.getData<any>(api, data);
  }

  updateStatus(key: string): Observable<any> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}(${key})/ODataService.UpdateStatus`,
      method: CoreApiMethodType.post
    }

    return this.apiService.getData<any>(api, null);
  }

  delete(key: string): Observable<any> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}(${key})`,
      method: CoreApiMethodType.delete
    }

    return this.apiService.getData<any>(api, null);
  }

  getTagLocalStorage() {
    let nearestTags = JSON.parse(localStorage.getItem("nearestTags") || "{}");
    return nearestTags;
  }

  addTagLocalStorage(id: any) {
    let nearestTags = JSON.parse(localStorage.getItem("nearestTags") || "{}");
    if(nearestTags[id]) {
      nearestTags[id]["point"] = nearestTags[id]["point"] + 1;
    } else {
      nearestTags[id] = {};
      nearestTags[id]["point"] = 1;
    }
    localStorage.setItem("nearestTags", JSON.stringify(nearestTags));
  }

}
