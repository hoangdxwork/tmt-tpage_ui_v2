export interface From {
  id?: any;
  name: string;
  picture?: any;
}

export interface ActiveMatchingPartner {
  name: string;
  code: string;
  status: string;
  status_text: string;
  status_style: string;
  id: number;
}

export interface Tag {
  name: string;
  icon?: any;
  color_class: string;
  color_code: string;
  created_time: Date;
  id: string;
}

export interface LastActivity {
  type: number;
  message: string;
  message_format?: any;
  message_obj?: any;
  comment_obj?: any;
  created_time: Date;
}

export interface LastComment {
  type: number;
  message: string;
  message_format?: any;
  message_obj?: any;
  comment_obj?: any;
  created_time: Date;
}

export interface LastMessage {
  type: number;
  message: string;
  message_format?: any;
  message_obj?: any;
  comment_obj?: any;
  created_time: Date;
}

export interface AssignedTo {
  Id: string;
  UserName: string;
  Name: string;
  Avatar: string;
}

export interface ConversationMatchingItem {
  id: string;
  page_id: string;
  psid: string;
  name: string;
  name_unsigned?: any;
  from: From;
  partner_id: number;
  partner_name: string;
  phone: string;
  address: string;
  has_phone: boolean;
  has_address: boolean;
  has_order: boolean;
  count_unread_messages: number;
  count_unread_comments: number;
  count_unread_activities: number;
  last_message_received_time?: Date;
  last_saleonline_order?: any;
  partner: ActiveMatchingPartner;
  tags: Tag[];
  last_activity: LastActivity;
  last_comment: LastComment;
  last_message: LastMessage;
  assigned_to_id: string;
  assigned_to: AssignedTo;
  DateCreated: Date;
  LastUpdated: Date;
  LastActivityTimeConverted: Date;
  checkSendMessage: boolean;
  keyTags: any;
}

export interface Query {
  pageId: string;
  page: number;
  limit: number;
  type: string;
}

export interface Response {
  hasNextPage: boolean;
  nextPageUrl: string;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface CRMMatchingMappingDTO {
  items: ConversationMatchingItem[];
  query: Query;
  response: Response;
}
