import { MDBInnerCreatedByDTO } from '../../conversation/inner.dto';

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
  MinLengthToOrder: number;
  MaxCreateOrder: number;
  TextContentToExcludeOrder: string;
  PhonePattern: string;
  EmailPattern: string;
  LiveCampaignId?: string;
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
