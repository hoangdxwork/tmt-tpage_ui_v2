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
}

export interface FastSaleOrderSummaryStatusDTO {
  Type: string;
  Total: number;
}
