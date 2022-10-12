import { ChatomniDataDto, ExtrasChildsDto } from './../../dto/conversation-all/chatomni/chatomni-data.dto';
import { ResponseAddMessCommentDto, ResponseAddMessCommentDtoV2 } from './../../dto/conversation-all/chatomni/response-mess.dto';
import { Injectable } from "@angular/core";
import { BehaviorSubject, ReplaySubject } from "rxjs";
import { TCommonService, THelperCacheService } from "src/app/lib";
import { BaseSevice } from "../base.service";
import { get as _get } from 'lodash';
import { set as _set } from 'lodash';
import { PartnerService } from '../partner.service';
import { PartnerTimeStampDto } from '@app/dto/partner/partner-timestamp.dto';
import { CRMTeamService } from '../crm-team.service';
import { CRMTeamDTO } from '@app/dto/team/team.dto';
import { TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSMessageService } from 'tds-ui/message';

@Injectable()

export class ChatomniCommentFacade extends BaseSevice  {

  prefix: string = "odata";
  table: string = "";
  baseRestApi: string = "rest/v2.0/chatomni";

  private readonly partner$ = new ReplaySubject<any>();
  private readonly _keyCachePartnerDict = "_partnerByTimestamps";

  dataSource: { [id: string] : ChatomniDataDto } = {};
  partnerDict: {[teamId: number] : PartnerTimeStampDto} = {};

  constructor(private apiService: TCommonService,
    public cacheApi: THelperCacheService,
    private message: TDSMessageService,
    private crmTeamService: CRMTeamService,
    private partnerService: PartnerService) {
    super(apiService);
  }

  setData(id: string, value: ChatomniDataDto | null) {
      _set(this.dataSource, [id], value);
  }

  getData(id: string) {
      let data = _get(this.dataSource, id) || undefined;
      return data;
  }

  mappingExtrasChildsDto(data: ResponseAddMessCommentDto){
    let model  = {
      Id: data.id,
      Type: data.type,
      IsOwner: data.is_admin,
      Data: {
        id: data.message?.id,
        message: data.message?.message,
        from: {
          name: data.name,
        },
      } as unknown,
      ChannelCreatedTime: data.DateCreated,
      Message: data.message_formatted,
      Status: data.status as number,
      CreatedBy: data.CreatedBy,
      CreatedTime: data.DateCreated,
      UserId: data.account_id
    } as unknown as ExtrasChildsDto;

    return  {...model};
  }

  mappingExtrasChildsDtoV2(data: ResponseAddMessCommentDtoV2){
    let model  = {
      Id: data.Id,
      Type: data.MessageType,
      IsOwner: data.IsOwner,
      Data: { ...data.Data
      } as unknown,
      ChannelCreatedTime: data.ChannelCreatedTime,
      Message: data.Message,
      Status: data.Status as number,
      CreatedBy: data.CreatedBy,
      UserId: data.UserId
    } as unknown as ExtrasChildsDto;

    return  {...model};
  }

  loadPartnerTimestampByCache(team: CRMTeamDTO){
    if(!team) return;

    let _key = `${this._keyCachePartnerDict}[${team.Id}]`;

    this.cacheApi.getItem(_key).subscribe((data) => {
      if(TDSHelperString.hasValueString(data)) {

          let cache = JSON.parse(data['value']) as TDSSafeAny;
          let cacheDB = cache['value'] as PartnerTimeStampDto;
          this.partnerDict[team.Id] = {...cacheDB};

          if(cacheDB && Number(cacheDB.Last) > 0) {
              this.loadPartnersByTimestamp(team.Id, cacheDB.Last);
          } else {
              this.partner$.next(cacheDB.Data);
          }
      } else {
          this.loadPartnersByTimestamp(team.Id);
      }
    });
  }

  loadPartnersByTimestamp(teamId: number, timestamp?: number) {
    let _key = `${this._keyCachePartnerDict}[${teamId}]`;

    this.partnerService.getPartnersByTimestamp(teamId, timestamp).subscribe({
      next: (obs: PartnerTimeStampDto) => {

          this.partnerDict[teamId] = {
              Next: obs.Next,
              Last: obs.Last,
              Data: Object.assign((this.partnerDict[teamId]?.Data || {}), (obs.Data || {}))
          };

          // TODO: trường hợp response có last thì dừng call api
          if(obs && Number(obs.Last)) {
              this.cacheApi.setItem(_key, this.partnerDict[teamId]);
              this.partner$.next(this.partnerDict[teamId]);
              return;
          }

          if(obs && obs.Next && Number(obs.Next) != timestamp) {
              this.loadPartnersByTimestamp(teamId, obs.Next);
              return;
          }

          this.cacheApi.setItem(_key, this.partnerDict[teamId]);
          this.partner$.next(this.partnerDict[teamId]);
      },
      error: (error: any) => {
          this.message.error(`${error?.error?.message}` || 'Đã xảy ra lỗi');
      }
    });
  }

  partnerTimeStamp() {
    return this.partner$.asObservable();
  }

}
