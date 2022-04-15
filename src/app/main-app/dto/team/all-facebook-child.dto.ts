export interface Child {
  Id: number;
  Name: string;
  ZaloOAId?: any;
  ZaloSecretKey?: any;
  Active: boolean;
  CompanyId?: any;
  Type?: any;
  Facebook_UserId: string;
  Facebook_ASUserId: string;
  Facebook_UserName: string;
  Facebook_UserAvatar: string;
  Facebook_UserCover?: any;
  Facebook_UserToken: string;
  Facebook_UserPrivateToken?: any;
  Facebook_PageId: string;
  Facebook_PageName: string;
  Facebook_PageLogo: string;
  Facebook_PageCover?: any;
  Facebook_PageToken: string;
  IsDefault: boolean;
  IsConverted: boolean;
  Facebook_TokenExpired?: any;
  Facebook_TypeId: string;
  ParentId: number;
  Facebook_Configs?: any;
}

export interface AllFacebookChildTO {
  Id: number;
  Name: string;
  ShopToken?: any;
  Active: boolean;
  CompanyId?: any;
  Type?: any;
  CountPage: number;
  CountGroup: number;
  Facebook_UserId: string;
  Facebook_ASUserId: string;
  Facebook_UserName: string;
  Facebook_UserAvatar: string;
  Facebook_UserCover?: any;
  Facebook_UserToken: string;
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
  Facebook_TypeId: string;
  ParentId?: any;
  ParentName?: any;
  ShopId?: any;
  Facebook_Configs?: any;
  Childs: Child[];
}

export interface ODataAllFacebookChildTO {
  "@odata.context": string;
  value: AllFacebookChildTO[];
}
