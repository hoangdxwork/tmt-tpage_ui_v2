import { ChatomniDataDto, ExtrasChildsDto } from './../../dto/conversation-all/chatomni/chatomni-data.dto';
import { ResponseAddMessCommentDtoV2 } from './../../dto/conversation-all/chatomni/response-mess.dto';
import { EventEmitter, Injectable } from "@angular/core";
import { ReplaySubject } from "rxjs";
import { TCommonService, THelperCacheService } from "src/app/lib";
import { BaseSevice } from "../base.service";
import { get as _get } from 'lodash';
import { set as _set } from 'lodash';
import { PartnerService } from '../partner.service';
import { PartnerTimeStampDto } from '@app/dto/partner/partner-timestamp.dto';
import { CRMTeamDTO } from '@app/dto/team/team.dto';
import { TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { CRMTeamService } from '../crm-team.service';
import { CommonService } from '../common.service';
import { StatusDTO } from '@app/dto/partner/partner.dto';

@Injectable()

export class ChatomniCommentFacade extends BaseSevice  {

  prefix: string = "odata";
  table: string = "";
  baseRestApi: string = "rest/v2.0/chatomni";

  private readonly partner$ = new ReplaySubject<any>();
  private readonly _keyCachePartnerDict = "_partnerByTimestamps";

  dataSource: {[id: string] : ChatomniDataDto} = {};
  partnerDict: {[teamId: number] : PartnerTimeStampDto} = {};
  lstPartnerStatus: any = [];

  public onChangePartnerTimeStamp$: EventEmitter<any> = new EventEmitter();
  public onSyncPartnerTimeStamp$: EventEmitter<any> = new EventEmitter();

  constructor(private apiService: TCommonService,
    public cacheApi: THelperCacheService,
    private teamService: CRMTeamService,
    private commonService: CommonService,
    private partnerService: PartnerService) {
    super(apiService);

    this.onSyncPartnerTimeStamp$.subscribe({
      next: (data: any) => {
        this.mappingPartnerTimeStamp(data);
      }
    })
  }

  mappingPartnerTimeStamp(data: any) {
    let team = this.teamService.getCurrentTeam() as any;
    if(!team) return;

    let userId = data.Conversation.UserId;
    let _key = `${this._keyCachePartnerDict}[${team.Id}]`;

    this.cacheApi.getItem(_key).subscribe((obs) => {
      if(TDSHelperString.hasValueString(obs)) {

          let cache = JSON.parse(obs['value']) as TDSSafeAny;
          let cacheDB = cache['value'] as PartnerTimeStampDto;
          this.partnerDict[team.Id] = {...cacheDB} as any;

          let exits = data && data.Partner && this.partnerDict[team.Id].Data
              && this.partnerDict[team.Id].Data[userId] && Object.keys(this.partnerDict[team.Id].Data[userId]).length > 0;
          if(!exits) {
            this.partnerDict[team.Id].Data[userId] = {} as any;
          }

          this.partnerDict[team.Id].Data[userId] = {
            i: data.Partner.Id || data.Conversation?.PartnerId,
            c: data.Partner.Ref || this.partnerDict[team.Id].Data[userId].c,
            p: (data.Partner.Phone || data.Order?.TelePhone || data.Conversation?.HasPhone == true) ? true : false,
            a: (data.Partner.Street || data.Order?.Address || data.Conversation?.HasAddress == true) ? true : false,
            s: JSON.stringify((this.partnerDict[team.Id].Data[userId].Status)),
            st: data.Partner.StatusText,
            ss: TDSHelperString.hasValueString(data.Partner.StatusStyle) ? data.Partner.StatusStyle : '#5cb85c',
            t: []
          } as any;

          data.Tags?.map((x: any) => {
            let tag = {
              color_class: x.ColorClass,
              name: x.Name,
              tpid: x.Id
            } as any;

            this.partnerDict[team.Id].Data[userId]?.tags?.push(tag);
          });

          let ssColor =  this.partnerDict[team.Id].Data[userId] && TDSHelperString.hasValueString(this.partnerDict[team.Id].Data[userId]?.ss)
              && this.partnerDict[team.Id].Data[userId].ss != '#5cb85c';
          if(ssColor) {
            this.onChangePartnerTimeStamp$.emit([team.Id, userId, this.partnerDict[team.Id].Data[userId]]);
            return;
          };

          let status = {} as any;
          if(this.lstPartnerStatus && this.lstPartnerStatus.length > 0) {
            status = this.lstPartnerStatus.filter((x: any) => x.text == data.Partner.StatusText)[0];
            this.partnerDict[team.Id].Data[userId].ss = status.value;

            this.cacheApi.setItem(_key, this.partnerDict[team.Id]);
            this.onChangePartnerTimeStamp$.emit([team.Id, userId, this.partnerDict[team.Id].Data[userId]]);
          } else {
            this.commonService.setPartnerStatus();
            this.commonService.getPartnerStatus().subscribe({
              next: (res: StatusDTO[]) => {
                this.lstPartnerStatus = [...res] as any;
                status = this.lstPartnerStatus.filter((x: any) => x.text == data.Partner.StatusText)[0] as any;

                this.partnerDict[team.Id].Data[userId].ss = status.value;
                this.cacheApi.setItem(_key, this.partnerDict[team.Id]);
                this.onChangePartnerTimeStamp$.emit([team.Id, userId, this.partnerDict[team.Id].Data[userId]]);
              },
              error: (err: any) => {
                this.cacheApi.setItem(_key, this.partnerDict[team.Id]);
                this.onChangePartnerTimeStamp$.emit([team.Id, userId, this.partnerDict[team.Id].Data[userId]]);
              }
            });
          }
      }
    })
  }

  setData(id: string, value: ChatomniDataDto | null) {
    _set(this.dataSource, [id], value);
  }

  getData(id: string) {
    let data = _get(this.dataSource, id) || undefined;
    return data;
  }

  mappingExtrasChildsDtoV2(data: ResponseAddMessCommentDtoV2){
    let model  = {
      Id: data.Id,
      Type: data.MessageType,
      IsOwner: data.IsOwner,
      Data: { ...data.Data } as unknown,
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
          this.partner$.next(error);
      }
    });
  }

  partnerTimeStamp() {
    return this.partner$.asObservable();
  }

}
