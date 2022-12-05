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


