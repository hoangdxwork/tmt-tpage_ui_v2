import { MailTemplateDTO } from "../mailtemplate/mail-template.dto";
import { ProductInnerDTO } from "../product/product.dto";
import { FacebookGraphCommentMessageTagDTO, FacebookGraphStoryAttachmentDTO, FacebookGraphUserSimpleDTO, FacebookInnerDataListDTO, FacebookInnerListDTO, FacebookInnerUserSimpleDTO, ObjectDataDTO } from "./inner.dto";

// Facebook_Graph_Message
export interface FacebookGraphMessageDTO {
  id: string;
  message: string;
  message_formatted: string;
  created_time: Date;
  from: FacebookGraphUserSimpleDTO;
  to: FacebookInnerListDTO<FacebookInnerUserSimpleDTO>;
  attachments: FacebookInnerDataListDTO<FacebookGraphAttachmentDTO>;
}

// Facebook_Graph_Comment
export interface FacebookGraphCommentDTO {
  id: string;
  parent: ObjectDataDTO;
  is_hidden: boolean;
  can_hide: boolean;
  can_remove: boolean;
  can_like: boolean;
  can_reply_privately: boolean;
  comment_count: number;
  message: string;
  message_formatted: string;
  phone: string;
  user_likes: boolean;
  created_time: Date;

  /// Đối tượng của comment: post, photo, video
  object: ObjectDataDTO;
  from: FacebookGraphUserSimpleDTO;
  comments: FacebookInnerDataListDTO<FacebookGraphCommentDTO>;
  attachment: FacebookGraphStoryAttachmentDTO;
  message_tags: Array<FacebookGraphCommentMessageTagDTO>;
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
