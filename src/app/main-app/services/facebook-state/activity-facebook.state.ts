import { Injectable, OnInit } from "@angular/core";
import { get as _get } from 'lodash';
import { ActivityStatus } from "src/app/lib/enum/message/coversation-message";

@Injectable({
  providedIn: 'root'
})

export class ActivityFacebookState implements OnInit{

  private dataSource: any = {};
  private extras: any = {};

  ngOnInit(): void {}

  public initExtrasByPsid(pageId: string, psid: string) {
    this.extras[pageId] = this.extras[pageId] || {};
    this.extras[pageId][psid] = this.extras[pageId][psid] || {};
  }

  public initActivityByType(pageId: string, psid: string, type: string) {
    this.dataSource[pageId] = this.dataSource[pageId] || {};
    this.dataSource[pageId][psid] = this.dataSource[pageId][psid] || {};
    this.dataSource[pageId][psid][type] = this.dataSource[pageId][psid][type] || {};
  }

  public initActivityExtrasByPartnerId(pageId: string, psid: string, partnerId: string) {
    let existAll = _get(this.dataSource, `${pageId}.${psid}.all.extras`);
    if(existAll) {
      this.dataSource[pageId][psid]["all"].extras.children = this.dataSource[pageId][psid]["all"].extras.children || {};
      this.dataSource[pageId][psid]["all"].extras.children[partnerId] = this.dataSource[pageId][psid]["all"].extras.children[partnerId] || [];
    }

    let existComment = _get(this.dataSource, `${pageId}.${psid}.comment.extras`);
    if(existComment) {
      this.dataSource[pageId][psid]["comment"].extras.children = this.dataSource[pageId][psid]["comment"].extras.children || {};
      this.dataSource[pageId][psid]["comment"].extras.children[partnerId] = this.dataSource[pageId][psid]["comment"].extras.children[partnerId] || [];
    }
  }

  public getExtrasMessage(pageId: string, psid: string) {
    let exist = _get(this.extras, `${pageId}.${psid}.messages`);
    return exist;
  }

  public getByPsid(pageId: string, psid: string) {
    let exist = _get(this.dataSource, `${pageId}.${psid}`);
    return exist;
  }

  public getByType(pageId: string, psid: string, type: string) {
    let exist = _get(this.dataSource, `${pageId}.${psid}.${type}`);
    return exist;
  }

  public getPost(pageId: string, psid: string, type: string, object_id: string) {
    let exist = _get(this.dataSource, `${pageId}.${psid}.${type}.extras.posts${object_id}`);
    return exist;
  }

  public setExtras(pageId: any, psid: string, data: any) {
    this.initExtrasByPsid(pageId, psid);
    this.extras[pageId][psid] = { ...([pageId] as any)[psid], ...data };

    return this.extras[pageId][psid];
  }

  public setActivity(pageId: string, psid: string, type: string, data: any) {
    this.initActivityByType(pageId, psid, type);
    this.dataSource[pageId][psid][type] = data;

    return this.dataSource[pageId][psid][type];
  }

  public addReplyComment(pageId: string, psid: string, partnerId: string, data: any) {
    this.initActivityExtrasByPartnerId(pageId, psid, partnerId);

    let extrasAll = _get(this.dataSource, `${pageId}.${psid}.all.extras.children`);
    if(extrasAll) {
      extrasAll[partnerId] = extrasAll[partnerId] || [];
      extrasAll[partnerId] = [data, ...extrasAll[partnerId]];
    }

    let extrasComment = _get(this.dataSource, `${pageId}.${psid}.comment.extras.children`);
    if(extrasComment) {
      extrasComment[partnerId] = extrasComment[partnerId] || [];
      extrasComment[partnerId] = [...extrasComment[partnerId], data];
    }
  }

  public addItemActivity(pageId: string, psid: string, type: string, data: any) {
    this.updateLastUpdated(data, data.DateCreated);

    let exist = _get(this.dataSource, `${pageId}.${psid}.${type}`);
    if(exist && exist.items && exist.items.length >= 0) {

      if(data.message && data.message.id && exist.items.findIndex((x: any) => x.fbid == data.message.id) >= 0) return;

      if(!data.fbid && data.message && data.message.id) {
        data.fbid = data.message.id;
      }

      exist.items = [...exist.items, data];
    }
  }

