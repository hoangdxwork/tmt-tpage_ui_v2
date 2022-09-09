

export interface ConversationOnUpdateDto {
  ChannelId: string;
  ChannelType: number;
  IsOwner: boolean;
  MessageError: string;
  MessageId: string;
  Result: "",
  Status: number,
  UserId: string;
}

export interface SocketioOnUpdateDto {
  Data: ConversationOnUpdateDto;
  Message: string;
  EventName: string;
  Type: string;
}
