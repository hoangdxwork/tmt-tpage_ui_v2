import { Injectable, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { TAPIDTO, TApiMethodType, TCommonService } from "src/app/lib";
import { TDSSafeAny } from "tmt-tang-ui";
import { CRMMatchingDTO } from "../../dto/conversation-all/crm-matching.dto";
import { BaseSevice } from "../base.service";
import { SignalRConnectionService } from "../signalR/signalR-connection.service";

export interface QueryStateConversationDTO {
  pageId: any;
  page: number;
  limit: number;
  type: string;
}

export interface ResponseStateConversationDTO {
  hasNextPage: any,
  nextPageUrl: any,
  pageSize: any,
  totalCount: any,
  totalPages: any
}

@Injectable({
  providedIn: 'root'
})

export class ConversationService extends BaseSevice implements OnInit {

  prefix: string = "";
  table: string = "";
  baseRestApi: string = "rest/v1.0/crmmatching";

  constructor(private apiService: TCommonService,
      private sgRConnectionService: SignalRConnectionService) {
      super(apiService)
  }

  ngOnInit(): void {
  }

  get(queryObj: any, url?: string): Observable<any> {
    if (url) {
        return this.getLink(url);
    }
    else {
      let queryString = Object.keys(queryObj).map(key => {
          return key + '=' + queryObj[key]
      }).join('&');

      let api: TAPIDTO = {
          url: `${this._BASE_URL}/${this.baseRestApi}?${queryString}`,
          method: TApiMethodType.get
      }
      return this.apiService.getData<CRMMatchingDTO>(api, null);
    }
  }

  getLink(url: string): Observable<any> {
    let api: TAPIDTO = {
      url: `${this._BASE_URL}/${url}`,
      method: TApiMethodType.get
    }
    return this.apiService.getData<CRMMatchingDTO>(api, null);
  }

  createQuery(pageId: any, type: any, keyword?: any, page?: any, limit?: any) {
    return {
        pageId: pageId,
        page: page || 1,
        limit: limit || 20,
        type: type
    } as QueryStateConversationDTO;
  }

  createResponse(response: any) {
    return {
        hasNextPage: response.HasNextPage,
        nextPageUrl: response.NextPage,
        pageSize: response.PageSize,
        totalCount: response.TotalCount,
        totalPages: response.TotalPages
    } as ResponseStateConversationDTO;
  }


  getNotes(page_id: string, psid: string) {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.baseRestApi}/${psid}/notes?page_id=${page_id}`,
        method: TApiMethodType.get,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  deleteNote(id: any) {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.baseRestApi}/${id}/notes`,
        method: TApiMethodType.delete,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }


}
