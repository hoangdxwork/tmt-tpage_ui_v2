import { EventEmitter, Injectable, OnDestroy } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { TCommonService } from "src/app/lib";
import { BaseSevice } from "../base.service";
import { SignalRConnectionService } from "../signalR/signalR-connection.service";
import { get as _get, maxBy as _maxBy } from 'lodash';
import { ActivityStatus, ConversationType } from "src/app/lib/enum/message/coversation-message";
import { ActivityFacebookState } from "../facebook-state/activity-facebook.state";
import { CRMTeamService } from "../crm-team.service";
import { FacebookPostService } from "../facebook-post.service";
import { ActivityMatchingService } from "../conversation/activity-matching.service";
import { map, shareReplay, takeUntil } from "rxjs/operators";
import { CRMMessagesRequest } from "../../dto/conversation/make-activity.dto";
import { TDSMessageService } from "tds-ui/message";
import { TDSHelperArray, TDSHelperString } from "tds-ui/shared/utility";
import { TDSNotificationService } from "tds-ui/notification";
import { CRMTeamDTO } from "../../dto/team/team.dto";

@Injectable({
  providedIn: 'root'
})

export class ActivityDataFacade extends BaseSevice implements OnDestroy {

  prefix: string = "";
  table: string = "";
  baseRestApi: string = "";

  private nextPageUrlCurrent!: string;
  private postExist: Array<any> = [];
  private postIdExist: Array<any> = [];

  private destroy$ = new Subject<void>();
  lstTeam!: any[];
  isProcessing: boolean = false;

  constructor(private apiService: TCommonService,
    private activityFbState: ActivityFacebookState,
    private facebookPostService: FacebookPostService,
    private crmTeamService: CRMTeamService,
    private notification: TDSNotificationService,
    private service: ActivityMatchingService,
    private sgRConnectionService: SignalRConnectionService) {
      super(apiService);

  }


  messageWebhook(model: any) {
    const data = Object.assign({}, model.data);
    if (data?.psid != data?.page_id) {
      if (data.last_activity && data.last_activity.type == 2) {
        let partnerId = _get(data, `last_activity.comment_obj.parent.id`);
        let objectId = _get(data, `last_activity.comment_obj.object.id`);

        if(!partnerId || partnerId == objectId) {
        } else {
            this.webhookAddReplyComment(data);
        }
      } else {
          this.webhookAddMessage(data, model.action);
      }
    }
  }

  messageJob(model: any) {
    const data = Object.assign({}, model.data);
    const psid = data.to_id;
    const pageId = data.account_id;
    // const dateCreated = data.date_created;
    // const type = data.type;

    const dataAdd = this.convertDataMessageJob(data);
    this.activityFbState.updateMessage(pageId, psid, "all", dataAdd);
    this.activityFbState.updateMessage(pageId, psid, "message", dataAdd);
  }

  messageSending(model: any) {
    const data = Object.assign({}, model.data);
    const psid = data.to_id;
    const pageId = data.account_id;

    const dataAdd = this.convertDataMessageJobSending(data);
    this.activityFbState.updateMessage(pageId, psid, "all", dataAdd);
    this.activityFbState.updateMessage(pageId, psid, "message", dataAdd);
  }

  messageFail(model: any) {
    const data = Object.assign({}, model.data);
    const psid = data.to_id;
    const pageId = data.account_id;

    const dataAdd = this.convertDataMessageJobFail(data);
    this.activityFbState.updateMessage(pageId, psid, "all", dataAdd);
    this.activityFbState.updateMessage(pageId, psid, "message", dataAdd);
  }

  messageRetry(model: any) {
    const data = Object.assign({}, model.data);
    const pageId = data.account_id;
    const psid = data.to_id;

    if(TDSHelperString.hasValueString(data.error_messages)) {
      this.notification.error('Gửi lại tin', `Thử gửi lại tin với ${data.to_name} thất bại`, { placement: 'bottomLeft' });
    }
    this.activityFbState.updateRetryMessage(pageId, psid, data);
  }

  messageReplyCommentServer(value: any) {
    let data = Object.assign({}, value);
    let psid = data.to_id;
    let pageId = data.account_id || (value.from && value.from.id ? value.from.id : null);
    let partner_id = _get(data, `partner.id`) || data.parent_id;

    let dataAdd = this.convertDataReplyComment(data);
    if(dataAdd["is_admin"] == null) dataAdd["is_admin"] = true;

    this.activityFbState.addReplyComment(pageId, psid, partner_id, dataAdd);
  }

