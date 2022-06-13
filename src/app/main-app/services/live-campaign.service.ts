import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { TAPIDTO, TApiMethodType, TCommonService } from "src/app/lib";
import { TDSSafeAny } from "tds-ui/shared/utility";
import { FacebookMappingPostDTO } from "../dto/conversation/post/post.dto";
import { ApproveLiveCampaignDTO, CartHistoryEventDTO, DetailReportLiveCampaignDTO, FSOrderHistoryEventDTO, LiveCampaign_SimpleDataDTO, ReportLiveCampaignOverviewDTO, SaleOnlineLiveCampaignDetailDTO, SaleOnline_LiveCampaignDTO, SearchReportLiveCampaignOverviewDTO, UpdateFacebookLiveCampaignDTO } from "../dto/live-campaign/live-campaign.dto";
import { ODataModelDTO, ODataResponsesDTO } from "../dto/odata/odata.dto";
import { BaseSevice } from "./base.service";

@Injectable()
export class LiveCampaignService extends BaseSevice {
  prefix: string = "odata";
  table: string = "SaleOnline_LiveCampaign";
  baseRestApi: string = "rest/v1.0/saleonine_livecampaign";
  public _keyCacheGrid: string = 'saleonine_livecampaign-page:grid_saleonine_livecampaign:settings';

  public dataActive$ = new BehaviorSubject<SaleOnline_LiveCampaignDTO[]>([]);

  constructor(private apiService: TCommonService) {
    super(apiService);
    this.initialize();
  }

  initialize() {
    this.getAvailables().subscribe(res => {
      let dataActive = res?.value.filter(x => x.IsActive);
      this.dataActive$.next(dataActive);
    })
  }

  getById(id: any): Observable<SaleOnline_LiveCampaignDTO> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}(${id})?$expand=Details,Users`,
      method: TApiMethodType.get,
    }

    return this.apiService.getData<SaleOnline_LiveCampaignDTO>(api, null);
	}

  getDetailById(id: string | undefined): Observable<SaleOnline_LiveCampaignDTO> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}(${id})?$expand=Details,Users,Preliminary_Template,ConfirmedOrder_Template`,
      method: TApiMethodType.get,
    }

    return this.apiService.getData<SaleOnline_LiveCampaignDTO>(api, null);
  }

  getAvailables(): Observable<ODataResponsesDTO<SaleOnline_LiveCampaignDTO>> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.GetAvailables?$orderby=DateCreated%20desc&$top=${30}`,
      method: TApiMethodType.get,
    }

    return this.apiService.getData<ODataResponsesDTO<SaleOnline_LiveCampaignDTO>>(api, null);
  }

  getDetailAndAttributes(id: any): Observable<LiveCampaign_SimpleDataDTO> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/${id}/getwithdetailandattributes`,
      method: TApiMethodType.get,
    }

    return this.apiService.getData<LiveCampaign_SimpleDataDTO>(api, null);
  }

  create(data: SaleOnline_LiveCampaignDTO): Observable<SaleOnline_LiveCampaignDTO> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}`,
      method: TApiMethodType.post,
    }

    return this.apiService.getData<SaleOnline_LiveCampaignDTO>(api, data);
  }

  update(data: SaleOnline_LiveCampaignDTO, isUpdate: boolean): Observable<SaleOnline_LiveCampaignDTO> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}(${data.Id})?isUpdate=${isUpdate}`,
      method: TApiMethodType.put,
    }

    return this.apiService.getData<SaleOnline_LiveCampaignDTO>(api, data);
  }

  updateLiveCampaignPost(id: string | undefined, data: UpdateFacebookLiveCampaignDTO): Observable<boolean> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}(${id})/ODataService.UpdateFacebook`,
      method: TApiMethodType.post,
    }

    return this.apiService.getData<boolean>(api, data);
  }

  getReportLiveCampaignOverview(data: ODataModelDTO<SearchReportLiveCampaignOverviewDTO>): Observable<ReportLiveCampaignOverviewDTO>{
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.ReportLiveCampaignOverview`,
      method: TApiMethodType.post,
    }

    return this.apiService.getData<ReportLiveCampaignOverviewDTO>(api, data);
  }

  approve(id: string | undefined): Observable<ApproveLiveCampaignDTO> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.table}/Approve?id=${id}`,
      method: TApiMethodType.post,
    }

    return this.apiService.getData<ApproveLiveCampaignDTO>(api, null);
  }

  delete(id: string | undefined): Observable<undefined> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}(${id})`,
      method: TApiMethodType.delete,
    }

    return this.apiService.getData<undefined>(api, null);
  }

  updateActiveDetail(id: string, isActive: boolean): Observable<SaleOnlineLiveCampaignDetailDTO> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.UpdateActiveDetail?key=${id}&isActive=${isActive}`,
      method: TApiMethodType.get,
    }

    return this.apiService.getData<SaleOnlineLiveCampaignDetailDTO>(api, null);
  }

  getAllFacebookPost(id: string | undefined): Observable<FacebookMappingPostDTO[]> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/${id}/getallfacebookpost`,
      method: TApiMethodType.get,
    }

    return this.apiService.getData<FacebookMappingPostDTO[]>(api, null);
  }

  getReport(id: string): Observable<DetailReportLiveCampaignDTO> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/${id}/getreport`,
      method: TApiMethodType.get,
    }

    return this.apiService.getData<DetailReportLiveCampaignDTO>(api, null);
  }

  updateProductQuantity(id: string, quantity: number | undefined, liveCampaignId: string): Observable<boolean> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/${id}/updateproductquantity?quantity=${quantity}&liveCampaignId=${liveCampaignId}`,
      method: TApiMethodType.post,
    }

    return this.apiService.getData<boolean>(api, null);
  }

  getSOCartHistory(liveCampaignId: string, productId: number, orderId: TDSSafeAny): Observable<ODataResponsesDTO<CartHistoryEventDTO>> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.GetSOCartHistory?key=${liveCampaignId}&product_id=${productId}&order_id=${orderId}`,
      method: TApiMethodType.get,
    }

    return this.apiService.getData<ODataResponsesDTO<CartHistoryEventDTO>>(api, null);
  }

  getFSCartHistory(liveCampaignId: string, productId: number, orderId: TDSSafeAny): Observable<FSOrderHistoryEventDTO> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.GetFSCartHistory?key=${liveCampaignId}&product_id=${productId}&order_id=${orderId}`,
      method: TApiMethodType.get,
    }

    return this.apiService.getData<FSOrderHistoryEventDTO>(api, null);
  }

}
