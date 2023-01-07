
export interface ProductInvertoryUpdatedDto {
    Id: number;
    Qty: number;
    QtyVirtual: number;
}

export interface DataInvertoryUpdatedDto {
    warehouseId: number;
    products: ProductInvertoryUpdatedDto[];
}

export interface SoketInvertoryUpdatedDto {
    error: boolean;
    type: string;
    action: string;
    message: string;
    enableAlert: boolean;
    enablePopup: boolean;
    data: DataInvertoryUpdatedDto;
    companyId: number;
    userId?: any;
}