  messageScanConversation(model: any) {
    let data = Object.assign({}, model.data);
    let pageId = data.account_id;
    let psid = data.psid;

    let dataAdd = this.convertDataScanConversation(data);
    this.activityFbState.addItemActivityAndSort(pageId, psid, "all", dataAdd);
    this.activityFbState.addItemActivityAndSort(pageId, psid, "message", dataAdd);
  }

  messageScanFeed(model: any) {
    let data = Object.assign({}, model.data.activity);
    data["comment"] = model.data.comment;

    let pageId = data.account_id;
    let psid = data.to_id;
    let object_id = data.comment.object.id;

    let dataAdd = this.convertDataScanFeed(data);
  }

  messageWithBill(model: any) {
    let data = Object.assign({}, model.data);
    let pageId = data.page_id || data.account_id;
    let psid = data.psid || data.to_id;

    let dataAdd = this.convertDataMessageWithBill(data);
    this.activityFbState.addItemActivity(pageId, psid, "all", dataAdd);
    this.activityFbState.addItemActivity(pageId, psid, "message", dataAdd);
  }

  messageAddTemplate(model: any) {
    let data = Object.assign({}, model.data);
    let psid = data.to_id;
    let pageId = data.account_id;
    // let dateCreated = data.dateCreated;
    // let type = data.type;

    let dataAdd = this.convertDataAddTemplate(data);
    this.activityFbState.updateMessage(pageId, psid, "all", dataAdd);
    this.activityFbState.updateMessage(pageId, psid, "message", dataAdd);
  }

  messageServer(value: any) {
    let data = Object.assign({}, value);
    let psid = data.to_id;
    let pageId = data.account_id;
    let dateCreated = data.DateCreated;
    let type = data.type;

    let dataAdd = this.convertDataServer(data);

    this.activityFbState.updateMessage(pageId, psid, "all", dataAdd);
    this.activityFbState.updateMessage(pageId, psid, "message", dataAdd);
  }

  webhookAddReplyComment(model: any) {
    const data = Object.assign({}, model.last_activity.comment_obj);
    const pageId = model.page_id;
    const psid = model.psid;
    const partner_id = _get(data, 'parent.id');

    this.activityFbState.addReplyComment(pageId, psid, partner_id, data);
  }

  webhookAddMessage(data: any, action: string) {
    const pageId = data.page_id || data.account_id;
    const psid = data.psid || data.to_id;

    const dataAdd = this.convertDataWebhook(data);
    if(action == "facebook_messages_delivery") {
      dataAdd["is_admin"] = true;
    }

    this.activityFbState.addItemActivity(pageId, psid, "all", dataAdd);
    this.activityFbState.addItemActivity(pageId, psid, "comment", dataAdd);
    this.activityFbState.addItemActivity(pageId, psid, "message", dataAdd);
  }

  convertDataWebhook(data: any) {
    const pageId = data.page_id;
    const last_activity = data.last_activity || data.last_comment || data.last_message || {};

    last_activity.message_formatted = last_activity.message_format || last_activity.message || "";
    const model = {} as any;

    model["type"] = last_activity.type;
    model["is_admin"] = pageId == data.from.id ? true : false;
    model["is_show_avatar"] = true;
    model["from_id"] = data.from.fbid;
    model["isSelected"] = false;
    model["error_message"] = null;
    model["message"] = last_activity.message_obj || last_activity.message;
    model["message_formatted"] = last_activity.message_formatted;
    model["status"] = ActivityStatus.success;
    model["DateCreated"] = last_activity.created_time;
    model["CreatedBy"] = null;
    model["comment"] = last_activity.comment_obj;
    model["Image"] = null;
    model["IsHandledBySystem"] = null;
    model["id"] = _get(data, `last_activity.comment_obj.id`) || data.id;
    model["tpid"] = data.tpid;
    model["fbid"] = last_activity.fbid;
    model["object_id"] = _get(data, `last_activity.comment_obj.object.id`);

    return model;
  }

