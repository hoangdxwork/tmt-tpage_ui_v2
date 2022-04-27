import { da } from 'date-fns/locale';
import { Injectable, OnDestroy, OnInit } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { map, shareReplay, takeUntil } from "rxjs/operators";
import { TCommonService } from "src/app/lib";
import { BaseSevice } from "../base.service";
import { ConversationService } from "../conversation/conversation.service";
import { ConversationFacebookState } from "../facebook-state/conversation-fb.state";
import { SharedService } from "../shared.service";
import { SignalRConnectionService } from "../signalR/signalR-connection.service";
import { CRMMatchingDTO } from '../../dto/conversation-all/crm-matching.dto';

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
      private fbState: ConversationFacebookState,
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
      this.fbState.createEventData(pageId);
      return this.getConversation(pageId, type);
  }

  getConversation(pageId: any, type: string) {
    let exist = this.fbState.get(pageId, type);
    if (exist) {
      this.dataSource$ = Observable.create((observer :any) => {
          observer.next(exist);
          observer.complete();
      });
    } else {
      let query = this.service.createQuery(pageId, type);
      this.dataSource$ = this.service.get(query).pipe(map((res: CRMMatchingDTO) => {
          let create = this.createConversation(res, query, type);
          if(create) {
              let result = this.fbState.setConversation(pageId, type, create);
              return result;
          }
      }), shareReplay());
    }

    return this.dataSource$;
  }

  createConversation(data: any, query: any, type: string) {
    let value = {
        items: this.prepareData(data.Items),
        query: query,
        response: this.service.createResponse(data)
    };

    return value;
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
