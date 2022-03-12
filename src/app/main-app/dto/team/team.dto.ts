import { ApplicationUserDTO } from '../account/application-user.dto';
import { CompanyDTO } from '../company/company.dto';

export class CRMTeam_UserDTO {
  public id: number;
  public crmTeamId: number;
  public userId: string;
  public applicationUsers: Array<ApplicationUserDTO>;
  public facebook_PageId: string;
  public facebook_PageName: string;
  public facebook_PageLogo: string;
}

export class CRMTeamDTO {
  public name: string;
  public active?: boolean;
  public companyId?: number;
  public company: CompanyDTO;

  // Dùng để phân loại: Zalo, Lazada, Shopee
  public type: string;
  public shopId: string;
  public shopToken: string;
  public facebook_UserId: string;

  // ASId
  public facebook_ASUserId: string;
  public facebook_UserName: string;
  public facebook_UserAvatar: string;
  public facebook_UserCover: string;

  // Token dài hạn
  public facebook_UserToken: string;
  public facebook_UserPrivateToken: string;
  public facebook_UserPrivateToken2: string;
  public facebook_PagePrivateToken: string;
  public facebook_PageId: string;
  public facebook_PageName: string;
  public facebook_PageImage: string;

  // Token dài hạn
  public facebook_PageToken: string;
  public facebook_PageLogo: string;
  public facebook_PageCover: string;
  public facebook_StrConfigs: string;

  // Cấu hình mặc định cho bài live
  public facebook_StrPostConfigs: string;

  // Link fanpage, group...
  public facebook_Link: string;
  public facebook_TokenExpired?: Date;
  public facebook_TypeId: Facebook_Type;
  public isDefault: boolean;
  public team_Users: Array<CRMTeam_UserDTO>;
  public parentId?: number;
  public parent: CRMTeamDTO;
  public childs: Array<CRMTeamDTO>;
  public _extraProperties: string;
}

export enum Facebook_Type {
  User = 0,
  Page = 1,
  Group = 2,
}
