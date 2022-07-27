import { PagingTimestampLowcase, QueryStateConversationDTO_v2 } from './../conversation/conversation.service';
import { EventEmitter, Injectable, OnDestroy} from "@angular/core";
import { Observable, Subject } from "rxjs";
import { map, shareReplay, takeUntil } from "rxjs/operators";
import { TCommonService } from "src/app/lib";
import { BaseSevice } from "../base.service";
import { ConversationService } from "../conversation/conversation.service";
import { ConversationFacebookState } from "../facebook-state/conversation-facebook.state";
import { SignalRConnectionService } from "../signalR/signalR-connection.service";
import { CRMMatchingDTO, CRMMatchingDTO_v2 } from '../../dto/conversation-all/crm-matching.dto';
import { ConversationMatchingItem, CRMMatchingMappingDTO, CRMMatchingMappingDTO_v2 } from "../../dto/conversation-all/conversation-all.dto";
import { DataUpdate } from "../../dto/conversation/conversation.dto";
import { CRMTeamService } from "../crm-team.service";
import { StringHelperV2 } from "../../shared/helper/string.helper";
import { Router } from "@angular/router";
import { TDSMessageService } from "tds-ui/message";
import { TDSHelperArray, TDSHelperObject, TDSHelperString, TDSSafeAny } from "tds-ui/shared/utility";
import { TDSNotificationService } from "tds-ui/notification";

@Injectable({
  providedIn: 'root'
})

export class ConversationDataFacade extends BaseSevice implements OnDestroy {

  prefix: string = "";
  table: string = "";
  baseRestApi: string = "";
  private dataSource$!: Observable<any>;
  private destroy$ = new Subject<void>();
  private currentTeam: any;
  private currentUrl!: string;
  public lstTeam!: any[];
  private nextPageUrlCurrent!: string;
  isProcessing: boolean = false;

  public onUpdateInfoByConversation$ = new EventEmitter<any>();
  public notificationMessNew$ = new EventEmitter<any>();

  constructor(private cvsFbState: ConversationFacebookState,
    private service: ConversationService,
    private crmTeamService: CRMTeamService,
    private notification: TDSNotificationService,
    private router: Router,
    private apiService: TCommonService,
    private sgRConnectionService: SignalRConnectionService) {
      super(apiService);

      this.crmTeamService.onChangeListFaceBook().subscribe((res :any) => {
        if(res && TDSHelperArray.isArray(res.Items)){
            this.lstTeam = res.Items;
        }
      })

      this.currentTeam = this.crmTeamService.getCurrentTeam();
      this.currentUrl = this.router.routerState.snapshot.url;

      this.initialize();
  }

