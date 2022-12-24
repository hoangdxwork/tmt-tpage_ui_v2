import { Detail_QuickSaleOnlineOrder } from '@app/dto/saleonlineorder/quick-saleonline-order.dto';
import { AutoOrderConfigDTO, ConversationPostConfigDTO, TBotRequestCallbackFailedDTO, AutoLabelConfigDTO, AutoHiddenConfigDTO } from '../dto/configs/post/post-order-config.dto';
import { EventEmitter, Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CoreAPIDTO, CoreApiMethodType, TCommonService, THelperCacheService } from 'src/app/lib';
import { AutoReplyConfigDTO } from '../dto/configs/page-config.dto';
import { FacebookPostDTO, FacebookPostItem } from '../dto/facebook-post/facebook-post.dto';
import { BaseSevice } from './base.service';

@Injectable({
  providedIn: 'root'
})

export class FacebookPostService extends BaseSevice {

  prefix: string = "odata";
  table: string = "";
  baseRestApi: string = "rest/v1.0";

  public currentTeam: any;
  public currentPost: any;
  destroy$ = new Subject<void>();
  responseData!: FacebookPostDTO;
  queryObj: any;

  public onLoadedPost$: EventEmitter<any> = new EventEmitter();
  public disableOnSave$: EventEmitter<boolean> = new EventEmitter<boolean>();

  private readonly _keyCacheDefaultProductPost = '_keycache_default_product_post';

  constructor(private apiService: TCommonService,
    public caheApi: THelperCacheService) {
      super(apiService);
  }

  getDefaultProductPost(): Detail_QuickSaleOnlineOrder | null {
    let item = localStorage.getItem(this._keyCacheDefaultProductPost);
    return item ? JSON.parse(item) : null;
  }

  setDefaultProductPost(product: Detail_QuickSaleOnlineOrder){
    localStorage.setItem(this._keyCacheDefaultProductPost,JSON.stringify(product));
  }

  removeCache(){
    localStorage.removeItem(this._keyCacheDefaultProductPost);
  }

  fetchPosts(teamId: any): Observable<any> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/facebook/fetchposts?teamId=${teamId}`,
      method: CoreApiMethodType.post
    }
    return this.apiService.getData<any>(api, null);
  }

  getByPostParent(teamId: number, postId: string): Observable<any> {
    let queryString = Object.keys(this.queryObj).map(key => {
      return key + '=' + this.queryObj[key]
    }).join('&');

    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/crmteam/${teamId}/getbypostparent?postId=${postId}&${queryString}`,
      method: CoreApiMethodType.get
    }
    return this.apiService.getData<any>(api, null);
  }

  getAutoReplyConfigs(postId: string): Observable<AutoReplyConfigDTO> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/facebookpost/${postId}/autoreplyconfigs`,
      method: CoreApiMethodType.get
    }
    return this.apiService.getData<AutoReplyConfigDTO>(api, null);
  }

  updateAutoReplyConfigs(postId: string, data: AutoReplyConfigDTO): Observable<ConversationPostConfigDTO> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/facebookpost/${postId}/autoreplyconfigs`,
      method: CoreApiMethodType.put
    }
    return this.apiService.getData<ConversationPostConfigDTO>(api, data);
  }

  getAutoLabelConfigs(pageId: string): Observable<AutoLabelConfigDTO> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/facebookpost/${pageId}/autolabelconfigs`,
      method: CoreApiMethodType.get
    }
    return this.apiService.getData<AutoLabelConfigDTO>(api, null);
  }

  updateAutoLabelConfigs(pageId: string, data: AutoLabelConfigDTO): Observable<ConversationPostConfigDTO> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/facebookpost/${pageId}/autolabelconfigs`,
      method: CoreApiMethodType.put
    }
    return this.apiService.getData<ConversationPostConfigDTO>(api, data);
  }

  getOrderConfig(teamId: number, postId: string): Observable<any> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/rest/v2.0/facebookpost/${teamId}_${postId}/autoorderconfigs`,
      method: CoreApiMethodType.get
    }

    return this.apiService.getData<any>(api, null);
  }

  updateOrderConfig(postId: string, isImmediateApply: boolean, data: AutoOrderConfigDTO): Observable<any> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/facebookpost/${postId}/autoorderconfigs?immediateApply=${isImmediateApply}`,
      method: CoreApiMethodType.put
    }

    return this.apiService.getData<any>(api, data);
  }

  updateInteractionConfig(postId: string, data: any): Observable<undefined> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/facebookpost/${postId}/autoorderreplyconfigs`,
      method: CoreApiMethodType.put
    }

    return this.apiService.getData<undefined>(api, data);
  }

  getHiddenCommentConfigs(postId: string): Observable<AutoHiddenConfigDTO> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/facebookpost/${postId}/AutoHiddenConfigs`,
      method: CoreApiMethodType.get
    }

    return this.apiService.getData<AutoHiddenConfigDTO>(api, null);
  }

  updateHiddenCommentConfigs(postId: string, data: AutoHiddenConfigDTO): Observable<ConversationPostConfigDTO> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/facebookpost/${postId}/AutoHiddenConfigs`,
      method: CoreApiMethodType.put
    }

    return this.apiService.getData<ConversationPostConfigDTO>(api, data);
  }

  getReport(postId: string): Observable<TBotRequestCallbackFailedDTO[]> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/facebookpost/${postId}/getreport?id=${postId}`,
      method: CoreApiMethodType.get
    }

    return this.apiService.getData<TBotRequestCallbackFailedDTO[]>(api, null);
  }
}
