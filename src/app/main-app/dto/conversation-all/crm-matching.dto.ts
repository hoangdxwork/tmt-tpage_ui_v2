export interface CRMMatchingFrom {
  id?: any;
  name: string;
  picture?: any;
}

export interface CRMMatchingPartner {
  name: string;
  code?: any;
  status: string;
  status_text: string;
  status_style: string;
  id: number;
}

export interface CRMMatchingLastActivity {
  type: number;
  message: string;
  message_format?: any;
  message_obj?: any;
  comment_obj?: any;
  created_time: Date;
}

export interface CRMMatchingLastComment {
  type: number;
  message: string;
  message_format?: any;
  message_obj?: any;
  comment_obj?: any;
  created_time: Date;
}

export interface CRMMatchingLastMessage {
  type: number;
  message: string;
  message_format?: any;
  message_obj?: any;
  comment_obj?: any;
  created_time: Date;
}

export interface CRMMatchingItem {
  id: string;
  page_id: string;
  psid: string;
  name: string;
  name_unsigned?: any;
  from: CRMMatchingFrom;
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
  last_message_received_time?: any;
  last_saleonline_order?: any;
  partner: CRMMatchingPartner;
  tags: any[];
  last_activity: CRMMatchingLastActivity;
  last_comment: CRMMatchingLastComment;
  last_message: CRMMatchingLastMessage;
  assigned_to_id?: any;
  assigned_to?: any;
  DateCreated: Date;
  LastUpdated: Date;
}

export interface CRMMatchingDTO {
  Items: CRMMatchingItem[];
  Extras?: any;
  PageIndex: number;
  PageSize: number;
  TotalCount: number;
  TotalPages: number;
  NextPage: string;
  PreviousPage?: any;
  HasPreviousPage: boolean;
  HasNextPage: boolean;
}
