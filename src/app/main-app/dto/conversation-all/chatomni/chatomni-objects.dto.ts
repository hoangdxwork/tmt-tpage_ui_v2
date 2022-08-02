import { Facebook_Graph_Post } from "./chatomni-facebook-post.dto";
import { ChatomniDataTShopPostDto } from "./chatomni-tshop-post.dto";

export interface ChatomniObjectsDetailDto {
  Data:  Facebook_Graph_Post | ChatomniDataTShopPostDto;// gán lại ChatomniDataTShopPost hoặc ChatomniDataFacebookPost
  Id: string;
  ObjectId: string;
  ObjectType: number;
  CreatedTime: Date;
  ChannelCreatedTime: Date;
  ChannelUpdatedTime?: any;
  Title?: any;
  Description: string;
  Thumbnail?:  { Url: string; };
}

export interface ChatomniObjectsDto {
  Items: ChatomniObjectsDetailDto[];
  Extras?: Extras;
  Paging: PagingTimestamp;
}
