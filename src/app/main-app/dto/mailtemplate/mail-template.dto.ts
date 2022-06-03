export interface MailTemplateDTO {
  Id: string;
  Name: string;
  PostId: string;
  CRMTeamId?: number;
  MessageId: string;
}

export interface MailTemplateUpdateDTO {
  Name: string;
  BodyPlain: string;
  TypeId: string;
  Active: boolean;
}
