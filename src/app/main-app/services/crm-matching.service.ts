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
import { BaseSevice } from './base.service';

@Injectable()
export class CRMMatchingService extends BaseSevice {

  prefix: string = "odata";
  table: string = "CRMMatching";
  baseRestApi: string = "rest/v1.0/crmmatching";

  constructor(private apiService: TCommonService) {
    super(apiService)
  }

  addNote(psid: string, data: any) {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/${psid}/notes`,
      method: TApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }

}
