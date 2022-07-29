export interface OnFacebookModel {
  action: string;
  companyId: number;
  data: RedisMessageConversationModel;
  enableAlert: boolean;
  enablePopup: boolean;
  error: boolean;
  message: string;
  type: string;
}

export interface RedisMessageConversationModel {
  page_id: string;
  psid: string;
  cid: string;
  link: string;
  asid: string;
  uid: string;
  name: string;
  name_unsigned: string;
  partner_name: string;
  phone: string;
  address: string;
  has_order: boolean;
  has_phone: boolean;
  has_address: boolean;
  count_unread_messages: number;
  count_unread_comments: number;
  count_unread_activities: number;
  from: Facebook_Inner_From;
  partner: Inner_Partner;
  tags: Inner_Tag[];
  last_activity: Inner_LastActivity;
  last_comment: Inner_LastActivity;
  last_message: Inner_LastActivity;
  assigned_to_id: string;
  assigned_to: MDB_Inner_CreatedBy;
}

export interface MDB_Inner_CreatedBy {
  Id: string;
  UserName: string;
  Name: string;
  Avatar: string;
}

export interface Inner_LastActivity {
  type: FacebookActivityType;
  fbid: string;
  message: string;
  message_formatted: string;
  message_obj: Facebook_Graph_Message;
  comment_obj: Facebook_Graph_Comment;
  created_time: Date | any;
}

export interface Facebook_Graph_Message {
  id: string;
  message: string;
  message_formatted: string;
  created_time: Date | any;
  from: Object;
  to: Object;
  attachments: any[];
}

export interface Facebook_Graph_Comment {
  id: string;
  parent: Object;
  is_hidden: boolean;
  can_hide: boolean;
  can_remove: boolean;
  can_live: boolean;
  can_reply_privately: boolean;
  comment_count: number;
  message: string;
  message_formatted: string;
  phone: string;
  user_likes: boolean;
  created_time: Date | any;
  object: Object;
  from: Object;
  comments: any;
  attachment: any;
  message_tags: any[];
}

export interface Inner_Tag {
  name: string;
  icon: string;
  color_class: string;
  color_code: string;
  created_time: Date | any;
}

export interface Inner_Partner {
  name: string;
  code: string;
  status: string;
  status_text: string;
  status_style: string;
}

export interface Facebook_Inner_From {
  id: string;
  name: string;
  picture: Object;
}

export  enum FacebookActivityType
{
    System = 0, // Hoạt động phát sinh từ phần mềm (do người dùng)
    Facebook = 1, // Hoạt động phát sinh từ webhook (không thuộc comment, message)
    Comment = 2, // Do người dùng
    Message = 3, // Do người dùng
    Reaction = 4,
}
