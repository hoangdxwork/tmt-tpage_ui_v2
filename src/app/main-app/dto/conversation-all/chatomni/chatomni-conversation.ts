import { StateChatbot } from "../conversation-all.dto";
import { ChatomniMessageType } from "./chatomni-data.dto";

export interface  ChatomniConversationTagDto {
  Id: string;
  Name: string;
  Icon?: any;
  ColorClass: string;
  ColorCode?: any;
  CreatedTime: Date;
}

export enum ChatomniMessageContentType {
  Normal = 0,
  Image = 1,
  Video = 2,
  Audio = 3,
  File = 4,
  Order = 5, // Đơn hàng
  Postback = 6, // Tương tác
  Other = 10
}

export interface  ChatomniConversationMessageDto {
  Id: string | null;
  Message: string;
  MessageType: ChatomniMessageType;
  CreatedTime: Date | any;
}

export interface ChatomniConversationItemDto {
  Id: string;
  UserId: string;
  ConversationId: string;
  Avatar?: any;
  Name: string;
  NameUnsigned: string;
  PartnerId: number;
  CountUnread: number;
  HasPhone: boolean;
  Phone?: any;
  Email?: any;
  HasAddress: boolean;
  AssignedToId?: any;
  AssignedTo?: any;
  Tags: ChatomniConversationTagDto[];
  UpdatedTime: Date;
  LatestMessage?: ChatomniConversationMessageDto;

  State?: StateChatbot;
  HasOrder?: boolean | null;
  Message?: string; // Không có trong dữ liệu trả về, dùng để hiện thị
}

export interface PagingTimestamp {
  Next: number;
  HasNext: boolean;
  UrlNext: string;
}

export interface ChatomniConversationDto {
  Extras?: any;
  Items: ChatomniConversationItemDto[];
  Paging: PagingTimestamp;
}

export interface ChatomniTagsEventEmitterDto{
  ConversationId: string,
  Tags: ChatomniConversationTagDto[]
}

export interface ChatomniLastMessageEventEmitterDto{
  ConversationId: string,
  LatestMessage?: ChatomniConversationMessageDto;
}
