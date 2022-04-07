
export interface Others {
    Text: string;
    Key: string;
    Value: boolean;
}

export interface PrinterConfig {
    Code: string;
    Name: string;
    Template?: number;
    PrinterId?: any;
    PrinterName?: any;
    Ip: string;
    Port: string;
    Note: string;
    FontSize?: any;
    NoteHeader: string;
    IsUseCustom: boolean;
    IsPrintProxy: boolean;
    IsPrintTpos: boolean;
    Others: Others[];
}

export interface ConfigsDTO {
    Id: string;
    DefaultPrinterId?: any;
    DefaultPrinterName?: any;
    DefaultPrinterTemplate: number;
    Printers: any[];
    PrinterConfigs: PrinterConfig[];
    CompanyId: number;
    CompanyName: string;
}

export interface City {
    name: string;
    nameNoSign?: any;
    code: string;
}

export interface District {
    name?: any;
    nameNoSign?: any;
    code?: any;
    cityName?: any;
    cityCode?: any;
}

export interface Ward {
    name?: any;
    nameNoSign?: any;
    code?: any;
    cityName?: any;
    cityCode?: any;
    districtName?: any;
    districtCode?: any;
}

export interface SalePartner {
    Id: number;
    Name: string;
    DisplayName: string;
    Street: string;
    Website?: any;
    Addresses: any[];
    Phone: string;
    PhoneReport?: any;
    Mobile?: any;
    Fax?: any;
    Email: string;
    Supplier: boolean;
    Customer: boolean;
    IsContact?: any;
    IsCompany: boolean;
    CompanyId?: any;
    Ref: string;
    Comment?: any;
    UserId?: any;
    Active: boolean;
    Employee: boolean;
    TaxCode?: any;
    ParentId?: any;
    PurchaseCurrencyId?: any;
    PurchaseCurrency?: any;
    Credit: number;
    Debit: number;
    TitleId?: any;
    Title?: any;
    Function?: any;
    Type: string;
    CompanyType: string;
    Childs: any[];
    Categories: any[];
    AccountReceivableId?: any;
    AccountReceivable?: any;
    AccountPayableId?: any;
    AccountPayable?: any;
    StockCustomerId?: any;
    StockCustomer?: any;
    StockSupplierId?: any;
    StockSupplier?: any;
    City: City;
    District: District;
    Ward: Ward;
    Barcode?: any;
    OverCredit: boolean;
    CreditLimit: number;
    PropertyProductPricelistId?: any;
    PropertyProductPricelist?: any;
    Zalo?: any;
    Facebook?: any;
    FacebookId?: any;
    FacebookASIds?: any;
    FacebookPSId?: any;
    Image?: any;
    ImageUrl?: any;
    LastUpdated?: any;
    LoyaltyPoints?: any;
    Discount: number;
    AmountDiscount: number;
    CategoryNames: string;
    PartnerCategoryId?: any;
    PartnerCategoryName?: any;
    NameNoSign?: any;
    PropertyPaymentTerm?: any;
    PropertyPaymentTermId?: any;
    PropertySupplierPaymentTerm?: any;
    PropertySupplierPaymentTermId?: any;
    CategoryId: number;
    DateCreated: Date;
    BirthDay?: any;
    DepositAmount?: any;
    Status: number;
    StatusText: string;
    StatusStyle?: any;
    ZaloUserId?: any;
    ZaloUserName?: any;
    CityCode?: any;
    CityName?: any;
    DistrictCode?: any;
    DistrictName?: any;
    WardCode?: any;
    WardName?: any;
    FullAddress: string;
    Ward_District_City: string;
}

export interface Category {
    Id: number;
    Name: string;
}

export interface UOM {
    Id: number;
    Name: string;
    NameNoSign: string;
    Rounding: number;
    Active: boolean;
    Factor: number;
    FactorInv: number;
    UOMType: string;
    CategoryId: number;
    Category: Category;
    CategoryName: string;
    Description?: any;
    ShowUOMType: string;
    NameGet: string;
    ShowFactor: number;
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
    Category?: any;
    CategoryName: string;
    Description?: any;
    ShowUOMType: string;
    NameGet?: any;
    ShowFactor: number;
}

