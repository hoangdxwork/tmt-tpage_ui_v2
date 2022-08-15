export interface SaleOnline_Facebook_CommentDto {
  id: string;
  post_id: string;
  message: string;
  like_count: number;
  comment_count: number;
  created_time: Date;
}

export interface OdataSaleOnline_Facebook_CommentDto {
  '@odata.context': string;
  value: SaleOnline_Facebook_CommentDto[];
}
