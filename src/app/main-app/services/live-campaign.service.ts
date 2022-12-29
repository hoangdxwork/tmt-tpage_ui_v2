import { SaleOnlineLiveCampaignDTO } from './../dto/live-campaign/report-livecampain-overview.dto';
import { Injectable } from "@angular/core";
import { ODataLiveCampaignDTO } from "@app/dto/live-campaign/odata-live-campaign.dto";
import { CRMTeamType } from "@app/dto/team/chatomni-channel.dto";
import { BehaviorSubject, Observable } from "rxjs";
import { CoreAPIDTO, CoreApiMethodType, TCommonService } from "src/app/lib";
import { TDSHelperString, TDSSafeAny } from "tds-ui/shared/utility";
import { GetAllFacebookPostDTO } from "../dto/live-campaign/getall-facebook-post.dto";
import { ODataLiveCampaignModelDTO } from "../dto/live-campaign/odata-live-campaign-model.dto";
import { ODataModelDTO, ODataResponsesDTO } from "../dto/odata/odata.dto";
import { BaseSevice } from "./base.service";

@Injectable()
export class LiveCampaignService extends BaseSevice {

  prefix: string = "odata";
  table: string = "SaleOnline_LiveCampaign";
  baseRestApi: string = "rest/v1.0/saleonine_livecampaign";
  public _keyCacheGrid: string = 'livecampaign-page:grid_livecampaign:settings';
  _keyCacheDrawerEdit: string = '_keyCacheDrawer';

  constructor(private apiService: TCommonService) {
    super(apiService);
  }

