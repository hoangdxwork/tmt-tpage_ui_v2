import { EventEmitter, Injectable, OnDestroy, OnInit } from '@angular/core';
import {  Observable, ReplaySubject, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { TAPIDTO, TApiMethodType, TCommonService, THelperCacheService } from 'src/app/lib';
import { TDSHelperArray } from 'tmt-tang-ui';
import { FacebookPostDTO, FacebookPostItem } from '../dto/facebook-post/facebook-post.dto';
import { ArrayHelper } from '../shared/helper/array.helper';
import { BaseSevice } from './base.service';

@Injectable({
  providedIn: 'root'
})

export class FacebookCommentService extends BaseSevice implements  OnDestroy {

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

  getCommentsOrderByPost(id: any): Observable<any> {
    let api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/SaleOnline_Facebook_Post/ODataService.GetCommentOrders?$expand=orders&PostId=${id}`,
      method: TApiMethodType.get
    }
    return this.apiService.getData<any>(api, null);
  }


  getCommentsByPostId(postId: string): Observable<any> {
    let queryString = Object.keys(this.queryObj).map(key => {
        return key + '=' + this.queryObj[key]
    }).join('&');

    let api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.baseRestApi}/facebookpost/${postId}/comments?${queryString}`,
        method: TApiMethodType.get
    }

    return this.apiService.getData<any>(api, null)
      .pipe(takeUntil(this.destroy$))
      .pipe(map((res: any) => {
          this.onResolveData(res, postId);
          return res;
      }));
  }

  onResolveData(data: any, postId: string) {
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
