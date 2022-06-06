export interface FacebookMappingPostDTO {
  DateCreated: Date;
  picture: string;
  live_campaign_id?: string;
  caption: string;
  story: string;
  message: string;
  type: string;
  /// Số bình luận
  count_comments: number;
  /// Số like
  count_reactions: number;
  /// Số lượt chia sẻ
  count_shares: number;
  created_time: Date;
  updated_time?: Date;
  status_type: string;
  permalink_url: string;
  fbid: string;
  page_id: string;
  page_name: string;
}
