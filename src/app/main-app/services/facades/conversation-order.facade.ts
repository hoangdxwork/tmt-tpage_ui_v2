import { EventEmitter, Injectable, OnDestroy, OnInit } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { TCommonService } from "src/app/lib";
import { TDSMessageService } from "tmt-tang-ui";
import { BaseSevice } from "../base.service";
import { ConversationService } from "../conversation/conversation.service";
import { ConversationFacebookState } from "../facebook-state/conversation-fb.state";
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

  constructor(private apiService: TCommonService,
      private fbState: ConversationFacebookState,
      private message: TDSMessageService,
      private service: ConversationService,
      private sgRConnectionService: SignalRConnectionService,
      private sharedService: SharedService) {
        super(apiService);
  }

  ngOnInit(): void {
    this.initialize();
    this.loadOrderFromSignalR();
  }

  loadOrderFromSignalR(){
    this.sgRConnectionService._onSaleOnlineOrder$
      .pipe(takeUntil(this.destroy$)).subscribe((res: any) => {debugger
        if(res && (res.action == "create" || res.action == "updated")) {

        }
    }, error => {
        this.message.error('Load đơn hàng từ signalR đã xảy ra lỗi');
    })
  }

  initialize() {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
