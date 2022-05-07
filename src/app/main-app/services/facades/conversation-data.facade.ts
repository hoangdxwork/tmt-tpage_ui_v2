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

@Injectable({
  providedIn: 'root'
})

export class ConversationDataFacade extends BaseSevice implements OnInit, OnDestroy {

  prefix: string = "";
  table: string = "";
  baseRestApi: string = "";
  private dataSource$!: Observable<any>;
  private destroy$ = new Subject();

  constructor(private apiService: TCommonService,
      private cvsFbState: ConversationFacebookState,
      private service: ConversationService,
      private sgRConnectionService: SignalRConnectionService,
      private sharedService: SharedService) {
        super(apiService)
  }

  ngOnInit(): void {
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

  notificationMessage(value: any): any {
    let data = Object.assign({}, value.data);
    let pageId = data.page_id;
    let psid = data.psid;
  }

  messageWebhook(data: any): any  {
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
