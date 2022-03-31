export interface MailTemplateDTO {
  id: string;
  name: string;
  postId: string;
  crmTeamId?: number;
  messageId: string;
}

export interface MailTemplateUpdateDTO {
  Name: string;
  BodyPlain: string;
  TypeId: string;
  Active: boolean;
}
