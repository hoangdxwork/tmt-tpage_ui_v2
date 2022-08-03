import { ChangeDetectorRef, EventEmitter, Injectable, OnDestroy, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { TCommonService } from "src/app/lib";
import { BaseSevice } from "../base.service";
import { ConversationFacebookState } from "../facebook-state/conversation-facebook.state";
import { SignalRConnectionService } from "../signalR/signalR-connection.service";
import { CRMTeamService } from '../crm-team.service';
import { TDSMessageService } from "tds-ui/message";
import { TDSNotificationService } from "tds-ui/notification";

@Injectable({
  providedIn: 'root'
})

export class ConversationEventFacade extends BaseSevice implements OnDestroy {

  prefix: string = "";
  table: string = "";
  baseRestApi: string = "";
  public hasEventDetectChanges = new EventEmitter<boolean>();
  private destroy$ = new Subject<void>();

  constructor(private apiService: TCommonService,
      private cvsFbState: ConversationFacebookState,
      public crmService: CRMTeamService,
      private notification: TDSNotificationService,
      private sgRConnectionService: SignalRConnectionService) {
        super(apiService);

        this.initialize();
  }

  initialize() {
    // Update send message
    this.sgRConnectionService._onSentConversation$.subscribe((res: any) => {
      this.updateSendMessage(res);
    });

    // Update mark seen
    this.sgRConnectionService._onReadConversation$.subscribe((data: any) => {
      this.updateMarkSeen(data);
    });

    // Send Message With Bill
    this.sgRConnectionService._onSendMessageWithBill$.subscribe(res => {
      this.updateSendMessage(res);
    });

    // Update SaleOnline_Order
    this.sgRConnectionService._onSaleOnlineOrder$.subscribe((data: any) => {
      if (data.action == "created" || data.action == "updated") {

          let currentTeam = this.crmService.getCurrentTeam();

          // Thông báo cho shop
          if(data && data.message && data.data && currentTeam && data.data.facebook_PageId == currentTeam.ChannelId) {
              let message = data.message;

              if(data.data && data.data.facebook_UserName) {
                  message += `Với khách hàng: ${data.data.facebook_UserName}`;
              }
              this.notification.info('Cập nhật đơn hàng', `${message}`, { placement: 'bottomLeft' });
          }

          this.updateSaleOnlineOrder(data);
      }
    })

    // Update FastSaleOrder
    this.sgRConnectionService._onFastSaleOrderEvent$.subscribe((data: any) => {
      if (data.action = "created") {

        this.updateFastSaleOrder(data);
        this.notification.info('Cập nhật hóa đơn', `${data.message}`, { placement: 'bottomLeft' });
      }
    })
  }

  getEvent() {
    return this.cvsFbState.getEvent;
  }

  updateMarkSeenBadge(pageId: string, type: string, psid: string) {
    this.cvsFbState.markSeenBadge(pageId, type, psid);
  }

  updateSendMessage(value: any) {
    let data = Object.assign({}, value.data);
    if(data && data.facebook && data.facebook.psId && data.facebook.pageId) {
        let user = this.convertAssignUser(data.createdBy);
        let psid = data.facebook.psId;
        let pageId = data.facebook.pageId;
        let event = {
          message: `${user["Name"] || ""} đã phản hồi`,
          time: new Date()
        };
        this.cvsFbState.setEvent(pageId, psid, event);
    }
  }

  updateMarkSeen(value: any) {
    let data = Object.assign({}, value.data);
    let user = this.convertAssignUser(data.createdBy);
    let facebook = data.facebook;

    if (facebook && facebook.pageId && facebook.psId) {
      let psid = data.facebook.psId;
      let pageId = data.facebook.pageId;
      let event = {
        message: `${user["Name"] || ""} đang xem`,
        time: new Date()
      };
      this.cvsFbState.setEvent(pageId, psid, event);
    }
  }

  updateSaleOnlineOrder(value: any) {
    let data = Object.assign({}, value.data);
    let facebook = data.facebook;

    if (facebook && facebook.pageId && facebook.psId) {
      let psid = facebook.psId;
      let pageId = facebook.pageId;
      let user = this.convertAssignUser(data.createdBy);

      let message = `${user["Name"] || ""} đã tạo đơn hàng`;
      if (value.action == "updated") {
          message = `${user["Name"] || ""} đã cập nhật đơn hàng`;
      }
      let event = {
          message: message,
          time: new Date()
      };
      this.cvsFbState.setEvent(pageId, psid, event);
    }
  }

  updateFastSaleOrder(value: any) {
    let data = Object.assign({}, value.data);
    let facebook = data.facebook;

    if (facebook && facebook.pageId && facebook.psId) {
        let psid = facebook.psId;
        let pageId = facebook.pageId;
        let user = this.convertAssignUser(data.createdBy);

        let message = `${user["Name"] || ""} đã tạo hoá đơn.`;
        if (value.action == "updated") {
          message = `${user["Name"] || ""} đã cập nhật hoá đơn`;
        }
        let event = {
          message: message,
          time: new Date()
        };
        this.cvsFbState.setEvent(pageId, psid, event);
    }
  }

  convertAssignUser(assignUser: any) {
      let result: any = {};

      result["Id"] = assignUser ? (assignUser.id || (assignUser.Id || null)) : "";
      result["UserName"] = assignUser ? (assignUser.userName || (assignUser.UserName || null)) : "";
      result["Name"] = assignUser ? (assignUser.name || (assignUser.Name || null)) : "";
      result["Avatar"] = assignUser ? (assignUser.avatar || (assignUser.Avatar || null)) : "";

      return result;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
