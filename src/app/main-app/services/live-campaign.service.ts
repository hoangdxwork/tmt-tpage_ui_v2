import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { TAPIDTO, TApiMethodType, TCommonService } from "src/app/lib";
import { LiveCampaign_SimpleDataDTO, SaleOnline_LiveCampaignDTO, UpdateFacebookLiveCampaignDTO } from "../dto/live-campaign/live-campaign.dto";
import { ODataResponsesDTO } from "../dto/odata/odata.dto";
import { BaseSevice } from "./base.service";

@Injectable()
export class LiveCampaignService extends BaseSevice {
  prefix: string = "odata";
  table: string = "SaleOnline_LiveCampaign";
  baseRestApi: string = "rest/v1.0/saleonine_livecampaign";

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

  getDetailById(id: string): Observable<SaleOnline_LiveCampaignDTO> {
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

  updateLiveCampaignPost(id: string | undefined, data: UpdateFacebookLiveCampaignDTO): Observable<boolean> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}(${id})/ODataService.UpdateFacebook`,
      method: TApiMethodType.post,
    }

    return this.apiService.getData<boolean>(api, data);
  }

}