  convertDataMessageJob(data: any) {
    const attachments = this.createDataAttachments(data.attachment_url);
    const createBy = this.convertCreateByUpperCase(data.create_by);
    const model = {} as any;

    model["type"] = this.getType(data.type);
    model["is_admin"] = data.is_admin != null ? data.is_admin : true;
    model["is_show_avatar"] = true;
    model["from_id"] = data.is_admin ? data.account_id : data.to_id;
    model["isSelected"] = false;
    model["error_message"] = data.error_messages;
    model["message"] = attachments;
    model["message_formatted"] = data.message_formatted;
    model["status"] = TDSHelperString.hasValueString(data.error_messages) ?
                     (!TDSHelperString.hasValueString(data.fbid) ? ActivityStatus.success : ActivityStatus.sending)
                     : ActivityStatus.fail;
    model["DateCreated"] = data.date_created;
    model["CreatedBy"] = createBy;
    model["comment"] = null;
    model["Image"] = null;
    model["IsHandledBySystem"] = createBy;
    model["id"] = data.id || data.fbid || data.tpid;
    model["tpid"] = data.tpid;
    model["fbid"] = data.fbid && data.fbid;

    return model;
  }

  convertDataMessageJobSending(data: any) {
    let attachments = this.createDataAttachments(data.attachment_url);
    let createBy = this.convertCreateByUpperCase(data.create_by);
    const model = {} as any;

    model["type"] = this.getType(data.type);
    model["is_admin"] = data.is_admin != null ? data.is_admin : true;
    model["is_show_avatar"] = true;
    model["from_id"] = data.is_admin ? data.account_id : data.to_id;
    model["isSelected"] = false;
    model["error_message"] = data.error_messages;
    model["message"] = attachments;
    model["message_formatted"] = data.message_formatted;
    model["status"] = ActivityStatus.sending;
    model["DateCreated"] = data.date_created;
    model["CreatedBy"] = createBy;
    model["comment"] = null;
    model["Image"] = null;
    model["IsHandledBySystem"] = createBy;
    model["id"] = data.id || data.tpid || data.fbid;
    model["tpid"] = data.tpid;
    model["fbid"] = data.fbid && data.fbid;

    return model;
  }

  convertDataMessageJobFail(data: any) {
    let attachments = this.createDataAttachments(data.attachment_url);
    let createBy = this.convertCreateByUpperCase(data.create_by);

    const model = {} as any;

    model["type"] = this.getType(data.type);
    model["is_admin"] = data.is_admin != null ? data.is_admin : true;
    model["is_show_avatar"] = true;
    model["from_id"] = data.is_admin ? data.account_id : data.to_id;
    model["isSelected"] = false;
    model["error_message"] = data.error_messages;
    model["message"] = attachments;
    model["message_formatted"] = data.message_formatted;
    model["status"] = ActivityStatus.fail;
    model["DateCreated"] = data.date_created;
    model["CreatedBy"] = createBy;
    model["comment"] = null;
    model["Image"] = null;
    model["IsHandledBySystem"] = createBy;
    model["id"] = data.id || data.tpid || data.fbid;
    model["tpid"] = data.tpid;
    model["fbid"] = data.fbid && data.fbid;

    return model;
  }

  convertDataServer(data: any) {
    const model = {} as any;

    model["type"] = data.type;
    model["is_admin"] = data.is_admin;
    model["is_show_avatar"] = true;
    model["from_id"] = data.account_id;
    model["isSelected"] = false;
    model["error_message"] = data.error_message;
    model["message"] = data.message || data.message_formatted;
    model["message_formatted"] = data.message_formatted;
    // result["status"] = this.getType(data.type);
    model["status"] = ActivityStatus.sending;
    model["DateCreated"] = data.DateCreated;
    model["CreatedBy"] = data.CreatedBy;
    model["comment"] = data.comment || null;
    model["Image"] = null;
    model["IsHandledBySystem"] = data.CreatedBy;
    model["id"] = data.id;
    model["tpid"] = data.fbid;
    model["fbid"] = null;

    return model;
  }

  convertDataReplyComment(data: any) {
    const model = {} as any;

    model["attachment"] = null;
    model["can_hide"] = false;
    model["can_like"] = false;
    model["can_remove"] = false;
    model["can_reply_privately"] = false;
    model["comment_count"] = 0;
    model["comments"] = null;
    model["created_time"] = data.DateCreated || new Date();
    model["from"] = data.from;
    model["id"] = data.id;
    model["is_hidden"] = false;
    model["message"] = data.message || data.message_formatted;
    model["message_tags"] = null;
    model["object"] = { id: data.post_id };
    model["parent"] = { id: data.parent_id };
    model["user_likes"] = false;
    model["is_admin"] = data.is_admin;

    return model;
  }

