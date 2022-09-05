import { Injectable } from '@angular/core';
import { Observable, ReplaySubject} from 'rxjs';
import { CoreAPIDTO, CoreApiMethodType, TCommonService } from 'src/app/lib';
import { TDSHelperArray, TDSSafeAny } from 'tds-ui/shared/utility';
import { AddApplicationUserDTO, AddShiftDTO, ApplicationUserDTO, ShiftDTO, UpdateApplicationUserDTO, UserUpdateShiftDTO } from '../dto/account/application-user.dto';
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

  lstUserActive: any = [];
  private readonly _lstUserActive$ = new ReplaySubject<any>();

  constructor(private apiService: TCommonService) {
      super(apiService);
  }

  initialize() {
    this.setUserActive();
  }

  getUserActive() {
    return  this._lstUserActive$.asObservable();
  }

  setUserActive() {
    if(TDSHelperArray.hasListValue(this.lstUserActive)) {
        this._lstUserActive$.next(this.lstUserActive);
    } else {
        this.apiUserActive().subscribe({
          next: (res: any) => {
              this.lstUserActive = [...res.value];
              this._lstUserActive$.next(res.value);
          }
        });
    }
  }

  apiUserActive() {
    let filter ='$filter=(Active%20eq%20true)&$count=true';
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}?${filter}`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<ODataApplicationUserDTO>(api, null);
  }

  get(): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<ODataApplicationUserDTO>(api, null);
  }

  getById(id: string): Observable<ApplicationUserDTO> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}('${id}')`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<ApplicationUserDTO>(api, null);
  }

  getActive(): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}?$filter=Active eq true`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  getShifts(): Observable<ODataResponsesDTO<ShiftDTO>> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/Shift`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<ODataResponsesDTO<ShiftDTO>>(api, null);
  }

  getShiftById(id: string): Observable<ShiftDTO> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/Shift(${id})`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<ShiftDTO>(api, null);
  }

  getCRMTeamUser(data: TDSSafeAny): Observable<ODataResponsesDTO<ApplicationUserDTO>> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.GetCRMTeamUser?$expand=CRMTeam_Users`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<ODataResponsesDTO<ApplicationUserDTO>>(api, data);
  }

  update(data: UpdateApplicationUserDTO): Observable<ApplicationUserDTO> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/update`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<ApplicationUserDTO>(api, data);
  }

  insert(data: AddApplicationUserDTO): Observable<ApplicationUserDTO> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/insert`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<ApplicationUserDTO>(api, data);
  }

  delete(id: string): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}('${id}')`,
      method: CoreApiMethodType.delete,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  addShifts(data: AddShiftDTO): Observable<ODataResponsesDTO<ShiftDTO>> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/Shift`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<ODataResponsesDTO<ShiftDTO>>(api, data);
  }

  updateShifts(data: ShiftDTO): Observable<ODataResponsesDTO<ShiftDTO>> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/Shift(${data.Id})`,
      method: CoreApiMethodType.put,
    }

    return this.apiService.getData<ODataResponsesDTO<ShiftDTO>>(api, data);
  }

  updateStatus(id: string): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}('${id}')/ODataService.UpdateStatus`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  removeShifts(id: string): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/Shift(${id})`,
      method: CoreApiMethodType.delete,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  getUserShifts(): Observable<ApplicationUserDTO[]> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/shifts`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<ApplicationUserDTO[]>(api, null);
  }

  getUserExist(userName: string, userId: string): Observable<ApplicationUserDTO> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/${userName}/${userId}/checkuserexist`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<ApplicationUserDTO>(api, null);
  }

  getEmailExist(email: string, userId?: string): Observable<ApplicationUserDTO> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/${email}/${userId}/checkemailexist`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<ApplicationUserDTO>(api, null);
  }

  updateUserShifts(userId: string, data: UserUpdateShiftDTO): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/${userId}/shifts`,
      method: CoreApiMethodType.put,
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }


}
