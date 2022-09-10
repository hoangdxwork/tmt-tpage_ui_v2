import { ChatomniConversationItemDto } from '@app/dto/conversation-all/chatomni/chatomni-conversation';
import { Injectable } from "@angular/core";
import { map, Observable, shareReplay, mergeMap } from "rxjs";
import { CoreAPIDTO, CoreApiMethodType, TCommonService } from "src/app/lib";
import { TDSHelperObject, TDSHelperString } from "tds-ui/shared/utility";
import { BaseSevice } from "../base.service";
import { get as _get } from 'lodash';
import { ChatomniConversationFacade } from "../chatomni-facade/chatomni-conversation.facade";
import { ChatomniConversationDto } from "../../dto/conversation-all/chatomni/chatomni-conversation";
import { ChatomniConversationInfoDto } from "@app/dto/conversation-all/chatomni/chatomni-conversation-info.dto";
import { CRMMatchingService } from "../crm-matching.service";

@Injectable()

export class ChatomniConversationService extends BaseSevice {

  prefix: string = "";
  table: string = "";
  baseRestApi: string = "rest/v2.0/chatomni";
  urlNext: string | undefined;

  _keyCheckCsidRouter = 'check_Csid_Router';

  constructor(private apiService: TCommonService,
    private crmMatchingService: CRMMatchingService,
      private csFacade: ChatomniConversationFacade) {
      super(apiService)
  }

  get(teamId: number, type: string, queryObj?: any): Observable<ChatomniConversationDto> {

    let queryString = null;
    if (queryObj) {
      queryString = Object.keys(queryObj).map(key => {
        return key + '=' + queryObj[key]
      }).join('&');
    }

    let url = `${this._BASE_URL}/${this.baseRestApi}/${teamId}/conversations?type=${type}`;
    if (TDSHelperString.hasValueString(queryString)) {
        url = `${url}&${queryString}`;
    }

    let api: CoreAPIDTO = {
      url: `${url}`,
      method: CoreApiMethodType.get,
    }
    return this.apiService.getData<ChatomniConversationDto>(api, null);
  }

  getLink(url: string): Observable<ChatomniConversationDto> {
    let queryString = null;

    if (TDSHelperString.hasValueString(queryString)) {
      url = `${url}&${queryString}`;
    }

    let api: CoreAPIDTO = {
      url: `${url}`,
      method: CoreApiMethodType.get
    }
    return this.apiService.getData<ChatomniConversationDto>(api, null);
  }

  makeDataSource(teamId: number, type: string, queryObj?: any): Observable<ChatomniConversationDto> {

    this.urlNext = '';
    this.csFacade.dataSource = {};

    return this.get(teamId, type, queryObj).pipe(map((res: any) => {

        // TODO: load dữ liệu lần đầu tiên
        if (TDSHelperObject.hasValue(res)) {
            this.csFacade.setData(teamId, res);
        }

        this.urlNext = res.Paging?.UrlNext;

        let result = this.csFacade.getData(teamId);
        return result;

    }), shareReplay({ bufferSize: 1, refCount: true }));

  }

  nextDataSource(teamId: number, type: string, lstConversation: ChatomniConversationItemDto[], queryObj?: any, ): Observable<ChatomniConversationDto> {

    let exist = this.csFacade.getData(teamId);
    lstConversation = lstConversation || [];

    if (exist && !TDSHelperString.hasValueString(this.urlNext)) {
        return new Observable((obs: any) => {
            obs.next();
            obs.complete();
        })
    }
    else {
      let url = this.urlNext as string;

      return this.getLink(url).pipe(map((res: ChatomniConversationDto) => {

        if(!res) {
          let result = this.csFacade.getData(teamId);
          return result;
        }

        if(res.Extras) {
          exist.Extras = {
              Objects: Object.assign({}, exist.Extras?.Objects, res.Extras?.Objects)
          }
        }

         // TODO: Lọc conversation item trùng khi socket trả về không có trong lstConversation
        if(res.Items && res.Items.length > 0) {

          res.Items.forEach((x: ChatomniConversationItemDto) => {
            let idx = lstConversation.findIndex(a => a.ConversationId == x.ConversationId);

            if(idx > -1) {

                let item = {...lstConversation[idx]};
                lstConversation[idx] = {...x};

                lstConversation[idx].LatestMessage = {...item.LatestMessage} as any;
                res.Items = res.Items.filter(y => x.ConversationId != y.ConversationId);
            }
          });
        }

        exist.Items = [];
        exist.Items = [...lstConversation,...res.Items];

        // TODO nếu trùng urlNext thì xóa không cho load
        if (this.urlNext != res.Paging?.UrlNext && res.Paging.HasNext) {
            this.urlNext = res.Paging.UrlNext;
            exist.Paging = { ...res.Paging };
        } else {
            delete this.urlNext;
        }

        this.csFacade.setData(teamId, exist);

        let result = this.csFacade.getData(teamId);
        return result;

      }), shareReplay({ bufferSize: 1, refCount: true }));
    }
  }

  getInfo(teamId: number, csid: string): Observable<any> {

    let id = `${teamId}_${csid}`;
    let api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.baseRestApi}/info?id=${id}`,
        method: CoreApiMethodType.get
    }
    return this.apiService.getData<any>(api, null);
  }

  syncConversationInfo(teamId: number, csid: string): Observable<any> {
    return this.getInfo(teamId, csid).pipe(map((x: any) => {
        return x;
    }),shareReplay(1))
    // mergeMap((x: any) => {
    //   if(x.Partner && x.Partner.Phone)  {
    //       return this.crmMatchingService.checkPhoneReport(x.Partner.Phone).pipe(map((p: any) => {
    //           x.Partner.PhoneReport = p.is_report;
    //           return x;
    //       }))
    //   } else {
    //       return x;
    //   }
    // }), )
  }

}
