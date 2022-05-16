export interface From {
  id: string;
  name: string;
  uid?: any;
}

export interface Parent {
  id: string;
}

export interface Object {
  id: string;
}

export interface From2 {
  id: string;
  name: string;
  uid?: any;
}

export interface ActivityByGroup {
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
  object: Object;
  from: From2;
  comments?: any;
  attachment?: any;
  message_tags?: any;
}

export interface CommentByGroupItem {
  id: string;
  from: From;
  activities: ActivityByGroup[];
}

export interface RequestCommentByGroup {
  Items: CommentByGroupItem[];
  Extras?: any;
  PageIndex: number;
  PageSize: number;
  TotalCount: number;
  TotalPages: number;
  NextPage?: any;
  PreviousPage?: any;
  HasPreviousPage: boolean;
  HasNextPage: boolean;
}