  public addItemActivityAndSort(pageId: string, psid: string, type: string, data: any) {
    this.updateLastUpdated(data, data.DateCreated);
    let exist = _get(this.dataSource, `${pageId}.${psid}.${type}`);

    if(exist) {
      exist.items = [...exist.items, data];
    }
  }

  public addPost(pageId: string, psid: string, type: string, objectId: string, post: any) {
    let exist = _get(this.dataSource, `${pageId}.${psid}.${type}.extras.posts.${objectId}`);
    let existType = _get(this.dataSource, `${pageId}.${psid}.${type}`);

    if(!exist && existType) {
      this.dataSource[pageId][psid][type].extras.posts[objectId] = post;
    }
  }

  public updateRetryMessage(pageId: string, psid: string, data: any) {
    let existAll = this.getByType(pageId, psid, "all");
    let existMessage = this.getByType(pageId, psid, "message");

    if(existAll) {
      let message = existAll.items.find((e: any) => e.id == data.tpid && data.tpid) ||
        existAll.items.find((e: any) => e.id == data.fbid && data.fbid) ||
        existAll.items.find((e: any) => e.tpid == data.tpid && data.tpid);

      if(message) {
        message["error_message"] = data.error_messages;
        message.DateCreated = new Date(); //data.date_created;
        message.fbid = data.fbid;
        message.status = !data.error_messages && data.error_messages != "" ? ActivityStatus.success: ActivityStatus.fail;

        this.deleteByMessage(pageId, psid, "all", message);
        this.addItemActivity(pageId, psid, "all", message);
      }
    }

    if(existMessage) {
      let message = existMessage.items.find((e: any) => e.id == data.tpid && data.tpid) ||
      existMessage.items.find((e: any) => e.id == data.fbid && data.fbid) ||
      existMessage.items.find((e: any) => e.tpid == data.tpid && data.tpid);

      if(message) {
        message["error_message"] = data.error_messages;
        message.DateCreated = new Date(); //data.date_created;
        message.fbid = data.fbid;
        message.status = !data.error_messages && data.error_messages != "" ? ActivityStatus.success: ActivityStatus.fail;

        this.deleteByMessage(pageId, psid, "message", message);
        this.addItemActivity(pageId, psid, "message", message);
      }
    }
  }

  public updateLastUpdated(item: any, time: any) {
    item["LastUpdated"] = time;
  }

  public updateMessage(pageId: string, psid: string, type: string, data: any) {
    this.updateLastUpdated(data, data.DateCreated);
    let exist = this.getByType(pageId, psid, type);

    if(exist) {
      let message = exist.items.find((e: any) => e.id == data.id && data.id) ||
        exist.items.find((e: any) => e.tpid == data.tpid && data.tpid) ||
        exist.items.find((e: any) => e.id == data.tpid && data.tpid) ||
        exist.items.find((e: any) => e.fbid == data.fbid && data.fbid) ||
        exist.items.find((e: any) => e.fbid == data.tpid && data.tpid);

      if(message) {
        let status = !data.error_message && data.error_message != "" ? ActivityStatus.success: ActivityStatus.fail;

        message.error_message = data.error_message;
        message.status = status;
        message.fbid = data.fbid;

        if(data.DateCreated > message.DateCreated) {
          message.DateCreated = data.message.DateCreated;
        }

      } else {
          this.addItemActivity(pageId, psid, type, data);
      }
    }
  }

  refreshAttachment(pageId: string, psid: string, data: any) {
    let existAll = this.getByType(pageId, psid, "all");
    if(existAll) {
      let item = existAll["items"].find((x: any) => (x.message && x.message.id == data.message_id));
      item && (item.message = data.message);
    }

    let existMessage = this.getByType(pageId, psid, "message");
    if(existMessage) {
      let item = existMessage["items"].find((x: any) => (x.message && x.message.id == data.message_id));
      item && (item.message = data.message);
    }
  }

  deleteByMessage(pageId: string, psid: string, type: string, mess: any) {
    if(mess) {
      this.dataSource[pageId][psid][type].items.splice(this.dataSource[pageId][psid][type].items.indexOf(mess), 1);
    }
  }

}
