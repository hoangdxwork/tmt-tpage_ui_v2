
export interface DetailProductOrderDeteledDto {
    ProductId: number;
    ProductName: string;
    UOMId: number;
    UOMName: string;
    Quantity: number;
    Price: number;
    LiveCampagnDetailId: string;
  }
  
  export interface OrderDeteledHistoriesDto {
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
    Details: DetailProductOrderDeteledDto[];
  }
  
  export interface OrderHistoriesDto {
    TotalCount: number;
    Orders: OrderDeteledHistoriesDto[];
  }

  export interface paramsOrderDeteledHistoriesDTO{
    liveCampaignId?: string;
    skip?: number;
    take?: number;
}