import { ActivityStatus } from "src/app/lib/enum/message/coversation-message";

export interface Object {
  id: string;
}

export interface From {
  id: string;
  name: string;
  uid?: any;
}

export interface Comment {
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

export interface Datum {
  id: string;
  name: string;
}

export interface To {
  data: Datum[];
}

export interface Message {
  id: string;
  message: string;
  created_time: Date;
  from: From;
  to: To;
  attachments?: any;
}

export interface Data {
  height: number;
  is_silhouette: boolean;
  url: string;
  width: number;
}

export interface Picture {
  data: Data;
}

export interface Image {
  height: number;
  src: string;
  width: number;
}

export interface Media {
  image: Image;
  source: string;
}

export interface Target {
  id: string;
  url: string;
}

export interface Attachments {
  data: Datum[];
  paging?: any;
}

export interface Summary {
  order?: any;
  total_count: number;
  can_comment: boolean;
  scanned_time?: any;
}

export interface Comments {
  summary: Summary;
}

export interface LiveCampaign {
  name: string;
  note?: any;
  id: string;
}

export interface From {
  id: string;
  name: string;
  picture: Picture;
}

export interface ExtrasPostItem {
  DateCreated: Date;
  LastUpdated: Date;
  account_id: string;
  fbid: string;
  parent_id?: any;
  caption?: any;
  description?: any;
  message: string;
  story: string;
  object_id?: any;
  type?: any;
  is_hidden: boolean;
  is_published: boolean;
  is_expired: boolean;
  promotable_id?: any;
  promotion_status?: any;
  status_type?: any;
  created_time: Date;
  updated_time: Date;
  picture: string;
  full_picture: string;
  permalink_url?: any;
  from: From;
  attachments: Attachments;
  from_id?: any;
  count_comments: number;
  count_reactions: number;
  count_shares: number;
  comments: Comments;
  reactions?: any;
  shares?: any;
  live_campaign_id: string;
  live_campaign: LiveCampaign;
}

export interface MakeActivityItem {
  id: string;
  from_id: string;
  object_id: string;
  is_admin: boolean;
  message_formatted: string;
  comment: Comment;
  message: Message;
  type: number;
  nlps: any[];
  error_message: string;
  DateCreated: Date;
  LastUpdated: Date;
  IsCompleted: boolean;
  DateProcessed?: Date;
  CreatedBy?: any;
}

export interface MakeActivityItemWebHook {
  id: string;
  from_id: string;
  object_id: string;
  is_admin: boolean;
  message_formatted: string;
  comment: Comment;
  message: Message;
  type: number;
  nlps: any[];
  error_message: string;
  DateCreated: Date;
  LastUpdated: Date;
  IsCompleted: boolean;
  DateProcessed?: Date;
  CreatedBy?: any;
  is_show_avatar: boolean;
  page_id: string | null;
  last_activity: Object;
  last_message: Object;
  attachment: any;
  fbid: string;
  tpid: string;
  status: ActivityStatus;
  Image: any;
  IsHandledBySystem: any;
  isSelected: boolean;
  message_obj: any;
  HasRepliedWithComment: boolean;
  HasRepliedWithMessage: boolean;
  CountOrder: number;
  to_id: any;
  account_id: any;
  ActivityCampaignId: string;
  host: string;
  psid: string;
  LastActivityTimeConverted: any;
  checkSendMessage: boolean;
  tags: any[];
  count_unread_activities: number;
  has_order: boolean;
  has_phone: number;
  has_address: number;
  is_show_break: boolean;
}

export interface MakeActivityQueryObj {
  limit: number;
  page: number;
  page_id: string;
  type: string;
}

export interface MakeActivityResponse {
  hasNextPage: boolean;
  nextPageUrl: string;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface MakeActivityExtras {
  children: { [key: number]: any };
  posts: { [key: number]: ExtrasPostItem };
}

export interface MakeActivityMessagesDTO {
  extras: MakeActivityExtras;
  items: Array<MakeActivityItemWebHook>;
  query: MakeActivityQueryObj;
  response: MakeActivityResponse;
}

export interface CRMMessagesRequest {
  Items: MakeActivityItemWebHook[];
  Extras: MakeActivityExtras;
  PageIndex: number;
  PageSize: number;
  TotalCount: number;
  TotalPages: number;
  NextPage: string;
  PreviousPage?: any;
  HasPreviousPage: boolean;
  HasNextPage: boolean;
}
