import { TDSSafeAny } from 'tmt-tang-ui';
import { ApplicationUserDTO } from '../account/application-user.dto';
import { MailTemplateDTO } from '../mailtemplate/mail-template.dto';
import {
  SaleOnlineFacebookPostDTO,
  SaleOnline_Order_DetailDTO,
} from '../saleonlineorder/sale-online-order.dto';

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
  IsShift?: boolean;
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
  Tags: TDSSafeAny; // string
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

export interface SearchReportLiveCampaignOverviewDTO {
  Ids?: string[];
  Text: string;
  StartDate?: Date;
  EndDate?: Date;
}

export interface ReportLiveCampaignOverviewDTO {
  SumQtyInCart: number;
  SumQtyWaitCheckOut: number;
  SumQtyCheckOut: number;
  SumCancelCheckout: number;
  SumOrderWaitCheckOut: number;
  SumOrderCheckOut: number;
  SumOrderCancelCheckOut: number;
  SumAmountWaitCheckOut: number;
  SumAmountWaitingPayment: number;
  SumAmountPaid: number;
}

export interface ApproveLiveCampaignDTO {
  success: boolean;
}

export interface DetailReportLiveCampaignDTO {
  Id: string;
  Name: string;
  Details: SaleOnlineLiveCampaignDetailReportDTO[];
  OrderSummary: SaleOnlineLiveCampaignSummaryReportDTO;
  BillSummary: SaleOnlineLiveCampaignSummaryReportDTO;
  PaySummary: SaleOnlineLiveCampaignSummaryReportDTO;
}

export interface SaleOnlineLiveCampaignDetailReportDTO {
  ImageUrl: string;
  QueueQuantity: number;
  ListSaleOnlineOrder: ViewReportSaleOnlineOrderLiveCampaignDTO[];
  ListFastSaleOrder: ViewReportFastSaleOrderLiveCampaignDTO[];
  Id: string;
  /// Thứ tự dùng cho live
  Index: number;
  /// Số lượng giới hạn
  Quantity?: number;
  RemainQuantity: number;
  ScanQuantity: number;
  /// Số lượng còn lại thực tế fastsaleorder
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
  IsActive: boolean;
}

export interface ViewReportSaleOnlineOrderLiveCampaignDTO {
  Id: string;
  Quantity: number;
  ProductId: number;
  Price: number;
  OrderId?: string;
  Facebook_UserName: string;
  PartnerId: number;
  Facebook_ASUserId: string;
  TotalAmount: number;
  LiveCampaign_DetailId?: string;
  LiveCampaignId?: string;
  ImageUrl: string;
}

export interface ViewReportFastSaleOrderLiveCampaignDTO {
  Id: number;
  ProductId: number;
  PriceTotal?: number;
  OrderId?: number;
  FacebookName: string;
  PartnerId?: number;
  FacebookId: string;
  State: string;
  Type: string;
  AmountTotal: number;
  LiveCampaign_DetailId?: string;
  LiveCampaignId?: string;
  ImageUrl: string;
  ProductUOMId: number;
  ProductUOMQty: number;
  CashOnDelivery?: number;
}

export interface SaleOnlineLiveCampaignSummaryReportDTO {
  OrderQuantity?: number;
  ProductQuantity?: number;
  TotalAmount?: number;
}

export interface ReportLiveCampaignProductDataDTO {
  ProductId: number; // Server đặt có thể null
  ProductName: string;
  ProductNameNoSign: string;
  ProductQtyInCart: number;
  ProductQtyWaitCheckOut: number;
  ProductQtyCheckOut: number;
  ProductQtyCancelCheckOut: number;
  OrderQtyWaitCheckOut: number;
  OrderQtyCancelCheckOut: number;
  InvoiceQtyCheckOut: number;
  InvoiceQtyCancelCheckOut: number;
}

export interface LiveCampaignSOOrderDTO {
  OrderId?: string;
  OrderCode: string;
  TotalQuantity: number;
  DateCreated: Date;
  Status: string;
  PartnerName: string;
}

export interface LiveCampaignFSOrderDTO {
  OrderId?: string;
  FSOrderId?: number;
  FSOrderCode: string;
  TotalQuantity: number;
  DateCreated: Date;
  PartnerName: string;
  State: string;
  ShowState: string;
  /// status delete or cancel of product
  /// delete,cancel
  Status: string;
}
