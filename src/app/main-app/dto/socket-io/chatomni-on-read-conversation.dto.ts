
export interface CreatedByOnReadConversationDto {
  Avatar: string;
  Id: string;
  Name: string;
  UserName: string;
}

export interface OnReadConversationDto {
  CreatedBy: CreatedByOnReadConversationDto
  PageId: string,
  UserId: string;
}

export interface SocketioOnReadConversationDto {
  Data: OnReadConversationDto;
  Message: string;
  EventName: string;
  Type: string; //"UpdateMarkseen"-> giá trị const
}
