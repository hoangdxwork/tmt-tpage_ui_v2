export interface ChildChatOmniChannelDto {
  Id: number;
  Name: string;
  OwnerId: string;
  ChannelId: string;
  ChannelAvatar?: any;
  ChannelUrl?: any;
  ZaloOAId?: any;
  ZaloSecretKey?: any;
  Active?: any;
  CompanyId?: any;
  Type: CRMTeamType;
  Facebook_UserId?: any;
  Facebook_ASUserId?: any;
  Facebook_UserName?: any;
  Facebook_UserAvatar?: any;
  Facebook_UserCover?: any;
  Facebook_UserToken?: any;
  Facebook_UserPrivateToken?: any;
  Facebook_PageId?: any;
  Facebook_PageName?: any;
  Facebook_PageLogo?: any;
  Facebook_PageCover?: any;
  Facebook_PageToken?: any;
  IsDefault: boolean;
  IsConverted: boolean;
  Facebook_TokenExpired?: any;
  Facebook_Configs?: any;
  Childs: any[];
  Users?: any;
  Facebook_TypeId: number;
  ParentId: number;
}

export interface ChatOmniChannelDto {
  Id: number;
  Name: string;
  OwnerId: string;
  OwnerToken?: any;
  OwnerAvatar: string;
  OwnerUrl?: any;
  ChannelId?: any;
  ChannelToken?: any;
  ChannelAvatar?: any;
  ShopToken?: any;
  Active?: any;
  CompanyId?: any;
  Type: CRMTeamType;
  CountPage: number;
  CountGroup: number;
  Facebook_UserId?: any;
  Facebook_ASUserId?: any;
  Facebook_UserName?: any;
  Facebook_UserAvatar?: any;
  Facebook_UserCover?: any;
  Facebook_UserToken?: any;
  Facebook_UserPrivateToken?: any;
  Facebook_UserPrivateToken2?: any;
  Facebook_PagePrivateToken?: any;
  Facebook_PageId?: any;
  Facebook_PageName?: any;
  Facebook_PageLogo?: any;
  Facebook_PageCover?: any;
  Facebook_PageToken?: any;
  Facebook_Link?: any;
  IsDefault: boolean;
  IsConverted: boolean;
  Facebook_TokenExpired?: any;
  Facebook_TypeId: number;
  ParentId?: any;
  ParentName?: any;
  Facebook_Configs?: any;
  Childs: ChildChatOmniChannelDto[];
  ShopId?: any;
  Facebook_AccountId?: any;
}

export enum CRMTeamType {
  _Facebook = "Facebook",
  _Zalo = "Zalo",
  _TShop = "TShop",
  _TUser = "TUser",
  _Lazada = "Lazada",
  _Shopee = "Shopee",
  _TikTok = "TikTok",
  _UnofficialTikTok = "UnofficialTikTok"
}
