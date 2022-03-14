import { MailTemplateDTO } from "../mailtemplate/mail-template.dto";
import { ProductInnerDTO } from "../product/product.dto";

export interface FacebookGraphMessageDTO {
  id: string;
  message: string;
  message_formatted: string;
  created_time: Date;
  from: FacebookGraphUserSimpleDTO;
  to: FacebookInnerListDTO<FacebookInnerUserSimpleDTO>;
  attachments: FacebookInnerDataListDTO<FacebookGraphAttachmentDTO>;
}

export interface FacebookInnerUserSimpleDTO {
  id: string;
  name: string;
}

export interface FacebookGraphAttachmentDTO {
  image_data: ImageData;
  video_data: VideoData;
}

export interface ImageData {
  url: string;
}

export interface VideoData {
  url: string;
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
