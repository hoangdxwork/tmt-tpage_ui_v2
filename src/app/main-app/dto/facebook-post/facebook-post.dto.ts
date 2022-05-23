import { PartnerDTO } from "../partner/partner.dto";
import { SaleOnline_OrderDTO } from "../saleonlineorder/sale-online-order.dto";

export interface Data {
  height: number;
  is_silhouette: boolean;
  url: string;
  width: number;
}

export interface Picture {
  data: Data;
}

export interface From {
  id: string;
  name: string;
  picture: Picture;
}

export interface Image {
  height: number;
  src: string;
  width: number;
}

export interface Media {
  image: Image;
  source: string;
}

export interface Image2 {
  height: number;
  src: string;
  width: number;
}

export interface Media2 {
  image: Image2;
  source?: any;
}

export interface Target {
  id: string;
  url: string;
}

export interface Datum2 {
  media: Media2;
  subattachments?: any;
  target: Target;
  title?: any;
  type: string;
  url: string;
}

export interface Subattachments {
  data: Datum2[];
  paging?: any;
}

export interface Target2 {
  id: string;
  url: string;
}

export interface Datum {
  media: Media;
  subattachments: Subattachments;
  target: Target2;
  title: string;
  type: string;
  url: string;
}

export interface Attachments {
  data: Datum[];
  paging?: any;
}

export interface Summary {
  order?: any;
  total_count: number;
  can_comment: boolean;
  scanned_time?: any;
}

export interface Comments {
  summary: Summary;
}

export interface Summary2 {
  total_count: number;
  viewer_reaction?: any;
  scanned_time?: any;
}

export interface Reactions {
  summary: Summary2;
}

export interface LiveCampaign {
  name: string;
  note: string;
  id: string;
}

export interface FacebookPostItem {
  DateCreated: Date;
  LastUpdated: Date;
  account_id: string;
  fbid: string;
  parent_id?: any;
  caption?: any;
  description?: any;
  message: string;
  story: string;
  object_id?: any;
  type?: any;
  is_hidden: boolean;
  is_published: boolean;
  is_expired: boolean;
  promotable_id?: any;
  promotion_status?: any;
  status_type: string;
  created_time: Date;
  updated_time: Date;
  picture: string;
  full_picture: string;
  permalink_url: string;
  from: From;
  attachments: Attachments;
  from_id?: any;
  count_comments: number;
  count_reactions: number;
  count_shares: number;
  comments: Comments;
  reactions: Reactions;
  shares?: any;
  live_campaign_id: string;
  live_campaign: LiveCampaign;
}

export interface FacebookPostDTO {
  Items: FacebookPostItem[];
  Extras?: any;
  PageIndex: number;
  PageSize: number;
  TotalCount: number;
  TotalPages: number;
  NextPage: string;
  PreviousPage?: any;
  HasPreviousPage: boolean;
  HasNextPage: boolean;
}

export interface CheckFacebookIdDTO {
  orders: SaleOnline_OrderDTO[];
  customers: PartnerDTO[];
  success: boolean;
  uid?: any;
}
