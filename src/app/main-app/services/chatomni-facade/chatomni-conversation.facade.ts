import { Injectable, OnDestroy } from "@angular/core";
import { TCommonService } from "src/app/lib";
import { BaseSevice } from "../base.service";
import { get as _get, maxBy as _maxBy } from 'lodash';
import { set as _set } from 'lodash';
import { ChatomniConversationDto, ChatomniConversationItemDto, ChatomniConversationMessageDto } from "../../dto/conversation-all/chatomni/chatomni-conversation";
import { CRMTeamService } from "../crm-team.service";
import { Subject, takeUntil } from "rxjs";
import { SocketioOnMessageDto } from "@app/dto/socket-io/chatomni-on-message.dto";
import { CRMTeamDTO } from "@app/dto/team/team.dto";
import { ChatomniDataItemDto, ChatomniFacebookDataDto } from "@app/dto/conversation-all/chatomni/chatomni-data.dto";

@Injectable()

export class ChatomniConversationFacade extends BaseSevice  {

  prefix: string = "odata";
  table: string = "";
  baseRestApi: string = "rest/v2.0/chatomni";

  dataSource: { [id: string] : ChatomniConversationDto } = {}; //this.chatomniDataSource[id]

  constructor(private apiService: TCommonService) {
    super(apiService)
  }

  setData(teamId: number, value: ChatomniConversationDto | null) {
      _set(this.dataSource, [teamId], value);
  }

  getData(teamId: number) {
      let data = _get(this.dataSource, teamId) || undefined;
      return data;
  }

  preapreMessageOnEventSocket(socket: SocketioOnMessageDto, conversationItem: ChatomniConversationItemDto) {
    let item: ChatomniDataItemDto = {
        Data: {...socket.Message?.Data} as ChatomniFacebookDataDto, // gán tạm thời
        Id: null,
        ObjectId: socket.Message?.ObjectId,
        ParentId: socket.Message?.ParentId,
        Message: socket.Message?.Message,
        Source: null,
        Type: socket.Message?.MessageType,
        UserId: socket.Message?.UserId,
        Status: 1,
        IsSystem: false, // System = 0, Hoạt động phát sinh từ phần mềm (do người dùng)
        CreatedById: null,
        CreatedBy: null,
        CreatedTime: socket.Message?.CreatedTime,
        ChannelCreatedTime: socket.Message?.ChannelCreatedTime,
        ChannelUpdatedTime: null,
        IsOwner: false
    } as any;

    return {...item};
  }
}
