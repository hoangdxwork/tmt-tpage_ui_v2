export interface  MapInvoiceNumberCommentDTO {
    PartnerId: number,
    LiveCampaignId: string,
    Data: Data
}


export interface Data {
    Number: string,
    Id: number,
}

export interface MapOrderCodeCommentDTO {
    id: string;
    asuid: string;
    uid: string;
    LiveCampaignId: string,
    type: string;
    orders: CommentOrderDTO[];
}

export interface CommentOrderDTO {
    id: string;
    index: number;
    code: string;
}
  
