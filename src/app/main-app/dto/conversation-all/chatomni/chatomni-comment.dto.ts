//TODO: Comment chatomni
export interface ChatomniCommentModelDto {
    Message?: string,
    CommentType: number, // 0: Phản hồi bình luận - 1: Ẩn bình luận - 2: Hiện bình luận- 3: Like bình luận
    Recipients: string[], // Danh sách id của bình luận	
}

export interface ChatomniReplyCommentModelDto {
    Message?: string,
    ObjectId: number,
    Recipients: string, // Danh sách id của bình luận	
}
