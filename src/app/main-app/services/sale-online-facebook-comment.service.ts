import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CoreAPIDTO, CoreApiMethodType, TCommonService } from "src/app/lib";
import { SaleOnline_Facebook_CommentFilterResultDTO } from "../dto/coversation-order/conversation-order.dto";
import { ODataResponsesDTO } from "../dto/odata/odata.dto";
import { BaseSevice } from "./base.service";

@Injectable({
  providedIn: 'root'
})

export class SaleOnline_FacebookCommentService extends BaseSevice {

  prefix: string = "odata";
  table: string = "SaleOnline_Facebook_Comment";
  baseRestApi: string = "/rest/v1.0/facebookpost";

  constructor(private apiService: TCommonService) {
    super(apiService)
  }

  getCommentsByUserAndPost(asId: string, postId: string): Observable<ODataResponsesDTO<SaleOnline_Facebook_CommentFilterResultDTO>> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.GetCommentsByUserAndPost?userId=${asId}&postId=${postId}`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<ODataResponsesDTO<SaleOnline_Facebook_CommentFilterResultDTO>>(api, null);
  }

  getCommentsOfOrder(fb_PostId: string, teamId: any, fb_ASUserId: string): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/${fb_PostId}/comments_by_user?teamId=${teamId}&userId=${fb_ASUserId}`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<any>(api, null);
  }

  getCommentsOfOrder_v2(teamId: any, objectId: string, userId: string): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/rest/v2.0/facebookpost/${teamId}_${objectId}/commentsbyuser?userId=${userId}`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<any>(api, null);
  }

}
