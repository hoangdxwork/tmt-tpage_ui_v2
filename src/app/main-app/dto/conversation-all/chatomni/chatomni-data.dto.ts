import { ChatomniObjectsItemDto } from './chatomni-objects.dto';
import { Facebook_Graph_Post } from "./chatomni-facebook-post.dto";
import { ChatomniDataTShopPostDto } from "./chatomni-tshop-post.dto";

export interface ChatomniDataDto {
  Items: ChatomniDataItemDto[];
  Extras?: ExtrasDto;
  Paging: PagingTimestamp;
}

export interface ExtrasDto {
  Objects: { [key: string]: ChatomniObjectsItemDto };
  Childs: { [key: string]: ExtrasChildsDto[] };
}

export interface Facebook_Graph_FromDto {
  id: string;
  name: string;
  uid?: any;
}

export interface ParentChildsDto {
  id: string;
}

export interface ObjectDto {
  id: string;
}

export interface ImageData {
  width: number;
  height: number;
  max_width: number;
  max_height: number;
  url: string;
  preview_url?: any;
  image_type: number;
  render_as_sticker: boolean;
}

export interface Datum {
  id?: any;
  mime_type: string;
  name?: any;
  size: number;
  file_url?: any;
  image_data: ImageData;
  video_data?: any;
}

export interface Attachments {
  data: Datum[];
  paging?: any;
}

export interface PayloadElementsDto {
  title: string;
  image_url: string;
  subtitle: string;
  buttons: any;
  item_url: any;
  quantity: any;
  price: any;
  currency: any;
}

export interface AddressPayloadDto {
  street_1: string,
  city: string,
  postal_code: any,
  country: string,
  state: string
}

export interface SummaryPayloadDto {
  subtotal: number;
  shipping_cost: number;
  total_tax: number;
  total_cost: number;
}

export interface FacebookPayloadDto {
  url?: any;
  template_type: string;
  top_element_style?: any;
  elements?: PayloadElementsDto[];
  buttons?: any;
  recipient_name?: any;
  order_number?: any;
  currency?: any;
  payment_method?: any;
  order_url?: any;
  timestamp?: any;
  address?: AddressPayloadDto;
  summary?: SummaryPayloadDto;
}

export interface FacebookWebhookAttachmentDto {
  type: string;
  payload: FacebookPayloadDto;
}

export interface ChatomniFacebookDataDto {
  id: string;
  message: string;
  message_formatted: string;
  created_time: Date;
  from: Facebook_Graph_FromDto;
  to?: Facebook_Inner_UserSimple;
  attachments: Attachments;
  parent: ParentChildsDto;
  is_hidden?: boolean;
  can_hide?: boolean;
  can_remove?: boolean;
  can_like?: boolean;
  can_reply_privately?: boolean;
  comment_count?: number;
  like_count?: number;
  user_likes?: boolean;
  object: ObjectDto;
  comments?: any[];
  attachment?: any;
  message_tags: MessageTag[];
  phone: string;
  webhook_attachments: FacebookWebhookAttachmentDto[] | any[];

  // các dữ liệu bổ sung để check client
  has_admin_required?: boolean;
  is_error_attachment?: boolean;// ko có trong dữ liệu trả về
  is_reply?: boolean;// ko có trong dữ liệu trả về
  is_private_reply: boolean;// ko có trong dữ liệu trả về
}

export interface ErrorMessageOmni {
  Code: string;
  Message: string;
}

export interface Facebook_Inner_UserSimple {
  id: string;
  name: string;
}

export interface MessageTag {
  id: string;
  name: string;
  offset: number;
  type: string;
  length: number;
}

export interface ChatomniInnerUser {
  Id: string;
  Name: string;
}

export interface Thumbnail {
  Width: number;
  Height: number;
  Url: string;
}

export interface NlpEntityDto {
  Name: string;
  Offset: number;
  Length: number;
  Value: string;
  Data?: any;
  Time: Date;
}

export interface ChatomniDataItemDto {
  Data: any; // ChatomniFacebookDataDto hoặc ChatomniTShopDataDto hoặc  TikTokLiveItemDataDto
  Id: string;
  ObjectId: string;
  ParentId?: string | any;
  Message: string;
  Source?: any;
  Type: ChatomniMessageType;
  UserId: string;
  Error?: ErrorMessageOmni | any;
  Status: ChatomniStatus;
  IsSystem: boolean; // System = 0, Hoạt động phát sinh từ phần mềm (do người dùng)
  CreatedById?: string | any;
  CreatedBy?: ChatomniInnerUser | any;
  CreatedTime: Date | any;
  ChannelCreatedTime: Date | any;
  ChannelUpdatedTime?: any;
  IsOwner: boolean;
  NlpEntities?: NlpEntityDto[] | any[];

