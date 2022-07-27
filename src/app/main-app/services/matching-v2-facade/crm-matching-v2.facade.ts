import { Injectable } from "@angular/core";
import { TCommonService } from "src/app/lib";
import { BaseSevice } from "../base.service";
import { set as _set } from 'lodash';
import { get as _get } from 'lodash';
import { CrmMatchingV2DTO } from "../../dto/conversation-all/crm-matching-v2/crm-matching-v2.dot";

@Injectable({
  providedIn: 'root'
})

export class CrmMatchingV2Facade extends BaseSevice  {

  prefix: string = "odata";
  table: string = "";
  baseRestApi: string = "rest/v2.0/crmmatching";

  crmV2DataSource: { [id: string] : CrmMatchingV2DTO } = {}; //this.crmV2DataSource[id]
  urlNext: string = "";

  constructor(private apiService: TCommonService) {
    super(apiService)
  }

  setData(id: string, value: CrmMatchingV2DTO) {
    _set(this.crmV2DataSource, [id], value);
  }

  getData(id: string) {
    let data = _get(this.crmV2DataSource, id) || undefined;
    return data;
  }


}
