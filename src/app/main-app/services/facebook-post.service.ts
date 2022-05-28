import { EventEmitter, Injectable, OnDestroy, OnInit } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { TAPIDTO, TApiMethodType, TCommonService, THelperCacheService } from 'src/app/lib';
import { TDSHelperArray } from 'tmt-tang-ui';
import { AutoOrderConfigDTO } from '../dto/configs/post/order-config.dto';
import { FacebookPostDTO, FacebookPostItem } from '../dto/facebook-post/facebook-post.dto';
import { BaseSevice } from './base.service';

@Injectable({
  providedIn: 'root'
})

export class FacebookPostService extends BaseSevice implements OnInit, OnDestroy {

  prefix: string = "odata";
  table: string = "";
  baseRestApi: string = "rest/v1.0";

  public currentTeam: any;
  public currentPost: any;
  destroy$ = new Subject();
  responseData!: FacebookPostDTO;
  queryObj: any;

  public onLoadedPost: EventEmitter<any> = new EventEmitter();
  public onRemoveOrderComment: EventEmitter<any> = new EventEmitter();

  constructor(private apiService: TCommonService,
    public caheApi: THelperCacheService) {
      super(apiService);
      this.setQuery();
  }

  ngOnInit() {
  }

  loadPost(data: any) {
    this.currentPost = data;
    this.onLoadedPost.emit(data);
  }

  getByIds(data: any): Observable<any> {
    let api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/facebookpost/get_by_ids`,
      method: TApiMethodType.post
    }

    return this.apiService.getData<any>(api, data);
  }

  fetchPosts(teamId: any): Observable<any> {
    let api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/facebook/fetchposts?teamId=${teamId}`,
      method: TApiMethodType.post
    }
    return this.apiService.getData<any>(api, null);
  }

  refetch(id: any): Observable<any> {
    let api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/facebookpost/${id}/refetch`,
      method: TApiMethodType.post
    }
    return this.apiService.getData<any>(api, null);
  }


  getPostByPageId(pageId: string, postId: string): Observable<any>{
    let api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/crmteam/facebookpost?pageId=${pageId}&postId=${postId}`,
      method: TApiMethodType.get
    }

    return this.apiService.getData<FacebookPostDTO>(api, null)
      .pipe(takeUntil(this.destroy$))
      .pipe(map((res: FacebookPostDTO) => {
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

    let api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/crmteam/${teamId}/getbypostparent?postId=${postId}&${queryString}`,
      method: TApiMethodType.get
    }
    return this.apiService.getData<any>(api, null);
  }

  getPostsByTeamId(teamId: number, link?: string, type?: string, eventType?: string, text?: string): Observable<any> {
    if(link) {
      let api: TAPIDTO = {
        url: `${this._BASE_URL}/${link}`,
        method: TApiMethodType.get
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

      let api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.baseRestApi}/crmteam/${teamId}/facebookposts?${queryString}`,
        method: TApiMethodType.get
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

  getAutoReplyConfigs(key: any): Observable<any> {
    let api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/facebookpost/${key}/AutoReplyConfigs`,
      method: TApiMethodType.get
    }
    return this.apiService.getData<any>(api, null);
  }

  updateAutoReplyConfigs(key: any, data: any): Observable<any> {
    let api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/facebookpost/${key}/AutoReplyConfigs`,
      method: TApiMethodType.put
    }
    return this.apiService.getData<any>(api, data);
  }

  getAutoLabelConfigs(key: any): Observable<any> {
    let api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/facebookpost/${key}/AutoLabelConfigs`,
      method: TApiMethodType.get
    }
    return this.apiService.getData<any>(api, null);
  }

  updateAutoLabelConfigs(key: any,data: any): Observable<any> {
    let api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/facebookpost/${key}/AutoLabelConfigs`,
      method: TApiMethodType.put
    }
    return this.apiService.getData<any>(api, data);
  }

  // POST CONFIG

  getOrderConfig(postId: string): Observable<AutoOrderConfigDTO> {
    let api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/facebookpost/${postId}/autoorderconfigs`,
      method: TApiMethodType.get
    }

    return this.apiService.getData<AutoOrderConfigDTO>(api, null);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
