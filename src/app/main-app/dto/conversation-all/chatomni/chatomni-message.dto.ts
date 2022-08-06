import { From_Post } from './chatomni-objects.dto';
import { Facebook_Graph_Post } from "./chatomni-facebook-post.dto";
import { ChatomniDataTShopPostDto } from "./chatomni-tshop-post.dto";

export interface ChatomniMessageDTO {
  Items: ChatomniMessageDetail[];
  Extras?: Extras;
  Paging: PagingTimestamp;
}

export interface Extras {
  Objects: { [key: string]: ExtrasObjectDto };
}

export interface Facebook_Graph_From {
  id: string;
  name: string;
  uid?: any;
  picture: From_Post
}

export interface Parent {
  id: string;
}

export interface Object {
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

export interface Image {
  height: number;
  src: string;
  width: number;
}

export interface Media {
  image: Image;
  source: string;
}

export interface Target {
  id: string;
  url: string;
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
//DatumV2 thay thế sau khi xóa conversation-post-view-2
export interface DatumV2{
  media: Media;
  subattachments?: any;
  target: Target;
  title: string;
  type: string;
  url: string;
}

export interface Attachments {
  data: Datum[];
  paging?: any;
}

export interface ChatomniDataFacebookMessage {
  id: string;
  message: string;
  message_formatted: string;
  created_time: Date;
  from: Facebook_Graph_From;
  to?: Facebook_Inner_UserSimple;
  attachments: Attachments;
  parent: Parent;
  is_hidden?: boolean;
  can_hide?: boolean;
  can_remove?: boolean;
  can_like?: boolean;
  can_reply_privately?: boolean;
  comment_count?: number;
  user_likes?: boolean;
  object: Object;
  comments?: any;
  attachment?: any;
  message_tags: MessageTag[];
  phone: string;

  // các dữ liệu bổ sung để check client
  has_admin_required: boolean;
  is_error_attachment: boolean;// ko có trong dữ liệu trả về
  errorShowAttachment: boolean;// ko có trong dữ liệu trả về
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
export interface ChatomniMessageDetail {
  Data: ChatomniDataFacebookMessage;
  Id: string;
  ObjectId: string;
  ParentId?: string;
  Message: string;
  Source?: any;
  Type: ChatomniMessageType;
  UserId: string;
  Error?: ErrorMessageOmni;
  Status: ChatomniStatus;
  IsSystem: boolean;
  CreatedById?: string;
  CreatedBy?: ChatomniInnerUser;
  CreatedTime: Date | any;
  ChannelCreatedTime: Date;
  ChannelUpdatedTime?: any;
  IsOwner: boolean;
}

export interface PagingTimestamp {
  Next: string;
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
  TShopMessage = 92
}

export interface ExtrasObjectDto {
  Data:  Facebook_Graph_Post | ChatomniDataTShopPostDto;// gán lại ChatomniDataTShopPost hoặc ChatomniDataFacebookPost
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
