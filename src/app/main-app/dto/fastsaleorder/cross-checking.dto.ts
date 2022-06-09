export interface CrossCheckingOrder {
    TrackingRef: string;
    CoDAmount: number;
    Note: string;
    ShipStatus: string;
}

export interface CrossCheckingDTO {
    datas: CrossCheckingOrder[];
    carrierId: number;
    note: string;
    payment: boolean;
    isNoteOrder: boolean;
}

export interface ExistedCrossChecking {
    IsExisted: boolean;
    COD: number;
    Message: string;
    TrackingRef: string;
}