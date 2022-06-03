import { ActivityStatus } from "src/app/lib/enum/message/coversation-message";

export interface From {
  id: string;
  name: string;
  uid?: any;
}

export interface CommentByPost {
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
  object: any;
  from: From;
  comments?: any;
  attachment?: any;
  message_tags?: any;
  is_reply: false;
  isPrivateReply: boolean;
  status: ActivityStatus
}

export interface Parent {
  id: string;
}

export interface DictCommentPost {
  id: string;
  parent: Parent;
  is_hidden: boolean;
  can_hide: boolean;
  can_remove: boolean;
  can_like: boolean;
  can_reply_privately: boolean;
  comment_count: number;
  message: string;
  user_likes: boolean;
  created_time: Date;
  object: any;
  from: From;
  comments?: any;
  attachment?: any;
  message_tags?: any;
}

export interface CommentByPostChilds {
  [key: string]: DictCommentPost
}

export interface CommentByPostExtras {
  childs: CommentByPostChilds;
}

export interface RequestCommentByPost {
  Items: CommentByPost[];
  Extras: CommentByPostExtras;
  PageIndex: number;
  PageSize: number;
  TotalCount: number;
  TotalPages: number;
  NextPage?: any;
  PreviousPage?: any;
  HasPreviousPage: boolean;
  HasNextPage: boolean;
}
