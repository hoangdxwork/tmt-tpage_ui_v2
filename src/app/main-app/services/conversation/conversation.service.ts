import { state } from '@angular/animations';
import { Injectable, OnInit } from "@angular/core";
import { Observable, of } from "rxjs";
import { TAPIDTO, TApiMethodType, TCommonService } from "src/app/lib";
import { CRMMatchingDTO, CRMMatchingDTO_v2 } from "../../dto/conversation-all/crm-matching.dto";
import { PagedList2 } from "../../dto/pagedlist2.dto";
import { MDBFacebookMappingNoteDTO } from "../../dto/partner/partner.dto";
import { BaseSevice } from "../base.service";

export interface QueryStateConversationDTO {
  pageId: any;
  page: number;
  limit: number;
  type: string;
  tag_ids?: string[];
  user_ids?: string[];
  start?: string;
  end?: string;
  has_phone?: boolean;
  has_address?: boolean;
  has_order?: boolean;
  has_unread?: boolean;
  not_address?: boolean;
  not_phone?: boolean;
}

export interface QueryStateConversationDTO_v2 {
  pageId: any;
  type: string;
  tag_ids?: string[];
  user_ids?: string[];
  start?: string;
  end?: string;
  has_phone?: boolean;
  has_address?: boolean;
  has_order?: boolean;
  has_unread?: boolean;
  not_address?: boolean;
  not_phone?: boolean;
  state: any; // trạng thái chatbot
  next?: number; //timestamp ở đơn vị milisecond, request đầu tiên có thể bỏ qua nó, request thứ 2 sẽ value nhỏ hơn hoặc = value min của request trước
}

export interface ResponseStateConversationDTO {
  hasNextPage: any,
  nextPageUrl: any,
  pageSize: any,
  totalCount: any,
  totalPages: any
}

export interface PagingTimestampLowcase {
  hasNext: boolean;
  next: number;
  urlNext: string;
}

@Injectable({
  providedIn: 'root'
})

export class ConversationService extends BaseSevice {

  prefix: string = "";
  table: string = "";
  baseRestApi: string = "rest/v1.0/crmmatching";
  baseRestApi_v2: string = "rest/v2.0/crmmatching";
  public currentUrlNext: string = "";

  constructor(private apiService: TCommonService) {
      super(apiService)
  }

  get(queryObj: any, url?: string): Observable<CRMMatchingDTO> {
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

  get_v2(queryObj: any, url?: string): Observable<CRMMatchingDTO_v2> {
    if (url) {
      return this.getLink_v2(url);
    }
    else {
      let queryString = Object.keys(queryObj).map(key => {
          return key + '=' + queryObj[key]
      }).join('&');

      let api: TAPIDTO = {
          url: `${this._BASE_URL}/${this.baseRestApi_v2}?${queryString}`,
          method: TApiMethodType.get
      }
      return this.apiService.getData<CRMMatchingDTO_v2>(api, null);
    }
  }

  getLink(url: string): Observable<CRMMatchingDTO> {
    let api: TAPIDTO = {
        url: `${url}`,
        method: TApiMethodType.get
    }
    return this.apiService.getData<CRMMatchingDTO>(api, null);
  }

  getLink_v2(url: string): Observable<CRMMatchingDTO_v2> {
    if(url != this.currentUrlNext) {
        this.currentUrlNext = url; // check phân trang bị trùng

        let api: TAPIDTO = {
            url: `${url}`,
            method: TApiMethodType.get
        }

        return this.apiService.getData<CRMMatchingDTO_v2>(api, null);
    } else {
      return of({} as any);
    }
  }

  createQuery(pageId: any, type: any, keyword?: any, page?: any, limit?: any) {
    return {
        pageId: pageId,
        page: page || 1,
        limit: limit || 20,
        type: type
    } as QueryStateConversationDTO;
  }

  createQuery_v2(pageId: any, type: any, next?: number, state?: any) {
    return {
        pageId: pageId,
        type: type,
    } as QueryStateConversationDTO_v2;
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

  createResponse_v2(response: CRMMatchingDTO_v2): any {
    if(response && response.Paging) {
        return {
            hasNext: response.Paging.HasNext,
            next: response.Paging.Next,
            urlNext: response.Paging.UrlNext
        } as PagingTimestampLowcase;
    }
  }

  getNotes(page_id: string, psid: string): Observable<PagedList2<MDBFacebookMappingNoteDTO>> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.baseRestApi}/${psid}/notes?page_id=${page_id}`,
        method: TApiMethodType.get,
    }

    return this.apiService.getData<PagedList2<MDBFacebookMappingNoteDTO>>(api, null);
  }

  deleteNote(id: string): Observable<undefined> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.baseRestApi}/${id}/notes`,
        method: TApiMethodType.delete,
    }

    return this.apiService.getData<undefined>(api, null);
  }

  setExtrasQuery(pageId: any, type: any, data: any) {
    let query = this.createQuery(pageId, type);

    if (data.tag_ids) {
      query["tag_ids"] = data.tag_ids.join(',');
    } else {
      delete query["tag_ids"];
    }

    if (data.user_ids) {
      query["user_ids"] = data.user_ids.join(',');
    } else {
      delete query["user_ids"];
    }

    if (data.from_date) {
      query["start"] = encodeURIComponent(data.from_date);
    } else {
      delete query["start"];
    }

    if (data.to_date) {
      query["end"] = encodeURIComponent(data.to_date);
    } else {
      delete query["end"];
    }

    if (data.hasPhone) {
      query["has_phone"] = data.hasPhone;
    } else {
      delete query["has_phone"];
    }

    if (data.hasAddress) {
      query["has_address"] = data.hasAddress;
    } else {
      delete query["has_address"];
    }

    if (data.hasOrder) {
      query["has_order"] = data.hasOrder;
    } else {
      delete query["has_order"];
    }

    if (data.hasUnread) {
      query["has_unread"] = data.hasUnread;
    } else {
      delete query["has_unread"];
    }

    if (data.notAddress) {
      query["not_address"] = data.notAddress;
    } else {
      delete query["not_address"];
    }

    if (data.notPhone) {
      query["not_phone"] = data.notPhone;
    } else {
      delete query["not_phone"];
    }

    return query;
  }


}
