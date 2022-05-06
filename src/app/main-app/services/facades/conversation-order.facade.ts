import { EventEmitter, Injectable, OnDestroy, OnInit } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { TCommonService } from "src/app/lib";
import { TDSMessageService } from "tmt-tang-ui";
import { CheckConversationData } from "../../dto/partner/check-conversation.dto";
import { BaseSevice } from "../base.service";
import { ConversationService } from "../conversation/conversation.service";
import { CRMTeamService } from "../crm-team.service";
import { ConversationFacebookState } from "../facebook-state/conversation-fb.state";
import { PartnerService } from "../partner.service";
import { SharedService } from "../shared.service";
import { SignalRConnectionService } from "../signalR/signalR-connection.service";

@Injectable({
  providedIn: 'root'
})

export class ConversationOrderFacade extends BaseSevice implements OnInit, OnDestroy {

  prefix: string = "";
  table: string = "";
  baseRestApi: string = "";
  private destroy$ = new Subject();
  public onLastOrderUpdated$: EventEmitter<any> = new EventEmitter<any>();
  public onLastOrderCheckCvs$: EventEmitter<any> = new EventEmitter<any>();

  constructor(private apiService: TCommonService,
      private fbState: ConversationFacebookState,
      private message: TDSMessageService,
      private crmTeamService: CRMTeamService,
      private service: ConversationService,
      private partnerService: PartnerService,
      private sgRConnectionService: SignalRConnectionService,
      private sharedService: SharedService) {
        super(apiService);
  }

  ngOnInit(): void {
    //TODO: Load đơn mặc định ở tab đơn hàng
    this.initialize();
    //TODO: Dùng để update realtime đơn hàng
    this.loadOrderFromSignalR();
  }

  loadOrderFromSignalR(){
    this.sgRConnectionService._onSaleOnlineOrder$.pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      if(res && (res.action == "create" || res.action == "updated")) {

      }
    }, error => {
        this.message.error('Load đơn hàng từ signalR đã xảy ra lỗi');
    })
  }

  initialize() {
    this.partnerService.onLoadedPartnerFromCheckCvs.pipe(takeUntil(this.destroy$))
      .subscribe((res: CheckConversationData) => {
        //TODO: đơn hàng gần nhất LastOrder
        if(res && res.LastOrder) {
            this.onLastOrderCheckCvs$.emit(res.LastOrder);
        }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
