import { EventEmitter, Injectable, OnDestroy, OnInit } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { map, shareReplay, takeUntil } from "rxjs/operators";
import { TCommonService } from "src/app/lib";
import { BaseSevice } from "../base.service";
import { ConversationService } from "../conversation/conversation.service";
import { ConversationFacebookState } from "../facebook-state/conversation-facebook.state";
import { SharedService } from "../shared.service";
import { SignalRConnectionService } from "../signalR/signalR-connection.service";
import { CRMMatchingDTO } from '../../dto/conversation-all/crm-matching.dto';
import { CRMMatchingMappingDTO } from "../../dto/conversation-all/conversation-all.dto";
import { DataUpdate } from "../../dto/conversation/conversation.dto";
import { CRMTeamService } from "../crm-team.service";
import { HrefPageService } from "../href-page.service";
import { TDSHelperArray, TDSHelperObject, TDSHelperString, TDSMessageService, TDSNotificationService } from "tmt-tang-ui";
import { StringHelperV2 } from "../../shared/helper/string.helper";
import { ActivatedRoute, Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})

export class ConversationPostFacade extends BaseSevice implements OnInit, OnDestroy {

  prefix: string = "";
  table: string = "";
  baseRestApi: string = "";
  destroy$ = new Subject();

  public onPostChanged$ = new EventEmitter<any>(); // Sự kiện thay đổi bài viết

  constructor(private message: TDSMessageService,
      private apiService: TCommonService,
      private cvsFbState: ConversationFacebookState,
      private service: ConversationService,
      private crmTeamService: CRMTeamService,
      private hrefService: HrefPageService,
      private notification: TDSNotificationService,
      private router: Router,
      private sgRConnectionService: SignalRConnectionService,
      private sharedService: SharedService) {
        super(apiService);
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
