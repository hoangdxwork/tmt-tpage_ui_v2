import { MailTemplateDTO } from '../mailtemplate/mail-template.dto';
import { ProductInnerDTO } from '../product/product.dto';
import { FacebookGraphMessageDTO, FacebookGraphCommentDTO } from './message.dto';
// Facebook_Inner_From
export interface FacebookInnerFromDTO {
  id: string;
  name: string;
  picture: FacebookUserPictureDTO;
}

// Facebook_UserPicture
export interface FacebookUserPictureDTO {
  data: FacebookUserPictureDataDTO;
}

export interface FacebookInnerUserSimpleDTO {
  id: string;
  name: string;
}

export interface FacebookUserPictureDataDTO {
  height: number;
  is_silhouette: boolean;
  url: string;
  width: number;
}

// Inner_Partner
export interface InnerPartnerDTO {
  tpid: number;
  name: string;
  code: string;
  status: string;
  status_text: string;
  status_style: string;
}

// Inner_Tag
export interface InnerTagDTO {
  tpid: string;
  name: string;
  icon: string;
  color_class: string;
  color_code: string;
  created_time?: Date;
}

// Inner_Activity
export interface InnerActivityDTO {
  type: FacebookActivityType;
  fbid: string;
  message: string;
  message_format: string;
  message_obj: FacebookGraphMessageDTO;
  comment_obj: FacebookGraphCommentDTO;
  created_time: Date;
}

export interface FacebookGraphUserSimpleDTO {
  id: string;
  name: string;
  uid: string;
}

export interface FacebookInnerListDTO<T> {
  data: Array<T>;
}

export interface FacebookInnerDataListDTO<T> {
  data: Array<T>;
  paging: FacebookInnerPagingDTO;
}

export interface FacebookInnerPagingDTO {
  cursors: FacebookInnerCursorDTO;
  next: string;
  previous: string;
}

export interface FacebookInnerCursorDTO {
  before: string;
  after: string;
}

export interface ObjectDataDTO {
  id: string;
}

export interface GenerateMessageDTO {
  orderIds: Array<string>;
  saleIds: Array<number>;
  template: MailTemplateDTO;
}

export interface AddTemplateMessageDTO {
  page_id: string;
  to_id: string;
  product: ProductInnerDTO;
}

export interface FacebookGraphCommentMessageTagDTO {
  id: string;
  length: number;
  name: string;
  offset: number;
  type: string;
}

// Facebook_Graph_StoryAttachment
export interface FacebookGraphStoryAttachmentDTO {
  media: StoryAttachmentMediaDTO;
  target: StoryAttachmentTargetDTO;
  type: string;
  url: string;
}

export interface StoryAttachmentMediaDTO {
  image: StoryAttachmentImageDTO;
}

export interface StoryAttachmentImageDTO {
  height: number;
  src: string;
  width: number;
}

export interface StoryAttachmentTargetDTO {
  id: string;
  url: string;
}

export interface InnerCreatedByDTO {
  id: string;
  userName: string;
  name: string;
  avatar: string;
}

// MDB_Inner_SaleOnline_Order
export interface InnerSaleOnlineOrderDTO {
  id: string;
  code: string;
  status: string;
  statusText: string;
  dateCreated: Date;
}

// FacebookActivityType
export enum FacebookActivityType
{
    System = 0, // Hoạt động phát sinh từ phần mềm (do người dùng)
    Facebook = 1, // Hoạt động phát sinh từ webhook (không thuộc comment, message)
    Comment = 2, // Do người dùng
    Message = 3, // Do người dùng
    Reaction = 4,
}
