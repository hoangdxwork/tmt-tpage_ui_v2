import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { TAPIDTO, TApiMethodType, TCommonService } from "src/app/lib";
import { TDSSafeAny } from "tds-ui/shared/utility";
import { GetAllFacebookPostDTO } from "../dto/live-campaign/getall-facebook-post.dto";
import { ODataLiveCampaignDTO } from "../dto/live-campaign/odata-live-campaign.dto";
import { ODataModelDTO, ODataResponsesDTO } from "../dto/odata/odata.dto";
import { BaseSevice } from "./base.service";

@Injectable()
export class LiveCampaignService extends BaseSevice {

  prefix: string = "odata";
  table: string = "SaleOnline_LiveCampaign";
  baseRestApi: string = "rest/v1.0/saleonine_livecampaign";
  public _keyCacheGrid: string = 'livecampaign-page:grid_livecampaign:settings';

  constructor(private apiService: TCommonService) {
    super(apiService);
  }

  get(): Observable<ODataLiveCampaignDTO>{
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}`,
        method: TApiMethodType.get,
    }

    return this.apiService.getData<ODataLiveCampaignDTO>(api, null);
  }

  getById(id: any): Observable<any> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}(${id})?$expand=Details,Users`,
      method: TApiMethodType.get,
    }

    return this.apiService.getData<any>(api, null);
	}

  getDetailById(id: string ): Observable<any> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}(${id})?$expand=Details,Users,Preliminary_Template,ConfirmedOrder_Template`,
      method: TApiMethodType.get,
    }

    return this.apiService.getData<any>(api, null);
  }

  getDetailAndAttributes(id: any): Observable<any> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/${id}/getwithdetailandattributes`,
      method: TApiMethodType.get,
    }

    return this.apiService.getData<any>(api, null);
  }

  create(data: any): Observable<any> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}`,
      method: TApiMethodType.post,
    }

    return this.apiService.getData<any>(api, data);
  }

  update(data: any, isUpdate: boolean): Observable<any> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}(${data.Id})?isUpdate=${isUpdate}`,
      method: TApiMethodType.put,
    }

    return this.apiService.getData<any>(api, data);
  }

  updateLiveCampaignPost(id: string | undefined, data: any): Observable<boolean> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}(${id})/ODataService.UpdateFacebook`,
      method: TApiMethodType.post,
    }

    return this.apiService.getData<boolean>(api, data);
  }

  getReportLiveCampaignOverview(data: any): Observable<any>{
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.ReportLiveCampaignOverview`,
      method: TApiMethodType.post,
    }

    return this.apiService.getData<any>(api, data);
  }

  approve(id: string | undefined): Observable<any> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.table}/Approve?id=${id}`,
      method: TApiMethodType.post,
    }

    return this.apiService.getData<any>(api, null);
  }

  delete(id: string | undefined): Observable<undefined> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}(${id})`,
      method: TApiMethodType.delete,
    }

    return this.apiService.getData<undefined>(api, null);
  }

  updateActiveDetail(id: string, isActive: boolean): Observable<any> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.UpdateActiveDetail?key=${id}&isActive=${isActive}`,
      method: TApiMethodType.get,
    }

    return this.apiService.getData<any>(api, null);
  }

  getAllFacebookPost(id: string | undefined): Observable<any> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/${id}/getallfacebookpost`,
      method: TApiMethodType.get,
    }

    return this.apiService.getData<any>(api, null);
  }

  getReport(id: string): Observable<any> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/${id}/getreport`,
      method: TApiMethodType.get,
    }

    return this.apiService.getData<any>(api, null);
  }

  updateProductQuantity(id: string, quantity: number | undefined, liveCampaignId: string): Observable<boolean> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/${id}/updateproductquantity?quantity=${quantity}&liveCampaignId=${liveCampaignId}`,
      method: TApiMethodType.post,
    }

    return this.apiService.getData<boolean>(api, null);
  }

  getSOCartHistory(liveCampaignId: string, productId: number, orderId: TDSSafeAny): Observable<ODataResponsesDTO<any>> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.GetSOCartHistory?key=${liveCampaignId}&product_id=${productId}&order_id=${orderId}`,
      method: TApiMethodType.get,
    }

    return this.apiService.getData<ODataResponsesDTO<any>>(api, null);
  }

  getFSCartHistory(liveCampaignId: string, productId: number, orderId: TDSSafeAny): Observable<any> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.GetFSCartHistory?key=${liveCampaignId}&product_id=${productId}&order_id=${orderId}`,
      method: TApiMethodType.get,
    }

    return this.apiService.getData<any>(api, null);
  }

  getProduct(liveCampaignId: string, params: string): Observable<any> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.ReportLiveCampaignProduct?key=${liveCampaignId}&${params}&$count=true`,
        method: TApiMethodType.get,
    }

    return this.apiService.getData<any>(api, null);
  }

  getSOOrder(liveCampaignId: string, productId: number, params: string) {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.GetLiveCampaignSOOrder?key=${liveCampaignId}&product_id=${productId}&${params}&$count=true`,
        method: TApiMethodType.get,
    }

    return this.apiService.getData<any>(api, null);
  }

  getSOOrderCancel(liveCampaignId: string, productId: number, params: string) {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.GetLiveCampaignSOOrderCancel?key=${liveCampaignId}&product_id=${productId}&${params}&$count=true`,
        method: TApiMethodType.get,
    }

    return this.apiService.getData<any>(api, null);
  }

  getFSOrder(liveCampaignId: string, productId: number, params: string) {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.GetLiveCampaignFSOrder?key=${liveCampaignId}&product_id=${productId}&${params}&$count=true`,
        method: TApiMethodType.get,
    }

    return this.apiService.getData<any>(api, null);
  }

  getFSOrderCancel(liveCampaignId: string, productId: number, params: string) {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.GetLiveCampaignFSOrderCancel?key=${liveCampaignId}&product_id=${productId}&${params}&$count=true`,
        method: TApiMethodType.get,
    }

    return this.apiService.getData<any>(api, null);
  }

}
