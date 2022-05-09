import { Injectable, OnDestroy, OnInit } from "@angular/core";
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
import { TDSHelperArray, TDSHelperObject, TDSHelperString, TDSNotificationService } from "tmt-tang-ui";
import { StringHelperV2 } from "../../shared/helper/string.helper";

@Injectable({
  providedIn: 'root'
})

export class ConversationDataFacade extends BaseSevice implements OnInit, OnDestroy {

  prefix: string = "";
  table: string = "";
  baseRestApi: string = "";
  private dataSource$!: Observable<any>;
  private destroy$ = new Subject();
  private currentTeam: any;
  private currentPage: any;
  public lstTeam!: any[];

  constructor(private apiService: TCommonService,
      private cvsFbState: ConversationFacebookState,
      private service: ConversationService,
      private crmTeamService: CRMTeamService,
      private hrefService: HrefPageService,
      private notification: TDSNotificationService,
      private sgRConnectionService: SignalRConnectionService,
      private sharedService: SharedService) {
        super(apiService);

        this.crmTeamService.onChangeListFaceBook().subscribe((res :any) => {
          if(res && TDSHelperArray.isArray(res.Items)){
              this.lstTeam = res.Items;
          }
        })
  }

  ngOnInit(): void {
    this.currentTeam = this.crmTeamService.getCurrentTeam();
    // this.currentPage = this.hrefService.getCurrentPage();
    this.initialize();
  }

  initialize() {
    //TODO: message from facebook
    this.sgRConnectionService._onFacebookEvent$.pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.notificationMessage(res);
        this.messageWebhook(res);
    }, error => {})
  }

  getTeamByPageId(pageId: any) {
    let team = {};
    this.lstTeam.forEach((x: any) => {
      var items = x.Childs.filter((a: any) => {
          if (a.Facebook_PageId == pageId) { return a }
      });
      if (items.length > 0) {
        team = items[0];
      }
    })
    return team;
  }

  notificationMessage(value: any): any {
    let data = Object.assign({}, value.data);
    let pageId = data.page_id;
    let psid = data.psid;

    if(value.action == "facebook_messages_delivery") return;

    if (this.currentPage && this.currentTeam && this.currentPage.key == "conversation" &&
      this.currentTeam.Facebook_PageId == pageId) {
    } else {

      let splitMessage = StringHelperV2.getSliceAfterSpaceByLength(value.message, 60, "...");
      let team = this.getTeamByPageId(pageId) as any;

      if (TDSHelperObject.hasValue(team)) {
        let message = `${splitMessage} tới Page: ${team.Facebook_PageName}`;
        let url = `/conversation/all?teamId=${team.Id}&type=all&psid=${psid}`;

        //TODO: mai xử lý tiếp signalR
        this.notification.error('', message);
        // this.toaStrCustomService.toaSuccess(message, url);
      } else {
        let messageError = "Không tìm thấy trang.";
        this.notification.error('', messageError);
        // this.toaStrCustomService.toaSuccessAndError(splitMessage, messageError);
      }

    }
  }

  messageServer(value: any) {
    let data = Object.assign({}, value);
    let psid = data.to_id;
    let pageId = data.account_id;
    let dateCreated = data.DateCreated;
    let type = data.type;

    this.updateConversation(pageId, type, psid, data.message_formatted, dateCreated, true);
  }

  messageWebhook(data: any): any  {

  }

  updateConversation(pageId: string, type: any, psid: string, message_format: string, dateCreated: any, is_admin: boolean) {
    let lastActivity = this.createLastActivity(message_format, dateCreated, type);

    let dataUpdate: DataUpdate = {
      last_activity: lastActivity,
      last_message: type == 3 ? lastActivity : null,
      last_comment: type == 2 ? lastActivity : null,
      LastActivityTimeConverted: dateCreated,
      LastUpdated: dateCreated,
      is_admin: is_admin
    }

    this.cvsFbState.updateConversation(pageId, "all", psid, dataUpdate);
    type == 2 && this.cvsFbState.updateConversation(pageId, "comment", psid, dataUpdate);
    type == 3 && this.cvsFbState.updateConversation(pageId, "message", psid, dataUpdate);
  }

  createLastActivity(message: string, dateCreated: any, type: any) {
    let result = {
      message: message,
      message_format: message,
      created_time: dateCreated,
      type: type
    };
    return result;
  }

  makeDataSource(pageId: any, type: string): Observable<any> {
    this.cvsFbState.createEventData(pageId);
    return this.getConversation(pageId, type);
  }

  getConversation(pageId: any, type: string): Observable<any> {
    let exist = this.cvsFbState.get(pageId, type);
    if (exist) {
        this.dataSource$ = Observable.create((obs :any) => {
            obs.next(exist);
            obs.complete();
        });
    } else {
      let query = this.service.createQuery(pageId, type);
      this.dataSource$ = this.service.get(query).pipe(map((res: CRMMatchingDTO) => {
        let create = this.createConversation(res, query, type);
        if(create) {
          return this.cvsFbState.setConversation(pageId, type, create);
        }
      }), shareReplay());
    }
    return this.dataSource$;
  }

  createConversation(data: any, query: any, type: string) {
    return {
        items: data.Items,
        query: query,
        response: this.service.createResponse(data)
    } as CRMMatchingMappingDTO;
  }

  checkSendMessage(pageId: any, type: any, psid: any) {
    var exist = this.cvsFbState.getByPsid(pageId, type, psid);
    if (exist) {
      exist.checkSendMessage = !exist.checkSendMessage;
    }
  }

  prepareData(datas: Array<any>) {
    datas.forEach((item: any) => {
      item.LastActivityTimeConverted = item.LastUpdated;
      let lastActivity = item.last_activity;
      if (lastActivity) {
          item.LastActivityTimeConverted = item.LastActivityTimeConverted || lastActivity.created_time;
      }
      //check send message
      item["checkSendMessage"] = false;
      //tags
      item["keyTags"] = {};
      if(item.tags && item.tags.length > 0) {
        item.tags.map((x: any) => {
            item["keyTags"][x.id] = true;
        })
      }
      else {
        item.tags = [];
      }
    });
    return datas;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
