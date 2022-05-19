import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TAPIDTO, TApiMethodType, TCommonService } from 'src/app/lib';
import { TDSHelperString, TDSSafeAny } from 'tmt-tang-ui';
import { CheckConversationDTO } from '../dto/partner/check-conversation.dto';
import { ODataCustomerDTO } from '../dto/partner/customer.dto';
import { PartnerBirthdayDTO } from '../dto/partner/partner-birthday.dto';
import { ODataPartnerCategoryDTO } from '../dto/partner/partner-category.dto';
import { PartnerDetailDTO } from '../dto/partner/partner-detail.dto';
import { ODataRegisterPartnerDTO } from '../dto/partner/partner-register-payment.dto';
import { PartnerTempDTO, ResRevenueCustomerDTO } from '../dto/partner/partner.dto';
import { BaseSevice } from './base.service';

@Injectable()
export class PartnerService extends BaseSevice {

  prefix: string = "odata";
  table: string = "Partner";
  baseRestApi: string = "rest/v1.0/partner";

  public _keyCacheGrid: string = 'partner-page:grid_partner:settings';
  public onLoadOrderFromTabPartner: EventEmitter<any> = new EventEmitter();
  public onLoadPartnerFromTabOrder: EventEmitter<any> = new EventEmitter();

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
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/api/common/getpartnerstatus`,
        method: TApiMethodType.get,
    }

    return this.apiService.getData<ODataRegisterPartnerDTO>(api, null);
  }

  getDefault(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.DefaultGet?$expand=AccountPayable,AccountReceivable,StockCustomer,StockSupplier`,
        method: TApiMethodType.post,
    }

    return this.apiService.getData<ODataRegisterPartnerDTO>(api, data);
  }

  getById(id: number): Observable<any> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}(${id})?$expand=PurchaseCurrency,Categories,AccountPayable,AccountReceivable,StockCustomer,StockSupplier,Title,PropertyProductPricelist,PropertySupplierPaymentTerm,PropertyPaymentTerm,Addresses`,
        method: TApiMethodType.get,
    }

    return this.apiService.getData<PartnerDetailDTO>(api,null);
  }

  insert(data: PartnerDetailDTO): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}`,
        method: TApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api,data);
  }

  update(key: number, data: PartnerDetailDTO): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}(${key})`,
        method: TApiMethodType.put,
    }

    return this.apiService.getData<TDSSafeAny>(api,data);
  }

  delete(id: TDSSafeAny): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}(${id})`,
        method: TApiMethodType.delete,
    }

    return this.apiService.getData<TDSSafeAny>(api,null);
  }

  assignTagPartner(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/TagPartner/ODataService.AssignTagPartner`,
        method: TApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api,data);
  }

  resetLoyaltyPoint(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.ResetLoyaltyPoint`,
        method: TApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api,data);
  }

  transferPartner(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.TransferPartner`,
        method: TApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api,data);
  }

  setActive(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.SetActive`,
        method: TApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api,data);
  }

  getPartnerRevenueById(key: number): Observable<ResRevenueCustomerDTO> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.GetPartnerRevenueById?key=${key}`,
        method: TApiMethodType.get,
    }

    return this.apiService.getData<ResRevenueCustomerDTO>(api, null);
  }

  getRegisterPaymentPartner(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.GetRegisterPaymentPartner?$expand=Partner`,
        method: TApiMethodType.post,
    }

    return this.apiService.getData<ODataRegisterPartnerDTO>(api, data);
  }

  getPartnerBirthday(type: string): Observable<any> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/api/common/getpartnerbirthday?type=${type}`,
        method: TApiMethodType.get,
    }

    return this.apiService.getData<PartnerBirthdayDTO>(api, null);
  }

  getPartnerCategory(): Observable<any> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/PartnerCategory?$orderby=ParentLeft&$count=true`,
        method: TApiMethodType.get,
    }

    return this.apiService.getData<ODataPartnerCategoryDTO>(api, null);
  }

  getCreditDebitCustomerDetail(partnerId: TDSSafeAny, skip: number, take: number): Observable<any> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.CreditDebitCustomerDetail?partnerId=${partnerId}&$skip=${skip}&$top=${take}&$count=true`,
        method: TApiMethodType.get,
    }

    return this.apiService.getData<ODataPartnerCategoryDTO>(api, null);
  }

  getCustomers(page: number, limit: number, keyword: string): Observable<any> {
    let filter = "";
    if (TDSHelperString.hasValueString(keyword)) {
      filter = `and (contains(DisplayName,'${keyword}') or contains(NameNoSign,'${keyword}') or contains(Name,'${keyword}') or contains(Phone,'${keyword}'))`
    }

    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/?$format=json&$top=${page * limit}&$skip=${(page - 1) * limit}&$filter=(Customer eq true and Active eq true)${filter}&$count=true`,
        method: TApiMethodType.get,
    }

    return this.apiService.getData<ODataCustomerDTO>(api, null);
  }

  updateStatus(id: number, data: TDSSafeAny): Observable<boolean> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}(${id})/OdataService.UpdateStatus`,
      method: TApiMethodType.post,
    }

    return this.apiService.getData<boolean>(api, data);
  }

  checkConversation(page_id: string, psid: string): Observable<CheckConversationDTO> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/checkconversation`,
      method: TApiMethodType.post,
    }

    return this.apiService.getData<CheckConversationDTO>(api, { PageId: page_id, UserId: psid });
  }

}
