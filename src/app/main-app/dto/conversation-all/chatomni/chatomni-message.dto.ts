export interface From {
  id: string;
  name: string;
  uid?: any;
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

export interface Parent {
  id: string;
}

export interface Object {
  id: string;
}

export interface ChatomniDataFacebookMessage {
  id: string;
  message: string;
  created_time: Date;
  from: From;
  to?: any;
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
  message_tags: any[];
}

export interface Item {
  Data: ChatomniDataFacebookMessage;
  Id: string;
  ObjectId: string;
  ParentId?: any;
  Message: string;
  Source?: any;
  Type: number;
  UserId: string;
  Error?: any;
  Status: number;
  IsSystem: boolean;
  CreatedById?: any;
  CreatedBy?: any;
  CreatedTime: Date;
  ChannelCreatedTime: Date;
  ChannelUpdatedTime?: any;
}

export interface PagingTimestamp {
  Next: string;
  HasNext: boolean;
  UrlNext: string;
}

export interface ChatomniMessageDTO {
  Items: Item[];
  Extras?: any;
  Paging: PagingTimestamp;
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
