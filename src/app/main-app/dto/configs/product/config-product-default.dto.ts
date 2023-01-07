import { ProductComboDto } from "@app/dto/product/product-combo.dto";
import { WallPicturesDTO } from "../../attachment/wall-pictures.dto";

export interface ConfigUOM {
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

export interface ConfigCateg {
    Id: number;
    Name: string;
    CompleteName: string;
    ParentId?: any;
    ParentCompleteName?: any;
    ParentLeft?: any;
    ParentRight?: any;
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

export interface ConfigUOMPO {
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

export interface UOMLine {
    Id: number;
    ProductTmplId: number;
    ProductTmplListPrice: number;
    UOMId: number;
    TemplateUOMFactor: number;
    ListPrice: number;
    Barcode: string;
    Price?: any;
    ProductId: number;
    UOMName: string;
    NameGet?: any;
    Factor: number;
    UOM: ConfigUOM;
}

export interface ConfigAttributeLine {
    Attribute: ConfigAttribute;
    Values: ConfigAttributeValue[];
    AttributeId: number;
}

export interface ConfigAttribute {
    Id: number;
    Name: string;
    Code: string;
    Sequence: number;
    CreateVariant: boolean;
}

export interface ConfigAttributeValue {
    Id: number;
    Name: string;
    Code: string;
    Sequence?: any;
    AttributeId: number;
    AttributeName: string;
    PriceExtra?: any;
    NameGet?: any;
}

export interface ConfigProductVariant {
    Id: number;
    EAN13?: any;
    DefaultCode: string;
    NameTemplate?: any;
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
    ImageUrl: string;
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
    NameTemplateNoSign?: any;
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
    DateCreated: Date;
    UOM?: any;
    Categ?: any;
    UOMPO?: any;
    POSCateg?: any;
    AttributeValues: ConfigAttributeValue[];
    OrderTag?: any;
}

export interface ConfigProductDefaultDTO {
    Id: number;
    Name: string;
    NameNoSign: string;
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
    UOMName: string;
    UOMPOId: number;
    UOMPOName: string;
    UOSId?: any;
    IsProductVariant: boolean;
    EAN13?: any;
    DefaultCode: string;
    QtyAvailable: number;
    VirtualAvailable: number;
    OutgoingQty: number;
    IncomingQty: number;
    PropertyCostMethod?: any;
    CategId: number;
    CategCompleteName: string;
    CategName: string;
    Weight: number;
    Tracking: string;
    DescriptionPurchase?: any;
    DescriptionSale?: any;
    CompanyId: number;
    NameGet: string;
    PropertyStockProductionId?: any;
    SaleDelay: number;
    InvoicePolicy: string;
    PurchaseMethod: string;
    PropertyValuation?: any;
    Valuation?: any;
    AvailableInPOS: boolean;
    POSCategId?: any;
    CostMethod?: any;
    Barcode: string;
    Image: string;
    ImageUrl: string;
    ProductVariantCount: number;
    LastUpdated: Date;
    UOMCategId?: any;
    BOMCount: number;
    Volume: number;
    CategNameNoSign: string;
    UOMNameNoSign?: any;
    UOMPONameNoSign?: any;
    IsCombo: boolean;
    EnableAll: boolean;
    ComboPurchased?: any;
    Version: number;
    VariantFirstId: number;
    VariantFistId?: any;
    ZaloProductId?: any;
    CompanyName: string;
    CompanyNameNoSign?: any;
    DateCreated: Date;
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
    CreatedByName: string;
    UOM: ConfigUOM;
    UOMCateg?: any;
    Categ: ConfigCateg;
    UOMPO: ConfigUOMPO;
    POSCateg?: any;
    Taxes: any[];
    SupplierTaxes: any[];
    Product_Teams: any[];
    Images: any[];
    UOMView?: any;
    Distributor?: any;
    Importer?: any;
    Producer?: any;
    OriginCountry?: any;
    ProductVariants: ConfigProductVariant[];
    AttributeLines: ConfigAttributeLine[];
    Items: any[];
    UOMLines: UOMLine[];
    ComboProducts: ProductComboDto[];
    ProductSupplierInfos: any[];
    OrderTag: any;
}

export interface ConfigSuggestVariants {
    Id: number;
    Name: string;
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
    UOM: ConfigUOM;
    Categ: ConfigCateg;
    UOMPO: ConfigUOMPO;
    AttributeLines: ConfigAttributeLine[];
    Items: any[];
    UOMLines: any[];
    ComboProducts: any[];
    ProductSupplierInfos: any[];
}
