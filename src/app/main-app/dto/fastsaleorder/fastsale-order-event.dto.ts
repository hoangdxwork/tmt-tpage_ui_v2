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
    liveCampaignId: string,
    type: SO_OrderType;
    orders: CommentOrderDTO[];
}

export interface CommentOrderDTO {
    id: string;
    index: number;
    code: string;
}


export enum SO_OrderType {
    _create = "create", // khi tạo đơn hàng insertFromPost
    _remove = "remove", // khi lưu createFastSaleOrder
}
