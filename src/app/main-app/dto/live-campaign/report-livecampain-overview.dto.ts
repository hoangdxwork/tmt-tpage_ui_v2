
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

export interface ReportLiveCampaignDetailDTO {
  ListSaleOnlineOrder?: any;
  ListFastSaleOrder?: any;
  ImageUrl?: any;
  QueueQuantity: number;
  Id: string;
  Index: number;
  Quantity: number;
  RemainQuantity: number;
  ScanQuantity: number;
  // RemainRealQuantity: number;
  QuantityCanceled: number;
  UsedQuantity: number;
  Price: number;
  Note?: any;
  ProductId: number;
  Product?: any;
  LiveCampaign_Id?: any;
  LiveCampaign?: any;
  ProductName: string;
  ProductNameGet?: any;
  UOMId: number;
  UOM?: any;
  UOMName: string;
  Tags: string;
  LimitedQuantity: number;
  ProductCode: string;
  IsActive: boolean;
  TotalFastSaleOrder?: number;
  TotalSaleOnlineOrder?: number;
  ProductTmlpId: number;
  DateCreated: Date;

  // 2 field không dùng để lưu
  TagWithAttributes?: any;
  AttributeValues?: any[];
}

export interface OrderSummaryDTO {
  OrderQuantity: number;
  ProductQuantity: number;
  TotalAmount: number;
}

export interface BillSummaryDTO {
  OrderQuantity: number;
  ProductQuantity: number;
  TotalAmount: number;
}

export interface PaySummaryDTO {
  OrderQuantity: number;
  ProductQuantity: number;
  TotalAmount: number;
}

export interface ReportLiveCampaignDTO {
  Id: string;
  Name: string;
  Details: ReportLiveCampaignDetailDTO[];
  OrderSummary: OrderSummaryDTO;
  BillSummary: BillSummaryDTO;
  PaySummary: PaySummaryDTO;
}

export interface TotalOrderBillSummaryDTO {
  OrderQuantity: number;
  ProductQuantity: number;
  TotalAmount: number;
}

export interface OverviewReportDTO {
  OrderSummary: OrderSummaryDTO;
  BillSummary: BillSummaryDTO;
  PaySummary: PaySummaryDTO;
  TotalOrderBillSummary: TotalOrderBillSummaryDTO;
}

export interface DetailExistsDTO {
  ProductId: number;
  UOMId: number;
  Tags: string;
}

export interface SaleOnlineLiveCampaignDTO {
  TotalCount: number;
  Details: ReportLiveCampaignDetailDTO[];
}