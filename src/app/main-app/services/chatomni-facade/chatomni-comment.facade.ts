import { ChatomniDataDto, ExtrasChildsDto } from './../../dto/conversation-all/chatomni/chatomni-data.dto';
import { ResponseAddMessCommentDto } from './../../dto/conversation-all/chatomni/response-mess.dto';
import { Injectable, OnDestroy } from "@angular/core";
import { map, Observable, Subject, takeUntil } from "rxjs";
import { TCommonService } from "src/app/lib";
import { BaseSevice } from "../base.service";
import { CRMTeamService } from "../crm-team.service";
import { get as _get } from 'lodash';
import { set as _set } from 'lodash';
import { PartnerService } from '../partner.service';
import { CRMTeamDTO } from '@app/dto/team/team.dto';
import { PartnerTimeStampDto, PartnerTimeStampItemDto } from '@app/dto/partner/partner-timestamp.dto';

@Injectable()

export class ChatomniCommentFacade extends BaseSevice  {

  prefix: string = "odata";
  table: string = "";
  baseRestApi: string = "rest/v2.0/chatomni";

  dataSource: { [id: string] : ChatomniDataDto } = {}; //this.postDataSource[id]
  partner: { [teamId: number] : PartnerTimeStampItemDto } = {};

  constructor(private apiService: TCommonService,
    private crmTeamService: CRMTeamService,
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
      UserId: data.to_id
    } as unknown as ExtrasChildsDto;

    return  {...model};
  }

  getParentTimeStamp(teamId: number): Observable<any> {
    let exist = this.partner![teamId] as any;

    if(exist && exist.length > 0) {

        return new Observable((observer :any) => {
            observer.next(exist);
            observer.complete();
        })

    } else {
      return new Observable((observer: any) => {
          this.loadPartnersByTimestamp(observer, teamId);
      })
    }
  }

  loadPartnersByTimestamp(observer: any, teamId: number, timestamp?: number) {

    this.partnerService.getPartnersByTimestamp(teamId, timestamp).subscribe((res: PartnerTimeStampDto): any => {
      if(res) {
        this.partner[teamId] = {...(this.partner[teamId] || {}), ...(res.Data || {})}

        if(res.Last!= timestamp) {
            this.loadPartnersByTimestamp(observer, teamId, res.Last);
        } else {
            observer.next(this.partner[teamId]);
            observer.complete();
        }

      }
    })
  }

}
