
export interface UOM {
    Id: number;
    Name: string;
    NameNoSign?: any;
    Rounding: number;
    Active: boolean;
    Factor: number;
    FactorInv: number;
    UOMType: string;
    CategoryId: number;
    CategoryName: string;
    Description?: any;
    ShowUOMType: string;
    NameGet: string;
    ShowFactor: number;
}

export interface Categ {
    Id: number;
    Name: string;
    CompleteName: string;
    ParentId?: any;
    ParentCompleteName?: any;
    ParentLeft: number;
    ParentRight: number;
    Sequence?: any;
    Type: string;
    AccountIncomeCategId?: any;
    AccountExpenseCategId?: any;
    StockJournalId?: any;
    StockAccountInputCategId?: any;
    StockAccountOutputCategId?: any;
    StockValuationAccountId?: any;
    PropertyValuation?: any;
    PropertyCostMethod: string;
    NameNoSign: string;
    IsPos: boolean;
    Version?: any;
    IsDelete: boolean;
}

export interface UOMPO {
    Id: number;
    Name: string;
    NameNoSign?: any;
    Rounding: number;
    Active: boolean;
    Factor: number;
    FactorInv: number;
    UOMType: string;
    CategoryId: number;
    CategoryName: string;
    Description?: any;
    ShowUOMType: string;
    NameGet: string;
    ShowFactor: number;
}

export interface ProductTemplateV2DTO {
    Id: number;
    Name?: any;
    NameNoSign?: any;
    Description?: any;
    Type: string;
    ShowType: string;
    ListPrice: number;
    DiscountSale: number;
    DiscountPurchase: number;
    PurchasePrice: number;
    StandardPrice: number;
    SaleOK: boolean;
    PurchaseOK: boolean;
    Active: boolean;
    UOMId: number;
    UOMName?: any;
    UOMPOId: number;
    UOMPOName?: any;
    UOSId?: any;
    IsProductVariant: boolean;
    EAN13?: any;
    DefaultCode?: any;
    QtyAvailable: number;
    VirtualAvailable: number;
    OutgoingQty: number;
    IncomingQty: number;
    PropertyCostMethod?: any;
    CategId: number;
    CategCompleteName?: any;
    CategName?: any;
    Weight: number;
    Tracking: string;
    DescriptionPurchase?: any;
    DescriptionSale?: any;
    CompanyId: number;
    NameGet?: any;
    PropertyStockProductionId?: any;
    SaleDelay: number;
    InvoicePolicy: string;
    PurchaseMethod: string;
    PropertyValuation?: any;
    Valuation?: any;
    AvailableInPOS: boolean;
    POSCategId?: any;
    CostMethod?: any;
    Barcode?: any;
    Image?: any;
    ImageUrl?: any;
    ProductVariantCount: number;
    LastUpdated?: any;
    UOMCategId?: any;
    BOMCount: number;
    Volume?: any;
    CategNameNoSign?: any;
    UOMNameNoSign?: any;
    UOMPONameNoSign?: any;
    IsCombo: boolean;
    EnableAll: boolean;
    ComboPurchased?: any;
    Version: number;
    VariantFirstId?: any;
    VariantFistId?: any;
    ZaloProductId?: any;
    CompanyName?: any;
    CompanyNameNoSign?: any;
    DateCreated?: any;
    InitInventory: number;
    UOMViewId?: any;
    ImporterId?: any;
    ImporterName?: any;
    ImporterAddress?: any;
    ProducerId?: any;
    ProducerName?: any;
    ProducerAddress?: any;
    DistributorId?: any;
    DistributorName?: any;
    DistributorAddress?: any;
    OriginCountryId?: any;
    OriginCountryName?: any;
    InfoWarning?: any;
    Element?: any;
    YearOfManufacture?: any;
    Specifications?: any;
    Tags?: any;
    CreatedByName?: any;
    UOM: UOM;
    Categ: Categ;
    UOMPO: UOMPO;
    OrderTag: any;

    AttributeLength?: any // field này dùng để check tạo mã chiến dịch live, ko có trong db
}


