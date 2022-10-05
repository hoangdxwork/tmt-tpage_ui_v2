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

export interface Configs {
    Id: string;
    DefaultPrinterId?: any;
    DefaultPrinterName?: any;
    DefaultPrinterTemplate: number;
    Printers: any[];
    PrinterConfigs: PrinterConfig[];
    CompanyId: number;
    CompanyName: string;
}

export interface SaleSetting_V2 {
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
    SaleNote?: any;
    AllowSaleNegative: boolean;
    GroupFastSaleDeliveryCarrier: boolean;
    GroupFastSaleShowPartnerCredit: boolean;
    GroupFastSaleShowRevenue: boolean;
    GroupFastSaleAddressFull: boolean;
    GroupSaleDisplayPromotionNote: boolean;
    SalePartnerId?: any;
    SalePartner?: any;
    GroupSaleLayout: boolean;
    DeliveryCarrierId?: any;
    DeliveryCarrier?: any;
    ProductId?: any;
    Product?: any;
    GroupSaleOnlineNote: boolean;
    GroupFastSaleReceiver: boolean;
    TaxId?: any;
    Tax?: any;
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
    Weight?: any;
    ShipAmount?: any;
    DeliveryNote?: any;
    StatusDenyPrintSale?: any;
    StatusDenyPrintShip?: any;
    GroupDenyPrintNoShippingConnection: boolean;
    GroupApplyPromotionInvoiceBySaleOnline: boolean;
    GroupAddStaffInvoiceDetail: boolean;
    GroupApplyStaffToSender: boolean;
    GroupApplyRemoveSaleOnline: boolean;
    GroupCreateMultipleRefunds: boolean;
}

export interface SaleSettingConfigDto_V2 {
    groups: string[];
    configs: Configs;
    taxes?: any;
    SaleSetting: SaleSetting_V2;
}


