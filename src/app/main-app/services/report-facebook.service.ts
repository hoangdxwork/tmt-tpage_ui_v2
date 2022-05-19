import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { TAPIDTO, TApiMethodType, TCommonService } from "src/app/lib";
import { InputSummaryOverviewDTO, InputSummaryPostDTO, MDBSummaryByPostDTO, ReportSummaryOverviewResponseDTO } from "../dto/dashboard/summary-overview.dto";
import { BaseSevice } from "./base.service";

@Injectable()
export class ReportFacebookService extends BaseSevice {
  prefix: string = "";
  table: string = "";
  baseRestApi: string = "rest/v1.0/reportfacebook";

  constructor(private apiService: TCommonService) {
      super(apiService);
  }

  getSummaryOverview(data: InputSummaryOverviewDTO): Observable<ReportSummaryOverviewResponseDTO> {
    let api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/summaryoverview`,
      method: TApiMethodType.post
    }

    return this.apiService.getData<ReportSummaryOverviewResponseDTO>(api, data);
  }

  getSummaryPost(data: InputSummaryPostDTO): Observable<MDBSummaryByPostDTO> {
    let api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/summarypost`,
      method: TApiMethodType.post
    }

    return this.apiService.getData<MDBSummaryByPostDTO>(api, data);
  }
}
