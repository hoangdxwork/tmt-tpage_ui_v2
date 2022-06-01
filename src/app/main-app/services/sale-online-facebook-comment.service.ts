import { EventEmitter, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { TAPIDTO, TApiMethodType, TCommonService } from "src/app/lib";
import { TDSSafeAny } from "tmt-tang-ui";
import { SaleOnline_Facebook_CommentFilterResultDTO } from "../dto/coversation-order/conversation-order.dto";
import { ODataResponsesDTO } from "../dto/odata/odata.dto";
import { PagedList2 } from "../dto/pagedlist2.dto";
import { BaseSevice } from "./base.service";


@Injectable({
  providedIn: 'root'
})
export class SaleOnline_FacebookCommentService extends BaseSevice {
  prefix: string = "odata";
  table: string = "SaleOnline_Facebook_Comment";
  baseRestApi: string = "";

  constructor(private apiService: TCommonService) {
    super(apiService)
  }

  getCommentsByUserAndPost(asId: string, postId: string): Observable<ODataResponsesDTO<SaleOnline_Facebook_CommentFilterResultDTO>> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.GetCommentsByUserAndPost?userId=${asId}&postId=${postId}`,
      method: TApiMethodType.get,
    }

    return this.apiService.getData<ODataResponsesDTO<SaleOnline_Facebook_CommentFilterResultDTO>>(api, null);
  }

}
