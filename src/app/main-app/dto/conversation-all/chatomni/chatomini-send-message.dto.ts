export interface ChatomniSendMessageModelDto {
    Message: string,
    MessageType: number, // 0: Gửi tin nhắn thông thường, 1: Tin nhắn retry, 2: Tin nhắn private reply: Tin nhắn trả lời bình luận
    Attactment: Attactment,
    RecipientId: string, // Id trả lời tin nhắn: CommentId, MessageId, PostId
}

export interface Attactment{
    Type: number, // 0: Hình ảnh
    Data: Data[],
}

export interface Data{
    Url: string,
}