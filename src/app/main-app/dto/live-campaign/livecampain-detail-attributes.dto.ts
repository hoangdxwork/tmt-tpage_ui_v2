
  export interface LiveCampaign {
      Id: string;
      Name: string;
      NameNoSign?: any;
      Facebook_UserId?: any;
      Facebook_UserName?: any;
      Facebook_UserAvatar?: any;
      Facebook_LiveId: string;
      Note?: any;
      IsActive: boolean;
      DateCreated: Date;
      Facebook_Post?: any;
      Details: any[];
      ResumeTime?: any;
      StartDate?: any;
      EndDate?: any;
      ConfirmedOrder_TemplateId?: any;
      ConfirmedOrder_Template?: any;
      Preliminary_TemplateId?: any;
      Preliminary_Template?: any;
      LiveCampaign_Users?: any;
      Users: any[];
      Config: number;
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
      IsShift?: any;
      IsEnableAuto?: any;
  }

  export interface LiveCampainGetWithDetailsDto {
      Id: string;
      Index: number;
      Quantity: number;
      RemainQuantity: number;
      UsedQuantity: number;
      Price: number;
      Note?: any;
      ProductId: number;
      ProductName: string;
      ProductNameGet?: any;
      UOMId: number;
      UOMName: string;
      Tags: string;
      LimitedQuantity: number;
      ProductCode: string;
      ProductTemplateName: string;
      AttributeValues: any[];
      IsActive: boolean;
  }

  export interface LiveCampainGetWithDetailAttributesDto {
      LiveCampaign: LiveCampaign;
      Details: LiveCampainGetWithDetailsDto[];
  }


