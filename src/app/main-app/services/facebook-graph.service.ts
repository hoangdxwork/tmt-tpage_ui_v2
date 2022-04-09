import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { TAPIDTO, TApiMethodType, TCommonService } from "src/app/lib";
import { TDSSafeAny } from "tmt-tang-ui";
import { FBUserPageRequestDTO } from "../dto/team/user-page.dto";
import { BaseSevice } from "./base.service";

@Injectable({
  providedIn: 'root'
})
export class FacebookGraphService extends BaseSevice {

  prefix: string = "";
  table: string = "";
  baseRestApi: string = "";

  readonly version: string = 'v3.3';

  constructor(private apiService: TCommonService) {
    super(apiService)
  }

  getUserPages(accessToken: string): Observable<FBUserPageRequestDTO> {
    const api: TAPIDTO = {
        url: `https://graph.facebook.com/${this.version}/me/accounts?fields=id,name,picture,category,category_list,access_token,link&limit=50&access_token=${accessToken}`,
        method: TApiMethodType.get,
    }

    return this.apiService.getData<FBUserPageRequestDTO>(api,null);
  }

}
