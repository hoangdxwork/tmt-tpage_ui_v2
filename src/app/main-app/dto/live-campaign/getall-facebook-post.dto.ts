export interface GetAllFacebookPostDTO {
  DateCreated: Date;
  picture: string;
  live_campaign_id: string;
  caption?: any;
  story: string;
  message: string;
  type?: any;
  count_comments: number;
  count_reactions: number;
  count_shares: number;
  created_time: Date;
  updated_time: Date;
  status_type: string;
  permalink_url: string;
  fbid: string;
  page_id: string;
  page_name: string;
}
