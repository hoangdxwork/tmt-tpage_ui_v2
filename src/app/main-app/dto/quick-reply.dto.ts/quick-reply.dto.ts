export interface QuickReplyDTO {
  Id: number;
  Name: string;
  EmailFrom?: any;
  PartnerTo?: any;
  Subject: string;
  SubjectHtml?: any;
  BodyHtml: string;
  BodyPlain: string;
  AdvancedTemplate?: any;
  ReportName?: any;
  Model: string;
  AutoDelete: boolean;
  IsDefaultForOrder: boolean;
  IsDefaultForBill: boolean;
  TypeId: string;
  TypeName: string;
  Active: boolean;
  DateCreated: Date;
}

export interface CreateQuickReplyDTO {
  Active: boolean,
  AdvancedTemplate?: string,
  BodyHtml?: string
  SubjectHtml: string,
}

export interface AdvancedTemplateDTO {
  Title: string,
  SubTitle?: string,
  Url: string,
  Buttons?: ButtonsDTO[],
  Text?: string,
  TemplateType: string,
  Pages?: PagesMediaDTO[]
}

export interface ButtonsDTO {
  Title: string,
  Payload: string,
  ButtonType: string,
  Url?: string
}

export interface PagesMediaDTO{
    PageId:string,
    PageName:string,
    AttachmentId:string
}

export interface ODataQuickReplyDTO {
  "@odata.context"?: string;
  "@odata.count"?: number;
  value: QuickReplyDTO[];
}
