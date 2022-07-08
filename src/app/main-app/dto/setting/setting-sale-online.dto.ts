import { AccountTaxDTO } from "../account/account.dto";
import { DeliveryCarrierDTO } from "../carrier/delivery-carrier.dto";
import { PartnerDTO } from "../partner/partner.dto";
import { PrinterConfigDTO, PrinterDTO, PrinterTemplateEnum } from "../print/print.dto";
import { ProductDTO } from "../product/product.dto";

export interface SaleOnlineSettingDTO { // /odata/SaleOnlineSetting
  id: number;
  enableAutoLiveErrorComment: boolean;
  enableAutoScanFacebookUId: boolean;
  enablePrintAddress: boolean;
  enablePrintComment: boolean;
  intervalTime: number;
  isDisablePrint: boolean;
  isOldest: boolean;
  isPrintMultiTimes: boolean;
  isPrintNote: boolean;
  liveErrorIntervalTime: number;
  localIP: string;
  mainExpanded: boolean;
  messageSender: string;
  postQuantityLimit: number;
  quantity: number;
  session: number;
  sessionEnable: boolean;
  sessionIndex: number;
  sessionStarted: string;
}

export interface Company_ConfigDTO {
  Id: string;
  DefaultPrinterId: string;
  DefaultPrinterName: string;
  DefaultPrinterTemplate: PrinterTemplateEnum;
  Printers: PrinterDTO[];
  PrinterConfigs: PrinterConfigDTO[];
  CompanyId: number;
  CompanyName: string;
}

export interface SaleSettingsDTO {
  Id: number;
  CompanyId: number;
  GroupUOM?: number;
  GroupDiscountPerSOLine?: number;
  GroupWeightPerSOLine?: number;
  DefaultInvoicePolicy: string;
  SalePricelistSetting: string;
  DefaultPickingPolicy?: number;
  GroupProductPricelist?: boolean;
  GroupPricelistItem?: boolean;
  GroupSalePricelist?: boolean;
  GroupCreditLimit?: number;
  GroupSaleDeliveryAddress?: number;
  GroupDelivery?: number;
  SaleNote?: string;
  AllowSaleNegative?: boolean;
  GroupFastSaleDeliveryCarrier?: boolean;
  GroupFastSaleShowPartnerCredit?: boolean;
  GroupFastSaleShowRevenue?: boolean;
  GroupFastSaleAddressFull?: boolean;
  GroupSaleDisplayPromotionNote?: boolean;
  SalePartnerId?: number;
  SalePartner?: PartnerDTO;
  GroupSaleLayout: boolean;
  DeliveryCarrierId?: number;
  DeliveryCarrier?: DeliveryCarrierDTO;
  ProductId: number;
  Product: ProductDTO;
  GroupSaleOnlineNote?: boolean;
  GroupFastSaleReceiver?: boolean;
  TaxId?: number;
  Tax?: AccountTaxDTO;
  GroupPriceRecent?: boolean;
  GroupFastSalePriceRecentFill?: boolean;
  GroupDiscountTotal?: boolean;
  GroupFastSaleTax?: boolean;
  GroupFastSaleInitCode?: boolean;
  GroupFastSaleBarcodeDisable?: boolean;
  GroupSaleDateDefault?: boolean;
  GroupAmountPaid?: boolean;
  GroupSalePromotion?: boolean;
  QuatityDecimal?: number;
  GroupSearchboxWithInventory?: boolean;
  GroupPartnerSequence?: boolean;
  GroupConfigProductImportExport?: boolean;
  GroupConfigProductDefault?: boolean;
  GroupProductSequence?: boolean;
  GroupProductSequenceBarcode?: boolean;
  Weight?: number;
  ShipAmount?: number;
  DeliveryNote: string;
  StatusDenyPrintSale: string;
  StatusDenyPrintShip: string;
  GroupDenyPrintNoShippingConnection?: boolean;
  GroupApplyPromotionInvoiceBySaleOnline?: boolean;
  GroupAddStaffInvoiceDetail?: boolean;
  GroupApplyStaffToSender?: boolean;
  GroupApplyRemoveSaleOnline?: boolean;
  GroupCreateMultipleRefunds?: boolean;
}

export interface InitSaleDTO {
  groups: string[];
  configs: Company_ConfigDTO;
  taxes?: any;
  SaleSetting: SaleSettingsDTO;
}
