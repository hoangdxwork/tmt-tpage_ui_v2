import { TDSSafeAny } from 'tds-ui/shared/utility';
import { ChatomniConversationMessageDto } from '../conversation-all/chatomni/chatomni-conversation';
import { ChatomniMessageType } from './../conversation-all/chatomni/chatomni-data.dto';

export interface ConversationSocketioDto {
  Id: string;
  ChannelType: number;
  ChannelId: string;
  UserId: string;
  Name?: any;
  HasPhone: boolean;
  HasAddress: boolean;
  UpdatedTime: Date;
}

export interface MessageSocketioDto {
  Id: string;
  ChannelType: number;
  ChannelId: string;
  UserId: string;
  Message: string;
  MessageType: ChatomniMessageType;
  ContentType?: any;
  ObjectId: string;
  ParentId?: any;
  Data: any; // DataMessageTshop hoặc DataFacebook
  CreatedTime: Date;
  ChannelCreatedTime: Date;
  LatestMessage?: ChatomniConversationMessageDto | any;
  IsOwner: boolean;
  CreatedBy?: any
}

export interface SocketioOnMessageDto {
  Conversation: ConversationSocketioDto;
  Message: MessageSocketioDto;
  EventName: string;
  Data: any;
}
