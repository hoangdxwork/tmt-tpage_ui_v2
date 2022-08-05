import { ChatomniMessageType } from "../conversation-all/chatomni/chatomni-message.dto";

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
  Data: any;
  CreatedTime: Date;
  ChannelCreatedTime: Date;
}

export interface SocketioOnMessageDto {
  Conversation: ConversationSocketioDto;
  Message: MessageSocketioDto;
  EventName: string;
}
