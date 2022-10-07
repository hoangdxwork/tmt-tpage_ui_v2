import { EventEmitter, Injectable } from '@angular/core';
import { PartnerStatusDTO, PartnerStatusModalDTO } from '@app/dto/partner/partner-status.dto';
import { PartnerTimeStampDto } from '@app/dto/partner/partner-timestamp.dto';
import { BehaviorSubject, Observable } from 'rxjs';
import { CoreAPIDTO, CoreApiMethodType, TCommonService } from 'src/app/lib';
import { TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { TabPartnerCvsRequestDTO } from '../dto/conversation-partner/partner-conversation-request.dto';
import { ODataCustomerDTO } from '../dto/partner/customer.dto';
import { PartnerBirthdayDTO } from '../dto/partner/partner-birthday.dto';
import { ODataPartnerCategoryDTO } from '../dto/partner/partner-category.dto';
import { PartnerDetailDTO } from '../dto/partner/partner-detail.dto';
import { ODataRegisterPartnerDTO } from '../dto/partner/partner-register-payment.dto';
import { CheckInfoPartnerDTO, InputCheckInfoPartnerDTO, PartnerTempDTO, ResRevenueCustomerDTO } from '../dto/partner/partner.dto';
import { BaseSevice } from './base.service';

@Injectable()
export class PartnerService extends BaseSevice {

  prefix: string = "odata";
  table: string = "Partner";
  baseRestApi: string = "rest/v1.0/partner";

  public _keyCacheGrid: string = 'partner-page:grid_partner:settings';

  public partnerStatus: any;
  public partnerStatus$ = new BehaviorSubject<any>(null);

  constructor(private apiService: TCommonService) {
    super(apiService);
    this.initialize();
  }

  initialize(){
    this.getPartnerStatus().subscribe((res: any) => {
        this.partnerStatus = res;
        this.partnerStatus$.next(this.partnerStatus);
    })
  }

  getPartnerStatus(): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/api/common/getpartnerstatus`,
        method: CoreApiMethodType.get,
    }

    return this.apiService.getData<ODataRegisterPartnerDTO>(api, null);
  }

  getDefault(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.DefaultGet?$expand=AccountPayable,AccountReceivable,StockCustomer,StockSupplier`,
        method: CoreApiMethodType.post,
    }

    return this.apiService.getData<ODataRegisterPartnerDTO>(api, data);
  }

  getById(id: number): Observable<any> {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}(${id})?$expand=PurchaseCurrency,Categories,AccountPayable,AccountReceivable,StockCustomer,StockSupplier,Title,PropertyProductPricelist,PropertySupplierPaymentTerm,PropertyPaymentTerm,Addresses`,
        method: CoreApiMethodType.get,
    }

    return this.apiService.getData<PartnerDetailDTO>(api,null);
  }

  insert(data: PartnerDetailDTO): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}`,
        method: CoreApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api,data);
  }

  update(key: number, data: PartnerDetailDTO): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}(${key})`,
        method: CoreApiMethodType.put,
    }

    return this.apiService.getData<TDSSafeAny>(api,data);
  }

  delete(id: TDSSafeAny): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}(${id})`,
        method: CoreApiMethodType.delete,
    }

    return this.apiService.getData<TDSSafeAny>(api,null);
  }

  assignTagPartner(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/TagPartner/ODataService.AssignTagPartner`,
        method: CoreApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api,data);
  }

  resetLoyaltyPoint(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.ResetLoyaltyPoint`,
        method: CoreApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api,data);
  }

  transferPartner(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.TransferPartner`,
        method: CoreApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api,data);
  }

  transferPartnerMultiple(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.TransferPartnerMultiple`,
        method: CoreApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api,data);
  }

  setActive(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.SetActive`,
        method: CoreApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api,data);
  }

  getPartnerRevenueById(key: number): Observable<ResRevenueCustomerDTO> {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.GetPartnerRevenueById?key=${key}`,
        method: CoreApiMethodType.get,
    }

    return this.apiService.getData<ResRevenueCustomerDTO>(api, null);
  }

  getRegisterPaymentPartner(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.GetRegisterPaymentPartner?$expand=Partner`,
        method: CoreApiMethodType.post,
    }

    return this.apiService.getData<ODataRegisterPartnerDTO>(api, data);
  }

  getPartnerBirthday(type: string): Observable<any> {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/api/common/getpartnerbirthday?type=${type}`,
        method: CoreApiMethodType.get,
    }

    return this.apiService.getData<PartnerBirthdayDTO>(api, null);
  }

  getPartnerCategory(): Observable<any> {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/PartnerCategory?$orderby=ParentLeft&$count=true`,
        method: CoreApiMethodType.get,
    }

    return this.apiService.getData<ODataPartnerCategoryDTO>(api, null);
  }

  getCreditDebitCustomerDetail(partnerId: TDSSafeAny, skip: number, take: number): Observable<any> {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.CreditDebitCustomerDetail?partnerId=${partnerId}&$skip=${skip}&$top=${take}&$count=true`,
        method: CoreApiMethodType.get,
    }

    return this.apiService.getData<ODataPartnerCategoryDTO>(api, null);
  }

  getCustomers(page: number, limit: number, keyword: string): Observable<any> {
    let filter = "";
    if (TDSHelperString.hasValueString(keyword)) {
      filter = `and (contains(DisplayName,'${keyword}') or contains(NameNoSign,'${keyword}') or contains(Name,'${keyword}') or contains(Phone,'${keyword}'))`
    }

    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/?$format=json&$top=${page * limit}&$skip=${(page - 1) * limit}&$filter=(Customer eq true and Active eq true)${filter}&$count=true`,
        method: CoreApiMethodType.get,
    }

    return this.apiService.getData<ODataCustomerDTO>(api, null);
  }

  updateStatus(id: number, data: TDSSafeAny): Observable<boolean> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}(${id})/OdataService.UpdateStatus`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<boolean>(api, data);
  }

  checkConversation(page_id: string, psid: string): Observable<TabPartnerCvsRequestDTO> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/checkconversation`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<TabPartnerCvsRequestDTO>(api, { PageId: page_id, UserId: psid });
  }

  checkInfo(data: InputCheckInfoPartnerDTO) : Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/rest/v2.0/partner/checkinfo`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<any>(api, data);
  }

  getLastOrder(partnerId: number): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/rest/v1.0/partner/${partnerId}/lastorder`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<any>(api, null);
  }

  getPartnersByTimestamp(teamId: any, timestamp: any): Observable<PartnerTimeStampDto> {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.baseRestApi}/getfacebookdictionarybytimestamp?teamId=${teamId}&timestamp=${timestamp}`,
        method: CoreApiMethodType.get,
    }
    return this.apiService.getData<PartnerTimeStampDto>(api, null);
  }

  getAllByMDBPartnerId(partnerId: any): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/rest/v1.0/partner/${partnerId}/pages`,
        method: CoreApiMethodType.get,
    }
    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  updatePartnerSimple(data: TDSSafeAny) {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.UpdatePartnerSimple `,
        method: CoreApiMethodType.post,
    }
    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  getInvoice(id: number, state: string): Observable<any> {
    let api: CoreAPIDTO = {
        url: `${this._BASE_URL}/rest/v2.0/partner/${id}/invoice?state=${state}`,
        method: CoreApiMethodType.get
    }
    return this.apiService.getData<any>(api, null);
  }

  getPartnerStatusExtra(): Observable<any> {
    let api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/PartnerStatusExtra`,
        method: CoreApiMethodType.get
    }
    return this.apiService.getData<any>(api, null);
  }

  insertPartnerStatusExtra(data: PartnerStatusModalDTO): Observable<any> {
    let api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/PartnerStatusExtra`,
        method: CoreApiMethodType.post
    }
    return this.apiService.getData<any>(api, data);
  }

  deletePartnerStatusExtra(key: number): Observable<any> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/PartnerStatusExtra(${key})`,
      method: CoreApiMethodType.delete
    }

    return this.apiService.getData<any>(api, null);
  }

  updatePartnerStatusExtra(data: PartnerStatusDTO): Observable<any> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/PartnerStatusExtra(${data.Id})`,
      method: CoreApiMethodType.put
    }

    return this.apiService.getData<any>(api, data);
  }



}
