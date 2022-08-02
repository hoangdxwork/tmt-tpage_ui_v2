import { Attachments, Extras, Facebook_Graph_From, PagingTimestamp } from "./chatomni-message.dto";
import { ChatomniDataTShopPostDto } from "./chatomni-tshop-post.dto";

export interface ChatomniObjectsItemDto {
  Data: any; //ObjectsFacebookPostDto | ChatomniDataTShopPostDto;
  Id: string;
  ObjectId: string;
  ObjectType: ChatomniObjectTypeDto;
  CreatedTime: Date;
  ChannelCreatedTime: Date;
  ChannelUpdatedTime?: any;
  Title?: any;
  Description: string;
  Thumbnail?: { Url: string; };
}

export interface ChatomniObjectsDto {
  Items: ChatomniObjectsItemDto[];
  Extras?: Extras;
  Paging: PagingTimestamp;
}

export enum ChatomniObjectTypeDto {
  FacebookPost = 0, // Text normal
  FacebookVideo = 1,
  FacebookLiveVideo = 2,
  FacebookPhoto = 3,
  FacebookAlbum = 4,
  TShopPost = 11,
  TShopVideo = 12,
  TShopLiveVideo = 13,
  TShopPhoto = 14,
  TShopAlbum = 15,
}

export interface ObjectsFacebookPostDto {
  from: Facebook_Graph_From ;
  id: string;
  parent_id: string;
  updated_time: Date | any;
  picture: string;
  permalink_url: string;
  object_id: string;
  attachments: Attachments;
  story: string;
  caption: string;
  created_time: Date | any;
  description: string;
  full_picture: string;
  message: string;
  type: string;
  status_type: string;
}
