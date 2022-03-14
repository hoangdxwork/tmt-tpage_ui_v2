import { CompanyDTO } from '../company/company.dto';
import { CRMTeam_UserDTO } from '../team/team.dto';

export interface ApplicationUserDTO {
  id: string;
  avatar: string;
  email: string;
  name: string;
  userName: string;
  passwordNew: string;
  companyId: number;
  company: CompanyDTO;
  companyName: string;
  image: string;
  subffix: string;

  companies: Array<CompanyDTO>;
  active?: boolean;
  barcode: string;
  posSecurityPin: string;

  roles: Array<ApplicationUserRolesDTO>;
  userShifts: Array<ApplicationUserShiftDTO>;

  crmTeam_Users: Array<CRMTeam_UserDTO>;

  inGroupPartnerManager: boolean;
  partnerId?: number;
  lastUpdated?: Date;
  phoneNumber: string;
}

export interface ApplicationUserShiftDTO {
  id: number;
  userId: string;
  shiftId: number;
  workingDay: Date;
  shifts: Array<ShiftDTO>;
}

export interface ShiftDTO {
  id: number;
  name: string;
  fromHour: string;
  toHour: string;
}

export interface ApplicationUserRolesDTO {
  userId: string;
  roleId: string;
}
