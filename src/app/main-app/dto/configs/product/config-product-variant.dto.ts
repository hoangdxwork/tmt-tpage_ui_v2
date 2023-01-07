export interface AttributeLineDto {
    Id?: number;
    ProductTmplId?: number;
    AttributeId: number;
    Attribute: AttributeDto;
    Values: AttributeValueDto[];
}

export interface AttributeDto {
    Id: number;
    Name: string;
    Code: string;
    Sequence: number;
    CreateVariant: boolean;
}

export interface AttributeValueDto {
    Id: number;
    Name: string;
    Code?: any;
    Sequence?: any;
    AttributeId: number;
    AttributeName: string;
    PriceExtra?: any;
    NameGet: string;
}

export interface ProductVariantDto {
    Id: number;
    EAN13?: any;
    DefaultCode?: any;
    NameTemplate: string;
    NameNoSign?: any;
    ProductTmplId: number;
    UOMId: number;
    UOMName?: any;
    UOMPOId: number;
    QtyAvailable: number;
    VirtualAvailable: number;
    OutgoingQty?: any;
    IncomingQty?: any;
    NameGet: string;
    POSCategId?: any;
    Price?: any;
    Barcode?: any;
    Image?: any;
    ImageUrl?: any;
    PriceVariant: number;
    SaleOK: boolean;
    PurchaseOK: boolean;
    DisplayAttributeValues?: any;
    LstPrice: number;
    Active: boolean;
    ListPrice: number;
    PurchasePrice?: any;
    DiscountSale?: any;
    DiscountPurchase?: any;
    StandardPrice: number;
    Weight: number;
    Volume?: any;
    OldPrice?: any;
    IsDiscount: boolean;
    ProductTmplEnableAll: boolean;
    Version: number;
    Description?: any;
    LastUpdated?: any;
    Type: string;
    CategId: number;
    CostMethod?: any;
    InvoicePolicy: string;
    Variant_TeamId: number;
    Name: string;
    PropertyCostMethod?: any;
    PropertyValuation?: any;
    PurchaseMethod: string;
    SaleDelay: number;
    Tracking?: any;
    Valuation?: any;
    AvailableInPOS: boolean;
    CompanyId?: any;
    IsCombo?: any;
    NameTemplateNoSign: string;
    TaxesIds: any[];
    StockValue?: any;
    SaleValue?: any;
    PosSalesCount?: any;
    Factor?: any;
    CategName?: any;
    AmountTotal?: any;
    NameCombos: any[];
    RewardName?: any;
    Product_UOMId?: any;
    Tags?: any;
    DateCreated?: any;
    InitInventory: number;
    OrderTag?: any;
    CreatedById?: any;
    Error?: any;
    AttributeValues: AttributeValueDto[];
}