  Attachments?: any;

  IsShowAvatar?: boolean; // không có trong api trả về, dùng để hiện thị, không hiện avatar nếu tin nhắn trong thời gian ngắn
  isNoPartnerId?:  boolean; // không có trong api trả về, dùng để phân biệt cmt child chưa tìm thấy cmt partner trong list api trả về
}

export interface PagingTimestamp {
  Next: number;
  HasNext: boolean;
  UrlNext: string;
}

export enum ChatomniStatus {
  Pending = 0, // Chờ gửi
  Done = 1, // Gửi thành công
  Error = 2 // Gửi lỗi
}

export enum ChatomniMessageType {
  System = 0,
  General = 1,
  Mail = 2,
  Sms = 3,
  Call = 4,
  FacebookMessage = 11,
  FacebookComment = 12, // Trừ các số tiếp theo nếu facebook có loại mới
  ZaloMessage = 21,
  TShopComment = 91,
  TShopMessage = 92,
  UnofficialTikTokChat = 1001
}

export enum ChatomniChannelType{
  General = 0,
  TUser = 1,
  TShop = 2,

  FacebookUser = 3,
  FacebookPage = 4,
  FacebookShop = 5,
  FacebookGroup = 6,

  TDesk = 11,
  TikTokShop = 12,
  ShopeeShop = 13,
  LazadaShop = 14,
  TikiShop = 15,

  // Kênh tiktok không chính thống
  UnofficialTikTok = 1001,
  UnofficialFacebookUser = 1011,
  UnofficialFacebookGroup = 1012
}

// Lấy ChatomniObjectsItemDto thay ExtrasObjectDto
export interface ExtrasObjectDto {
  Data: Facebook_Graph_Post | ChatomniDataTShopPostDto;// gán lại ChatomniDataTShopPost hoặc ChatomniDataFacebookPost
  Id: string;
  ObjectId: string;
  ObjectType: number;
  CreatedTime: Date;
  ChannelCreatedTime: Date;
  ChannelUpdatedTime?: any;
  Title?: any;
  Description: string;
  Thumbnail?: Thumbnail
}

export interface ExtrasChildsDto {
  Data: ChatomniFacebookDataDto;
  Id: string;
  ObjectId: string;
  ParentId?: string;
  Message: string;
  Source?: any;
  Type: ChatomniMessageType;
  UserId: string;
  Error?: ErrorMessageOmni;
  Status: ChatomniStatus;
  IsSystem: boolean; // System = 0, Hoạt động phát sinh từ phần mềm (do người dùng)
  CreatedById?: string;
  CreatedBy?: ChatomniInnerUser;
  CreatedTime: Date | any;
  ChannelCreatedTime: Date;
  ChannelUpdatedTime?: any;
  IsOwner: boolean;
}

export interface ChatomniTShopDataDto {
  Id: any;
  Content: TShopDataConentDto;
  Type: number;
  Status: boolean;
  Sender: Sender;
  ShopId: string;
  ConversationId: string;
  Recipient: Recipient;
  AttachmentDto: AttachmentDto[] | any;
  ListUserId: string[];
  MessageLinkDto: any[];
  SocketId: string;
  CookieId?: any;
  CreationTime: Date;
  ExtraProperties: ExtraProperties;
  ObjectKind: string;
  ObjectKindValue?: number;
  ObjectId?: any;
  ParentCommentId?: any;
  UserId: string;
  Actor: TShopDataActorDto;
  CreatorId: string;
}

export interface TShopDataConentDto {
  Tags: any;
  Text: string;
}

export interface Sender {
  Id: string;
  Name: string;
  Avatar?: any;
  UserName?: any;
}

export interface Recipient {
  Id: string;
  Name: string;
  Avatar?: any;
  UserName?: any;
}

export interface AttachmentDto {
  id: string;
  untrustedNameForDisplay: string;
  downloadUrl: string;
  size: number;
  fileExtension: string;
  status?: any;
  fileUrl: string;
  conversationId: string;
  messageId: string;
  attachmentType: number;
  creationTime: Date;
}

export interface ImageData {
  width: number;
  height: number;
  max_width: number;
  max_height: number;
  url: string;
  image_type: number;
  render_as_sticker: boolean;
}

export interface AttachmentIsAdminDto {
  mime_type: string;
  size: number;
  image_data: ImageData;
}

export interface ExtraProperties {
  sendFrom: string;
}

export interface TShopDataActorDto {
  Id: string;
  Name: string;
  AvatarUrl: string;
}

