export interface GetLineOrderDTO {
  Id: string;
  Quantity: number;
  Price: number;
  ProductId: number;
  ProductName: string;
  ProductNameGet: string;
  ProductCode: string;
  UOMId: number;
  UOMName: string;
  Note: string;
  Factor: number;
  OrderId: string;
  Priority: number;
  ImageUrl: string;
  LiveCampaign_DetailId?: any;
  IsOrderPriority?: any;
  QuantityRegex?: any;
}
