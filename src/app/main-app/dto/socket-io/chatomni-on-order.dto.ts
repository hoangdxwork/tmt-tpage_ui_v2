export interface OnSocketOnSaleOnline_OrderDto {
    Data: DataOrder,
    EventName: string,
    Message: string,
    Type: string, //"SaleOnline_Order"
}

export interface DataOrder{
    Id: string,
    Code: string,
    Session: number,
    SessionIndex: number,
    Facebook_PostId: string,
    Facebook_UserName: string,
    Facebook_ASUserId: string,
    Facebook_PageId: string
}
