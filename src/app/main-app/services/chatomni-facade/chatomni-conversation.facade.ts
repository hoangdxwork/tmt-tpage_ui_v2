import { Injectable, OnDestroy } from "@angular/core";
import { TCommonService } from "src/app/lib";
import { BaseSevice } from "../base.service";
import { get as _get, maxBy as _maxBy } from 'lodash';
import { set as _set } from 'lodash';
import { ChatomniConversationDto } from "../../dto/conversation-all/chatomni/chatomni-conversation";
import { CRMTeamService } from "../crm-team.service";
import { Subject, takeUntil } from "rxjs";

@Injectable()

export class ChatomniConversationFacade extends BaseSevice  {

  prefix: string = "odata";
  table: string = "";
  baseRestApi: string = "rest/v2.0/chatomni";

  dataSource: { [id: string] : ChatomniConversationDto } = {}; //this.chatomniDataSource[id]

  constructor(private apiService: TCommonService) {
    super(apiService)
  }

  setData(teamId: number, value: ChatomniConversationDto | null) {
      _set(this.dataSource, [teamId], value);
  }

  getData(teamId: number) {
      let data = _get(this.dataSource, teamId) || undefined;
      return data;
  }

}