export interface Categ {
    Id: number;
    Name: string;
    CompleteName: string;
    ParentId?: any;
    Parent?: any;
    ParentCompleteName?: any;
    ParentLeft?: any;
    ParentRight?: any;
    Sequence?: any;
    Type: string;
    AccountIncomeCategId?: any;
    AccountIncomeCateg?: any;
    AccountExpenseCategId?: any;
    AccountExpenseCateg?: any;
    StockJournalId?: any;
    StockJournal?: any;
    StockAccountInputCategId?: any;
    StockAccountInputCateg?: any;
    StockAccountOutputCategId?: any;
    StockAccountOutputCateg?: any;
    StockValuationAccountId?: any;
    StockValuationAccount?: any;
    PropertyValuation?: any;
    PropertyCostMethod: string;
    Routes: any[];
    NameNoSign?: any;
    IsPos: boolean;
    Version?: any;
    IsDelete: boolean;
}

export interface Product {
    Id: number;
    EAN13?: any;
    DefaultCode: string;
    NameTemplate: string;
    NameNoSign?: any;
    ProductTmplId: number;
    ProductTmpl?: any;
    UOMId: number;
    UOM: UOM;
    UOMName: string;
    UOMPOId: number;
    UOMPO: UOMPO;
    QtyAvailable: number;
    VirtualAvailable: number;
    OutgoingQty?: any;
    IncomingQty?: any;
    NameGet: string;
    POSCategId?: any;
    POSCateg?: any;
    Price?: any;
    Barcode: string;
    Image?: any;
    Images: any[];
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
    AttributeValues: any[];
    LastUpdated?: any;
    Type: string;
    UOMLines: any[];
    CategId: number;
    Categ: Categ;
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
}

export interface Tax {
    Id: number;
    Name: string;
    TypeTaxUse: string;
    ShowTypeTaxUse: string;
    AmountType: string;
    Active: boolean;
    Sequence: number;
    Amount: number;
    AccountId: number;
    Account?: any;
    RefundAccountId: number;
    RefundAccount?: any;
    PriceInclude: boolean;
    Description?: any;
    CompanyId: number;
    CompanyName: string;
}

export interface SaleSettingDTO {
    Id: number;
    CompanyId: number;
    GroupUOM: number;
    GroupDiscountPerSOLine: number;
    GroupWeightPerSOLine: number;
    DefaultInvoicePolicy: string;
    SalePricelistSetting: string;
    DefaultPickingPolicy: number;
    GroupProductPricelist: boolean;
    GroupPricelistItem: boolean;
    GroupSalePricelist: boolean;
    GroupCreditLimit: number;
    GroupSaleDeliveryAddress: number;
    GroupDelivery: number;
    SaleNote: string;
    AllowSaleNegative: boolean;
    GroupFastSaleDeliveryCarrier: boolean;
    GroupFastSaleShowPartnerCredit: boolean;
    GroupFastSaleShowRevenue: boolean;
    GroupFastSaleAddressFull: boolean;
    GroupSaleDisplayPromotionNote: boolean;
    SalePartnerId: number;
    SalePartner: SalePartner;
    GroupSaleLayout: boolean;
    DeliveryCarrierId?: any;
    DeliveryCarrier?: any;
    ProductId: number;
    Product: Product;
    GroupSaleOnlineNote: boolean;
    GroupFastSaleReceiver: boolean;
    TaxId: number;
    Tax: Tax;
    GroupPriceRecent: boolean;
    GroupFastSalePriceRecentFill: boolean;
    GroupDiscountTotal: boolean;
    GroupFastSaleTax: boolean;
    GroupFastSaleInitCode: boolean;
    GroupFastSaleBarcodeDisable: boolean;
    GroupSaleDateDefault: boolean;
    GroupAmountPaid: boolean;
    GroupSalePromotion: boolean;
    QuatityDecimal: number;
    GroupSearchboxWithInventory: boolean;
    GroupPartnerSequence: boolean;
    GroupConfigProductImportExport: boolean;
    GroupConfigProductDefault: boolean;
    GroupProductSequence: boolean;
    GroupProductSequenceBarcode: boolean;
    Weight: number;
    ShipAmount: number;
    DeliveryNote: string;
    StatusDenyPrintSale: string;
    StatusDenyPrintShip: string;
    GroupDenyPrintNoShippingConnection: boolean;
    GroupApplyPromotionInvoiceBySaleOnline: boolean;
    GroupAddStaffInvoiceDetail: boolean;
    GroupApplyStaffToSender: boolean;
    GroupApplyRemoveSaleOnline: boolean;
    GroupCreateMultipleRefunds: boolean;
}

export interface SaleConfigsDTO {
    groups: string[];
    configs: ConfigsDTO;
    taxes?: any;
    SaleSetting: SaleSettingDTO;
}


