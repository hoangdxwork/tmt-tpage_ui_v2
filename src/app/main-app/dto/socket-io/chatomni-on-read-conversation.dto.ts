
export interface CreatedByOnMarkseenDto {
  Avatar: string;
  Id: string;
  Name: string;
  UserName: string;
}

export interface ConversationOnReadDto {
  Id: string;
  UserId: string;
  ChannelId: string;
  ChannelType: string;
}

export interface OnReadConversationDto {
  CreateBy: CreatedByOnMarkseenDto
  Conversation: ConversationOnReadDto
}

export interface SocketioOnMarkseenDto {
  Data: OnReadConversationDto;
  Message: string;
  EventName: string;
  Type: string; //UpdateMarkseen
}
