import { ViewConversation_FastSaleOrdersDTO } from "../fastsaleorder/view_fastsaleorder.dto";
import { FacebookUserPictureDTO, InnerActivityDTO, InnerCreatedByDTO, InnerPartnerDTO, InnerSaleOnlineOrderDTO, InnerTagDTO } from "./inner.dto";

// MDB_Facebook_Partner_Mapping
export interface ConversationDTO { // /rest/v1.0/crmmatching/406109210143079_2869571179747239
  id: string;

  dateCreated: Date;
  lastUpdated?: Date;

  /// Khóa duy nhất: host_page_id_psid
  host: string;
  /// Khóa duy nhất: host_page_id_psid
  page_id: string;
  /// Khóa duy nhất: host_page_id_psid
  psid: string;

  cid: string;
  link: string;
  asid: string;
  uid: string;

  /// Tên cũ, sẽ đổi khi khách muốn cập nhật
  /// Hiển thị: from.name (name)
  name: string;
  name_unsigned: string;
  from: FacebookUserPictureDTO;
  partner_id?: number;

  /// Tên khách hàng nếu có
  partner_name: string;
  phone: string;
  address: string;

  has_phone: boolean;
  has_address: boolean;
  has_order: boolean;

  count_unread_messages: number;
  count_unread_comments: number;
  count_unread_activities: number;

  SQLId: string;
  last_message_received_time?: Date;
  last_saleonline_order: InnerSaleOnlineOrderDTO;

  partner: InnerPartnerDTO;
  tags: Array<InnerTagDTO>;

  last_activity: InnerActivityDTO;
  last_comment: InnerActivityDTO;
  last_message:InnerActivityDTO;

  assigned_to_id: string;
  assigned_to: InnerCreatedByDTO;

  /// Các tag cố định theo tính năng
  /// aship: đang giao hàng, sắp giao hàng, đã giao hàng
  /// order: đơn nháp, hoá đơn...
  /// bill: chưa thanh toán, đã thanh toán
  //Dictionary<string, string> extras:

  /// Check from hợp lệ
  isValidFrom: boolean;
}


export interface DataUpdate {
  last_activity: any;
  last_message: any;
  last_comment: any;
  LastActivityTimeConverted: any;
  LastUpdated: any;
  is_admin: boolean;
}

export interface ConversationOrderBillByPartnerDTO {
  LastSaleOrder?: ViewConversation_FastSaleOrdersDTO;
  Total: number;
  Result: ConversationOrderBillByPartnerResultDTO[];
}

export interface ConversationOrderBillByPartnerResultDTO {
  type: string;
  data: ViewConversation_FastSaleOrdersDTO[];
  total: number;
}

export interface ConversationSummaryByTagDTO {
  id: string;
  name: string;
  icon: string;
  color_class: string;
  color_code: string;
  count: number;
}
