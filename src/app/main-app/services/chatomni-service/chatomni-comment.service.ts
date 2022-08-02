import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CoreAPIDTO, CoreApiMethodType, TCommonService } from "src/app/lib";
import { BaseSevice } from "../base.service";
import { ChatomniPostFacade } from "../chatomni-facade/chatomni-comment.facade";

@Injectable()

export class ChatomniCommentService extends BaseSevice  {

  prefix: string = "odata";
  table: string = "";
  baseRestApi: string = "rest/v2.0/chatomni";

  urlNext: string | undefined;

  constructor(private apiService: TCommonService,
    private omniFacade: ChatomniPostFacade) {
      super(apiService)
  }

  get(teamId: number, objectId: any, type: string): Observable<any> {

    let api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.baseRestApi}/${teamId}_${objectId}/comments?type=${type}`,
        method: CoreApiMethodType.get,
    }
    return this.apiService.getData<any>(api, null);
  }

  getLink(url: string): Observable<any>  {
    let api: CoreAPIDTO = {
          url: `${url}`,
          method: CoreApiMethodType.get
      }
      return this.apiService.getData<any>(api, null);
  }
}
