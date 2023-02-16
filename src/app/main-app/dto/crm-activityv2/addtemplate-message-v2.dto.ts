import { Picture } from './../conversation/make-activity.dto';

export interface AddTemplateMessageWithInvoiceDto {
  message: string;
  page_id: string;
  to_id: string;
  comment_id: string;
  fs_order: {
    Id: number,
    Note: string
  }
}

export interface AddTemplateMessageWithProductDto {
  message: string;
  page_id: string;
  to_id: string;
  comment_id: string;
  product: {
    Id: number,
    Name: string,
    Description: string,
    Picture: string,
    Price: number
  }
}

export interface GenerateMessagePartnersDto {
  PartnerIds: any[];
  ChannelIds: any[]; // Danh sách PartnerId (Hiện chỉ áp dụng được 1 lần 1 channel)
  ChannelType: any; //CRMTeamType
  Message: string;
}

export interface GenerateMessageObjectDto {
  ObjectId: string;
  Message: any;
  ChannelType: any; //CRMTeamType
}

