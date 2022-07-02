export interface HistoryChatDTO {
    OrderId: string;
    OrderCode: string;
    FSOrderId: number;
    Number?: any;
    psid: string;
    LiveCampaignId?: any;
    PartnerId: number;
    Message: string;
    IsSuccess: boolean;
    ErrorMessage: string;
    DateCreated: Date;
}

export interface orderHistoryChatDTO {
    Total: number;
    Datas: HistoryChatDTO[];
}

export interface paramsHistoryChatDTO{
    liveCampaignId?: string;
    orderId?: string;
    partnerId?: string;
    skip?: number;
    take?: number;
}