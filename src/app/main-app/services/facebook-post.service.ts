import { Detail_QuickSaleOnlineOrder } from '@app/dto/saleonlineorder/quick-saleonline-order.dto';
import { AutoOrderConfigDTO, ConversationPostConfigDTO, TBotRequestCallbackFailedDTO, AutoLabelConfigDTO, AutoHiddenConfigDTO } from '../dto/configs/post/post-order-config.dto';
import { EventEmitter, Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { CoreAPIDTO, CoreApiMethodType, TCommonService, THelperCacheService } from 'src/app/lib';
import { TDSHelperArray } from 'tds-ui/shared/utility';
import { AutoReplyConfigDTO } from '../dto/configs/page-config.dto';
import { FacebookPostDTO, FacebookPostItem } from '../dto/facebook-post/facebook-post.dto';
import { BaseSevice } from './base.service';

@Injectable({
  providedIn: 'root'
})

export class FacebookPostService extends BaseSevice implements OnDestroy {

  prefix: string = "odata";
  table: string = "";
  baseRestApi: string = "rest/v1.0";

  public currentTeam: any;
  public currentPost: any;
  destroy$ = new Subject<void>();
  responseData!: FacebookPostDTO;
  queryObj: any;

  public onLoadedPost$: EventEmitter<any> = new EventEmitter();

  private readonly _keyCacheDefaultProductPost = '_keycache_default_product_post';

  constructor(private apiService: TCommonService,
    public caheApi: THelperCacheService) {
      super(apiService);
      this.setQuery();
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

  loadPost(data: any) {
    this.currentPost = data;
    this.onLoadedPost$.emit(data);
  }

  getByIds(data: any): Observable<any> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/facebookpost/get_by_ids`,
      method: CoreApiMethodType.post
    }

    return this.apiService.getData<any>(api, data);
  }

  fetchPosts(teamId: any): Observable<any> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/facebook/fetchposts?teamId=${teamId}`,
      method: CoreApiMethodType.post
    }
    return this.apiService.getData<any>(api, null);
  }

  refetch(id: any): Observable<any> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/facebookpost/${id}/refetch`,
      method: CoreApiMethodType.post
    }
    return this.apiService.getData<any>(api, null);
  }


  getPostByPageId(pageId: string, postId: string): Observable<any>{
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/crmteam/facebookpost?pageId=${pageId}&postId=${postId}`,
      method: CoreApiMethodType.get
    }

    return this.apiService.getData<FacebookPostDTO>(api, null)
      .pipe(takeUntil(this.destroy$)).pipe(map((res: FacebookPostDTO) => {
        if(res && TDSHelperArray.isArray(res.Items)){
           res.Items.map((x: any) => {
            if (x.attachments && x.attachments.data) {
                let att = x.attachments.data[0];
                x.description = att.title;
                x.type = att.type;
            }
          });
          res.Items = res.Items.sort((a: any, b :any) => Date.parse(a.DateCreated) - Date.parse(b.DateCreated))
        }
      }));
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

  getPostsByTeamId(teamId: number, link?: string, type?: string, eventType?: string, text?: string): Observable<any> {
    if(link) {
      let api: CoreAPIDTO = {
        url: `${link}`,
        method: CoreApiMethodType.get
      }

      return this.apiService.getData<any>(api, null)
        .pipe(takeUntil(this.destroy$))
        .pipe(map((res: any) => {
            this.onResolveData(res);
            return res;
        }));
    } else {
      let queryString = Object.keys(this.queryObj).map(key => {
          return key + '=' + this.queryObj[key]
      }).join('&');

      if(eventType == 'TYPE') {
        queryString = queryString + '&type=' + type;
      } else if(eventType == 'SORT') {
        queryString = queryString + '&sort=' + type;
      }

      if(text) {
        queryString = queryString + '&q=' + text;
      }

      let api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.baseRestApi}/crmteam/${teamId}/facebookposts?${queryString}`,
        method: CoreApiMethodType.get
      }

      return this.apiService.getData<any>(api, null)
        .pipe(takeUntil(this.destroy$))
        .pipe(map((res: FacebookPostDTO) => {
            this.onResolveData(res);
            return res;
      }));
    }
  }

  // Gọi hàm => this.queryObj = query hoặc {page: 1, limit: 20};
  public setQuery(query?: any) {
    this.queryObj = query || {
        page: 1,
        limit: 20,
    };
  }

  private onResolveData(data :any) {
    if (data?.Items as FacebookPostItem[]) {
        data.Items.map((x: FacebookPostItem) => {
            if (x.attachments && x.attachments.data) {
                let att = x.attachments.data[0];
                x.description = att.title;
                x.type = att.type;
            }
        });
    }
    this.responseData = data;
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
