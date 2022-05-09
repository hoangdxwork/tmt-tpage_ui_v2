export interface ConfigUOMTypeDTO {
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

export interface OdataUOMTypeDTO {
    "@odata.context": string;
    "@odata.count": number;
    value: ConfigUOMTypeDTO[];
}

export interface ConfigOriginCountryDTO {
    Id: number;
    Name: string;
    Code: string;
    NameNoSign: string;
    Note: string;
    DateCreated: Date;
    LastUpdated?: any;
}

export interface OdataOriginCountryDTO {
    "@odata.context": string;
    "@odata.count": number;
    value: ConfigOriginCountryDTO[];
}