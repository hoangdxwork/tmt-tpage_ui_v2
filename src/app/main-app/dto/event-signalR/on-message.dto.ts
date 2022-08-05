export interface OnMessageModel {
  action: string;
  companyId: number;
  data: DataOnMessageModel;
  enableAlert: boolean;
  enablePopup: boolean;
  error: boolean;
  message: string;
  type: TypeOnMessage;
}

export interface DataOnMessageModel {
  account_id: string;
  attachment_url: string;
  create_by: Object;
  date_created: Date | any;
  error_message: string;
  fbid: string;
  is_admin: boolean;
  message_formatted: string;
  reply_id: string;
  to_id: string;
  to_name: string;
  tpid: string;
  type: number;
}

export enum TypeOnMessage {
  send_message_sending = "send_message_sending",
  send_message_completed = "send_message_completed",
  send_message_failed = "send_message_failed",
  send_message_retry = "send_message_retry",
  send_message_with_bill = "send_message_with_bill"
}
