import { TDSSafeAny } from 'tds-ui/shared/utility';
import { ApplicationUserDTO } from '../account/application-user.dto';
import { ShipProviderCreateChatbotDTO } from '../carrier/delivery-carrier.dto';
import { CompanyDTO } from '../company/company.dto';
import { CRMTeamType } from './chatomni-channel.dto';

export interface CRMTeam_UserDTO {
  Id: number;
  CRMTeamId: number;
  UserId: string;
  ApplicationUsers: Array<ApplicationUserDTO>;
  Facebook_PageId: string;
  Facebook_PageName: string;
  Facebook_PageLogo: string;
}

export interface CRMTeamDTO {

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
  Childs?: CRMTeamDTO[];
  ShopId?: any;
  Facebook_AccountId?: any;

  ChannelUrl?: any;
  ZaloOAId?: any;
  ZaloSecretKey?: any;
  Users?: CRMTeam_UserDTO[];
}

export interface UpdateGrantPermissionDTO {
  CRMTeamId: number,
  UserId: string
}

export interface TPosAppMongoDBFacebookDTO {
  id: string;
  host: string;
  DateCreated: Date;
  LastUpdated?: Date;
  FacebookId: string;
  FacebookToken: string;
  FacebookName: string;
  FacebookAvatar: string;
  FacebookCover: string;
  FacebookLink: string;
  CallbackUrl: string;
  IsExpired: boolean;
  IsEnableChatbot: boolean;
  ChatbotToken: string;
  FacebookType: Facebook_Type;
}

export interface InputCreateChatbotDTO {
  Name: string;
  Facebook_PageId: string;
  Address: string;
  ShipProvider: ShipProviderCreateChatbotDTO[];
  Category: string;
  CompanyId: number;
  Phone: string;
}

export interface VerifyTeamDto {
  FacebookId: string;
  FacebookName: string;
  FacebookAvatar: string;
  Token: string;
}

export interface FaebookVerifyDataDto {
  Id: number;
  Name: string;
  OwnerId?: any;
  OwnerToken?: any;
  OwnerAvatar?: any;
  OwnerUrl?: any;
  ChannelId?: any;
  ChannelToken?: any;
  ChannelAvatar?: any;
  ShopToken?: any;
  Active?: any;
  CompanyId?: any;
  Type?: any;
  CountPage: number;
  CountGroup: number;
  Facebook_UserId: string;
  Facebook_ASUserId: string;
  Facebook_UserName: string;
  Facebook_UserAvatar?: any;
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
  Facebook_TypeId: number;
  ParentId?: any;
  ParentName?: any;
  Facebook_Configs?: any;
  Childs: any[];
  ShopId?: any;
  Facebook_AccountId: string;
  DateCreated?: any;
}

export interface FacebookVerifyResultDto {
  IsAddRequired: boolean;
  Data: FaebookVerifyDataDto;
}

export enum Facebook_Type {
  User = 0,
  Page = 1,
  Group = 2,
}
