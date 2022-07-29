export interface  ChatomniConversationTagDto {
  Id: string;
  Name: string;
  Icon?: any;
  ColorClass: string;
  ColorCode?: any;
  CreatedTime: Date;
}

export interface ChatomniConversationItemDto {
  Id: string;
  UserId: string;
  ConversationId: string;
  Avatar?: any;
  Name: string;
  NameUnsigned: string;
  PartnerId: number;
  CountUnread: number;
  HasPhone: boolean;
  Phone?: any;
  Email?: any;
  HasAddress: boolean;
  AssignedToId?: any;
  AssignedTo?: any;
  Tags: ChatomniConversationTagDto[];
  UpdatedTime: Date;
}

export interface PagingTimestamp {
  Next: number;
  HasNext: boolean;
  UrlNext: string;
}

export interface ChatomniConversationDto {
  Extras?: any;
  Items: ChatomniConversationItemDto[];
  Paging: PagingTimestamp;
}