  convertDataScanConversation(data: any) {
    let attachments = this.createDataAttachments(data.attachment_url);
    const model = {} as any;

    model["type"] = this.getType(data.type);
    model["is_admin"] = data.is_admin;
    model["is_show_avatar"] = true;
    model["from_id"] = data.is_admin ? data.account_id : data.psid;
    model["isSelected"] = false;
    model["error_message"] = false;
    model["message"] = attachments;
    model["message_formatted"] = data.message_formatted;
    model["status"] = ActivityStatus.success;
    model["DateCreated"] = data.date_created;
    model["CreatedBy"] = data.create_by;
    model["comment"] = null;
    model["Image"] = null;
    model["IsHandledBySystem"] = data.create_by;
    model["id"] = data.tpid;
    model["tpid"] = data.tpid;
    model["fbid"] = data.fbid;

    return model;
  }

  convertDataScanFeed(data: any) {
    const model = {} as any;

    model["type"] = this.getType(data.type);
    model["is_admin"] = data.is_admin;
    model["is_show_avatar"] = true;
    model["from_id"] = data.from.id;
    model["isSelected"] = false;
    model["error_message"] = data.error_message;
    model["message"] = data.message;
    model["message_formatted"] = data.message_formatted;
    model["status"] = ActivityStatus.success;
    model["DateCreated"] = data.dateCreated;
    model["CreatedBy"] = data.CreatedBy;
    model["comment"] = data.comment;
    model["Image"] = null;
    model["IsHandledBySystem"] = data.CreatedBy;
    model["object_id"] = data.comment.object.id;
    model["id"] = data.comment.id;
    model["tpid"] = data.tpid;
    model["fbid"] = data.fbid;

    return model;
  }

  convertDataAddTemplate(data: any) {
    let attachments = this.createDataAttachments(data.attachment_url);
    let createBy = this.convertCreateByUpperCase(data.createdBy);

    const model = {} as any;

    model["type"] = this.getType(data.type);
    model["is_admin"] = data.is_admin;
    model["is_show_avatar"] = true;
    model["from_id"] = data.is_admin ? data.account_id : data.to_id;
    model["isSelected"] = false;
    model["error_message"] = data.error_messages;
    model["message"] = attachments || data.message;
    model["message_formatted"] = data.message_formatted;
    model["status"] = ActivityStatus.success;
    model["DateCreated"] = data.dateCreated;
    model["CreatedBy"] = createBy;
    model["comment"] = null;
    model["Image"] = null;
    model["IsHandledBySystem"] = createBy;
    model["id"] = data.id;
    model["tpid"] = data.id;
    model["fbid"] = null;

    return model;
  }

  convertDataMessageWithBill(data: any) {
    let pageId = data.page_id;
    let last_activity = {
        message_formatted: data.message_formatted || data.message || "",
        message: data.message || data.message_formatted || "",
        type: 3,
        created_time: data.date_created,
        fbid: data.fbid,
        message_obj: null,
        comment_obj: null
    };

    const model = {} as any;

    model["type"] = last_activity.type;
    model["is_admin"] = data.is_admin;
    model["is_show_avatar"] = true;
    model["from_id"] = data.is_admin ? data.account_id : data.to_id;
    model["isSelected"] = false;
    model["error_message"] = data.error_messages;
    model["message"] = last_activity.message_obj || last_activity.message;
    model["message_formatted"] = last_activity.message_formatted;
    model["status"] = ActivityStatus.sending;
    model["DateCreated"] = last_activity.created_time;
    model["CreatedBy"] = data.create_by;
    model["comment"] = last_activity.comment_obj;
    model["Image"] = null;
    model["IsHandledBySystem"] = null;
    model["id"] = _get(data, `last_activity.comment_obj.id`) || data.id;
    model["tpid"] = data.tpid;
    model["fbid"] = last_activity.fbid;
    model["object_id"] = _get(data, `last_activity.comment_obj.object.id`);

    return model;
  }

  getType(value: any): any {
    if (value == 1)
      return ConversationType.All;
    else if (value == 2)
      return ConversationType.Comment;
    else if (value == 3)
      return ConversationType.Message;
    else {
      return null;
    }
  }

  convertCreateByUpperCase(user: any) {
    const model = {} as any;
    if(user) {
      model["Name"] = user["Name"] || user["name"];
      model["Id"] = user["Id"] || user["id"];
      model["Avatar"] = user["Avatar"] || user["avatar"];
      model["UserName"] = user["UserName"] || user["userName"];
    }
    return model;
  }

