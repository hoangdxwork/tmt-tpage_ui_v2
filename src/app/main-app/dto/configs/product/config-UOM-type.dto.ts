export interface ProductUOMTypeDto {
    Id: number;
    Name: string;
    NameNoSign: string;
    Code: string;
    Type: string;
    Address: string;
    Phone: string;
    Email: string;
    Active: boolean;
    DateCreated: Date;
    Note?: any;
}

export interface OdataUOMTypeDto {
    "@odata.context": string;
    "@odata.count": number;
    value: ProductUOMTypeDto[];
}

export interface OriginCountryDto {
    Id: number;
    Name: string;
    Code: string;
    NameNoSign: string;
    Note: string;
    DateCreated: Date;
    LastUpdated?: any;
}

export interface OdataOriginCountryDto {
    "@odata.context": string;
    "@odata.count": number;
    value: OriginCountryDto[];
}