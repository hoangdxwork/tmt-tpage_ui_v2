import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CoreAPIDTO, CoreApiMethodType, TCommonService } from "src/app/lib";
import { EventSummaryDTO, InputSummaryOverviewDTO, InputSummaryPostDTO, InputSummaryTimelineDTO, MDBSummaryByPostDTO, MDBTotalCommentMessageFbDTO, ReportSummaryOverviewResponseDTO, SummaryActivityByStaffDTO } from "../dto/dashboard/summary-overview.dto";
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
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/summaryoverview`,
      method: CoreApiMethodType.post
    }

    return this.apiService.getData<ReportSummaryOverviewResponseDTO>(api, data);
  }

  getSummaryOverviewCurrentDay(pageId?: any): Observable<MDBSummaryByPostDTO> {
    pageId = pageId || '';
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/summaryoverviewcurrentday?pageId=${pageId}`,
      method: CoreApiMethodType.get
    }

    return this.apiService.getData<MDBSummaryByPostDTO>(api, null);
  }

  getSummaryPost(data: InputSummaryPostDTO): Observable<MDBSummaryByPostDTO> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/summarypost`,
      method: CoreApiMethodType.post
    }

    return this.apiService.getData<MDBSummaryByPostDTO>(api, data);
  }

  getCommentAndMessage(data: InputSummaryTimelineDTO): Observable<MDBTotalCommentMessageFbDTO[]> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/summarytimeline`,
      method: CoreApiMethodType.post
    }

    return this.apiService.getData<MDBTotalCommentMessageFbDTO[]>(api, data);
  }

  getSummaryByStaffs(startDate: string, endDate: string): Observable<SummaryActivityByStaffDTO[]> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/summarystaff?start=${startDate}&end=${endDate}`,
      method: CoreApiMethodType.get
    }

    return this.apiService.getData<SummaryActivityByStaffDTO[]>(api, null);
  }
}
