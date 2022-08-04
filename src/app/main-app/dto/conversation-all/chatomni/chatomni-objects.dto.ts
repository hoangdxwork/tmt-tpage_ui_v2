import { Facebook_Graph_Post } from "./chatomni-facebook-post.dto";
import { Attachments, Extras, Facebook_Graph_From, PagingTimestamp } from "./chatomni-message.dto";
import { ChatomniDataTShopPostDto } from "./chatomni-tshop-post.dto";

export interface ChatomniObjectsItemDto {
  Data: Facebook_Graph_Post;//  | ChatomniDataTShopPostDto
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
