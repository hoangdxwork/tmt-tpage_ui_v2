
export interface From {
  id: string;
  name: string;
  uid?: any;
}

export interface CommentsOfOrderDTO {
  id: string;
  parent?: any;
  is_hidden: boolean;
  can_hide: boolean;
  can_remove: boolean;
  can_like: boolean;
  can_reply_privately: boolean;
  comment_count: number;
  message: string;
  user_likes: boolean;
  created_time: Date;
  object: Object;
  from: From;
  comments?: any;
  attachment?: any;
  message_tags?: any;
}
