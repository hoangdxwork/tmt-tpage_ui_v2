import { ApplicationUserDTO } from "../account/application-user.dto";
import { MailTemplateDTO } from "../mailtemplate/mail-template.dto";
import { SaleOnlineFacebookPostDTO, SaleOnline_Order_DetailDTO } from "../saleonlineorder/sale-online-order.dto";

export interface LiveCampaign_SimpleDataDTO {
  LiveCampaign: SaleOnline_LiveCampaignDTO;
  Details: LiveCampaignDetailDataDTO[];
}

export interface SaleOnline_LiveCampaignDTO {
  Id?: string;
  Name?: string;
  NameNoSign?: string;
  Facebook_UserId?: string;
  Facebook_UserName?: string;
  Facebook_UserAvatar?: string;
  Facebook_LiveId?: string;
  Note?: string;
  IsActive: boolean;
  DateCreated: Date;
  Facebook_Post?: SaleOnlineFacebookPostDTO;
  Details: SaleOnlineLiveCampaignDetailDTO[];
  ResumeTime?: number;
  StartDate?: Date;
  EndDate?: Date;
  ConfirmedOrder_TemplateId?: number;
  ConfirmedOrder_Template?: MailTemplateDTO;
  Preliminary_TemplateId?: number;
  Preliminary_Template?: MailTemplateDTO;
  LiveCampaign_Users?: ApplicationUserDTO;
  Users: ApplicationUserDTO[];
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
  // IsShift?: any;
}

export interface SaleOnlineLiveCampaignDetailDTO {
  Id: string;
  Index: number;
  Quantity?: number;
  RemainQuantity: number;
  ScanQuantity: number;
  RemainRealQuantity: number;
  UsedQuantity: number;
  Price: number;
  Note: string;
  ProductId?: number;
  ProductName: string;
  ProductNameGet: string;
  UOMId?: number;
  UOMName: string;
  Tags: string;
  LimitedQuantity: number;
  ProductCode: string;
  ImageUrl: string;
  IsActive: boolean;
}

export interface LiveCampaignDetailDataDTO {
  Id: string;
  Index: number;
  Quantity?: number;
  RemainQuantity: number;
  UsedQuantity: number;
  Price: number;
  Note: string;
  ProductId?: number;
  ProductName: string;
  ProductNameGet: string;
  UOMId?: number;
  UOMName: string;
  Tags: string;
  LimitedQuantity: number;
  ProductCode: string;
  ProductTemplateName: string;
  AttributeValues: ProductAttributeValueSimpleDTO[];
}

export interface ProductAttributeValueSimpleDTO {
  Id: number;
  Name: string;
  NameGet: string;
}

export interface UpdateFacebookLiveCampaignDTO {
  action: string;
  model: SaleOnline_LiveCampaignDTO;
}
