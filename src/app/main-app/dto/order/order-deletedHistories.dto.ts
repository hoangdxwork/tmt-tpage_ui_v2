export interface DeletedOrderDetail {
  ProductId: number;
  ProductName: string;
  UOMId: number;
  UOMName: string;
  Quantity: number;
  Price: number;
  LiveCampagnDetailId: string;
}

export interface DeletedOrderDTO {
  DateCreated: Date;
  OrderId: string;
  Code: string;
  psid: string;
  FacebookPostId: string;
  FacebookCommentId: string;
  LiveCampaignId: string;
  PartnerId: number;
  PartnerName: string;
  Address: string;
  Total: number;
  TotalQuantity: number;
  IsCancelCheckout?: boolean;
  UserId: string;
  UserName: string;
  Details: DeletedOrderDetail[];
  DeletedBy?: any;
}

export interface DeletedOrderHistoriesDTO {
  TotalCount: number;
  Orders: DeletedOrderDTO[];
}
