export interface ProductShopCartDto {
    Id: number;
    NameTemplate: string;
    NameGet: string;
    Name: string;
    NameNoSign: string;
    SaleOK: boolean;
    PurchaseOK: boolean;
    Active: boolean;
    DefaultCode: string;
    EAN13?: any;
    IsCombo: boolean;
    AvailableInPOS: boolean;
    ProductTmplId: number;
    Price: number;
    ListPrice: number;
    Barcode: string;
    ImageUrl: string;
    NameTemplateNoSign: string;
    Variant_TeamId: number;
    UOMId: number;
    UOMName: string;
    ShopQuantity: number;
    DateCreated: Date;
    LastUpdated?: any;
}

export interface OdataProductShopCartDto {
    "@odata.context": string;
    "@odata.count": number;
    value: ProductShopCartDto[];
}