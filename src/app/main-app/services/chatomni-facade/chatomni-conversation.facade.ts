import { TDSSafeAny } from 'tds-ui/shared/utility';
import { SocketEventSubjectDto } from '@app/services/socket-io/socket-onevent.service';
import { EventEmitter, Injectable } from "@angular/core";
import { TCommonService } from "src/app/lib";
import { BaseSevice } from "../base.service";
import { get as _get, maxBy as _maxBy } from 'lodash';
import { set as _set } from 'lodash';
import { ChatomniConversationDto, ChatomniConversationItemDto } from "../../dto/conversation-all/chatomni/chatomni-conversation";
import { SocketioOnMessageDto } from "@app/dto/socket-io/chatomni-on-message.dto";
import { ChatomniDataItemDto, ChatomniFacebookDataDto, ChatomniMessageType, ChatomniStatus } from "@app/dto/conversation-all/chatomni/chatomni-data.dto";

export interface OnSyncDto {
  Type: TypeOnSync;
  UserId: string;
}

export enum TypeOnSync {
  _All = "All",
  _Order = "Order",
  _Partner= "Partner",
}

@Injectable()

export class ChatomniConversationFacade extends BaseSevice  {

  prefix: string = "odata";
  table: string = "";
  baseRestApi: string = "rest/v2.0/chatomni";

  dataSource: { [id: string] : ChatomniConversationDto } = {}; //this.chatomniDataSource[id]

  // TODO: sự kiên đồng bộ dữ liệu
  public onSyncConversationInfo$ = new EventEmitter<any | null>();

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
        Id: socket.Message?.Id,
        ObjectId: socket.Message?.ObjectId,
        ParentId: socket.Message?.ParentId,
        Message: socket.Message?.Message,
        Source: null,
        Type: socket.Message?.MessageType,
        UserId: socket.Message?.UserId,
        Status: ChatomniStatus.Done, 
        IsSystem: false, // System = 0, Hoạt động phát sinh từ phần mềm (do người dùng)
        CreatedById: null,
        CreatedBy: socket.Message?.CreatedBy,
        CreatedTime: socket.Message?.CreatedTime,
        ChannelCreatedTime: socket.Message?.ChannelCreatedTime,
        ChannelUpdatedTime: null,
        IsOwner: socket.Message?.IsOwner,
    } as any;

    return {...item};
  }

  prepareNewMessageOnEventSocket(socket: SocketEventSubjectDto){
    let item: ChatomniConversationItemDto = {
      ConversationId: socket.Data.Conversation?.UserId,
      CountUnread: 1,
      HasAddress: socket.Data?.Conversation?.HasAddress,
      HasPhone: socket.Data?.Conversation?.HasPhone,
      Id: socket.Data.Conversation?.Id,

      LatestMessage: {
        CreatedTime: socket.Data.Message?.CreatedTime,
        Message: socket.Data.Message?.Message,
        MessageType: socket.Data.Message?.MessageType,
      } as TDSSafeAny,

      Name: socket.Data.Conversation?.Name || this.checkUser(socket.Data.Message?.MessageType),
      UpdatedTime: socket.Data.Message?.CreatedTime,
      UserId: socket.Data.Conversation?.UserId
    } as TDSSafeAny

    return {...item}
  }

  checkUser(MessageType: number){
    if(MessageType == ChatomniMessageType.FacebookComment || MessageType == ChatomniMessageType.FacebookMessage){
      return 'Người dùng Facebook'
    }

    if(MessageType == ChatomniMessageType.TShopComment || MessageType == ChatomniMessageType.TShopMessage){
      return 'Người dùng TShop'
    }

    return 'Người dùng'
  }
}
