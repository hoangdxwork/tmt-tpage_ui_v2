import { EventEmitter, Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { TAPIDTO, TApiMethodType, TCommonService } from "src/app/lib";
import { BaseSevice } from "../base.service";
import { CRMMessagesRequest } from '../../dto/conversation/make-activity.dto';
import { TDSSafeAny } from "tds-ui/shared/utility";
import { PagingTimestampLowcase, QueryStateConversationDTO_v2 } from "./conversation.service";

@Injectable({
  providedIn: 'root'
})

export class ActivityMatchingService extends BaseSevice  {

  prefix: string = "odata";
  table: string = "CRMActivity";
  baseRestApi: string = "rest/v1.0/crmmatching";
  baseRestApi_v2: string = "rest/v2.0/chatomni";

  private activity: any = {};
  private extras: any = {};

  public dataSource$!: Observable<any>;
  public onGetComment$: EventEmitter<any> = new EventEmitter();
  public onCopyMessageHasAminRequired$: EventEmitter<any> = new EventEmitter();
  public currentUrlNext!: string;

  constructor(private apiService: TCommonService) {
    super(apiService)
  }

  get(queryObj: any, psid: any, url?: any): Observable<any> {
    if (url) {
        return this.getLink(url);
    } else {
      let queryString = Object.keys(queryObj).map(key => {
          return key + '=' + queryObj[key]
      }).join('&');

      let api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.baseRestApi}/${psid}/messages?${queryString}`,
        method: TApiMethodType.get,
      }
      return this.apiService.getData<CRMMessagesRequest>(api, null);
    }
  }

  get_v2(queryObj: any, teamId: number, psid: any, url?: any): Observable<any> {
    if (url) {
        return this.getLink_v2(url);
    } else {
      let queryString = Object.keys(queryObj).map(key => {
          return key + '=' + queryObj[key]
      }).join('&');

      let api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.baseRestApi_v2}/${teamId}_${psid}/messages?${queryString}`,
        method: TApiMethodType.get,
      }
      return this.apiService.getData<any>(api, null);
    }
  }

  get_v3(teamId: number, psid: any, type?: string): Observable<any> {
      let api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.baseRestApi_v2}/${teamId}_${psid}/messages?type=${type}`,
        method: TApiMethodType.get,
      }
      return this.apiService.getData<any>(api, null);
  }

  get_v2_comment(teamId: number, objectId: any): Observable<any> {

    let api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi_v2}/${teamId}_${objectId}/comments`,
      method: TApiMethodType.get,
    }
    return this.apiService.getData<any>(api, null);
  }

  getLink(url: string): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
      url: `${url}`,
      method: TApiMethodType.get,
    }
    return this.apiService.getData<CRMMessagesRequest>(api, null);
  }

  getLink_v2(url: string): Observable<TDSSafeAny> {
    if(url != this.currentUrlNext) {
        this.currentUrlNext = url; // check phân trang bị trùng
        const api: TAPIDTO = {
          url: `${url}`,
          method: TApiMethodType.get,
        }
        return this.apiService.getData<any>(api, null);
    } else {
      return of({} as any);
    }
  }

  createQuery(pageId: any, type: any, page?: any, limit?: any) {
    return {
      page_id: pageId,
      type: type,
      page: page || 1,
      limit: limit || 20,
    } as any;
  }

  createQuery_v2(type: any) {
    return {
        type: type,
    } as any;
  }

  createResponse(response: any) {
    return {
      hasNextPage: response.HasNextPage,
      nextPageUrl: response.NextPage,
      pageSize: response.PageSize,
      totalCount: response.TotalCount,
      totalPages: response.TotalPages
    } as any;
  }

  createResponse_v2(response: any): any {
    if(response && response.Paging) {
        return {
            hasNext: response.Paging.HasNext,
            next: response.Paging.Next,
            urlNext: response.Paging.UrlNext
        } as PagingTimestampLowcase;
    }
  }

  refreshAttachment(id: string, message_id: string, image_id: string): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/rest/v1.0/crmactivity/${id}/refreshattachment?message_id=${message_id}&image_id=${image_id}`,
      method: TApiMethodType.post,
    }
    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  retryMessage(id: string, page_id: string): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/rest/v1.0/crmactivity/${id}/queueretrymessage?page_id=${page_id}`,
      method: TApiMethodType.post,
    }
    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  addLikeComment(data: any): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/rest/v1.0/facebook/addlikecomment`,
      method: TApiMethodType.post,
    }
    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  hideComment(data: any): Observable<TDSSafeAny> {
  const api: TAPIDTO = {
      url: `${this._BASE_URL}/rest/v1.0/facebook/hidecomment`,
      method: TApiMethodType.post,
    }
    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  replyComment(teamId: number, data: any): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/rest/v1.0/facebook/replycomment?teamId=${teamId}`,
      method: TApiMethodType.post,
    }
    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  addQuickReplyComment(data: any): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/rest/v1.0/crmactivity/quickreplycomment`,
      method: TApiMethodType.post,
    }
    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  addTemplateManyMessage(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/rest/v1.0/crmactivity/addtemplatemanymessage`,
      method: TApiMethodType.post,
    }
    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  addManyMailTemplateMessage(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/rest/v1.0/crmactivity/addmailtemplatemessage`,
      method: TApiMethodType.post,
    }
    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  addManyMessage(data: TDSSafeAny, page_id: TDSSafeAny): Observable<any> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/rest/v1.0/crmactivity/${page_id}/addmanymessage`,
      method: TApiMethodType.post,
    }
    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  addTemplateMessage(psid: string, data: any): Observable<TDSSafeAny> {
    if(data.to_id) {
      psid = data.to_id;
    }
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/rest/v1.0/crmactivity/${psid}/addtemplatemessage`,
      method: TApiMethodType.post,
    }
    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  assignUser(psid:string, data: any){
    if(data.to_id) {
      psid = data.to_id;
    }
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/${psid}/assignuser`,
      method: TApiMethodType.post,
    }
    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  assignTagToConversation(psid: string, tagId: string, pageId: string){
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/${psid}/updatetag`,
      method: TApiMethodType.post
    }
    let model = {
      pageId: pageId,
      action: 'add',
      tagId: tagId
    }
    return this.apiService.getData<TDSSafeAny>(api, model);
  }

  removeTagFromConversation(psid: string, tagId: string, pageId: string){
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/${psid}/updatetag`,
      method: TApiMethodType.post
    }
    let model =  {
      pageId: pageId,
      action: 'remove',
      tagId: tagId
    }
    return this.apiService.getData<TDSSafeAny>(api, model);
  }

  assignUserToConversation(psid: string, userId: string, pageId: string) {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/${psid}/assignuser`,
      method: TApiMethodType.post
    }

    let model = {
      pageId: pageId,
      userId: userId
    }
    return this.apiService.getData<TDSSafeAny>(api, model);
  }

}
