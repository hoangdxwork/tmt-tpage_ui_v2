import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CoreAPIDTO, CoreApiMethodType, TCommonService } from 'src/app/lib';
import { TDSSafeAny } from 'tds-ui/shared/utility';
import { ConversationSummaryByTagDTO } from '../dto/conversation/conversation.dto';
import { InputReasonCannelOrderDTO, MDBFacebookMappingNoteDTO, MDBPhoneReportDTO } from '../dto/partner/partner.dto';
import { ArrayHelper } from '../shared/helper/array.helper';
import { BaseSevice } from './base.service';

@Injectable()
export class CRMMatchingService extends BaseSevice {

  prefix: string = "odata";
  table: string = "CRMMatching";
  baseRestApi: string = "rest/v1.0/crmmatching";

  public queryObj: any = {};
  public dataResponse: any;
  public allItems!: any[];
  public currentItems!: any[];
  public conversationItems: any;

  constructor(private apiService: TCommonService) {
    super(apiService);
      this.setQuery();
  }

  get(url?: string): Observable<any>{
    if (url) {
        return this.getLink(url);
    } else {
      let queryString = Object.keys(this.queryObj).map(key => {
          return key + '=' + this.queryObj[key]
      }).join('&');

      const api: CoreAPIDTO = {
          url: `${this._BASE_URL}/${this.baseRestApi}?${queryString}`,
          method: CoreApiMethodType.get
      }
      return this.apiService.getData<TDSSafeAny>(api, null)
        .pipe(map((res: any) => {
            this.onResolveData(res);
            return res;
      }));
    }
  }

  getLink(url: string): Observable<any> {
    const api: CoreAPIDTO = {
        url: `${url}`,
        method: CoreApiMethodType.get
    }
    return this.apiService.getData<TDSSafeAny>(api, null)
      .pipe(map((res: any) => {
          this.onResolveData(res);
          return res;
      }));
  }

  refetch(psid: string, pageId: string): Observable<any> {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.baseRestApi}/${psid}/refetch?page_id=${pageId}`,
        method: CoreApiMethodType.get
    }
    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  markSeen(page_id: string, fbid: string, type: string, assign_user_id: string): Observable<any> {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.baseRestApi}/${fbid}/markseen`,
        method: CoreApiMethodType.post
    }
    return this.apiService.getData<TDSSafeAny>(api, { page_id: page_id, type: type, assign_user_id: assign_user_id });
  }

  addNote(psid: string, data: MDBFacebookMappingNoteDTO) {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/${psid}/notes`,
      method: CoreApiMethodType.post,
    }
    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  addOrUpdatePhoneReport(data: InputReasonCannelOrderDTO): Observable<MDBPhoneReportDTO> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/addorupdatephonereport`,
      method: CoreApiMethodType.post,
    }
    return this.apiService.getData<MDBPhoneReportDTO>(api, data);
  }

  getHistoryReportPhone(phone: string): Observable<MDBPhoneReportDTO> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/gethistoryreportphone?phone=${phone}`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<MDBPhoneReportDTO>(api, null);
  }

  unReportPhone(phone: string): Observable<undefined> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/unreportphone?phone=${phone}`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<undefined>(api, null);
  }

  addMessage(psid: string, data: TDSSafeAny) {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/rest/v1.0/crmactivity/${psid}/addmessage`,
      method: CoreApiMethodType.post,
    }
    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  addQuickReplyComment(data: TDSSafeAny) {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/rest/v1.0/crmactivity/quickreplycomment`,
      method: CoreApiMethodType.post,
    }
    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  getSummaryByTags(pageId: string, start: string, end: string): Observable<ConversationSummaryByTagDTO[]> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/summarybytags?PageId=${pageId}&Start=${start}&End=${end}`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<ConversationSummaryByTagDTO[]>(api, null);
  }

  private setQuery(query?: any) {
    this.queryObj = query || {
        page: 1,
        limit: 20
    };
  }

  private onResolveData(res: any) {
    if (!this.allItems) {
        this.allItems = [];
    }
    this.dataResponse = res;
    this.currentItems = res.Items;
    this.allItems = ArrayHelper.makeUniqueArray(this.allItems, res.Items, "Id");
  }

  getMDBByPSId(pageId: TDSSafeAny, psid: string) {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/${pageId}_${psid}`,
      method: CoreApiMethodType.get,
    }
    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  checkPhoneReport(phone: string): Observable<any> {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.baseRestApi}/${phone}/checkphonereport`,
        method: CoreApiMethodType.post
    }
    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  transferChatbot(pageId: string, psId: string) {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.baseRestApi}/transferchatbot?page_id=${pageId}&psid=${psId}`,
        method: CoreApiMethodType.get
    }
    return this.apiService.getData(api, null);
  }

}
