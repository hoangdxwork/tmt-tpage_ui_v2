import { TIDictionary } from 'src/app/lib';
import { CRMTagDTO } from 'src/app/main-app/dto/crm-tag/odata-crmtag.dto';
import { MDBInnerCreatedByDTO } from '../../conversation/inner.dto';
import { AutoReplyConfigDTO } from '../page-config.dto';

export interface AutoOrderConfigDTO {
  // Tiêu đề live lấy từ chiến dịch hoặc tự nhập
  LiveTitle: string;
  IsEnableOrderAuto: boolean;
  // Tạo tất cả đơn nếu là text - Không bao gồm trạng thái bom hàng
  IsForceOrderWithAllMessage: boolean;
  IsOnlyOrderWithPartner: boolean;
  IsOnlyOrderWithPhone: boolean;
  IsForceOrderWithPhone: boolean;
  IsForcePrintWithPhone: boolean;
  MinLengthToVisible: number;
  MinLengthToOrder: number;
  MaxCreateOrder: number;
  TextContentToExcludeOrder: string;
  PhonePattern: string;
  EmailPattern: string;
  LiveCampaignId: string;
  TeamId?: number;
  TextContentToOrders: AutoOrderConfig_ContentToOrderDTO[];
  ExcludedPhones: string[];
  ExcludedStatusNames: string[];
  // Bật gán user cho những partner chưa được gán cho ai
  IsEnableAutoAssignUser: boolean;
  // Danh sách user để gán tự động
  Users: MDBInnerCreatedByDTO[];
  // null là không cấu hình, lấy cấu hình mặc định - true: gửi - false: không gửi
  IsEnableOrderReplyAuto?: boolean;
  OrderReplyTemplate: string;
  IsEnableShopLink: boolean;
  ShopLabel: string;
  ShopLabel2: string;
  // Cờ dùng để chỉ gửi một lần
  IsOrderAutoReplyOnlyOnce: boolean;
}

export interface AutoOrderConfig_ContentToOrderDTO {
  Index: number;
  Content: string;
  ContentWithAttributes: string;
  // Bặt tắt dựa vào IsActive của LiveCampaignDetail
  IsActive: boolean;
  Product: AutoOrderConfig_ProductDTO;
}

export interface AutoOrderConfig_ProductDTO {
  ProductId?: number;
  ProductCode: string;
  ProductName: string;
  ProductNameGet: string;
  Price?: number;
  UOMId?: number;
  UOMName: string;
  // Số lượng tối đa
  Quantity?: number;
  // Số lượng giới hạn/người
  QtyLimit?: number;
  // Số lượng mặc định/người
  QtyDefault?: number;
  // Bật bắt số lượng bằng regex
  IsEnableRegexQty: boolean;
  // Bật kiểm tra thuộc tính
  IsEnableRegexAttributeValues: boolean;
  // Cho phép chốt nhiều lần (nhưng không cho trùng nội dung chốt)
  IsEnableOrderMultiple: boolean;
  // Các giá trị thuộc tính để bổ trợ regex
  AttributeValues: string[];
  DescriptionAttributeValues: string[];
}

export interface AutoHiddenConfigDTO {
  IsEnableAutoHideComment: boolean;
  IsEnableAutoHideAllComment: boolean;
  IsEnableAutoHideCommentWithPhone: boolean;
  IsEnableAutoHideCommentWithEmail: boolean;
  ContentOfCommentForAutoHide: string;
  PhonePattern: string;
  EmailPattern: string;
}

export interface MDBFacebookMappingPostAutoConfigDTO {
  host: string;
  account_id: string;
  fbid: string;
  live_campaign_id: string;
  live_campaign_name: string;
  live_campaign_is_active: boolean;
  job_id: string;
  phone_pattern: string;
  email_pattern: string;
  auto_label_config_text: string;
  auto_label_config?: AutoLabelConfigDTO;
  auto_order_config_text: string;
  auto_order_config: AutoOrderConfigDTO;
  old_config_text?: any;
  old_config?: any;
  auto_hidden_config_text: string;
  auto_hidden_config: AutoHiddenConfigDTO;
  auto_reply_config_text: string;
  auto_reply_config: AutoReplyConfigDTO;
  DateCreated: Date;
  LastUpdated?: any;
}

export interface AutoLabelConfigDTO {
  /// Bật gán nhãn tự động dựa trên số điện thoại
  AssignOnPhone: boolean;
  TagOnPhone: CRMTagDTO;
  /// Bật gán nhãn tự động nếu có tạo đơn
  AssignOnOrder: boolean;
  TagOnOrder: CRMTagDTO;
  AssignOnPattern: boolean;
  TagOnPattern: TagControlLabelDTO[];
  /// Bật gán nhãn tự động nếu lưu nháp
  AssignOnBillDraft: boolean;
  TagOnBillDraft: CRMTagDTO;
  /// Bật gán nhãn tự động nếu xác nhận và in
  AssignOnBillPrint: boolean;
  TagOnBillPrint: CRMTagDTO;
  /// Bật gán nhãn tự động nếu xác nhận và in ship
  AssignOnBillPrintShip: boolean;
  TagOnBillPrintShip: CRMTagDTO;
}

export interface TagControlLabelDTO {
  CrmTag: CRMTagDTO;
  CrmKey: string;
}

export interface TBotRequestCallbackFailedDTO {
  Id: string;
  Url: string;
  Data: any;
  Host: string;
  PostId: string;
  ResponseContext: string;
  RequestHeaders: TIDictionary<any>;
  IsCreated: boolean;
  DateCreated: Date;
  LastUpdated?: Date;
}
