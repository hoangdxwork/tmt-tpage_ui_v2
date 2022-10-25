
export interface CreatedByOnReadConversationDto {
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
  CreatedBy: CreatedByOnReadConversationDto
  Conversation: ConversationOnReadDto
}

export interface SocketioOnReadConversationDto {
  Data: OnReadConversationDto;
  Message: string;
  EventName: string;
  Type: string; //UpdateMarkseen
}
