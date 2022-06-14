import { EventEmitter, Injectable, OnDestroy, OnInit, Output } from '@angular/core';
import {  Observable, ReplaySubject, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { TAPIDTO, TApiMethodType, TCommonService, THelperCacheService } from 'src/app/lib';
import { RequestCommentByGroup } from '../dto/conversation/post/comment-group.dto';
import { OdataCommentOrderPostDTO } from '../dto/conversation/post/comment-order-post.dto';
import { RequestCommentByPost } from '../dto/conversation/post/comment-post.dto';
import { CheckFacebookIdDTO, FacebookPostDTO, FacebookPostItem } from '../dto/facebook-post/facebook-post.dto';
import { ArrayHelper } from '../shared/helper/array.helper';
import { BaseSevice } from './base.service';

@Injectable({
  providedIn: 'root'
})

export class FacebookCommentService extends BaseSevice implements  OnDestroy {

  @Output() onFilterSortCommentPost$ = new EventEmitter<any>();

  prefix: string = "odata";
  table: string = "";
  baseRestApi: string = "rest/v1.0";

  private queryObj: any;
  private queryObj2: any;
  public queryObj3: any;
  public allItems: any;
  public dataResponse: any;
  public currentItems!: any[];


  private destroy$: Subject<void> = new Subject<void>();

  constructor(private apiService: TCommonService,
    public caheApi: THelperCacheService) {
    super(apiService);
      this.setQuery();
  }

  setSort(sort: string): void {
    if (!this.queryObj) {
        this.setQuery();
    }
    this.queryObj.sort = sort;
  }

  private setQuery(query?: any) {
    this.queryObj = query || {
        page: 1,
        limit: 50
    };
    this.queryObj2 = query || {
        page: 1,
        limit: 200
    };
    this.queryObj3 = query || {
        page: 1,
        limit: 200
    };
  }

  fetchComments(teamId: number, postId: string): Observable<any>{
    let api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/facebook/fetchcomments?teamId=${teamId}&postId=${postId}`,
      method: TApiMethodType.post
    }
    return this.apiService.getData<any>(api, null);
  }

  getCommentsOrderByPost(id: any): Observable<any> {
    let api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/SaleOnline_Facebook_Post/ODataService.GetCommentOrders?$expand=orders&PostId=${id}`,
      method: TApiMethodType.get
    }
    return this.apiService.getData<OdataCommentOrderPostDTO>(api, null);
  }


  getCommentsByPostId(postId: string): Observable<any> {
    let queryString = Object.keys(this.queryObj).map(key => {
        return key + '=' + this.queryObj[key]
    }).join('&');

    let api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.baseRestApi}/facebookpost/${postId}/comments?${queryString}`,
        method: TApiMethodType.get
    }

    return this.apiService.getData<RequestCommentByPost>(api, null)
      .pipe(takeUntil(this.destroy$))
      .pipe(map((res: RequestCommentByPost) => {
          this.onResolveData(res, postId);
          return res;
      }));
  }

  getFilterCommentsByPostId(postId: string): Observable<any> {
    let queryString = Object.keys(this.queryObj3).map(key => {
        return key + '=' + this.queryObj3[key]
    }).join('&');

    let api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.baseRestApi}/facebookpost/${postId}/filtercomments?${queryString}`,
        method: TApiMethodType.get
    }
    return this.apiService.getData<any>(api, null);
  }

  getGroupCommentsByPostId(postId: string): Observable<any> {
    let queryString = Object.keys(this.queryObj).map(key => {
        return key + '=' + this.queryObj[key]
    }).join('&');

    let api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.baseRestApi}/facebookpost/${postId}/groupcomments?${queryString}`,
        method: TApiMethodType.get
    }
    return this.apiService.getData<RequestCommentByGroup>(api, null);
  }

  getManageCommentsByLimit(postId: string){
    let queryString = Object.keys(this.queryObj3).map(key => {
        return key + '=' + this.queryObj3[key]
    }).join('&');
    let api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.baseRestApi}/facebookpost/${postId}/comments?${queryString}`,
        method: TApiMethodType.get
    }
    return this.apiService.getData<RequestCommentByPost>(api, null)
      .pipe(takeUntil(this.destroy$))
      .pipe(map((res: RequestCommentByPost) => {
          this.onResolveData(res, postId);
          return res;
      }));
  }

  getReportCommentByPost(postId: string): Observable<any>{
    let api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/facebookpost${postId}/getreport?id=${postId}`,
      method: TApiMethodType.post
    }

    return this.apiService.getData<any>(api, null);
  }

  getCustomersByFacebookId(psid: string, postId: string, teamId: number): Observable<CheckFacebookIdDTO> {
    let api: TAPIDTO = {
      url: `${this._BASE_URL}/api/facebook/checkfacebookid?asuid=${psid}&postid=${postId}&teamId=${teamId}`,
      method: TApiMethodType.get
    }

    return this.apiService.getData<CheckFacebookIdDTO>(api, null);
  }

  onResolveData(data: RequestCommentByPost, postId: string) {
    this.allItems = this.allItems || {};

    if (!this.allItems[postId]) {
        this.allItems[postId] = [];
    }

    this.dataResponse = data;
    this.currentItems = data.Items;
    this.allItems[postId] = ArrayHelper.makeUniqueArray(this.allItems[postId], data.Items, "Id");
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
