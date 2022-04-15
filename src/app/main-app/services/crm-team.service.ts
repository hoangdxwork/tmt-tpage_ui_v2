import { Injectable } from '@angular/core';
import {  Observable, ReplaySubject } from 'rxjs';
import { TAPIDTO, TApiMethodType, TCommonService, THelperCacheService } from 'src/app/lib';
import { TDSHelperObject, TDSSafeAny } from 'tmt-tang-ui';
import { PagedList2 } from '../dto/pagedlist2.dto';
import { CRMTeamDTO } from '../dto/team/team.dto';
import { BaseSevice } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class CRMTeamService extends BaseSevice {

  prefix: string = "odata";
  table: string = "CRMTeam";
  baseRestApi: string = "rest/v1.0/crmteam";
  private readonly __keyCacheTeamId = 'nearestTeamId';

  private listFaceBook$ = new ReplaySubject<PagedList2<CRMTeamDTO> | null>(1);
  private currentTeam$ = new ReplaySubject<CRMTeamDTO | null>(1);
  private _currentTeam!: CRMTeamDTO | null;

  constructor(private apiService: TCommonService, public caheApi: THelperCacheService) {
    super(apiService)
  }

  getAllFacebooks(): Observable<PagedList2<CRMTeamDTO>> {
    let api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/getallfacebooks`,
      method: TApiMethodType.get
    }
    return this.apiService.getData<PagedList2<CRMTeamDTO>>(api, null);
  }

  getAllChannels(): Observable<Array<CRMTeamDTO>> {
    let api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/getallchannels`,
      method: TApiMethodType.post
    }
    return this.apiService.getData<Array<CRMTeamDTO>>(api, null);
  }

  insert(data: TDSSafeAny): Observable<Array<CRMTeamDTO>> {
    let api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}`,
      method: TApiMethodType.post
    }
    return this.apiService.getData<Array<CRMTeamDTO>>(api, data);
  }

  onChangeListFaceBook() {
    return this.listFaceBook$.asObservable();
  }

  onUpdateListFaceBook(data: PagedList2<CRMTeamDTO> | null) {
    this.listFaceBook$.next(data);
  }

  onRefreshListFacebook() {
    this.getAllFacebooks().subscribe(dataTeam => {
      if (TDSHelperObject.hasValue(dataTeam)) {
        this.onUpdateListFaceBook(dataTeam);
      }
      else {
        this.onUpdateListFaceBook(null);
        this.onUpdateTeam(null);
      }
    }, error => {
      this.onUpdateListFaceBook(null);
      this.onUpdateTeam(null);
    });
  }

  getCurrentTeam(): CRMTeamDTO | null {
    return this._currentTeam;
  }

  // xử lý teasm
  getCacheTeamId(): Observable<string | null> {
    return new Observable(obs => {
      this.caheApi.getItem(this.__keyCacheTeamId).subscribe(ops => {
        let value = null;
        if (TDSHelperObject.hasValue(ops)) {
          value = JSON.parse(ops.value).value;
        }
        obs.next(value);
        obs.complete();
      });
    });

  }

  getLongLiveToken(data: TDSSafeAny): Observable<TDSSafeAny> {
    let api: TAPIDTO = {
      url: `${this._BASE_URL}/rest/v1.0/facebook/getlonglivetoken`,
      method: TApiMethodType.post
    }
    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  setCacheTeamId(data: TDSSafeAny) {
    this.caheApi.setItem(this.__keyCacheTeamId, data);
  }

  onUpdateTeam(data: CRMTeamDTO | null) {
    this.setCacheTeamId(data ? data.Id : null);
    this._currentTeam = data;
    this.currentTeam$.next(data);
  }

  onChangeTeam() {
    return this.currentTeam$.asObservable();
  }

  updateActive(id: number): Observable<TDSSafeAny> {
    let api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/${id}/active`,
      method: TApiMethodType.post
    }
    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  refreshPageToken(id: number, data: any): Observable<TDSSafeAny> {
    let api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/${id}/refreshpagetoken?`,
      method: TApiMethodType.post
    }
    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  delete(key: any): Observable<TDSSafeAny> {
    let api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}(${key})`,
      method: TApiMethodType.delete
    }
    return this.apiService.getData<TDSSafeAny>(api, null);
  }

}
