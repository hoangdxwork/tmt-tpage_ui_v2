import { ApplicationUserDTO } from '../account/application-user.dto';
import { CompanyDTO } from '../company/company.dto';
import { ObjectDataDTO } from '../conversation/inner.dto';
import { PartnerDTO, PartnerStatus } from '../partner/partner.dto';
import { StockWarehouseDTO } from '../product/warehouse.dto';

export interface SaleOnlineOrderSummaryStatusDTO {
  dateStart?: Date;
  dateEnd?: Date;
  tagIds: string;
  searchText: string;
}

export interface SaleOnline_OrderDTO {
  Id: string;
  Code: string;

  Facebook_UserId: string;
  Facebook_PostId: string;
  Facebook_ASUserId: string;
  Facebook_CommentId: string;
  Facebook_AttachmentId: string;
  Facebook_UserName: string;
  Facebook_UserAvatar: string;
  Facebook_Content: string;
  _telephone: string;

  Telephone: string;

  Address: string;
  PartnerPhone: string;
  Name: string;
  Email: string;
  Note: string;
  Deposit: number;
  LiveCampaignId: string;
  LiveCampaignName: string;

  PartnerId?: number;
  Partner: PartnerDTO;
  PartnerName: string;
  PartnerStatus: PartnerStatus;
  PartnerStatusText: string;
  PartnerCode: string;

  CityCode: string;
  CityName: string;
  DistrictCode: string;
  DistrictName: string;
  WardCode: string;
  WardName: string;

  TotalAmount: number;
  TotalQuantity: number;

  DateCreated: Date;
  LastUpdated?: Date;

  Status: SaleOnlineOrderStatusType;
  StatusText: string;

  Facebook_CommentsText: string;
  Facebook_Comments: Array<SaleOnline_Order_FacebookCommentDTO>;

  Details: Array<SaleOnline_Order_DetailDTO>;

  StatusStr: string;
  CommentIds: Array<string>;
  CompanyId?: number;
  PartnerNameNosign: string;
  SessionIndex: number;
  Session: number;
  Source: string;
  Source_FacebookUserId: string;
  Source_FacebookMessageId: string;
  ZaloOrderCode: string;
  ZaloOrderId: string;
  ZaloOAId: string;
  DeliveryInfo: string;
  CRMTeamId?: number;
  MatchingId: string;
  IsCreated: boolean;
  IsUpdated: boolean;
  CRMTeamName: string;

  // Hiển thị số lần in
  PrintCount: number;
  UserId: string;
  User: ApplicationUserDTO;
  Tags: string;
  NameNetwork: string;
  UserName: string;

  WarehouseId?: number;
  WarehouseName: string;
  Warehouse: StockWarehouseDTO;

  Company: CompanyDTO;
  CompanyName: string;

  FormAction: string;
}

export interface SaleOnline_Order_FacebookCommentDTO {
  id: string;
  message: string;
  created_time: string;
  created_time_converted?: Date;
  can_hide: boolean;
  can_remove: boolean;
  like_count: number;
  comment_count: number;
  view_id: number;
  is_hidden: boolean;
  post_id: string;
  object: ObjectDataDTO;
  from: SaleOnline_Facebook_FromDTO;
  comments: Array<SaleOnline_Order_FacebookCommentDTO>;
  saleOnlineDeliveyInfo: SaleOnlineDeliveryInfoDTO;
}

export interface SaleOnline_Order_DetailDTO {
  id: string;
  quantity: number;
  price: number;
  productId?: number;
  productName: string;
  productNameGet: string;
  productCode: string;
  uomId?: number;
  uomName: string;
  note: string;
  dactor?: number;
  orderId: string;

  // Thứ tự ưu tiên, thứ tự <= 0 => hiển thị trạng thái hết hàng lúc người dùng cập nhật giỏ hàng
  priority: number;
  imageUrl: string;
}

export interface SaleOnlineDeliveryInfoDTO {
  carrierName: string;
  trackingRef: string;
  trackingRefSort: string;
  ship_Weight: string;
  ship_Fee: number;
  cod: string;
  isCOD: boolean;
  ship_Receiver: ShipReceiverDTO;
}

export interface ShipReceiverDTO {
  name: string;
  phone: string;
  address: string;
}

export interface SaleOnline_Facebook_FromDTO {
  id: string;
  uid: string;
  asid: string;
  picture: string;
  name: string;
  mobile_phone: string;
}

export interface UpdateStatusTextSaleOnlineDTO { // /odata/SaleOnline_Order/ODataService.UpdateStatusTextSaleOnline
  Code: string;
  Id: string;
  Name: string;
  StatusText: string;
  TotalAmount: number;
}

export enum SaleOnlineOrderStatusType {
  Draft, // Nháp
  Ordered, // Đơn hàng
  Deposited, // Đặt cọc
  Deliveried, // Giao hàng
  Paid, // Thanh toán
  Completed, // Hoàn thành
  Canceled, // Hủy
  Returned, // Trả hàng
  Confirmed, //Xác nhận
}

export interface SaleOnlineFacebookCommentFilterResultDTO { // rest/v1.0/SaleOnline_Facebook_Comment/GetCommentsByUserAndPost
  id: string;
  post_id: string;
  message: string;
  like_count?: number;
  comment_count?: number;
  created_time: string;
  from: SaleOnlineFacebookFromDTO;
  comments: Array<SaleOnlineFacebookCommentChildFilterResultDTO>;
  selected?: boolean;
}

export interface SaleOnlineFacebookCommentChildFilterResultDTO {
  id: string;
  post_id: string;
  message: string;
  like_count?: number;
  comment_count?: number;
  created_time: string;
  from: SaleOnlineFacebookFromDTO;
}

export interface SaleOnlineFacebookFromDTO {
  id: string;
  uid: string;
  asid: string;
  picture: string;
  name: string;
  last_name: string;
  first_name: string;
  middle_name: string;
  mobile_phone: string;
  email: string;
  gender: string;
  locale: string;
  age_range: SaleOnlineFacebookFromAgeRangeDTO;
}

export interface SaleOnlineFacebookFromAgeRangeDTO {
  min?: number;
  max?: number;
}
