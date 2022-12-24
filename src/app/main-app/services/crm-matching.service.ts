import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CoreAPIDTO, CoreApiMethodType, TCommonService } from 'src/app/lib';
import { TDSSafeAny } from 'tds-ui/shared/utility';
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
  }

  markSeenV2(teamId: number, csid: string): Observable<any> {
    let id = `${teamId}_${csid}`;
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/rest/v2.0/chatomni/${id}/markseen`,
        method: CoreApiMethodType.post
    }
    return this.apiService.getData<TDSSafeAny>(api, null);
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
