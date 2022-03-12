import { CompanyDTO } from '../company/company.dto';
import { CRMTeam_UserDTO } from '../team/team.dto';

export class ApplicationUserDTO {
  public id: string;
  public avatar: string;
  public email: string;
  public name: string;
  public userName: string;
  public passwordNew: string;
  public companyId: number;
  public company: CompanyDTO;
  public companyName: string;
  public image: string;
  public subffix: string;

  public companies: Array<CompanyDTO>;
  public active?: boolean;
  public barcode: string;
  public posSecurityPin: string;

  public roles: Array<ApplicationUserRolesDTO>;
  public userShifts: Array<ApplicationUserShiftDTO>;

  public crmTeam_Users: Array<CRMTeam_UserDTO>;

  public inGroupPartnerManager: boolean;
  public partnerId?: number;
  public lastUpdated?: Date;
  public phoneNumber: string;
}

export class ApplicationUserShiftDTO {
  public id: number;
  public userId: string;
  public shiftId: number;
  public workingDay: Date;
  public shifts: Array<ShiftDTO>;
}

export class ShiftDTO {
  public id: number;
  public name: string;
  public fromHour: string;
  public toHour: string;
}

export class ApplicationUserRolesDTO {
  public userId: string;
  public roleId: string;
}
