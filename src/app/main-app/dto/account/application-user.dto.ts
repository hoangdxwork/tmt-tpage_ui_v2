import { CompanyDTO } from '../company/company.dto';
import { CRMTeam_UserDTO } from '../team/team.dto';

export interface ApplicationUserDTO {
  Id: string;
  Avatar: string;
  Email: string;
  Name: string;
  UserName: string;
  PasswordNew: string;
  CompanyId: number;
  Company: CompanyDTO;
  CompanyName: string;
  Image: string;
  Subffix: string;

  Companies: Array<CompanyDTO>;
  Active?: boolean;
  Barcode: string;
  PosSecurityPin: string;

  Roles: Array<ApplicationUserRolesDTO>;
  UserShifts: Array<ApplicationUserShiftDTO>;

  CRMTeam_Users: Array<CRMTeam_UserDTO>;

  InGroupPartnerManager: boolean;
  PartnerId?: number;
  LastUpdated?: Date;
  PhoneNumber: string;

  Fields: Array<any>;
  Functions: Array<any>;
  GroupRefs: Array<any>;
  }

export interface ApplicationUserShiftDTO {
  Id: number;
  UserId: string;
  ShiftId: number;
  WorkingDay: Date;
  Shifts: Array<ShiftDTO>;
}

export interface ShiftDTO {
  id: number;
  name: string;
  fromHour: string;
  toHour: string;
}

export interface ApplicationUserRolesDTO {
  UserId: string;
  RoleId: string;
}
