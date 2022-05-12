import { DeliveryCarrierDTO } from 'src/app/main-app/dto/carrier/delivery-carrier.dto';
import { CompanyDTO } from 'src/app/main-app/dto/company/company.dto';
import { AccountTaxDTO, AccountDTO, AccountJournalDTO } from './../account/account.dto';
import { PartnerDTO } from "../partner/partner.dto";
import { Product_PriceListDTO } from "../product/product.dto";
import { ApplicationUserDTO } from '../account/application-user.dto';
import { StockWarehouseDTO } from '../product/warehouse.dto';
import { FastSaleOrderLineDTO } from '../fastsaleorder/fastsaleorder.dto';
import { SaleCouponProgramDTO } from '../configs/sale-coupon-program.dto';

export interface ODataFastSaleOrderDTO {
    "@odata.context"?: string,
    "@odata.count"?: number;
    value: Array<FastSaleOrderDTO>
}

export interface FastSaleOrderDTO {
    ShowState: string;
    ShowShipStatus: string;
    TrackingUrl: string;
    FullAddress: string;
    Tags: string;
    ReferenceNumber?: any;
    HasTag: string;
    Id: number;
    Name?: any;
    PartnerId: number;
    PartnerDisplayName: string;
    PartnerFacebookId: string;
    Address: string;
    Phone: string;
    IsPendingApprovalCOD: boolean;
    FacebookName: string;
    FacebookNameNosign: string;
    FacebookId: string;
    DisplayFacebookName: string;
    Deliver: string;
    AmountTotal: number;
    UserId: string;
    UserName: string;
    DateInvoice: Date;
    State: string;
    CompanyId: number;
    Comment: string;
    Residual: number;
    Type: string;
    RefundOrderId?: any;
    Number: string;
    PartnerNameNoSign: string;
    DeliveryPrice: number;
    CarrierId?: number;
    CarrierName: string;
    CashOnDelivery: number;
    TrackingRef: string;
    ShipStatus: string;
    CarrierDeliveryType: string;
    WardName: string;
    DistrictName: string;
    CityName: string;
    CityCode?: any;
    WeightTotal: number;
    ShipWeight: number;
    AmountTax: number;
    AmountUntaxed: number;
    Discount?: number;
    DiscountAmount: number;
    DecreaseAmount?: number;
    ShipPaymentStatus: string;
    CompanyName: string;
    Ship_Receiver_Name: string;
    Ship_Receiver_Phone: string;
    Ship_Receiver_Street: string;
    AmountDeposit: number;
    CustomerDeliveryPrice?: number;
    CreatedById: string;
    DeliveryNote: string;
    PartnerEmail: string;
    IsPrintCustom?: boolean;
    WarehouseId: number;
    WarehouseName: string;
    PaymentJournalId: number;
    PaymentJournalName: string;
    PrintShipCount: number;
    PrintDeliveryCount: number;
    PaymentMessageCount: number;
    IsRefund?: boolean;
    InvoiceReference?: any;
    CreateByName: string;
    DateCreated: Date;
    Reference?: any;
    CRMTeamId?: number;
    CRMTeamName: string;
    SaleOnlineIds: string[];
    Partner: PartnerDTO;
    PartnerName: string;
}

export interface FastSaleOrderSummaryStatusDTO {
  Type: string;
  Total: number;
}

export interface FastSaleOrderRestDTO {
  Id: number;

  Name: string;
  PrintShipCount?: number;
  PrintDeliveryCount?: number;
  PaymentMessageCount?: number;

  PartnerId: number;
  Partner: PartnerDTO;
  PartnerDisplayName: string;
  PartnerEmail: string;
  PartnerFacebookId: string;
  PartnerFacebook: string;
  PartnerFacebookLink: string;
  PartnerPhone: string;
  Reference: string;
  PriceListId: number;
  PriceList: Product_PriceListDTO;

  AmountTotal?: number;
  TotalQuantity: number;
  Discount?: number;
  DiscountAmount?: number;
  DecreaseAmount?: number;
  WeightTotal?: number;
  AmountTax?: number;
  AmountUntaxed?: number;
  TaxId?: number;
  Tax: AccountTaxDTO;

  UserId: string;
  User: ApplicationUserDTO;
  UserName: string;
  DateInvoice?: Date;
  DateCreated?: Date;
  State: string;
  ShowState: string;

  CompanyId: number;
  Company: CompanyDTO;
  Comment: string;
  WarehouseId: number;
  Warehouse: StockWarehouseDTO;

  OrderLines: FastSaleOrderLineDTO [];
  SaleCouponProgram: SaleCouponProgramDTO[];
  SaleOnlineIds: string[];
  SaleOnlineNames: string[];

  Residual?: number;

  Type: string;
  RefundOrderId?: number;
  ReferenceNumber: string;
  RefundOrder: FastSaleOrderDTO;

  AccountId: number;
  Account: AccountDTO;

  JournalId: number;
  Journal: AccountJournalDTO;

  Number: string;
  PartnerNameNoSign: string;
  DeliveryPrice?: number;
  CustomerDeliveryPrice?: number;

  CarrierId?: number;
  Carrier: DeliveryCarrierDTO;
  CarrierName: string;
  CarrierDeliveryType: string;
  DeliveryNote: string;

  ReceiverName: string;
  ReceiverPhone: string;
  ReceiverAddress: string;

  HistoryDeliveryDetails: HistoryDeliveryStatusDetailDTO[];
  ReceiverDate?: Date;
  ReceiverNote: string;

  CashOnDelivery?: number;

  TrackingRef: string;
  TrackingArea: string;
  TrackingUrl: string;
}

export interface HistoryDeliveryStatusDetailDTO {
  Id: number;
  OrderCode: string;
  ShipCode: string;
  OrderAmount: number;
  ShipAmount: number;
  Note: string;
  HistoryId: number;
  IsSuccess: boolean;
  CustomerDeliveryPrice?: number;
  OrderId?: number;
  DeliveryPrice?: number;
  Status: string;
  Date?: Date;
  CarrierName: string;
  DateOrder?: Date;
  State: string;
  ShowState: string;
}
