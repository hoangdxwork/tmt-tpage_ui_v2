import { EventEmitter, Injectable,  Output } from '@angular/core';
import { Observable } from 'rxjs';
import { CoreAPIDTO, CoreApiMethodType, TCommonService, THelperCacheService } from 'src/app/lib';
import { OdataCommentOrderPostDTO } from '../dto/conversation/post/comment-order-post.dto';
import { BaseSevice } from './base.service';

@Injectable()

export class FacebookCommentService extends BaseSevice  {

  @Output() onFilterSortCommentPost$ = new EventEmitter<any>();

  prefix: string = "odata";
  table: string = "";
  baseRestApi: string = "rest/v1.0";

  constructor(private apiService: TCommonService,
    public caheApi: THelperCacheService) {
    super(apiService);
  }

  fetchComments(teamId: number, postId: string): Observable<any>{
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/facebook/fetchcomments?teamId=${teamId}&postId=${postId}`,
      method: CoreApiMethodType.post
    }
    return this.apiService.getData<any>(api, null);
  }

  getCommentsOrderByPost(id: any): Observable<any> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/SaleOnline_Facebook_Post/ODataService.GetCommentOrders?$expand=orders&PostId=${id}`,
      method: CoreApiMethodType.get
    }
    return this.apiService.getData<OdataCommentOrderPostDTO>(api, null);
  }

  chatomniGetCommentsOrders(teamId: any, objectId: any): Observable<any> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/saleonine_livecampaign/getcommentorders?teamId=${teamId}&objectId=${objectId}`,
      method: CoreApiMethodType.get
    }
    return this.apiService.getData<OdataCommentOrderPostDTO>(api, null);
  }

}