  initialize() {
    //TODO: message from facebook
    this.sgRConnectionService._onFacebookEvent$.pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
        this.messageWebhook(res);
        this.notificationMessage(res);
    });

    //TODO: load message from messageJob
    this.sgRConnectionService._onSendMessageCompleteEvent$.pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
        this.messageJob(res);
    });

    // Message Sending
    this.sgRConnectionService._onSendMessageSendingEvent$.pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.messageJob(res);
    });

     // Message Fail
     this.sgRConnectionService._onSendMessageFailEvent$.pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.messageJob(res);
    });

    // Data From Scan
    this.sgRConnectionService._onFacebookScanData$.pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      if(res.type == "update_scan_conversation") {
          this.messageScanConversation(res);
      }
      if(res.type == "update_scan_feed") {
          this.messageScanFeed(res);
      }
    });

    // Message From Add Template
    this.sgRConnectionService._onAddTemplateMessage$.pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      if(res.type == "add_template_message") {
        this.messageAddTemplate(res);
      }
    });

    // Update tag
    this.sgRConnectionService._onAppendTagSucceedEvent$.pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.updateAddTags(res, res.type);
    });

    // Update assign user
    this.sgRConnectionService._onAppendAssignUserEvent$.pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.updateAssignUser(res);
    });
  }

  getTeamByPageId(pageId: any) {
    let team = {};
    this.lstTeam.forEach((x: any) => {
      let items = x.Childs.filter((a: any) => {
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

    if(value.action == "facebook_messages_delivery") {
      return
    };

    let exist = this.currentUrl?.startsWith('/conversation') && (this.currentTeam?.Facebook_PageId == pageId);
    if (!exist) {

      let splitMessage = StringHelperV2.getSliceAfterSpaceByLength(value.message, 60, "...");
      let team = this.getTeamByPageId(pageId) as any;

      if (TDSHelperObject.hasValue(team)) {
        let message = `${splitMessage} tới Page: ${team.Facebook_PageName}`;
        data.message = message;
        data.team = team;

        this.notificationMessNew$.emit(data);
      } else {
        data.message = 'Không tìm thấy trang'
        this.notificationMessNew$.emit(data);
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

  messageWebhook(value: any): any  {
    let data = Object.assign({}, value.data) as any;

    if (data && data.psid == data.page_id) {
      return
    }

    let pageId = data.page_id;
    let psid = data.psid;
    let type = data.last_activity.type;
    let dateCreated = data.last_activity.created_time;
    let is_admin = data.from.id == data.page_id ? true : false;
    let message = data.last_activity ? data.last_activity.message || data.last_activity.message_format : " ";

    let dataAdd = this.convertDataWebhook(data) as any;
    if(value && value.action == "facebook_messages_delivery") {
      dataAdd["is_admin"] = true;
    }
    this.addOrUpdateConversation(pageId, type, psid, message, dateCreated, is_admin, dataAdd);
  }

  messageJob(value: any) {
    let data = Object.assign({}, value.data);
    let psid = data.to_id;
    let pageId = data.account_id;
    let dateCreated = data.date_created;
    let type = data.type;

    this.updateConversation(pageId, type, psid, data.message_formatted, dateCreated, true);
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

  // makeDataSource(pageId: any, type: string): Observable<any> {
  //   this.cvsFbState.createEventData(pageId);
  //   return this.getConversation(pageId, type);
  // }

  // makeDataSource_v2(pageId: any, type: string): Observable<any> {
  //   this.cvsFbState.createEventData(pageId);
  //   return this.getConversation_v2(pageId, type);
  // }

  // getConversation(pageId: any, type: string): Observable<any> {
  //   let exist = this.cvsFbState.get(pageId, type);
  //   if (exist) {
  //       this.dataSource$ = Observable.create((obs :any) => {
  //           obs.next(exist);
  //           obs.complete();
  //       });
  //   } else {
  //     let query = this.service.createQuery(pageId, type);
  //     this.dataSource$ = this.service.get(query).pipe(map((res: CRMMatchingDTO) => {
  //       let create = this.createConversation(res, query, type);
  //       if(create) {
  //         return this.cvsFbState.setConversation(pageId, type, create);
  //       }
  //     }), shareReplay({ bufferSize: 1, refCount: true }));
  //   }
  //   return this.dataSource$;
  // }



  // createConversation(data: any, query: any, type: string) {
  //   return {
  //       items: [...this.prepareData(data.Items)],
  //       query: query,
  //       response: this.service.createResponse(data)
  //   } as CRMMatchingMappingDTO;
  // }

  // createConversation_v2(data: CRMMatchingDTO_v2, query: QueryStateConversationDTO_v2, type: string) {
  //   return {
  //       items: [...this.prepareData(data.Items)],
  //       query: query,
  //       response: this.service.createResponse_v2(data)
  //   } as CRMMatchingMappingDTO_v2;
  // }

  checkSendMessage(pageId: any, type: any, psid: any) {
    let exist = this.cvsFbState.getByPsid(pageId, type, psid);
    if (exist) {
      exist.checkSendMessage = !exist.checkSendMessage;
    }
  }

  messageScanConversation(value: any) {
    let data = Object.assign({}, value.data);

    let pageId = data.page_id;
    let psid = data.psid;
    let type = data.type;
    let dateCreated = data.date_created;
    let is_admin = data.is_admin;
    let message = data.message_formatted || " ";

    let dataAdd = this.convertDataScanConversation(data);
    this.addOrUpdateConversation(pageId, type, psid, message, dateCreated, is_admin, dataAdd);
  }

  addOrUpdateConversation(pageId: string, type: any, psid: string, message: string, dateCreated: any, is_admin :any, data: any) {

    let existAll = this.cvsFbState.getByPsid(pageId, "all", psid);
    let existComment = this.cvsFbState.getByPsid(pageId, "comment", psid);
    let existMessage = this.cvsFbState.getByPsid(pageId, "message", psid);

    let team = this.getTeamByPageId(pageId) as any;
    if(!team) return;

    // Cập nhật tất cả
    if (existAll) {
      this.checkInfoUpdate(existAll, data);
      this.updateConversation(pageId, type, psid, message, dateCreated, is_admin);
    } else {
      this.cvsFbState.addConversation(pageId, "all", psid, data);
    }

    // Cập nhật bình luận
    if (existComment && type == 2) {
      this.checkInfoUpdate(existComment, data);
      this.updateConversation(pageId, type, psid, message, dateCreated, is_admin);
    }
    else if (type == 2) {
      this.cvsFbState.addConversation(pageId, "comment", psid, data);
    }

    // Cập nhật tin nhắn
    if (existMessage && type == 3) {
      this.checkInfoUpdate(existMessage, data);
      this.updateConversation(pageId, type, psid, message || data.message, dateCreated, is_admin);
    }
    else if (type == 3) {
      this.cvsFbState.addConversation(pageId, "message", psid, data);
    }
  }

  checkInfoUpdate(exist: any, dataUpdate: any) {
    if(exist && dataUpdate.has_phone) {
      exist.has_phone = true;
      exist.phone = dataUpdate.phone;
    }

    if(exist && dataUpdate.has_address) {
      exist.has_address = true;
      exist.address = dataUpdate.address;
    }
    this.onUpdateInfoByConversation$.emit(dataUpdate);
  }

  updateAddTags(value: any, type: string) {
    let data = Object.assign({}, value.data);
    let pageId = data.page_id;
    let psid = data.psid;
    let tag = data.new_tag;

    this.updateTagByType(pageId, "all", psid, tag, type);
    this.updateTagByType(pageId, "comment", psid, tag, type);
    this.updateTagByType(pageId, "message", psid, tag, type);
  }

  updateTagByType(pageId: string, type: string, psid: string, tag: any, typeUpdate: string) {
    let exist = this.cvsFbState.getByPsid(pageId, type, psid);
    if (exist && exist.tags) {
      let tagExist = exist.tags.filter((x: any) => x.id == tag.id)[0];

      if (!tagExist && typeUpdate == "append_tag_succeed") {
        exist.tags.push(tag);
        exist.keyTags[tag.id] = true;
      }
      else if (tagExist && typeUpdate == "remove_tag_succeed") {
        exist.tags = exist.tags.filter((x: any) => x.id != tag.id);
        delete exist.keyTags[tag.id];
      }
    }
  }

  updateAssignUser(value: any) {
    // this.message.success(value.message);
    let data = Object.assign({}, value.data);

    let pageId = data.page_id;
    let psid = data.psid;
    let assigned_to = data.assigned_to;

    if (data.assigned_to) {
      assigned_to = this.convertAssignUser(data.assigned_to);
    }

    this.updateAssignUserByType(pageId, "all", psid, assigned_to);
    this.updateAssignUserByType(pageId, "comment", psid, assigned_to);
    this.updateAssignUserByType(pageId, "message", psid, assigned_to);
  }

  updateAssignUserByType(pageId: string, type: string, psid: string, assigned_to: any) {
    let exist = this.cvsFbState.getByPsid(pageId, type, psid);
    if (exist) {
      exist.assigned_to = assigned_to || {};
      exist.assigned_to_id = assigned_to ? assigned_to.id : null;
    }
  }

  messageScanFeed(value: any) {
    let data = Object.assign({}, value.data.activity);
    data["comment"] = value.data.comment;

    let pageId = data.account_id;
    let psid = data.to_id;
    let type = data.type;
    let dateCreated = data.dateCreated;
    let is_admin = data.is_admin;
    let message = data.message_formatted || " ";

    let dataAdd = this.convertDataScanFeed(data);

    this.addOrUpdateConversation(pageId, type, psid, message, dateCreated, is_admin, dataAdd);
  }

  messageAddTemplate(value: any) {
    let data = Object.assign({}, value.data);
    let pageId = data.account_id;
    let psid = data.to_id;
    let type = data.type;
    let dateCreated = data.dateCreated;
    let is_admin = data.is_admin;
    let message = data.message_formatted || " ";

    let dataAdd = this.convertDataAddTemplate(data);
    this.addOrUpdateConversation(pageId, type, psid, message, dateCreated, is_admin, dataAdd);
  }

  convertAssignUser(assignUser: any) {
    let result = {} as any;

    result["Id"] = assignUser ? (assignUser.id || (assignUser.Id || null)) : "";
    result["UserName"] = assignUser ? (assignUser.userName || (assignUser.UserName || null)) : "";
    result["Name"] = assignUser ? (assignUser.name || (assignUser.Name || null)) : "";
    result["Avatar"] = assignUser ? (assignUser.avatar || (assignUser.Avatar || null)) : "";

    return result;
  }

  convertDataAddTemplate(data: any) {
    let pageId = data.account_id;
    let last_activity = this.createLastActivity(data.message_formatted, data.dateCreated, data.type);
    last_activity.message = last_activity.message_format || last_activity.message || "";

    let result = {} as any;
    result["name"] =  data.to_name;
    result["psid"] = data.to_id;
    result["last_activity"] = last_activity;
    result["last_comment"] = {};
    result["last_message"] = last_activity;
    result["count_unread_activities"] = 1;
    result["LastActivityTimeConverted"] = last_activity.created_time;
    result["checkSendMessage"] = false;
    result["tags"] = data.tag || [];
    result["assigned_to"] = null;
    result["has_order"] = false;
    result["has_phone"] = false;
    result["has_address"] = false;

    return result;
  }

  convertDataScanFeed(data: any) {
    let last_activity = this.createLastActivity(data.message || data.message_formatted, data.dateCreated, data.type);
    last_activity.message = last_activity.message_format || last_activity.message || "";

    let model = {} as any;
    model["name"] = data.comment.from.name;
    model["psid"] = data.to_id;
    model["last_activity"] = last_activity;
    model["last_comment"] = last_activity;
    model["last_message"] = {};
    model["count_unread_activities"] = 1;
    model["LastActivityTimeConverted"] = last_activity.created_time;
    model["checkSendMessage"] = false;
    model["tags"] = data.tag || [];
    model["assigned_to"] = null;
    model["has_order"] = false;
    model["has_phone"] = false;
    model["has_address"] = false;

    return model;
  }

  convertDataScanConversation(data: any) {
    let pageId = data.account_id;
    let last_activity = this.createLastActivity(data.message_formatted, data.date_created, data.type);
    last_activity.message = last_activity.message_format || last_activity.message || "";

    let model = {} as any;
    model["name"] =  data.to_name;
    model["psid"] = data.psid;
    model["last_activity"] = last_activity;
    model["last_comment"] = {};
    model["last_message"] = last_activity;
    model["count_unread_activities"] = 1;
    model["LastActivityTimeConverted"] = last_activity.created_time;
    model["checkSendMessage"] = false;
    model["tags"] = data.tag || [];
    model["assigned_to"] = null;
    model["has_order"] = false;
    model["has_phone"] = false;
    model["has_address"] = false;

    return model;
  }

  convertDataWebhook(data: any) {
    let last_activity = data.last_activity || data.last_comment || data.last_message || {};
    last_activity.message = last_activity.message_format || last_activity.message || "";

    let model = {} as any;
    model["name"] = data.name || data.partner_name || " ";
    model["psid"] = data.psid;
    model["psid"] = data.id || data.psid;
    model["last_activity"] = data.last_activity || last_activity;
    model["last_comment"] = data.last_comment || {};
    model["last_message"] = data.last_message || {};
    model["count_unread_activities"] = 1;
    model["LastActivityTimeConverted"] = last_activity.created_time;
    model["checkSendMessage"] = false;
    model["tags"] = data.tag || [];
    model["phone"] = data.phone ? data.phone : null;
    model["address"] = data.address ? data.address : null;
    model["assigned_to"] = data.assigned_to;
    model["has_order"] = data.has_order;
    model["has_phone"] = data.has_phone;
    model["has_address"] = data.has_address;

    return model;
  }

  isEmpty(obj: any) {
    return Object.keys(obj).length === 0;
  }

  // nextData(pageId: any, type: any): Observable<any> {
  //   const data = this.cvsFbState.get(pageId, type)
  //   let exist = data && data.response?.hasNextPage || data && data.response?.nextPageUrl != this.nextPageUrlCurrent;

  //   return new Observable(observer => {
  //     if(this.isProcessing) {
  //         observer.next(false);
  //         observer.complete();
  //         return;
  //     }

  //     if(!exist) {
  //       observer.next();
  //       observer.complete();
  //     } else {
  //       this.nextPageUrlCurrent = data.response.nextPageUrl;
  //       this.service.getLink(this.nextPageUrlCurrent).subscribe((res: any) => {

  //         if(TDSHelperArray.hasListValue(res.Items)) {
  //           data.items = [...data.items, ...this.prepareData(res.Items)];
  //           data.response = this.service.createResponse(res);

  //           observer.next(data);
  //           observer.complete();
  //         } else {
  //           this.isProcessing = true;
  //           observer.next();
  //           observer.complete();
  //         }
  //       }, error => {
  //         (this.nextPageUrlCurrent as any) = null;
  //         observer.next();
  //         observer.complete();
  //       });
  //     }
  //   });
  // }

  // createQuery(pageId: string, type: any) {
  //   return this.service.createQuery(pageId, type);
  // }

  // nextDataWithQuery(pageId: string, type: string, queryObj: any): Observable<any> {

  //   let query = Object.keys(queryObj).map(key => {
  //     return key + '=' + queryObj[key]
  //   }).join('&');

  //   const data = this.cvsFbState.getByQuery(query);
  //   let exist = data && data.response?.hasNextPage || data && data.response?.nextPageUrl != this.nextPageUrlCurrent;

  //   return new Observable(observer => {
  //     if(!exist) {
  //       observer.next(false);
  //       observer.complete();
  //     } else {
  //       this.nextPageUrlCurrent = data.response.nextPageUrl;
  //       this.service.getLink(this.nextPageUrlCurrent).subscribe((res: any) => {

  //         if(TDSHelperArray.hasListValue(res.Items)) {
  //           data.items = [...data.items, ...this.prepareData(res.Items)];
  //           data.response = this.service.createResponse(res);

  //           observer.next(data);
  //           observer.complete();
  //         } else {
  //           observer.next(false);
  //           observer.complete();
  //         }
  //       }, error => {
  //           (this.nextPageUrlCurrent as any) = null;
  //           observer.next(false);
  //           observer.complete();
  //       });
  //     }
  //   })
  // }


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

  // makeDataSourceWithQuery(pageId: any, type: any, query: any): Observable<any> {
  //   this.dataSource$ = this.getConversationWithQuery(pageId, type, query);
  //   return this.dataSource$;
  // }

  // getConversationWithQuery(pageId: string, type: string, queryObj: any): Observable<any> {
  //   let query = Object.keys(queryObj).map(key => {
  //     return key + '=' + queryObj[key]
  //   }).join('&');

  //   let exist = this.cvsFbState.getByQuery(query);

  //   if (exist) {
  //     return Observable.create((observer: any) => {
  //       observer.next(exist);
  //       observer.complete();
  //     })
  //   } else {
  //     return this.service.get(queryObj).pipe(map((res: any) => {
  //       let create = this.createConversation(res, queryObj, type);
  //       let result = this.cvsFbState.setConversationQuery(query, create);
  //       return result;
  //     }), shareReplay({ bufferSize: 1, refCount: true }), takeUntil(this.destroy$));
  //   }
  // }

  setExtrasQuery(pageId: any, type: any, data: any) {
    return this.service.setExtrasQuery(pageId, type, data);
  }

  checkAllSendMessage(pageId: any, type: any, status: boolean) {
    let exist = this.cvsFbState.get(pageId, type);

    if(exist && exist.items) {
      exist.items.forEach((item: any) => {
        item.checkSendMessage = status;
      });
    }
  }

  getChecked(pageId: any, type: any, lstPsid: string[]) {
    let result: TDSSafeAny[] = [];
    let exist = this.cvsFbState.get(pageId, type);
    if(exist && exist.items && lstPsid) {
      let data: TDSSafeAny[] = [];
      lstPsid.forEach((id: TDSSafeAny) => {
        data.push(exist.items.find((x : TDSSafeAny)=>x.psid == id))
      })
      data.forEach((x: TDSSafeAny) => {
        let r = {
          to_id: x.psid,
          to_name: x.name,
          partner_id: x.partner_id
        }
        result.push(r);
      });
    }

    return result;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
