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
    type: fastSaleOrderSaveType;
    orders: CommentOrderDTO[];
}

export interface CommentOrderDTO {
    id: string;
    index: number;
    code: string;
}


export enum fastSaleOrderSaveType {
    create = "create", // khi tạo đơn hàng insertFromPost 
    remove = "remove", // khi lưu createFastSaleOrder
}
