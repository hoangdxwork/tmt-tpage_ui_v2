import { Injectable } from "@angular/core";
import { HttpClient } from "@microsoft/signalr";
import { Observable } from "rxjs";
import { TAPIDTO, TApiMethodType, TCommonService } from "src/app/lib";
import { FacebookApiMethod, FacebookApiParams } from "src/app/lib/dto/facebook.dto";
import { FBUserPageRequestDTO } from "../dto/team/user-page.dto";
import { BaseSevice } from "./base.service";
import { FacebookLoginService } from "./facebook-login.service";

@Injectable({
  providedIn: 'root'
})
export class FacebookGraphService extends BaseSevice {

  prefix: string = "";
  table: string = "";
  baseRestApi: string = "";

  public limit: Number = 50;
  public me: any;
  readonly version: string = 'v3.3';

  constructor(private apiService: TCommonService,
    private fb: FacebookLoginService) {
    super(apiService)
  }

  api(path: string, method?: string, params?: any): Observable<any> {
      return this.fb.api(path, <FacebookApiMethod>method, <FacebookApiParams>params);
  }

  getUserPages(accessToken: string): Observable<FBUserPageRequestDTO> {
    const api: TAPIDTO = {
        url: `https://graph.facebook.com/${this.version}/me/accounts?fields=id,name,picture,category,category_list,access_token,link&limit=50&access_token=${accessToken}`,
        method: TApiMethodType.get,
    }

    return this.apiService.getData<FBUserPageRequestDTO>(api,null);
  }

  getFeed(accessToken: any): Observable<any> {
    return this.fb.api(`/me/feed?fields=id,picture,message,story,description&access_token=${accessToken}`, {})
        .pipe((res: any) => {
            return res;
        });
  }

}
