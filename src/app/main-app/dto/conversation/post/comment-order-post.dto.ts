export interface CommentOrder {
  id: string;
  session: number;
  index: number;
  code: string;
}

export interface CommentOrderPost {
  id: string;
  asuid: string;
  uid?: any;
  orders: CommentOrder[];
}

export interface OdataCommentOrderPostDTO {
  "@odata.context": string;
  value: CommentOrderPost[];
}
