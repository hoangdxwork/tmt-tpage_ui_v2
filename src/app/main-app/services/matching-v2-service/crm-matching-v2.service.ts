import { Injectable } from "@angular/core";
import { Observable, map, shareReplay } from "rxjs";
import { TAPIDTO, TApiMethodType, TCommonService } from "src/app/lib";
import { TDSHelperArray, TDSHelperObject, TDSHelperString } from "tds-ui/shared/utility";
import { CrmMatchingV2Detail, CrmMatchingV2DTO } from "../../dto/conversation-all/crm-matching-v2/crm-matching-v2.dot";
import { BaseSevice } from "../base.service";
import { CrmMatchingV2Facade } from "../matching-v2-facade/crm-matching-v2.facade";

@Injectable({
  providedIn: 'root'
})

export class CrmMatchingV2Service extends BaseSevice  {

  prefix: string = "odata";
  table: string = "";
  baseRestApi: string = "rest/v2.0/crmmatching";

  urlNext: string | undefined;

  constructor(private apiService: TCommonService,
    private crmMatchingV2Facade: CrmMatchingV2Facade) {
      super(apiService)
  }

  get(pageId: string, type: string, queryObj?: any): Observable<CrmMatchingV2DTO> {

      let queryString = null;
      if(queryObj) {
          queryString = Object.keys(queryObj).map(key => {
              return key + '=' + queryObj[key]
          }).join('&');
      }

      let url = `${this._BASE_URL}/${this.baseRestApi}?pageId=${pageId}&type=${type}`;
      if(TDSHelperString.hasValueString(queryString)) {
          url = `${url}&${queryString}`;
      }

      let api: TAPIDTO = {
          url: `${url}`,
          method: TApiMethodType.get,
      }
      return this.apiService.getData<CrmMatchingV2DTO>(api, null);
  }

  getLink(url: string, queryObj?: any): Observable<CrmMatchingV2DTO>  {

    let queryString = null;
    if(queryObj) {
        queryString = Object.keys(queryObj).map(key => {
            return key + '=' + queryObj[key]
        }).join('&');
    }

    if(TDSHelperString.hasValueString(queryString)) {
        url = `${url}&${queryString}`;
    }

    let api: TAPIDTO = {
          url: `${url}`,
          method: TApiMethodType.get
      }
      return this.apiService.getData<CrmMatchingV2DTO>(api, null);
  }

  makeDataSource(pageId: any, type: string, queryObj?: any): Observable<CrmMatchingV2DTO> {

    // let exist = this.crmMatchingV2Facade.getData(pageId);
    this.urlNext = '';
    // if(exist) {
    //     return Observable.create((obs :any) => {
    //         obs.next(exist);
    //         obs.complete();
    //     })
    // } else {
      return this.get(pageId, type, queryObj).pipe(map((res: CrmMatchingV2DTO) => {

          // TODO: load dữ liệu lần đầu tiên
          if(TDSHelperObject.hasValue(res)) {
              this.crmMatchingV2Facade.setData(pageId, res);
          }

          this.urlNext = res.Paging?.UrlNext;

          let result = this.crmMatchingV2Facade.getData(pageId);
          return result;

      }), shareReplay({ bufferSize: 1, refCount: true }));
    // }
}

nextDataSource(pageId: string, queryObj?: any): Observable<CrmMatchingV2DTO> {

  let exist = this.crmMatchingV2Facade.getData(pageId);

  if(exist && !TDSHelperString.hasValueString(this.urlNext)) {
      return Observable.create((obs :any) => {
          obs.next();
          obs.complete();
      })
  }
  else {
    let url = this.urlNext  as string;
    return this.getLink(url, queryObj).pipe(map((res: CrmMatchingV2DTO) => {

       // TODO nếu trùng urlNext thì xóa không cho load
       if(this.urlNext != res.Paging?.UrlNext && res.Paging.HasNext) {
            this.urlNext = res.Paging.UrlNext;

            exist.Items = [ ...exist.Items, ...res.Items ];
            exist.Paging = { ...res.Paging };

        } else {
            delete this.urlNext;
        }

        this.crmMatchingV2Facade.setData(pageId, exist);

        let result = this.crmMatchingV2Facade.getData(pageId);
        return result;

    }), shareReplay({ bufferSize: 1, refCount: true }));
  }
}

}
