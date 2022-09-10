import { ChatomniDataDto, ChatomniDataItemDto } from './../../dto/conversation-all/chatomni/chatomni-data.dto';
import { EventEmitter, Injectable } from "@angular/core";
import { catchError, map, Observable, of, shareReplay } from "rxjs";
import { CoreAPIDTO, CoreApiMethodType, TCommonService } from "src/app/lib";
import { TDSHelperArray, TDSHelperObject, TDSHelperString, TDSSafeAny } from "tds-ui/shared/utility";
import { BaseSevice } from "../base.service";
import { get as _get } from 'lodash';
import { set as _set } from 'lodash';
import { ChatomniMessageFacade } from "../chatomni-facade/chatomni-message.facade";

@Injectable()

export class ChatomniMessageService extends BaseSevice  {

  prefix: string = "odata";
  table: string = "";
  baseRestApi: string = "rest/v2.0/chatomni";
  urlNext: string | undefined;

  constructor(private apiService: TCommonService,
    private omniFacade: ChatomniMessageFacade) {
      super(apiService)
  }

  get(teamId: number, psid: any, type: string): Observable<ChatomniDataDto> {

      let api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.baseRestApi}/${teamId}_${psid}/messages?type=${type}`,
        method: CoreApiMethodType.get,
      }
      return this.apiService.getData<ChatomniDataDto>(api, null);
  }

  getLink(url: string): Observable<any>  {
    let api: CoreAPIDTO = {
        url: `${url}`,
        method: CoreApiMethodType.get
    }
    return this.apiService.getData<any>(api, null);
  }

  makeDataSource(teamId: number, psid: any, type: string): Observable<ChatomniDataDto> {

      this.urlNext = '';
      this.omniFacade.dataSource = {};

      let id = `${teamId}_${psid}`;

      return this.get(teamId, psid, type).pipe(map((res: ChatomniDataDto) => {
     
          // TODO: load dữ liệu lần đầu tiên
          if(TDSHelperObject.hasValue(res)) {
              this.omniFacade.setData(id, res);
          }

          this.urlNext = res.Paging?.UrlNext;

          let result = this.omniFacade.getData(id);
          return result; //tương đương this.chatomniDataSource[id]

      }), shareReplay({ bufferSize: 1, refCount: true }));
  }

  nextDataSource(id: string, dataSourceItem: ChatomniDataItemDto[]): Observable<ChatomniDataDto> {

    let exist = this.omniFacade.getData(id);
    if(exist && !TDSHelperString.hasValueString(this.urlNext)) {

        return Observable.create((obs :any) => {
            obs.next();
            obs.complete();
        })
    }
    else {
      let url = this.urlNext  as string;
      return this.getLink(url).pipe(map((res: ChatomniDataDto) => {
     
          if(res.Extras) {
            exist.Extras = {
                Objects: Object.assign({}, exist.Extras?.Objects, res.Extras?.Objects),
                Childs: Object.assign({}, exist.Extras?.Childs, res.Extras?.Childs)
            }
          }

          if(dataSourceItem && dataSourceItem.length > 0){
            exist.Items = [ ...dataSourceItem, ...res.Items ];
          } else {
            exist.Items = [ ...exist.Items, ...res.Items ];
          }

          exist.Paging = { ...res.Paging };

          // TODO nếu trùng urlNext thì xóa không cho load
          if(this.urlNext != res.Paging?.UrlNext && res.Paging.HasNext) {
              this.urlNext = res.Paging.UrlNext;
          } else {
              delete this.urlNext;
          }

          this.omniFacade.setData(id, exist);

          let result = this.omniFacade.getData(id);
          return result; //tương đương this.chatomniDataSource[id]]

      }), shareReplay({ bufferSize: 1, refCount: true }));
    }
  }

}
