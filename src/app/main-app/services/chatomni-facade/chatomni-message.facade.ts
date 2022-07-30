import { Injectable, OnDestroy } from "@angular/core";
import { TCommonService } from "src/app/lib";
import { BaseSevice } from "../base.service";
import { get as _get, maxBy as _maxBy } from 'lodash';
import { ChatomniMessageDTO } from "../../dto/conversation-all/chatomni/chatomni-message.dto";
import { set as _set } from 'lodash';
import { CRMTeamService } from "../crm-team.service";
import { Subject, takeUntil } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class ChatomniMessageFacade extends BaseSevice implements OnDestroy  {

  prefix: string = "odata";
  table: string = "";
  baseRestApi: string = "rest/v2.0/chatomni";

  chatomniDataSource: { [id: string] : ChatomniMessageDTO } = {}; //this.chatomniDataSource[id]

  private destroy$ = new Subject<void>();

  constructor(private apiService: TCommonService,
    private crmTeamService: CRMTeamService) {
    super(apiService)

    this.crmTeamService.onChangeTeam().pipe(takeUntil(this.destroy$)).subscribe(res => {debugger
        if(res)
          this.chatomniDataSource = {};
    })
  }

  setData(id: string, value: ChatomniMessageDTO | null) {
    _set(this.chatomniDataSource, [id], value);
  }

  getData(id: string) {
    let data = _get(this.chatomniDataSource, id) || undefined;
    return data;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
