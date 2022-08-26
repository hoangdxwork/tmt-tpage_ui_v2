export interface LiveCampaignModel {
  Id: string;
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
  StartDate?: Date;
  EndDate?: Date;
  ConfirmedOrder_TemplateId?: any;
  Preliminary_TemplateId?: any;
  Config: string;
  ShowConfig: string;
  MinAmountDeposit: number;
  MaxAmountDepositRequired: number;
  IsEnableAuto: boolean;
  EnableQuantityHandling?: any;
  IsAssignToUserNotAllowed?: any;
  SumQtyInCart: number;
  SumQtyWaitCheckOut: number;
  SumQtyCheckOut: number;
  SumCancelCheckout: number;
  SumOrderWaitCheckOut: number;
  SumOrderCheckOut: number;
  SumOrderCancelCheckOut: number;
  Users: any[],
  Details: any[],
  IsShift?: any;
}

export interface ODataLiveCampaignModelDTO {
  '@odata.context': string;
  '@odata.count': number;
  value: LiveCampaignModel[];
}