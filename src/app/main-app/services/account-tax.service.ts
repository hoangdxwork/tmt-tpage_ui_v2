import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable} from 'rxjs';
import { CoreAPIDTO, CoreApiMethodType, TCommonService } from 'src/app/lib';
import { AccountTaxDTO } from '../dto/account/account.dto';
import { ApplicationRoleDTO } from '../dto/account/application-role.dto';
import { ODataResponsesDTO } from '../dto/odata/odata.dto';
import { BaseSevice } from './base.service';

@Injectable()
export class AccountTaxService extends BaseSevice {

  prefix: string = "odata";
  table: string = "AccountTax";
  baseRestApi: string = "";

  constructor(private apiService: TCommonService) {
    super(apiService);
  }

  getTax(): Observable<ODataResponsesDTO<AccountTaxDTO>> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.GetWithCompany`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<ODataResponsesDTO<AccountTaxDTO>>(api, null);
  }

}
