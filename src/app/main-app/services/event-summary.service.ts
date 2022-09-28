import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CoreAPIDTO, CoreApiMethodType, TCommonService } from "src/app/lib";
import { MDBTotalCommentMessageFbDTO } from "../dto/dashboard/summary-overview.dto";
import { BaseSevice } from "./base.service";

@Injectable()
export class EventSummaryService extends BaseSevice {
  prefix: string = "";
  table: string = "";
  baseRestApi: string = "rest/v2.0/eventsummary";

  constructor(private apiService: TCommonService) {
      super(apiService);
  }

  getSummaryCurrentDay(): Observable<any> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/chatomni/today`,
      method: CoreApiMethodType.get
    }

    return this.apiService.getData<any>(api, null);
  }
}