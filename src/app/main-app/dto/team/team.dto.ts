import { ApplicationUserDTO } from '../account/application-user.dto';
import { CompanyDTO } from '../company/company.dto';

export interface CRMTeam_UserDTO {
  id: number;
  crmTeamId: number;
  userId: string;
  applicationUsers: Array<ApplicationUserDTO>;
  facebook_PageId: string;
  facebook_PageName: string;
  facebook_PageLogo: string;
}

export interface CRMTeamDTO {
  name: string;
  active?: boolean;
  companyId?: number;
  company: CompanyDTO;

  // Dùng để phân loại: Zalo, Lazada, Shopee
  type: string;
  shopId: string;
  shopToken: string;
  facebook_UserId: string;

  // ASId
  facebook_ASUserId: string;
  facebook_UserName: string;
  facebook_UserAvatar: string;
  facebook_UserCover: string;

  // Token dài hạn
  facebook_UserToken: string;
  facebook_UserPrivateToken: string;
  facebook_UserPrivateToken2: string;
  facebook_PagePrivateToken: string;
  facebook_PageId: string;
  facebook_PageName: string;
  facebook_PageImage: string;

  // Token dài hạn
  facebook_PageToken: string;
  facebook_PageLogo: string;
  facebook_PageCover: string;
  facebook_StrConfigs: string;

  // Cấu hình mặc định cho bài live
  facebook_StrPostConfigs: string;

  // Link fanpage, group...
  facebook_Link: string;
  facebook_TokenExpired?: Date;
  facebook_TypeId: Facebook_Type;
  isDefault: boolean;
  team_Users: Array<CRMTeam_UserDTO>;
  parentId?: number;
  parent: CRMTeamDTO;
  childs: Array<CRMTeamDTO>;
  _extraProperties: string;
}

export enum Facebook_Type {
  User = 0,
  Page = 1,
  Group = 2,
}
