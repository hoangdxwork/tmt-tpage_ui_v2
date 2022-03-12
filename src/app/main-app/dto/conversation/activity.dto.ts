import { CRMTeamDTO } from '../team/team.dto';

export class CRMActivityCampaignDTO {
  public cRMTeamId?: number;
  public details: Array<CRMActivityDTO>;
  public string: string;
  public mailTemplateId?: number;

  constructor() {
    this.details = new Array<CRMActivityDTO>();
  }
}

export class CRMActivityDTO {
  public crmTeamId?: number;
  public crmTeam: CRMTeamDTO;
  public facebook_ASId: string;
  public facebook_CommentId: string;
  public facebook_PostId: string;
  public facebook_UserId: string;
  public facebook_UserName: string;
  public matchingId: string;
  public message: string;
  public partnerId?: number;
  public typeId: ActivityType;
}

export enum ActivityType {
  All = -1,
  General = 0,
  Comment = 1,
  Message = 2,
  Mail = 3,
  SMS = 4,
  Call = 5,
  Meeting = 6,
  Reaction = 7,
}
