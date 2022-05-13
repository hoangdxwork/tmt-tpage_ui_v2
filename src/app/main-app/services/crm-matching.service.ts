import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TAPIDTO, TApiMethodType, TCommonService } from 'src/app/lib';
import { TDSHelperString, TDSSafeAny } from 'tmt-tang-ui';
import { CheckConversationDTO } from '../dto/partner/check-conversation.dto';
import { ODataCustomerDTO } from '../dto/partner/customer.dto';
import { PartnerBirthdayDTO } from '../dto/partner/partner-birthday.dto';
import { ODataPartnerCategoryDTO } from '../dto/partner/partner-category.dto';
import { PartnerDetailDTO } from '../dto/partner/partner-detail.dto';
import { ODataRegisterPartnerDTO } from '../dto/partner/partner-register-payment.dto';
import { InputReasonCannelOrderDTO, MDBFacebookMappingNoteDTO, MDBPhoneReportDTO } from '../dto/partner/partner.dto';
import { BaseSevice } from './base.service';

@Injectable()
export class CRMMatchingService extends BaseSevice {

  prefix: string = "odata";
  table: string = "CRMMatching";
  baseRestApi: string = "rest/v1.0/crmmatching";

  constructor(private apiService: TCommonService) {
    super(apiService)
  }

  addNote(psid: string, data: MDBFacebookMappingNoteDTO) {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/${psid}/notes`,
      method: TApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  addOrUpdatePhoneReport(data: InputReasonCannelOrderDTO): Observable<MDBPhoneReportDTO> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/addorupdatephonereport`,
      method: TApiMethodType.post,
    }

    return this.apiService.getData<MDBPhoneReportDTO>(api, data);
  }

  getHistoryReportPhone(phone: string): Observable<MDBPhoneReportDTO> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/gethistoryreportphone?phone=${phone}`,
      method: TApiMethodType.get,
    }

    return this.apiService.getData<MDBPhoneReportDTO>(api, null);
  }

  unReportPhone(phone: string): Observable<undefined> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/unreportphone?phone=${phone}`,
      method: TApiMethodType.post,
    }

    return this.apiService.getData<undefined>(api, null);
  }

}
