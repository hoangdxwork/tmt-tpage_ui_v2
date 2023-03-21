import { Injectable } from "@angular/core";
import { HttpClient } from "@microsoft/signalr";
import { Observable } from "rxjs";
import { CoreAPIDTO, CoreApiMethodType, TCommonService } from "src/app/lib";
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

  getGraphFacebookAccounts(accessToken: string): Observable<FBUserPageRequestDTO> {
    const api: CoreAPIDTO = {
        url: `https://graph.facebook.com/${this.version}/me/accounts?fields=id,name,picture,category,category_list,access_token,link&limit=50&access_token=${accessToken}`,
        method: CoreApiMethodType.get,
    }

    return this.apiService.getData<FBUserPageRequestDTO>(api,null);
  }

  getGraphFacebookMeFeed(accessToken: any): Observable<any> {
    return this.fb.api(`/me/feed?fields=id,picture,message,story,description&access_token=${accessToken}`, {})
        .pipe((res: any) => {
            return res;
        });
  }

  getGraphFacebookPage(accessToken: any): Observable<any> {
    return this.fb.api(`me/accounts?fields=id,name,link,picture,access_token&limit=500&access_token=${accessToken}`, {})
        .pipe((res: any) => {
            return res;
        });
  }

  getGraphFacebookGroup(ownerId: any): Observable<any> {
    return this.fb.api(`${ownerId}?fields=id,name,picture`, {})
        .pipe((res: any) => {
            return res;
        });
  }

  grapfbGetMe(accessToken: any): Observable<any> {
    const api: CoreAPIDTO = {
      url: `https://graph.facebook.com/me?fields=id,name,picture&access_token=${accessToken}`,
      method: CoreApiMethodType.get,
    }
    return this.apiService.getData<any>(api,null);
  }

}
