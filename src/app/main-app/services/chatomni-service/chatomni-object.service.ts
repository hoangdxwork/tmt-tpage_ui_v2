import { Injectable } from "@angular/core";
import { ChatomniObjectsDto, ChatomniObjectsItemDto } from "@app/dto/conversation-all/chatomni/chatomni-objects.dto";
import { CoreAPIDTO } from "@core/dto";
import { CoreApiMethodType } from "@core/enum";
import { TCommonService } from "@core/services";
import { map, Observable, shareReplay } from "rxjs";
import { TDSHelperArray, TDSHelperObject, TDSHelperString } from "tds-ui/shared/utility";
import { BaseSevice } from "../base.service";
import { ChatomniObjectFacade } from "../chatomni-facade/chatomni-object.facade";

@Injectable()

export class ChatomniObjectService extends BaseSevice  {

  prefix: string = "";
  table: string = "";
  baseRestApi: string = "rest/v2.0/chatomni";

  urlNext: string | undefined;
  _keycache_params_postid = "_params_postid";

  constructor(private apiService: TCommonService,
    private objFacade: ChatomniObjectFacade) {
      super(apiService)
  }

  get(teamId: number, queryObj?: any): Observable<ChatomniObjectsDto> {

    let queryString = null;
    if (queryObj) {
        queryString = Object.keys(queryObj).map((key: any): any => {
            return key + '=' + queryObj[key]
        }).join('&');
    }

    let url = `${this._BASE_URL}/${this.baseRestApi}/${teamId}/objects`;
    if (TDSHelperString.hasValueString(queryString)) {
        url = `${url}?${queryString}`;
    }

    let api: CoreAPIDTO = {
      url: `${url}`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<ChatomniObjectsDto>(api, null);
  }

  getLink(url: string): Observable<ChatomniObjectsDto> {

    let api: CoreAPIDTO = {
        url: `${url}`,
        method: CoreApiMethodType.get
    }
    return this.apiService.getData<ChatomniObjectsDto>(api, null);
  }

  makeDataSource(teamId: number, queryObj?: any): Observable<ChatomniObjectsDto> {

    this.urlNext = '';
    this.objFacade.dataSource = {};

    return this.get(teamId, queryObj).pipe(map((res: ChatomniObjectsDto) => {

      // TODO: load dữ liệu lần đầu tiên
      if (TDSHelperObject.hasValue(res)) {
          this.objFacade.setData(teamId, res);
      }

      this.urlNext = res.Paging?.UrlNext;

      let result = this.objFacade.getData(teamId);
      return result;

    }), shareReplay({ bufferSize: 1, refCount: true }));

  }

  nextDataSource(teamId: number): Observable<ChatomniObjectsDto> {

    let exist = this.objFacade.getData(teamId);

    if (exist && !TDSHelperString.hasValueString(this.urlNext)) {
        return new Observable((obs: any) => {
            obs.next();
            obs.complete();
        })
    }

    else {
      let url = this.urlNext as string;
      return this.getLink(url).pipe(map((res: ChatomniObjectsDto) => {

        if(res && res.Extras) {
          exist.Extras = {
              Objects: Object.assign({}, exist.Extras?.Objects, res.Extras?.Objects),
              Childs: Object.assign({}, exist.Extras?.Childs, res.Extras?.Childs)
          }
        }

        // TODO: item đầu tiên trong list trả về bị trùng item cuối cùng trong danh sách hiện tại
        if(res && res.Items && res.Items.length > 0) {
            let x = res.Items[0];
            let f = exist.Items.filter(y => y.ObjectId == x.ObjectId)[0];

            if(f && f?.ObjectId) {
                res.Items = res.Items.filter(y => y.ObjectId !== x.ObjectId);
            }
        }

        exist.Items = [...exist.Items, ...(res.Items || [])];

        // TODO nếu trùng urlNext thì xóa không cho load
        if (res && this.urlNext != res.Paging?.UrlNext && res.Paging.HasNext) {
            this.urlNext = res.Paging?.UrlNext;

            exist.Paging = { ...res.Paging };

        } else {
            delete this.urlNext;
        }

        this.objFacade.setData(teamId, exist);

        let result = this.objFacade.getData(teamId);
        return result;

      }), shareReplay({ bufferSize: 1, refCount: true }));
    }
  }

}
