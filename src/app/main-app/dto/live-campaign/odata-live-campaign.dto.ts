export interface LiveCampaignProductDTO {
  Id: string;
  Index: number;
  Quantity: number;
  RemainQuantity: number;
  ScanQuantity: number;
  UsedQuantity: number;
  Price: number;
  Note?: any;
  LiveCampaign_Id?: any;
  ProductId: number;
  ProductName: string;
  ProductNameGet?: any;
  UOMId: number;
  UOMName: string;
  Tags: string;
  LimitedQuantity: number;
  ProductCode: string;
  ImageUrl: string;
  IsActive: boolean;
}

export interface User {
  Avatar?: any;
  Email?: any;
  Name: string;
  Id: string;
  UserName?: any;
  PasswordNew?: any;
  CompanyId: number;
  CompanyName?: any;
  Image?: any;
  Subffix?: any;
  Active: boolean;
  Barcode?: any;
  PosSecurityPin?: any;
  GroupRefs: any[];
  InGroupPartnerManager: boolean;
  PartnerId?: any;
  LastUpdated?: any;
  Functions: any[];
  Fields: any[];
  PhoneNumber?: any;
  Roles: any[];
}

export interface PreliminaryTemplate {
  Id: number;
  Name: string;
  EmailFrom?: any;
  PartnerTo?: any;
  Subject?: any;
  SubjectHtml?: any;
  BodyHtml?: any;
  BodyPlain?: any;
  AdvancedTemplate?: any;
  ReportName?: any;
  Model?: any;
  AutoDelete: boolean;
  IsDefaultForOrder: boolean;
  IsDefaultForBill: boolean;
  IsSystemTemplate?: any;
  TypeId: string;
  TypeName?: any;
  Active: boolean;
  DateCreated: Date;
}

export interface ConfirmedOrderTemplate {
  Id: number;
  Name: string;
  EmailFrom?: any;
  PartnerTo?: any;
  Subject?: any;
  SubjectHtml?: any;
  BodyHtml?: any;
  BodyPlain?: any;
  AdvancedTemplate?: any;
  ReportName?: any;
  Model?: any;
  AutoDelete: boolean;
  IsDefaultForOrder: boolean;
  IsDefaultForBill: boolean;
  IsSystemTemplate?: any;
  TypeId: string;
  TypeName?: any;
  Active: boolean;
  DateCreated: Date;
}

export interface LiveCampaignDTO {
  Id: string | undefined;
  Name: string;
  NameNoSign: string;
  Facebook_UserId: string;
  Facebook_UserName: string;
  Facebook_UserAvatar?: any;
  Facebook_LiveId: string;
  Note?: any;
  IsActive: boolean;
  DateCreated: Date;
  ResumeTime: number;
  StartDate: Date;
  EndDate: Date;
  ConfirmedOrder_TemplateId?: any;
  Preliminary_TemplateId?: any;
  Config: string;
  ShowConfig: string;
  MinAmountDeposit: number;
  MaxAmountDepositRequired: number;
  EnableQuantityHandling: boolean;
  IsAssignToUserNotAllowed: boolean;
  SumQtyInCart: number;
  SumQtyWaitCheckOut: number;
  SumQtyCheckOut: number;
  SumCancelCheckout: number;
  SumOrderWaitCheckOut: number;
  SumOrderCheckOut: number;
  SumOrderCancelCheckOut: number;
  IsShift: boolean;
  IsEnableAuto: boolean;
  Details: LiveCampaignProductDTO[];
  Users: User[];
  Preliminary_Template: PreliminaryTemplate;
  ConfirmedOrder_Template: ConfirmedOrderTemplate;
}

export interface ODataLiveCampaignDTO {
  "@odata.context"?: string;
  Id: string | undefined;
  Name: string;
  NameNoSign: string;
  Facebook_UserId: string;
  Facebook_UserName: string;
  Facebook_UserAvatar?: any;
  Facebook_LiveId: string;
  Note?: any;
  IsActive: boolean;
  DateCreated: Date;
  ResumeTime: number;
  StartDate: Date;
  EndDate: Date;
  ConfirmedOrder_TemplateId?: any;
  Preliminary_TemplateId?: any;
  Config: string;
  ShowConfig: string;
  MinAmountDeposit: number;
  MaxAmountDepositRequired: number;
  EnableQuantityHandling: boolean;
  IsAssignToUserNotAllowed: boolean;
  SumQtyInCart: number;
  SumQtyWaitCheckOut: number;
  SumQtyCheckOut: number;
  SumCancelCheckout: number;
  SumOrderWaitCheckOut: number;
  SumOrderCheckOut: number;
  SumOrderCancelCheckOut: number;
  IsShift: boolean;
  IsEnableAuto: boolean;
  Details: LiveCampaignProductDTO[];
  Users: User[];
  Preliminary_Template: PreliminaryTemplate;
  ConfirmedOrder_Template: ConfirmedOrderTemplate;
}