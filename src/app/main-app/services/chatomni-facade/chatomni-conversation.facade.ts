import { Injectable, OnDestroy } from "@angular/core";
import { TCommonService } from "src/app/lib";
import { BaseSevice } from "../base.service";
import { get as _get, maxBy as _maxBy } from 'lodash';
import { ChatomniMessageDTO } from "../../dto/conversation-all/chatomni/chatomni-message.dto";
import { set as _set } from 'lodash';
import { ChatomniConversationDto } from "../../dto/conversation-all/chatomni/chatomni-conversation";
import { CRMTeamService } from "../crm-team.service";
import { Subject, takeUntil } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class ChatomniConversationFacade extends BaseSevice implements OnDestroy   {

  prefix: string = "odata";
  table: string = "";
  baseRestApi: string = "rest/v2.0/chatomni";

  csDataSource: { [id: string] : ChatomniConversationDto } = {}; //this.chatomniDataSource[id]
  private destroy$ = new Subject<void>();

  constructor(private apiService: TCommonService,
    private crmTeamService: CRMTeamService) {
    super(apiService)

    this.crmTeamService.onChangeTeam().pipe(takeUntil(this.destroy$)).subscribe(res => {
        if(res)
          this.csDataSource = {};
    })
  }

  setData(teamId: number, value: ChatomniConversationDto | null) {
    _set(this.csDataSource, [teamId], value);
  }

  getData(teamId: number) {
    let data = _get(this.csDataSource, teamId) || undefined;
    return data;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
