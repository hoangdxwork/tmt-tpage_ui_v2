
  export interface LiveCampaignSimpleDetail {
    Id: string | any;
    Index: number;
    Quantity: number;
    RemainQuantity: number;
    ScanQuantity: number;
    QuantityCanceled: number;
    UsedQuantity: number;
    Price: number;
    Note?: any;
    ProductId: number;
    LiveCampaign_Id?: any;
    ProductName: string;
    ProductNameGet?: any;
    UOMId: number;
    UOMName: string;
    Tags: string | any;
    LimitedQuantity: number;
    ProductCode: string;
    ImageUrl: string;
    IsActive: boolean;
    ProductTmlpId: number;

    // 2 field không dùng để lưu
    TagWithAttributes?: any;
    AttributeValues?: any[];
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

export interface LiveCampaignSimpleDto {
  Id: string | any;
  Name: string;
  NameNoSign?: any;
  Facebook_UserId: string;
  Facebook_UserName: string;
  Facebook_UserAvatar?: any;
  Facebook_LiveId?: any;
  Note?: any;
  IsActive: boolean;
  DateCreated: Date | any;
  ResumeTime: number;
  StartDate: Date | any;
  EndDate: Date | any;
  ConfirmedOrder_TemplateId?: any;
  Preliminary_TemplateId?: any;
  Config: string;
  ShowConfig: string;
  MinAmountDeposit: number;
  MaxAmountDepositRequired: number;
  EnableQuantityHandling: boolean;
  IsAssignToUserNotAllowed?: any;
  SumQtyInCart: number;
  SumQtyWaitCheckOut: number;
  SumQtyCheckOut: number;
  SumCancelCheckout: number;
  SumOrderWaitCheckOut: number;
  SumOrderCheckOut: number;
  SumOrderCancelCheckOut: number;
  IsShift?: any;
  IsEnableAuto: boolean;
  Details: LiveCampaignSimpleDetail[];
  Users: any[];
  Preliminary_Template: PreliminaryTemplate;
  ConfirmedOrder_Template: ConfirmedOrderTemplate;
}

