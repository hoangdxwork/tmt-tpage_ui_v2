import { ExtrasChildsDto } from './../../dto/conversation-all/chatomni/chatomni-data.dto';
import { ResponseAddMessCommentDto } from './../../dto/conversation-all/chatomni/response-mess.dto';
import { Injectable, OnDestroy } from "@angular/core";
import { Subject, takeUntil } from "rxjs";
import { TCommonService } from "src/app/lib";
import { BaseSevice } from "../base.service";
import { CRMTeamService } from "../crm-team.service";
import { get as _get } from 'lodash';
import { set as _set } from 'lodash';

@Injectable()

export class ChatomniCommentFacade extends BaseSevice  {

  prefix: string = "odata";
  table: string = "";
  baseRestApi: string = "rest/v2.0/chatomni";

  dataSource: { [id: string] : any } = {}; //this.postDataSource[id]

  constructor(private apiService: TCommonService) {
    super(apiService)
  }

  setData(id: string, value: any | null) {
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

}
