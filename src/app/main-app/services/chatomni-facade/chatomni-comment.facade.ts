import { Data } from './../../dto/saleonlineorder/create-fastsaleorder.dto';
import { ChatomniDataDto, ExtrasChildsDto } from './../../dto/conversation-all/chatomni/chatomni-data.dto';
import { ResponseAddMessCommentDto, ResponseAddMessCommentDtoV2 } from './../../dto/conversation-all/chatomni/response-mess.dto';
import { Injectable, OnDestroy } from "@angular/core";
import { map, Observable, shareReplay, Subject, takeUntil } from "rxjs";
import { TCommonService } from "src/app/lib";
import { BaseSevice } from "../base.service";
import { CRMTeamService } from "../crm-team.service";
import { get as _get } from 'lodash';
import { set as _set } from 'lodash';
import { PartnerService } from '../partner.service';
import { PartnerTimeStampDto, PartnerTimeStampItemDto } from '@app/dto/partner/partner-timestamp.dto';

@Injectable()

export class ChatomniCommentFacade extends BaseSevice  {

  prefix: string = "odata";
  table: string = "";
  baseRestApi: string = "rest/v2.0/chatomni";

  private readonly partner$ = new Subject<any>();

  dataSource: { [id: string] : ChatomniDataDto } = {}; //this.postDataSource[id]
  partner: { [teamId: number] : PartnerTimeStampItemDto } = {};

  constructor(private apiService: TCommonService,
    private partnerService: PartnerService) {
    super(apiService)
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

  getParentTimeStamp(teamId: number) {
    let exist = this.partner![teamId] as any;

    if(exist && exist.length > 0) {
        this.partner$.next(exist);
    } else {
        this.loadPartnersByTimestamp(teamId);
    }
  }

  loadPartnersByTimestamp(teamId: number, timestamp?: number) {

    this.partnerService.getPartnersByTimestamp(teamId, timestamp).subscribe((res: PartnerTimeStampDto): any => {
      if(res) {
        this.partner[teamId] = {...(this.partner[teamId] || {}), ...(res.Data || {})};

        if( res.Last && res.Last!= timestamp) {
            this.loadPartnersByTimestamp(teamId, res.Last);
        } else {
            this.partner$.next(this.partner[teamId])
        }
      }
    }, shareReplay());
  }

  partnerDict() {
    return this.partner$.asObservable();
  }

}
