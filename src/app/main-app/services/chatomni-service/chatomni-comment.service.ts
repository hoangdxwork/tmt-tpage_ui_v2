import { Injectable } from "@angular/core";
import { ChatomniDataDto, ChatomniDataItemDto } from "@app/dto/conversation-all/chatomni/chatomni-data.dto";
import { map, Observable, shareReplay } from "rxjs";
import { CoreAPIDTO, CoreApiMethodType, TCommonService } from "src/app/lib";
import { TDSHelperArray, TDSHelperObject, TDSHelperString } from "tds-ui/shared/utility";
import { BaseSevice } from "../base.service";
import { ChatomniCommentFacade } from "../chatomni-facade/chatomni-comment.facade";

@Injectable()

export class ChatomniCommentService extends BaseSevice  {

  prefix: string = "odata";
  table: string = "";
  baseRestApi: string = "rest/v2.0/chatomni";

  urlNext: string | undefined;

  constructor(private apiService: TCommonService,
    private commentFacade: ChatomniCommentFacade) {
      super(apiService)
  }

  get(id: any, queryObj?: any): Observable<ChatomniDataDto> {

    let queryString = null;
    if (queryObj) {
        queryString = Object.keys(queryObj).map(key => {
            return key + '=' + queryObj[key]
        }).join('&');
    }

    let url = `${this._BASE_URL}/${this.baseRestApi}/${id}/comments`;
    if (TDSHelperString.hasValueString(queryString)) {
        url = `${url}&${queryString}`;
    }

    let api: CoreAPIDTO = {
        url: `${url}`,
        method: CoreApiMethodType.get,
    }
    return this.apiService.getData<ChatomniDataDto>(api, null);
  }

  getLink(url: string, queryObj?: any): Observable<ChatomniDataDto>  {
    let queryString = null;
    if (queryObj) {
        queryString = Object.keys(queryObj).map(key => {
            return key + '=' + queryObj[key]
        }).join('&');
    }

    if (TDSHelperString.hasValueString(queryString)) {
        url = `${url}&${queryString}`;
    }

    let api: CoreAPIDTO = {
        url: `${url}`,
        method: CoreApiMethodType.get
    }

    return this.apiService.getData<ChatomniDataDto>(api, null);
  }

  makeDataSource(teamId: number, objectId: any, queryObj?: any): Observable<ChatomniDataDto> {

    this.urlNext = '';
    this.commentFacade.dataSource = {};
    let id = `${teamId}_${objectId}`;

    return this.get(id, queryObj).pipe(map((res: ChatomniDataDto) => {

      // TODO: load dữ liệu lần đầu tiên
      this.commentFacade.setData(id, res);
      this.urlNext = res.Paging?.UrlNext;

      let result = this.commentFacade.getData(id);
      return result;

    }), shareReplay({ bufferSize: 1, refCount: true }));

  }

  nextDataSource(id: string): Observable<ChatomniDataDto> {

    let exist = this.commentFacade.getData(id);
    if(exist && !TDSHelperString.hasValueString(this.urlNext)) {

        return new Observable((obs :any) => {
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

            exist.Items = [ ...exist.Items, ...res.Items ];
            exist.Paging = { ...res.Paging };

            // TODO nếu trùng urlNext thì xóa không cho load
            if(this.urlNext != res.Paging?.UrlNext && res.Paging.HasNext) {
                this.urlNext = res.Paging.UrlNext;
            } else {
                delete this.urlNext;
            }

            this.commentFacade.setData(id, exist);

            let result = this.commentFacade.getData(id);
            return result; //tương đương this.chatomniDataSource[id]]

        }), shareReplay({ bufferSize: 1, refCount: true }));
    }
  }
}
