import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { TAPIDTO, TApiMethodType, TCommonService } from "src/app/lib";
import { InputSummaryOverviewDTO, InputSummaryPostDTO, InputSummaryTimelineDTO, MDBSummaryByPostDTO, MDBTotalCommentMessageFbDTO, ReportSummaryOverviewResponseDTO, SummaryActivityByStaffDTO } from "../dto/dashboard/summary-overview.dto";
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

  getSummaryCurrentDay(pageId: string): Observable<MDBTotalCommentMessageFbDTO[]> {
    let api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/summarycurrentday?pageId=${pageId}`,
      method: TApiMethodType.get
    }

    return this.apiService.getData<MDBTotalCommentMessageFbDTO[]>(api, null);
  }

  getSummaryOverviewCurrentDay(pageId: string): Observable<MDBSummaryByPostDTO> {
    let api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/summaryoverviewcurrentday?pageId=${pageId}`,
      method: TApiMethodType.get
    }

    return this.apiService.getData<MDBSummaryByPostDTO>(api, null);
  }

  getSummaryPost(data: InputSummaryPostDTO): Observable<MDBSummaryByPostDTO> {
    let api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/summarypost`,
      method: TApiMethodType.post
    }

    return this.apiService.getData<MDBSummaryByPostDTO>(api, data);
  }

  getCommentAndMessage(data: InputSummaryTimelineDTO): Observable<MDBTotalCommentMessageFbDTO[]> {
    let api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/summarytimeline`,
      method: TApiMethodType.post
    }

    return this.apiService.getData<MDBTotalCommentMessageFbDTO[]>(api, data);
  }

  getSummaryByStaffs(startDate: string, endDate: string): Observable<SummaryActivityByStaffDTO[]> {
    let api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/summarystaff?start=${startDate}&end=${endDate}`,
      method: TApiMethodType.get
    }

    return this.apiService.getData<SummaryActivityByStaffDTO[]>(api, null);
  }
}
