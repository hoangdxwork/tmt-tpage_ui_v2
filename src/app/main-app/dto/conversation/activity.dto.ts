import { CRMTeamDTO } from '../team/team.dto';

export interface CRMActivityCampaignDTO {
  crmTeamId?: number;
  details: Array<CRMActivityDTO>;
  string: string;
  mailTemplateId?: number;
}

export interface CRMActivityDTO {
  crmTeamId?: number;
  crmTeam: CRMTeamDTO;
  facebook_ASId: string;
  facebook_CommentId: string;
  facebook_PostId: string;
  facebook_UserId: string;
  facebook_UserName: string;
  matchingId: string;
  message: string;
  partnerId?: number;
  typeId: ActivityType;
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
