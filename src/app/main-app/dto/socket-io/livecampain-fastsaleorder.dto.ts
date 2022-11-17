export interface SocketLiveCampaignFastSaleOrderDto {
  Type: string;
  Message: string;
  Data: LiveCampaignFastSaleOrderDataDto;
  EventName: string;
}

export interface LiveCampaignFastSaleOrderDataDto {
  FastSaleOrderId: number;
  LiveCampaignId: string;
  PartnerId: number;
  PartnerName: string;
  Number: string;
}