  createDataAttachments(attachment_url: string) {
    const model = {} as any;
    if (TDSHelperString.hasValueString(attachment_url)) {
      model["attachments"] = {};
      model["attachments"]["data"] = [];
      model["attachments"]["data"].push({
          image_data: {
            url: attachment_url
          }
      });
    }
    return model;
  }

  getTeamByPageId(pageId: any) {
    let team = {};
    this.lstTeam.forEach((x: any) => {
      let items = x.Childs.filter((a: any) => {
          if (a.ChannelId == pageId) { return a }
      });
      if (items.length > 0) {
        team = items[0];
      }
    })
    return team;
  }

  private getPost(pageId: string, ids: string) {
  }

  getPostExist(postId: any) {
    let exist = this.postExist.find(x => x.fbid == postId);
    return exist;
  }

  makeActivity(pageId: any, psid: any, type: any): Observable<any> {
    this.activityFbState.initExtrasByPsid(pageId, psid);
    return this.getActivity(pageId, psid, type);
  }

  getActivity(pageId: any, psid: any, type: any): Observable<any> {
    let exist = this.activityFbState.getByType(pageId, psid, type);
    if (exist) {
      return Observable.create((observer :any) => {
          observer.next(exist);
          observer.complete();
      })
    } else {
      let query = this.service.createQuery(pageId, type);

      return this.service.get(query, psid).pipe(map((res: any) => {
          if(res && TDSHelperArray.isArray(res.Items)) {
            res.Items = res.Items.sort((a: any, b: any) => Date.parse(a.DateCreated) - Date.parse(b.DateCreated));
          }

          let value = this.createType(res, query);
          this.activityFbState.setExtras(pageId, psid, value.extras);

          return this.activityFbState.setActivity(pageId, psid, type, value);

      }), shareReplay({ bufferSize: 1, refCount: true }));
    }
  }

  getMessageNearest(pageId: string, psid: string, type: string) {
    let exist = this.activityFbState.getByType(pageId, psid, type);
    if (exist && exist.items) {
      let result = _maxBy(exist.items, 'DateCreated');
      return result;
    }
    return null;
  }

  getMessageAttachments(pageId: string, psid: string, messageId: string): any {
    let exist = this.activityFbState.getExtrasMessage(pageId, psid);
    if (exist) {
      return (exist[messageId] || { attachments: { data: null } }).attachments.data;
    }
    return null;
  }

  isEmpty(obj: any) {
    return Object.keys(obj).length === 0;
  }

  nextData(pageId: string, psid: string, type: string){
    const data = this.activityFbState.getByType(pageId, psid, type) as any;
    let exist = data && data.response?.hasNextPage || data && data.response?.nextPageUrl != this.nextPageUrlCurrent;

    if(this.isProcessing || !exist) {
      // this.hasNextData$.emit(false);
      return;
    }

    // this.hasNextData$.emit(true);
    this.nextPageUrlCurrent = data?.response?.nextPageUrl;

    this.service.getLink(this.nextPageUrlCurrent)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: CRMMessagesRequest): any => {
        if(TDSHelperArray.hasListValue(res.Items)) {

          data.extras.children = { ...data.extras?.children, ...res.Extras?.children };
          data.extras.posts = { ...data.extras?.posts, ...res.Extras?.posts };
          data.items = [ ...res.Items, ...data.items ];

          data.response = this.service.createResponse(res);
          // this.hasNextData$.emit(false);
        } else {
          // this.hasNextData$.emit(false);
        }
      }, error => {
        // this.hasNextData$.emit(false);
        (this.nextPageUrlCurrent as any) = null;
    });
  }

  refreshData(pageId: string, psid: string, type: string): Observable<any> {
    let query = this.service.createQuery(pageId, type) as any;

    return this.service.get(query, psid).pipe(map((res: any) => {
      let value = this.createType(res, query);
      this.activityFbState.setExtras(pageId, psid, value.extras);

      return this.activityFbState.setActivity(pageId, psid, type, value);
    }), shareReplay({ bufferSize: 1, refCount: true }), takeUntil(this.destroy$));
  }

  refreshAttachment(data: any) {
    let psid = data.to_id;
    let pageId = data.account_id;
    this.activityFbState.refreshAttachment(pageId, psid, data);
  }

  createType(data: any, query: any) {
    return {
        items: data.Items,
        extras: data.Extras || {},
        query: query,
        response: this.service.createResponse(data)
    } as any;
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
