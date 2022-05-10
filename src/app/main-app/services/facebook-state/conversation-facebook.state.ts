import { Injectable, OnInit } from "@angular/core";
import { get as _get } from 'lodash';

export interface EventDataDict {
  [pageId: string]: any
}

@Injectable({
    providedIn: 'root'
})

export class ConversationFacebookState implements OnInit{

  public dataSource: any = {};
  public eventData: EventDataDict = {};

  ngOnInit(): void {
  }

  get getEvent() {
      return this.eventData;
  }

  public get(pageId: string, type: string) {
    return _get(this.dataSource, `${pageId}.${type}`) as any;
  }

  public setEvent(pageId: string, psid: string, event: any) {
      this.eventData[pageId] = this.eventData[pageId] || this.createEventData(pageId) as any;
      this.eventData[pageId][psid] = event;
  }

  public createEventData(pageId: string) {
      this.eventData[pageId] = this.eventData[pageId] || {};
      return this.eventData[pageId];
  }

  public setConversation(pageId: string, type: string, data: any) {
      this.dataSource[pageId] = this.dataSource[pageId] || {} as any;
      this.dataSource[pageId][type] = data;
      return this.dataSource[pageId][type];
  }

  public getByPsid(pageId: string, type: string, psid: string) {
    let exist = _get(this.dataSource, `${pageId}.${type}.items`) as any;
    if(exist) {
      return exist.find((x: any) => x.psid == psid);
    }
    return null;
  }

  public updateConversation(pageId: string, type: string, psid: string, data: any) {
    let exist = this.getByPsid(pageId, type, psid);

    if(exist && this.checkLastTimeUpdate(data, exist)) {
      this.updateLastUpdated(data, type, exist);

      let dateCreated = new Date(data.LastUpdated || data.last_activity.created_time).getTime() > new Date(exist.LastActivityTimeConverted).getTime() ?
      data.last_activity.created_time : exist.LastActivityTimeConverted;

      exist.last_activity = data.last_activity;
      exist.last_message = data.last_message;
      exist.last_comment = data.last_comment;
      exist.LastActivityTimeConverted = dateCreated;
      exist.LastUpdated = data.LastUpdated || data.DateCreated;

      this.deleteByConversation(pageId, type, exist);
      this.dataSource[pageId][type].items = [exist, ...this.dataSource[pageId][type].items];
    }
  }

  public updateLastUpdated(data: any, type: string, exist?: any) {
    data["LastUpdated"] = data.LastUpdated || data.last_activity.created_time;
    data["LastActivityTimeConverted"] = data.LastUpdated || data.last_activity.created_time;

    let unread_activities = "count_unread_activities";
    let unread_messages = "count_unread_messages";
    let unread_comments = "count_unread_comments";

    if(exist) {
      if(data && data.is_admin == false && type == "all") {
        exist[unread_activities] = this.checkCountUnread(exist[unread_activities]) + 1;
      }
      else if(data && data.is_admin == false && type == "message") {
        exist[unread_messages] = this.checkCountUnread(exist[unread_messages]) + 1;
      }
      else if(data && data.is_admin == false && type == "comment") {
        exist[unread_comments] = this.checkCountUnread(exist[unread_comments]) + 1;
      }

      if(data && data.is_admin == true && type == "all") {
        exist[unread_activities] = 0;
      }
      else if(data && data.is_admin == true && type == "message") {
        exist[unread_messages] = 0;
      }
      else if(data && data.is_admin == true && type == "comment") {
        exist[unread_comments] = 0;
      }
    }
    else {
      if(data && data.is_admin == false && type == "all") {
        data[unread_activities] = 1;
      }
      else if(data && !data.is_admin == false && type == "message") {
        data[unread_messages] = 1;
      }
      else if(data && !data.is_admin == false && type == "comment") {
        data[unread_comments] = 1;
      }
    }
  }

  private checkLastTimeUpdate(dataUpdate: any, dataExist: any): boolean {
    let existTime = dataExist.LastUpdated || (dataExist.last_activity ? dataExist.last_activity.created_time : new Date());
    let newTime = dataUpdate.LastUpdated || (dataUpdate.last_activity ? dataUpdate.last_activity.created_time : new Date());

    if(new Date(newTime).getTime() > new Date(existTime).getTime()) {
      return true;
    }

    return false;
  }

  private checkCountUnread(count: number) {
    if(count <= 0) count = 0;
    return count;
  }


  private deleteByConversation(pageId: string, type: string, item: any) {
    if(item) {
      this.dataSource[pageId][type].items.splice(this.dataSource[pageId][type].items.indexOf(item), 1);
    }
  }

}
