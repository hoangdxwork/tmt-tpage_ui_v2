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

// export interface Parent {
//   id: string;
// }

// export interface Object {
//   id: string;
// }

// export interface From {
//   id: string;
//   name: string;
//   uid?: any;
// }

// export interface DataSocketioDto {
//   id: string;
//   parent: Parent;
//   is_hidden: boolean;
//   can_hide: boolean;
//   can_remove: boolean;
//   can_like: boolean;
//   can_reply_privately: boolean;
//   comment_count: number;
//   message: string;
//   user_likes: boolean;
//   created_time: Date;
//   object: Object;
//   from: From;
//   comments?: any;
//   attachment?: any;
//   message_tags: any[];
// }

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
  LatestMessage?: ChatomniConversationMessageDto;
}

export interface SocketioOnMessageDto {
  Conversation: ConversationSocketioDto;
  Message: MessageSocketioDto;
  EventName: string;
}

export interface DataMessageTshop{  
  Id: string,
  Content: string,
  ConversationId: string,
  CookieId?: string,
  CreationTime: Date,
  ExtraProperties: SendFrom,
  ListUserId: string[],
  MessageLinkDto: TDSSafeAny[],
  Recipient: UserThop,
  Sender: UserThop,
  ShopId: string,
  SocketId?: string,
  Status: boolean,
  Type: number
}

export interface UserThop{
  Id: string, 
  Name: string, 
  Avatar: string, 
  UserName: string
}

export interface SendFrom{
  sendFrom: string
}

export interface Content {
  Text: string;
  Tags?: any;
}

export interface Actor {
  Id: string;
  Name: string;
  AvatarUrl: string;
}

export interface DataComentTShop {
  Id: number;
  Content: Content;
  ObjectKind: string;
  ObjectKindValue: number;
  ObjectId: number;
  ParentCommentId?: any;
  ShopId: string;
  UserId: string;
  Actor: Actor;
  CreatorId: string;
  CreationTime: Date;
  SocketId: string;
}
