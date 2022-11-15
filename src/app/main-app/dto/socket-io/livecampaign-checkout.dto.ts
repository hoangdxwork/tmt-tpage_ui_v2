export interface LiveCampaigntAvailableToBuyDto {
  LiveCampaign_DetailId: string;
  LiveCampaignId: string;
  QuantityAvailableToBuy: number;
  ProductId: number;
  ProductUOMId: number;
}

export interface SocketLiveCampaignAvailableToBuyDto {
  Type: string;
  Message: string;
  Data: LiveCampaigntAvailableToBuyDto;
  EventName: string;
}

export interface LiveCampaigntPendingCheckoutDto {
  LiveCampaign_DetailId: string;
  LiveCampaignId: string;
  Quantity: number;
  ProductId: number;
  ProductUOMId: number;
}

export interface SocketLiveCampaignPendingCheckoutDto {
  Type: string;
  Message: string;
  Data: LiveCampaigntAvailableToBuyDto;
  EventName: string;
}
