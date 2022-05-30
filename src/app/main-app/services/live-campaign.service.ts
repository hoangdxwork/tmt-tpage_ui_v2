import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { TAPIDTO, TApiMethodType, TCommonService } from "src/app/lib";
import { LiveCampaign_SimpleDataDTO, SaleOnline_LiveCampaignDTO } from "../dto/live-campaign/live-campaign.dto";
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

  }

  getById(id: any): Observable<SaleOnline_LiveCampaignDTO> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}(${id})?$expand=Details,Users`,
      method: TApiMethodType.get,
    }

    return this.apiService.getData<SaleOnline_LiveCampaignDTO>(api, null);
	}

  getDetailAndAttributes(id: any): Observable<LiveCampaign_SimpleDataDTO> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/${id}/getwithdetailandattributes`,
      method: TApiMethodType.get,
    }

    return this.apiService.getData<LiveCampaign_SimpleDataDTO>(api, null);
  }


}
