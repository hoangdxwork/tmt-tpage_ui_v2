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

export interface ODataQuickReplyDTO {
  "@odata.context"?: string;
  "@odata.count"?: number;
  value: QuickReplyDTO[];
}
