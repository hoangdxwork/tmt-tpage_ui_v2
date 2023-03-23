import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CoreAPIDTO, CoreApiMethodType, TCommonService, THelperCacheService } from 'src/app/lib';
import { BaseSevice } from './base.service';
import { FacebookPostDTO } from '@app/dto/facebook-post/facebook-post.dto';

@Injectable({
  providedIn: 'root'
})

export class GroupCommentsService extends BaseSevice {

  prefix: string = "";
  table: string = "";
  baseRestApi: string = "rest/v1.0/facebookpost";

  constructor(private apiService: TCommonService,
    public caheApi: THelperCacheService) {
      super(apiService);
  }

  getGroupComments(postId: string, params: string ): Observable<FacebookPostDTO> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/${postId}/groupcomments?${params}`,
      method: CoreApiMethodType.get
    }

    return this.apiService.getData<FacebookPostDTO>(api, null);
  }



}
