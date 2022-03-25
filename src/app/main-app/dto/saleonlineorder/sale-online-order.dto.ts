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
  id: string;
  code: string;

  facebook_UserId: string;
  facebook_PostId: string;
  facebook_ASUserId: string;
  facebook_CommentId: string;
  facebook_AttachmentId: string;
  facebook_UserName: string;
  facebook_UserAvatar: string;
  facebook_Content: string;
  _telephone: string;

  telephone: string;

  address: string;
  partnerPhone: string;
  name: string;
  email: string;
  note: string;
  deposit: number;
  liveCampaignId: string;
  liveCampaignName: string;

  partnerId?: number;
  partner: PartnerDTO;
  partnerName: string;
  partnerStatus: PartnerStatus;
  partnerStatusText: string;
  partnerCode: string;

  cityCode: string;
  cityName: string;
  districtCode: string;
  districtName: string;
  wardCode: string;
  wardName: string;

  totalAmount: number;
  totalQuantity: number;

  dateCreated: Date;
  lastUpdated?: Date;

  status: SaleOnlineOrderStatusType;
  statusText: string;

  facebook_CommentsText: string;
  facebook_Comments: Array<SaleOnline_Order_FacebookCommentDTO>;

  details: Array<SaleOnline_Order_DetailDTO>;

  statusStr: string;
  commentIds: Array<string>;
  companyId?: number;
  partnerNameNosign: string;
  sessionIndex: number;
  session: number;
  source: string;
  source_FacebookUserId: string;
  source_FacebookMessageId: string;
  zaloOrderCode: string;
  zaloOrderId: string;
  zaloOAId: string;
  deliveryInfo: string;
  crmTeamId?: number;
  matchingId: string;
  isCreated: boolean;
  isUpdated: boolean;
  crmTeamName: string;

  // Hiển thị số lần in
  printCount: number;
  userId: string;
  user: ApplicationUserDTO;
  tags: string;
  nameNetwork: string;
  userName: string;

  warehouseId?: number;
  warehouseName: string;
  warehouse: StockWarehouseDTO;

  company: CompanyDTO;
  companyName: string;

  formAction: string;
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
