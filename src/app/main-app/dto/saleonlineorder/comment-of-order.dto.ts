
// export interface From {
//   id: string;
//   name: string;
//   uid?: any;
// }

// export interface CommentsOfOrderDTO {
//   id: string;
//   parent?: any;
//   is_hidden: boolean;
//   can_hide: boolean;
//   can_remove: boolean;
//   can_like: boolean;
//   can_reply_privately: boolean;
//   comment_count: number;
//   message: string;
//   user_likes: boolean;
//   created_time: Date;
//   object: Object;
//   from: From;
//   comments?: any;
//   attachment?: any;
//   message_tags?: any;
// }


  export interface UserBadge {
      type: string;
      name?: any;
      displayType: number;
      url: string;
  }

  export interface UserDetails {
      createTime: string;
      bioDescription: string;
      profilePictureUrls: string[];
  }

  export interface FollowInfo {
      followingCount: number;
      followerCount: number;
      followStatus: number;
      pushStatus: number;
  }

  export interface Data {
      comment: string;
      userId: string;
      secUid: string;
      uniqueId: string;
      nickname: string;
      profilePictureUrl: string;
      rollowRole: number;
      userBadges: UserBadge[];
      userDetails: UserDetails;
      followInfo: FollowInfo;
      isModerator: boolean;
      isNewGifter: boolean;
      isSubscriber: boolean;
      topGifterRank: number;
      msgId: string;
      createTime: string;
      connectionId: any;
      roomId: string;
      ownerUserId: string;
  }

  export interface CommentsOfOrderDTO {
      Data: Data;
      Id: string;
      ObjectId: string;
      ParentId?: any;
      Message: string;
      MessageFormatted?: any;
      NlpEntities: any[];
      Source?: any;
      Type: number;
      UserId: string;
      Error?: any;
      Status: number;
      IsSystem: boolean;
      IsOwner: boolean;
      CreatedById?: any;
      CreatedBy?: any;
      CreatedTime: Date;
      ChannelCreatedTime: Date;
      ChannelUpdatedTime?: any;
      Attachments?: any;
      Order?: any;
  }

  export interface RootObject {
      ObjectIds: string[];
      LiveCampaignId?: any;
      Items: CommentsOfOrderDTO[];
  }
