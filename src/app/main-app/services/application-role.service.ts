import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable} from 'rxjs';
import { CoreAPIDTO, CoreApiMethodType, TCommonService } from 'src/app/lib';
import { ApplicationRoleDTO } from '../dto/account/application-role.dto';
import { ODataResponsesDTO } from '../dto/odata/odata.dto';
import { BaseSevice } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class ApplicationRoleService extends BaseSevice {

  prefix: string = "odata";
  table: string = "ApplicationRole";
  baseRestApi: string = "";

  constructor(private apiService: TCommonService) {
    super(apiService);
  }

  get(): Observable<ODataResponsesDTO<ApplicationRoleDTO>> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<ODataResponsesDTO<ApplicationRoleDTO>>(api,null);
  }

}
