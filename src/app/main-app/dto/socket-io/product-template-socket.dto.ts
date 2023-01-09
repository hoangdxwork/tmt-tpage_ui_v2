
export interface DataProductSocketDto {
    Id: number;
}

export interface ProductTemplateSocketDto {
    error: boolean;
    type: string;
    action: string;
    message: string;
    enableAlert: boolean;
    enablePopup: boolean;
    data: DataProductSocketDto;
    companyId: number;
    userId: string;
}


