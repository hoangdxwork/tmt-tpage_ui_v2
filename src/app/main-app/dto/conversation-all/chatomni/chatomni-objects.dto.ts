import { ExtrasDto, PagingTimestamp } from './chatomni-data.dto';
import { Attachments } from './../../facebook-post/facebook-post.dto';
import { Facebook_Graph_Post } from "./chatomni-facebook-post.dto";
import { ChatomniDataTShopPostDto } from "./chatomni-tshop-post.dto";


export interface ChatomniObjectsItemDto {
  /**
   * MDB_Facebook_Mapping_PostDto | ChatomniDataTShopPostDto
   * */
  Data: MDB_Facebook_Mapping_PostDto | ChatomniDataTShopPostDto,
  Id: string;
  ObjectId: string;
  ObjectType: ChatomniObjectTypeDto;
  CreatedTime: Date | any;
  ChannelCreatedTime: Date | any;
  ChannelUpdatedTime?: Date | any;
  Title?: any;
  Description: string;
  Thumbnail?: Thumbnail;
  LiveCampaignId?: string;
  LiveCampaign?: ChatomniLiveCampaignDto;
  StatusLive?: any; // 1 đang live
}

export interface ChatomniObjectsDto {
  Items: ChatomniObjectsItemDto[];
  Extras?: ExtrasDto;
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

export interface ChatomniLiveCampaignDto {
  Id?: string;
  Name: string;
  Note: string;
}

export interface MDB_Facebook_Mapping_PostDto {
  id: string;
  parent_id : string;
  caption: string;
  description: string;
  message: string;
  story: string;
  object_id: string;
  type: string;
  status_type: string;
  created_time: Date;
  updated_time: Date;
  picture: string;
  full_picture: string;
  permalink_url: string;
  is_hidden: boolean;
  is_published : boolean;
  is_expired: boolean;
  promotable_id: string;
  promotion_status: string;
  from: From_Post;
  comments: Comments;
  reactions: Reactions;
  attachments: Attachments;
  from_id: string;
  count_comments: number;
  count_reactions: number;
  count_shares: number;
}

export interface Facebook_Inner_LiveCampaignDto{
  name: string;
  note: string;
}

export interface Reactions {
  summary: Summary2;
}

export interface Summary2 {
  total_count: number;
  viewer_reaction: string;
}

export interface Comments {
  summary: Summary;
}

export interface Summary {
  order: string;
  total_count: number;
  can_comment?: boolean;
}

export interface From_Post {
  id: string;
  name: string;
  picture: Picture;
}

export interface Picture {
  data: Data_Picture;
}

export interface Data_Picture {
  height: number;
  is_silhouette: boolean;
  url: string;
  width: number;
}

export interface Thumbnail {
  Width: number;
  Height: number;
  Url: string;
}
