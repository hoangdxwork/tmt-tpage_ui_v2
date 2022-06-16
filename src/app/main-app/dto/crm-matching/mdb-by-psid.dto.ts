export interface From {
  id?: any;
  name: string;
  picture?: any;
}

export interface Partner {
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
  color_code?: any;
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

export interface AssignedTo {
  Id: string;
  UserName: string;
  Name: string;
  Avatar: string;
}

export interface MDBByPSIdDTO {
  id: string;
  DateCreated: Date;
  LastUpdated: Date;
  page_id: string;
  psid: string;
  cid?: any;
  link?: any;
  asid?: any;
  uid?: any;
  name: string;
  name_unsigned: string;
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
  SQLId?: any;
  last_message_received_time?: any;
  last_saleonline_order?: any;
  partner: Partner;
  tags: Tag[];
  last_activity: LastActivity;
  last_comment: LastComment;
  last_message?: any;
  assigned_to_id: string;
  assigned_to: AssignedTo;
  keyTags: any;
}
