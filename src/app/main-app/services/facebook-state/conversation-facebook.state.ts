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

}
