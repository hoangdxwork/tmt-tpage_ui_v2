import { TDSSafeAny } from 'tds-ui/shared/utility';
import { ApplicationUserDTO } from '../account/application-user.dto';
import { ShipProviderCreateChatbotDTO } from '../carrier/delivery-carrier.dto';
import { CompanyDTO } from '../company/company.dto';

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
  Id:TDSSafeAny;
  Name: string;
  Active?: boolean;
  CompanyId?: number;
  Company: CompanyDTO;

  // Dùng để phân loại: Zalo, Lazada, Shopee
  Type: string;
  FhopId: string;
  FhopToken: string;
  Facebook_UserId: string;

  // ASId
  Facebook_ASUserId: string;
  Facebook_UserName: string;
  Facebook_UserAvatar: string;
  Facebook_UserCover: string;

  // Token dài hạn
  Facebook_UserToken: string;
  Facebook_UserPrivateToken: string;
  Facebook_UserPrivateToken2: string;
  Facebook_PagePrivateToken: string;
  Facebook_PageId: string;
  Facebook_PageName: string;
  Facebook_PageImage: string;

  // Token dài hạn
  Facebook_PageToken: string;
  Facebook_PageLogo: string;
  Facebook_PageCover: string;
  Facebook_StrConfigs: string;

  // Cấu hình mặc định cho bài live
  Facebook_StrPostConfigs: string;

  // Link fanpage, group...
  Facebook_Link: string;
  Facebook_TokenExpired?: Date;
  Facebook_TypeId: Facebook_Type;
  IsDefault: boolean;
  Team_Users: Array<CRMTeam_UserDTO>;
  ParentId?: number;
  Parent: CRMTeamDTO;
  Childs: Array<CRMTeamDTO>;
  Users: Array<ApplicationUserDTO>;
  _extraProperties: string;
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

export enum Facebook_Type {
  User = 0,
  Page = 1,
  Group = 2,
}
