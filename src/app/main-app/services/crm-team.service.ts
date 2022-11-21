import { EventEmitter, Injectable, Output } from '@angular/core';
import { TShopDto, TUserDto } from '@core/dto/tshop.dto';
import { Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { CoreAPIDTO, CoreApiMethodType, TCommonService, THelperCacheService } from 'src/app/lib';
import { TDSHelperObject, TDSSafeAny } from 'tds-ui/shared/utility';
import { AutoHideCommentDTO, AutoReplyConfigDTO, ChannelAutoLabelConfigDTO, ChannelFacebookConfigDTO } from '../dto/configs/page-config.dto';
import { ODataAllFacebookChildTO } from '../dto/team/all-facebook-child.dto';
import { CRMTeamDTO, InputCreateChatbotDTO, TPosAppMongoDBFacebookDTO, UpdateGrantPermissionDTO } from '../dto/team/team.dto';
import { BaseSevice } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class CRMTeamService extends BaseSevice {

  prefix: string = "odata";
  table: string = "CRMTeam";
  baseRestApi: string = "rest/v1.0/crmteam";
  private readonly __keyCacheTeamId = 'nearestTeamId';

  private readonly listFaceBook$ = new ReplaySubject<Array<CRMTeamDTO> | null>(1);
  private readonly currentTeam$ = new ReplaySubject<CRMTeamDTO | null>(1);
  private _currentTeam!: CRMTeamDTO | null;

  @Output() changeTeamFromLayout$ = new EventEmitter<any>();

  constructor(private apiService: TCommonService, public caheApi: THelperCacheService) {
    super(apiService);
  }

  getAllFacebooks(): Observable<Array<CRMTeamDTO>> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/rest/v2.0/chatomni/channels`,
      method: CoreApiMethodType.get
    }
    return this.apiService.getData<Array<CRMTeamDTO>>(api, null);
  }

  getAllChannels(): Observable<Array<CRMTeamDTO>> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/rest/v2.0/chatomni/channels`,
      method: CoreApiMethodType.get
    }
    return this.apiService.getData<Array<CRMTeamDTO>>(api, null);
  }

  getTShopUser(accessToken: string): Observable<TUserDto> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/rest/v2.0/chatomni/user?accessToken=${accessToken}`,
      method: CoreApiMethodType.get
    }
    return this.apiService.getData<TUserDto>(api, null);
  }

  getTShop(accessToken: string): Observable<Array<TShopDto>> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/rest/v2.0/chatomni/shop?accessToken=${accessToken}`,
      method: CoreApiMethodType.get
    }
    return this.apiService.getData<Array<TShopDto>>(api, null);
  }

  insert(data: TDSSafeAny): Observable<Array<CRMTeamDTO>> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}`,
      method: CoreApiMethodType.post
    }
    return this.apiService.getData<Array<CRMTeamDTO>>(api, data);
  }

  onChangeListFaceBook() {
    return this.listFaceBook$.asObservable();
  }

  onUpdateListFaceBook(data: Array<CRMTeamDTO> | null) {
    this.listFaceBook$.next(data);
  }

  onRefreshListFacebook() {
    this.getAllFacebooks().subscribe(dataTeam => {
      if (TDSHelperObject.hasValue(dataTeam)) {
        this.onUpdateListFaceBook(dataTeam);
      }
      else {
        this.onUpdateListFaceBook(null);
        this.onUpdateTeam(null);
      }
    }, error => {
      this.onUpdateListFaceBook(null);
      this.onUpdateTeam(null);
    });
  }

  getCurrentTeam(): CRMTeamDTO | null {
    return this._currentTeam;
  }

  getActiveByPageIds$(pageIds: string[]): Observable<any> {
    return this.onChangeListFaceBook().pipe(map((res: any) => {
      let data: any[] = [];

      if(res && res.length > 0) {
          res.map((t: any) => {
            t.Childs.map((c: any) => {
                if (pageIds.indexOf(c.ChannelId) >= 0) {
                    data.push(c);
                }
            })
        });
      }

      return data;
    }))
  }

  getTeamById(id: string): Observable<any> {
    return this.onChangeListFaceBook().pipe(map((res: any) => {
      let data: any[] = [];

      if(res && res.length > 0) {
          res.map((t: any) => {

            t.Childs.map((c: any) => {
              if (c.Id === id) {
                  data.push(c);
                  return;
              }
            })
        });
      }

      return data[0];
    }))
  }

  // xử lý teasm
  getCacheTeamId(): Observable<string | null> {
    return this.caheApi.getItem(this.__keyCacheTeamId).pipe(
      map((ops: TDSSafeAny) => {
        let value: string | null = null;
        if (TDSHelperObject.hasValue(ops)) {
          value = JSON.parse(ops.value).value;
        }
        return value;
      })
    )
  }

  getLongLiveToken(data: TDSSafeAny): Observable<TDSSafeAny> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/rest/v1.0/facebook/getlonglivetoken`,
      method: CoreApiMethodType.post
    }
    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  setCacheTeamId(data: TDSSafeAny) {
    this.caheApi.setItem(this.__keyCacheTeamId, data);
  }

  //TODO: cập nhật team cho các componet đăng ký sự kiện onChangeTeam, lưu cache.
  onUpdateTeam(data: CRMTeamDTO | null) {
    this.setCacheTeamId(data ? data.Id : null);
    this._currentTeam = data;
    this.currentTeam$.next(data);
  }

  onChangeTeam() {
    return this.currentTeam$.asObservable();
  }

  updateActive(id: number): Observable<TDSSafeAny> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/${id}/active`,
      method: CoreApiMethodType.post
    }
    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  refreshPageToken(id: number, data: any): Observable<TDSSafeAny> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/${id}/refreshpagetoken?`,
      method: CoreApiMethodType.post
    }
    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  delete(key: any): Observable<TDSSafeAny> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}(${key})`,
      method: CoreApiMethodType.delete
    }
    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  getAllFacebookChildsv2(): Observable<ODataAllFacebookChildTO> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.GetAllFacebook?$expand=Childs`,
      method: CoreApiMethodType.get
    }
    return this.apiService.getData<ODataAllFacebookChildTO>(api, null);
  }

  getAllFacebookChildsV2(): Observable<any> {
    return this.getAllChannels().pipe(map((teams: any[]) => {
        let items: any[] = [];
        if(teams && teams.length > 0) {
            teams.forEach(x => {
                if(x.Childs && x.Childs.length > 0) {
                    x.Childs.forEach((a: any) => {
                        delete a.Childs;
                        items.push(a);
                    });
                }
            })
        }
        return [...items];
    }))
  }

  getChannelAutoReplyConfig(pageId: string): Observable<AutoReplyConfigDTO> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/${pageId}/channelautoreplyconfig`,
      method: CoreApiMethodType.get
    }

    return this.apiService.getData<AutoReplyConfigDTO>(api, null);
  }

  insertOrUpdateChannelAutoReplyConfig(pageId: string, data: AutoReplyConfigDTO): Observable<TDSSafeAny> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/${pageId}/channelautoreplyconfig`,
      method: CoreApiMethodType.put
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  getChannelAutoHiddenConfig(pageId: string): Observable<AutoHideCommentDTO> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/${pageId}/channelautohiddenconfig`,
      method: CoreApiMethodType.get
    }

    return this.apiService.getData<AutoHideCommentDTO>(api, null);
  }

  insertOrUpdateChannelAutoHiddenConfig(pageId: string, data: AutoHideCommentDTO): Observable<TDSSafeAny> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/${pageId}/channelautohiddenconfig`,
      method: CoreApiMethodType.put
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  getChannelConfig(pageId: string): Observable<ChannelFacebookConfigDTO> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/getchannelconfig?pageId=${pageId}`,
      method: CoreApiMethodType.get
    }

    return this.apiService.getData<ChannelFacebookConfigDTO>(api, null);
  }

  getChannelAutoLabelConfig(pageId: string): Observable<ChannelAutoLabelConfigDTO> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/${pageId}/channelautolabelconfig`,
      method: CoreApiMethodType.get
    }

    return this.apiService.getData<ChannelAutoLabelConfigDTO>(api, null);
  }

  insertOrUpdateChannelAutoLabelConfig(pageId: string, data: TDSSafeAny): Observable<ChannelAutoLabelConfigDTO> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/${pageId}/channelautolabelconfig`,
      method: CoreApiMethodType.put
    }

    return this.apiService.getData<ChannelAutoLabelConfigDTO>(api, data);
  }

  updateGrantPermission(data: UpdateGrantPermissionDTO[]): Observable<TDSSafeAny> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/updategrantpermission`,
      method: CoreApiMethodType.put
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  getChannelChatbot(ids: string[]): Observable<TPosAppMongoDBFacebookDTO[]> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/getchannelchatbot`,
      method: CoreApiMethodType.post
    }

    return this.apiService.getData<TPosAppMongoDBFacebookDTO[]>(api, ids);
  }

  onChatbot(pageId: string): Observable<undefined> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/onchatbot?pageId=${pageId}`,
      method: CoreApiMethodType.get
    }

    return this.apiService.getData<undefined>(api, null);
  }

  offChatbot(pageId: string): Observable<undefined> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/offchatbot?pageId=${pageId}`,
      method: CoreApiMethodType.get
    }

    return this.apiService.getData<undefined>(api, null);
  }

  connectChatbot(data: InputCreateChatbotDTO): Observable<undefined> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/connectchatbot`,
      method: CoreApiMethodType.post
    }

    return this.apiService.getData<undefined>(api, data);
  }

  getByFacebookPageId(pageId: string): Observable<any> {
    let api: CoreAPIDTO = {
      url: `${this._BASE_URL}/odata/CRMTeam/ODataService.GetByFacebookPageId?PageId=${pageId}`,
      method: CoreApiMethodType.post
    }

    return this.apiService.getData<any>(api, null);
  }

}
