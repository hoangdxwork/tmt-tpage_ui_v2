import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CoreAPIDTO, CoreApiMethodType, TCommonService } from "src/app/lib";
import { AccountJournalDTO } from "../dto/account/account.dto";
import { ODataResponsesDTO } from "../dto/odata/odata.dto";
import { BaseSevice } from "./base.service";

@Injectable()
export class AccountJournalService extends BaseSevice {

  prefix: string = "odata";
  table: string = "AccountJournal";
  baseRestApi: string = "";

  constructor(private apiService: TCommonService) {
    super(apiService)
  }

  getWithCompanyPayment(): Observable<ODataResponsesDTO<AccountJournalDTO>> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.GetWithCompany?format=json&$filter=(Type eq 'bank') or (Type eq 'cash')`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<ODataResponsesDTO<AccountJournalDTO>>(api, null);
  }
}