  get(): Observable<any>{
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}`,
        method: CoreApiMethodType.get,
    }

    return this.apiService.getData<any>(api, null);
  }

  getById(id: any): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}(${id})?$expand=Details,Users`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<any>(api, null);
	}

  getDetailById(id: string ): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}(${id})?$expand=Details,Users,Preliminary_Template,ConfirmedOrder_Template`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<any>(api, null);
  }

  getAvailables(text?: string){
    let url = "ODataService.GetAvailables?%24orderby=DateCreated+desc&%24top=30";
    if(TDSHelperString.hasValueString(text)) {
        url = `${url}&%24filter=((contains(Name%2C'${text}')+or+contains(Facebook_UserName%2C'${text}')))`;
    }
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/${url}`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<any>(api, null);
  }

  getAvailablesV2(offset: number, limit: number, text?: string){
    let skip = (offset -1) * limit;
    let url = `ODataService.GetAvailables?%24orderby=DateCreated+desc&%24skip=${skip}&%24top=${limit}&$count=true`;
    if(TDSHelperString.hasValueString(text)) {
        url = `${url}&%24filter=((contains(Name%2C'${text}')+or+contains(NameNoSign%2C'${text}')))`;
    }

    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/${url}`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<any>(api, null);
  }

  getDetailAndAttributes(id: any): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/${id}/getwithdetailandattributes`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<any>(api, null);
  }

  create(data: any): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<any>(api, data);
  }

  update(data: any, isUpdate: boolean): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}(${data.Id})?isUpdate=${isUpdate}&includeOrderTag=true`,
      method: CoreApiMethodType.put,
    }

    return this.apiService.getData<any>(api, data);
  }

  updateFacebookByLiveCampaign(id: string, data: any): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}(${id})/ODataService.UpdateFacebook`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<any>(api, data);
  }

  getReportLiveCampaignOverview(data: any): Observable<any>{
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.ReportLiveCampaignOverview`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<any>(api, data);
  }

  approve(id: string | undefined): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.table}/Approve?id=${id}`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<any>(api, null);
  }

  delete(id: string | undefined): Observable<undefined> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}(${id})`,
      method: CoreApiMethodType.delete,
    }

    return this.apiService.getData<undefined>(api, null);
  }

  updateActiveDetail(id: string, isActive: boolean): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.UpdateActiveDetail?key=${id}&isActive=${isActive}`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<any>(api, null);
  }

  getAllFacebookPost(id: string | undefined): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/${id}/getallfacebookpost`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<any>(api, null);
  }

  getReport(id: string): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/${id}/getreport`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<any>(api, null);
  }

  updateProductQuantity(id: string, quantity: number | undefined, liveCampaignId: string): Observable<boolean> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/${id}/updateproductquantity?quantity=${quantity}&liveCampaignId=${liveCampaignId}`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<boolean>(api, null);
  }

  getSOCartHistory(liveCampaignId: string, productId: number, orderId: TDSSafeAny): Observable<ODataResponsesDTO<any>> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.GetSOCartHistory?key=${liveCampaignId}&product_id=${productId}&order_id=${orderId}`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<ODataResponsesDTO<any>>(api, null);
  }

  getFSCartHistory(liveCampaignId: string, productId: number, orderId: TDSSafeAny): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.GetFSCartHistory?key=${liveCampaignId}&product_id=${productId}&order_id=${orderId}`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<any>(api, null);
  }

  reportLiveCampaignProduct(liveCampaignId: string, take: number, skip: number, isOnlyProductCancel: boolean = false, searchText?: string): Observable<any> {
    let url = `${this._BASE_URL}/${this.baseRestApi}/${liveCampaignId}/reportlivecampaignproduct?take=${take}&skip=${skip}&isOnlyProductCancel=${isOnlyProductCancel}`;

    if(searchText) {
      url += `&q=${searchText}`
    }

    const api: CoreAPIDTO = {
        url: url,
        method: CoreApiMethodType.get,
    }

    return this.apiService.getData<any>(api, null);
  }

  getSOOrder(liveCampaignId: string, productId: number, params: string) {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.GetLiveCampaignSOOrder?key=${liveCampaignId}&product_id=${productId}&${params}&$count=true`,
        method: CoreApiMethodType.get,
    }

    return this.apiService.getData<any>(api, null);
  }

  getSOOrderCancel(liveCampaignId: string, productId: number, params: string) {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.GetLiveCampaignSOOrderCancel?key=${liveCampaignId}&product_id=${productId}&${params}&$count=true`,
        method: CoreApiMethodType.get,
    }

    return this.apiService.getData<any>(api, null);
  }

  getFSOrder(liveCampaignId: string, productId: number, params: string) {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.GetLiveCampaignFSOrder?key=${liveCampaignId}&product_id=${productId}&${params}&$count=true`,
        method: CoreApiMethodType.get,
    }

    return this.apiService.getData<any>(api, null);
  }

  getFSOrderCancel(liveCampaignId: string, productId: number, params: string) {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.GetLiveCampaignFSOrderCancel?key=${liveCampaignId}&product_id=${productId}&${params}&$count=true`,
        method: CoreApiMethodType.get,
    }

    return this.apiService.getData<any>(api, null);
  }

  deleteDetails(id: string, ids: any): Observable<any> {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.baseRestApi}/${id}/deletedetails`,
        method: CoreApiMethodType.delete,
    }

    return this.apiService.deleteData<any>(api, null, ids);
  }

  updateDetails(id: string, data: any): Observable<any> {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.baseRestApi}/${id}/updatedetails`,
        method: CoreApiMethodType.post,
    }

    return this.apiService.getData<any>(api, data);
  }

  getOrderTagbyIds(ids: any): Observable<any> {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/rest/v1.0/product/getordertagbyids`,
        method: CoreApiMethodType.post,
    }

    return this.apiService.getData<any>(api, ids);
  }

  updateSimple(id: string, data: any): Observable<any> {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.baseRestApi}/${id}/updatesimple`,
        method: CoreApiMethodType.post,
    }

    return this.apiService.getData<any>(api, data);
  }

  orderPartnerbyLivecampaign(liveCampaignId: string): Observable<any> {
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/rest/v1.0/fastsaleorder/orderpartnerbylivecampaign?liveCampaignId=${liveCampaignId}`,
        method: CoreApiMethodType.get,
    }

    return this.apiService.getData<any>(api, null);
  }

  //TODO: mẫu add product
  urlSampleProductLiveCampaign(): any {
    let url = `${this._BASE_URL}/Content/files/live_campaign/mau_import_san_pham_live_campaign.xlsx`;
    return url;
  }

  importProductLivecampaign(data: any): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/importproductlivecampaign`,
      method: CoreApiMethodType.post
    }
    return this.apiService.getData<any>(api, data);
  }

  overviewReport(liveCampaignId: string): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/${liveCampaignId}/overviewreport`,
      method: CoreApiMethodType.get,
    }
    return this.apiService.getData<any>(api, null);
  }

  overviewDetailsReport(liveCampaignId: string, params?: string): Observable<SaleOnlineLiveCampaignDTO> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/${liveCampaignId}/overviewdetailsreport`+ (params ? `?${params}` : ``),
      method: CoreApiMethodType.get,
    }
    return this.apiService.getData<any>(api, null);
  }

  overviewSaleOnlineoOrders(liveCampaignId: string, params: string): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/overviewsaleonlineorders?liveCampaignDetailId=${liveCampaignId}&${params}`,
      method: CoreApiMethodType.get,
    }
    return this.apiService.getData<any>(api, null);
  }

  overviewFastSaleOrders(liveCampaignId: string, params: string): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/overviewfastsaleorders?liveCampaignDetailId=${liveCampaignId}&${params}`,
      method: CoreApiMethodType.get,
    }
    return this.apiService.getData<any>(api, null);
  }


  getContentToOrders(liveCampaignId: string): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/${liveCampaignId}/getcontenttoorders`,
      method: CoreApiMethodType.get,
    }
    return this.apiService.getData<any>(api, null);
  }


  setLocalStorageDrawer(objectId: any, liveCampaignId: string, isOpenDrawer: boolean) {
    const key = `${this._keyCacheDrawerEdit}`;
    let data = {
      liveCampaignId: liveCampaignId,
      objectId: objectId,
      isOpenDrawer: isOpenDrawer
    };

    localStorage.setItem(key, JSON.stringify(data));
  }

  getLocalStorageDrawer() {
    const key = `${this._keyCacheDrawerEdit}`;
    let item = localStorage.getItem(key);

    if(item) {
      return JSON.parse(item);
    } else {
      return null;
    }
  }

  removeLocalStorageDrawer() {
    const key = `${this._keyCacheDrawerEdit}`;
    localStorage.removeItem(key);
  }

  getByLiveCampaignId(id: any): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}(${id})`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<any>(api, null);
	}

  getDetailExistByProductIds(id: string): Observable<any>{
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/rest/v1.0/saleonine_livecampaign/${id}/getdetailexists`,
        method: CoreApiMethodType.get,
    }

    return this.apiService.getData<any>(api, null);
  }

  updateChannelByLiveCampaign(id: string, data: any): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}(${id})/ODataService.UpdateChannel`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<any>(api, data);
  }

  apiUpdateChannelLiveCampaign(id: string, data: any, channelType: string) {
    switch (channelType) {
      case CRMTeamType._TShop:
      case CRMTeamType._UnofficialTikTok:
          return this.updateChannelByLiveCampaign(id, data)
      default:
          return this.updateFacebookByLiveCampaign(id, data);
    }
  }

}
