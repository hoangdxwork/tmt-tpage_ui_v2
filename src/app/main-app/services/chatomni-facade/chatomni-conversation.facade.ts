import { Injectable } from "@angular/core";
import { TCommonService } from "src/app/lib";
import { BaseSevice } from "../base.service";
import { get as _get, maxBy as _maxBy } from 'lodash';
import { ChatomniMessageDTO } from "../../dto/conversation-all/chatomni/chatomni-message.dto";
import { set as _set } from 'lodash';
import { ChatomniConversationDto } from "../../dto/conversation-all/chatomni/chatomni-conversation";

@Injectable({
  providedIn: 'root'
})

export class ChatomniConversationFacade extends BaseSevice  {

  prefix: string = "odata";
  table: string = "";
  baseRestApi: string = "rest/v2.0/chatomni";

  csDataSource: { [id: string] : ChatomniConversationDto } = {}; //this.chatomniDataSource[id]

  constructor(private apiService: TCommonService) {
    super(apiService)
  }

  setData(teamId: number, value: ChatomniConversationDto | null) {
    _set(this.csDataSource, [teamId], value);
  }

  getData(teamId: number) {
    let data = _get(this.csDataSource, teamId) || undefined;
    return data;
  }

}
