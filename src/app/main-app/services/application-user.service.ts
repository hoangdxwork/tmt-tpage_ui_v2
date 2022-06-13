import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import { TAPIDTO, TApiMethodType, TCommonService, THelperCacheService, TIDictionary } from 'src/app/lib';
import { TDSSafeAny } from 'tds-ui/shared/utility';
import { AddApplicationUserDTO, AddShiftDTO, ApplicationUserCRMTeamDTO, ApplicationUserDTO, ApplicationUserShiftDTO, ShiftDTO, UpdateApplicationUserDTO, UserUpdateShiftDTO } from '../dto/account/application-user.dto';
import { ODataResponsesDTO } from '../dto/odata/odata.dto';
import { ODataApplicationUserDTO } from '../dto/user/application-user.dto';
import { BaseSevice } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class ApplicationUserService extends BaseSevice {

  prefix: string = "odata";
  table: string = "ApplicationUser";
  baseRestApi: string = "rest/v1.0/user";

  public data: any;
  public dataActive: any = [];

  public dataSource$ = new BehaviorSubject<any>([]);
  public dataActive$ = new BehaviorSubject<any>(this.dataActive);

  constructor(private apiService: TCommonService) {
      super(apiService);
      this.initialize();
  }

  initialize() {
    if (this.data) {
        this.dataSource$.next(this.data);
    } else {
        this.get().pipe(map(res => res.value)).subscribe((res: any) => {
          this.data = res;
          this.dataSource$.next(this.data);
          this.loadDataActive();
        });
    }
  }

  loadDataActive() {
    if(this.data) {
      this.dataActive = this.data.filter((x: any) => x.Active == true) || [];
      this.dataActive$.next(this.dataActive);
    }
  }

  get(): Observable<any> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}`,
      method: TApiMethodType.get,
    }

    return this.apiService.getData<ODataApplicationUserDTO>(api,null);
  }

  getById(id: string): Observable<ApplicationUserDTO> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}('${id}')`,
      method: TApiMethodType.get,
    }

    return this.apiService.getData<ApplicationUserDTO>(api,null);
  }

  getActive(): Observable<any> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}?$filter=Active eq true`,
      method: TApiMethodType.get,
    }

    return this.apiService.getData<TDSSafeAny>(api,null);
  }

  getShifts(): Observable<ODataResponsesDTO<ShiftDTO>> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/Shift`,
      method: TApiMethodType.get,
    }

    return this.apiService.getData<ODataResponsesDTO<ShiftDTO>>(api, null);
  }

  getShiftById(id: string): Observable<ShiftDTO> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/Shift(${id})`,
      method: TApiMethodType.get,
    }

    return this.apiService.getData<ShiftDTO>(api, null);
  }

  getCRMTeamUser(data: TDSSafeAny): Observable<ODataResponsesDTO<ApplicationUserDTO>> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.GetCRMTeamUser?$expand=CRMTeam_Users`,
      method: TApiMethodType.post,
    }

    return this.apiService.getData<ODataResponsesDTO<ApplicationUserDTO>>(api, data);
  }

  update(data: UpdateApplicationUserDTO): Observable<ApplicationUserDTO> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/update`,
      method: TApiMethodType.post,
    }

    return this.apiService.getData<ApplicationUserDTO>(api, data);
  }

  insert(data: AddApplicationUserDTO): Observable<ApplicationUserDTO> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/insert`,
      method: TApiMethodType.post,
    }

    return this.apiService.getData<ApplicationUserDTO>(api, data);
  }

  delete(id: string): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}('${id}')`,
      method: TApiMethodType.delete,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  addShifts(data: AddShiftDTO): Observable<ODataResponsesDTO<ShiftDTO>> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/Shift`,
      method: TApiMethodType.post,
    }

    return this.apiService.getData<ODataResponsesDTO<ShiftDTO>>(api, data);
  }

  updateShifts(data: ShiftDTO): Observable<ODataResponsesDTO<ShiftDTO>> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/Shift(${data.Id})`,
      method: TApiMethodType.put,
    }

    return this.apiService.getData<ODataResponsesDTO<ShiftDTO>>(api, data);
  }

  updateStatus(id: string): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}('${id}')/ODataService.UpdateStatus`,
      method: TApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  removeShifts(id: string): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/Shift(${id})`,
      method: TApiMethodType.delete,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  getUserShifts(): Observable<ApplicationUserDTO[]> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/shifts`,
      method: TApiMethodType.get,
    }

    return this.apiService.getData<ApplicationUserDTO[]>(api, null);
  }

  getUserExist(userName: string, userId: string): Observable<ApplicationUserDTO> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/${userName}/${userId}/checkuserexist`,
      method: TApiMethodType.get,
    }

    return this.apiService.getData<ApplicationUserDTO>(api, null);
  }

  getEmailExist(email: string, userId?: string): Observable<ApplicationUserDTO> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/${email}/${userId}/checkemailexist`,
      method: TApiMethodType.get,
    }

    return this.apiService.getData<ApplicationUserDTO>(api, null);
  }

  updateUserShifts(userId: string, data: UserUpdateShiftDTO): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/${userId}/shifts`,
      method: TApiMethodType.put,
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }


}
