import { Attachments } from './chatomni-data.dto';

export interface Facebook_Graph_Post {
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
  IsGraph: boolean;
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
