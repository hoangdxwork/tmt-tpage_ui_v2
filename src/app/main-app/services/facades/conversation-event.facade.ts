import { ChangeDetectorRef, EventEmitter, Injectable, OnDestroy, OnInit } from "@angular/core";
import { TCommonService } from "src/app/lib";
import { BaseSevice } from "../base.service";
import { CRMTeamService } from '../crm-team.service';

@Injectable({
  providedIn: 'root'
})

export class ConversationEventFacade extends BaseSevice  {

  prefix: string = "";
  table: string = "";
  baseRestApi: string = "";
  public hasEventDetectChanges = new EventEmitter<boolean>();

  constructor(private apiService: TCommonService,
      public crmService: CRMTeamService) {
        super(apiService);
  }


}
