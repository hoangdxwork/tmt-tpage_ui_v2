import { EventEmitter, Injectable, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { TAPIDTO, TApiMethodType, TCommonService } from "src/app/lib";
import { TDSSafeAny } from "tmt-tang-ui";
import { BaseSevice } from "../base.service";
import { SignalRConnectionService } from "../signalR/signalR-connection.service";

@Injectable({
  providedIn: 'root'
})

export class ActivityMatchingService extends BaseSevice implements OnInit {

  prefix: string = "";
  table: string = "";
  baseRestApi: string = "rest/v1.0/crmmatching";


  private activity: any = {};
  private extras: any = {};

  public dataSource$!: Observable<any>;
  public onGetComment$: EventEmitter<any> = new EventEmitter();

  constructor(private apiService: TCommonService,
      private sgRConnectionService: SignalRConnectionService) {
      super(apiService)
  }

  ngOnInit(): void {
  }

  get(queryObj: any, psid: any, url?: any): Observable<any> {
    if (url) {
        return this.getLink(url);
    } else {
      let queryString = Object.keys(queryObj).map(key => {
          return key + '=' + queryObj[key]
      }).join('&');

      let api: TAPIDTO = {
          url: `${this._BASE_URL}/${this.baseRestApi}/${psid}/messages?${queryString}`,
          method: TApiMethodType.get,
      }
      return this.apiService.getData<TDSSafeAny>(api, null);
    }
  }

  getLink(url: string): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${url}`,
        method: TApiMethodType.get,
    }
    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  createQuery(pageId: any, type: any, page?: any, limit?: any) {
    return {
      page_id: pageId,
      type: type,
      page: page || 1,
      limit: limit || 20,
    } as any;
  }

  createResponse(response: any) {
    return {
      hasNextPage: response.HasNextPage,
      nextPageUrl: response.NextPage,
      pageSize: response.PageSize,
      totalCount: response.TotalCount,
      totalPages: response.TotalPages
    } as any;
  }
}
