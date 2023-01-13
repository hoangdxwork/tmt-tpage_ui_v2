import { PriorityStatus } from 'src/app/main-app/services/mock-odata/odata-saleonlineorder.service';
import { LiveCampaign } from './../live-campaign/livecampain-detail-attributes.dto';
import { NumericDictionaryIteratee } from 'lodash';
import { ApplicationUserDTO } from '../account/application-user.dto';
import { CompanyDTO } from '../company/company.dto';
import { ObjectDataDTO } from '../conversation/inner.dto';
import { PartnerDTO, PartnerStatus } from '../partner/partner.dto';
import { StockWarehouseDTO } from '../product/warehouse.dto';

export interface SaleOnlineStatusModelDto {
  DateStart?: Date | any;
  DateEnd?: Date | any;
  TagIds: string;
  SearchText: string;
  PostId?: string;
  TeamId?: number;
  HasTelephone?: boolean;
  LiveCampaignId?: string;
  PriorityStatus?: any;
  StatusTexts?: string[];
}

export interface SaleOnlineStatusValueDto {
  StatusText: string;
  Total: number;
}

export interface SaleOnline_OrderDTO {
  Id: string | undefined;
  Code: string | undefined;

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
  User?: ApplicationUserDTO;
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
  from: SaleOnlineFacebookFromDTO;
  comments: Array<SaleOnline_Order_FacebookCommentDTO>;
  saleOnlineDeliveyInfo: SaleOnlineDeliveryInfoDTO;
  attachment: SaleOnline_Order_FacebookCommentAttachmentDTO[];
}

export interface SaleOnline_Order_FacebookCommentAttachmentDTO
{
  payload: SaleOnline_Order_FacebookCommentPayloadDTO;
  type: string;
}

export interface SaleOnline_Order_FacebookCommentPayloadDTO
{
  thumbnail: string;
  id: string;
  url: string;
}

export interface SaleOnline_Order_DetailDTO {
  Id: string;
  Quantity: number;
  Price: number;
  ProductId?: number;
  ProductName: string;
  ProductNameGet: string;
  ProductCode: string;
  UOMId?: number;
  UOMName: string;
  Note: string;
  Dactor?: number;
  OrderId: string;
  IsOrderPriority?: boolean;
  // Thứ tự ưu tiên, thứ tự <= 0 => hiển thị trạng thái hết hàng lúc người dùng cập nhật giỏ hàng
  Priority: number;
  ImageUrl: string;
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

export interface UpdateStatusTextSaleOnlineDTO { // /odata/SaleOnline_Order/ODataService.UpdateStatusTextSaleOnline
  Code: string | undefined;
  Id: string | undefined;
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

export interface SaleOnlineFacebookFromAgeRangeDTO {
  min?: number;
  max?: number;
}

export interface SaleOnlineFacebookPostDTO {
  Id: string;
  facebook_id: string;
  message: string;
  source: string;
  story: string;
  description: string;
  link: string;
  caption: string;
  picture: string;
  full_picture: string;
  icon: string;
  object_id: string;
  parent_id: string;
  permalink_url: string;
  place: string;
  promotable_id: string;
  is_expired: boolean;
  is_hidden: boolean;
  is_published: boolean;
  str_attachments: string;
  str_child_attachments: string;
  str_targeting: string;
  str_shares: string;
  created_time: Date;
  updated_time?: Date;
  count_comments: number;
  count_reactions: number;
  count_shares: number;
  from: SaleOnlineFacebookFromDTO;
  LiveCampaignId?: string;
  LiveCampaignName: string;
}
