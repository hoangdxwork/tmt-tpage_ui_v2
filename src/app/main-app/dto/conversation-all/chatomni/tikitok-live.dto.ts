import { ChatomniMessageType } from "./chatomni-data.dto";

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

export interface TikTokLiveItemDataDto {
    comment: string;
    userId: string;
    secUid: string;
    uniqueId: string;
    nickname: string;
    profilePictureUrl: string;
    rollowRole: number;
    userBadges: any[];
    userDetails: UserDetails;
    followInfo: FollowInfo;
    isModerator: boolean;
    isNewGifter: boolean;
    isSubscriber: boolean;
    topGifterRank?: any;
    msgId: string;
    createTime: string;
    connectionId: any;
    roomId: string;
    ownerUserId: string;
}

export interface TikTokLiveItemDto {
    Data: TikTokLiveItemDataDto;
    Id: string;
    ObjectId: string;
    ParentId?: any;
    Message: string;
    NlpEntities: any[];
    Source?: any;
    Type: ChatomniMessageType;
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
}

export interface Extras {
}

export interface Paging {
    Next: string;
    HasNext: boolean;
    UrlNext: string;
}

export interface TikTokLiveDto {
    Items: TikTokLiveItemDto[];
    Extras: Extras;
    Paging: Paging;
}


