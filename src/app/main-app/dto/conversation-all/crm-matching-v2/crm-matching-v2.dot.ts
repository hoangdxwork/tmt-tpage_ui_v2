export interface From {
  id?: any;
  name: string;
  picture?: any;
}

export interface Partner {
  name: string;
  code?: any;
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

export interface CrmMatchingV2Detail {
  id: string;
  page_id: string;
  psid: string;
  name: string;
  name_unsigned?: any;
  from: From;
  partner_id?: number;
  partner_name: string;
  phone: string;
  address?: any;
  has_phone: boolean;
  has_address: boolean;
  has_order: boolean;
  state: number | null; //StateChatbot;
  count_unread_messages: number;
  count_unread_comments: number;
  count_unread_activities: number;
  last_message_received_time?: Date;
  last_saleonline_order?: any;
  partner: Partner;
  tags?: Tag[];
  last_activity: LastActivity;
  last_comment: LastComment;
  last_message: LastMessage;
  assigned_to_id?: any;
  assigned_to?: any;
  DateCreated: Date | any;
  LastUpdated: Date | any;

  // TODO các field bổ sung
  LastActivityTimeConverted: Date;
  checkSendMessage: boolean;
  keyTags: any;
}

export enum StateChatbot {
  Normal = 0, // trạng thái bình thường
  Transfer = 1, // đang chuyển cho admin xử lý
  Warning = 2 , // hệ thống đang gặp vấn đề
}

export interface PagingTimestamp {
  Next: number;
  HasNext: boolean;
  UrlNext: string;
}

export interface CrmMatchingV2DTO {
  Items: CrmMatchingV2Detail[];
  Extras?: any;
  Paging: PagingTimestamp;
}
