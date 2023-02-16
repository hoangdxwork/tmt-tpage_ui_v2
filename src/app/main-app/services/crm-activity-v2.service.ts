import { Injectable } from "@angular/core";
import { AddTemplateMessageWithInvoiceDto, AddTemplateMessageWithProductDto, GenerateMessagePartnersDto } from "@app/dto/crm-activityv2/addtemplate-message-v2.dto";
import { Observable } from "rxjs";
import { CoreAPIDTO, CoreApiMethodType, TCommonService } from "src/app/lib";
import { BaseSevice } from "./base.service";

@Injectable()
export class CRMActivityV2Service extends BaseSevice {

  prefix: string = "";
  table: string = "";
  baseRestApi: string = "/rest/v2.0/crmactivity";

  constructor(private apiService: TCommonService) {
    super(apiService)
  }

  addTemplateMessageWithInvoice(channelId: string, data: AddTemplateMessageWithInvoiceDto): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/${channelId}/addtemplatemessage`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<any>(api, data);
  }

  addTemplateMessageWithProduct(channelId: string, data: AddTemplateMessageWithProductDto): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/${channelId}/addtemplatemessage`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<any>(api, data);
  }

  generateMessagePartners(data: GenerateMessagePartnersDto): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/generatemessagepartners`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<any>(api, data);
  }

  generateMessageObject(data: GenerateMessagePartnersDto): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/generatemessageobject`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<any>(api, data);
  }
}
