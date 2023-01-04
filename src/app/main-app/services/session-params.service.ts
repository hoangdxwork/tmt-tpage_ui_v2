import { QueryFilterConversationDto } from './../dto/conversation-all/chatomni/chatomni-conversation';
import { ChatomniDataItemDto } from './../dto/conversation-all/chatomni/chatomni-data.dto';
import { ChatomniObjectsItemDto } from './../dto/conversation-all/chatomni/chatomni-objects.dto';
import { SessionParamsDto } from './../pages/conversations/conversation-post/conversation-post.component';
import { TDSHelperString } from 'tds-ui/shared/utility';
import { ChatomniConversationService } from './chatomni-service/chatomni-conversation.service';
import { ChatomniObjectService } from './chatomni-service/chatomni-object.service';
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class SessionParamsService {
  constructor(
    private chatomniObjectService: ChatomniObjectService,
    private chatomniConversationService: ChatomniConversationService) {
  }

  // SessionStoragePost
  setSessionStoragePostId(item: ChatomniObjectsItemDto | ChatomniDataItemDto ): any {
    const _keyCache = this.chatomniObjectService._keycache_params_postid;
    let data: SessionParamsDto = {
      ObjectId: item.ObjectId,
      ParentId: '',
    }

    if(item && TDSHelperString.hasValueString(item.ParentId)) {
      data.ParentId = item.ParentId;
    }

    sessionStorage.setItem(_keyCache, JSON.stringify(data));
  }

  getSessionStoragePostId(): any {
    const _keyCache = this.chatomniObjectService._keycache_params_postid;
    let item = sessionStorage.getItem(_keyCache) as any;

    if(item) {
        return JSON.parse(item);
    } else {
        return null;
    }
  }

  removeSessionStoragePostId() {
    const _keyCache = this.chatomniObjectService._keycache_params_postid;
    sessionStorage.removeItem(_keyCache);
  }

  // SessionStorageConversation
  setSessionStorageConversationId(id: string): any {
    const _keyCache = this.chatomniConversationService._keycache_params_csid;
    sessionStorage.setItem(_keyCache, JSON.stringify(id));
  }

  getSessionStorageConversationId(): any {
    const _keyCache = this.chatomniConversationService._keycache_params_csid;
    let item = sessionStorage.getItem(_keyCache) as any;

    if(item) {
        return JSON.parse(item);
    } else {
        return null;
    }
  }

  removeSessionStorageConversationId() {
    const _keyCache = this.chatomniConversationService._keycache_params_csid;
    sessionStorage.removeItem(_keyCache);
  }

  // QueryObj
  setQueryObjConversation(queryObj: QueryFilterConversationDto): any {
    const _keyCache = this.chatomniConversationService._keyQueryObj_conversation_all;
    localStorage.setItem(_keyCache, JSON.stringify(queryObj));
  }

  getQueryObjConversation(): any {
    const _keyCache = this.chatomniConversationService._keyQueryObj_conversation_all;
    let item = localStorage.getItem(_keyCache) as any;

    if(item) {
        return JSON.parse(item);
    } else {
        return null;
    }
  }

  removeQueryObjConversation() {
    const _keyCache = this.chatomniConversationService._keyQueryObj_conversation_all;
    localStorage.removeItem(_keyCache);
  }

  removeStorageAll() {
    this.removeSessionStorageConversationId();
    this.removeSessionStoragePostId();
    this.removeQueryObjConversation();
  }
}
