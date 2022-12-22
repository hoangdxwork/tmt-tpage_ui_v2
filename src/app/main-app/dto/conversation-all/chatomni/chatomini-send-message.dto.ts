//TODO: Gửi tin nhắn 1 người
export interface ChatomniSendMessageModelDto {
    Message: string,
    MessageType: number, // 0: Gửi tin nhắn thông thường, 1: Tin nhắn retry, 2: Tin nhắn private reply: Tin nhắn trả lời bình luận
    Attachment: Attachment,
    RecipientId: string, // Id trả lời tin nhắn: CommentId, MessageId, PostId
}

export interface Attachment{
    Type: number, // 0: Hình ảnh
    Data: Data,
}

export interface Data{
    Urls: string[],
    Url: string,
}

//TODO: Gửi tin nhắn nhiều người
export interface ChatomniSendMessageManyPeopleModelDto {
    Message: string,
    MessageType: number, // 0: Gửi tin nhắn thông thường, 1: Tin nhắn retry, 2: Tin nhắn private reply: Tin nhắn trả lời bình luận
    Attachment: Attachment,
    Recipients: UserMany[], // Id trả lời tin nhắn: CommentId, MessageId, PostId
}
export interface UserMany{
    UserId: string,
    RecipientId?: string
}

export enum EnumSendMessageType {
  _NORMAl = 0,
  _RETRY = 1,
  _REPLY = 2
}
