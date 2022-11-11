export interface LiveCampaignCheckoutDataDto {
  LiveCampaign_DetailId: string;
  LiveCampaignId: string;
  Quantity: number;
  ProductId: number;
  ProductUOMId: number;
}

export interface SocketLiveCampaignCheckoutDto {
  Type: string;
  Message: string;
  Data: LiveCampaignCheckoutDataDto;
  EventName: string;
}
