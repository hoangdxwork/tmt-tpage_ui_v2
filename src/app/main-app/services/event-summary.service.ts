import { SummaryTagDTO } from './../dto/dashboard/summary-daily.dto';
import { EventSummaryDTO } from './../dto/dashboard/summary-overview.dto';
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CoreAPIDTO, CoreApiMethodType, TCommonService } from "src/app/lib";
import { BaseSevice } from "./base.service";
import { format } from 'date-fns';

@Injectable()
export class EventSummaryService extends BaseSevice {
  prefix: string = "";
  table: string = "eventsummary";
  baseRestApi: string = "rest/v2.0";

  constructor(private apiService: TCommonService) {
      super(apiService);
  }

  getEventSummary(data : number): Observable<EventSummaryDTO> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/${this.table}/byday?day=${data}`,
      method: CoreApiMethodType.get
    }

    return this.apiService.getData<EventSummaryDTO>(api, null);
  }

  getSummaryCurrentDay(): Observable<any> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/${this.table}/chatomni/today`,
      method: CoreApiMethodType.get
    }

    return this.apiService.getData<any>(api, null);
  }

  getSummaryByDay(day: number): Observable<any> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/${this.table}/chatomni/byday?day=${day}`,
      method: CoreApiMethodType.get
    }

    return this.apiService.getData<any>(api, null);
  }

  getSummaryByTags(day: number): Observable<SummaryTagDTO[]> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/eventsummary/tags/byday?day=${day}`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<SummaryTagDTO[]>(api, null);
  }

  getSummaryOrderByPeriod(since: any, until: any): Observable<any> {
    since = format(since, 'yyyy-MM-dd+00:00:00');
    until= format(until, 'yyyy-MM-dd+00:00:00');

    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/${this.table}/order/byperiod?since=${since}&until=${until}`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<any>(api, null);
  }
}
