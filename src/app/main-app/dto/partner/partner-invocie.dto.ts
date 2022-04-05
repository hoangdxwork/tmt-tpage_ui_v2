
export interface ODataPartnerInvoiceDTO {
  "@odata.context"?: string,
  "@odata.count"?: number,
  value: Array<PartnerInvoiceDTO>
}

export interface PartnerInvoiceDTO {
  Id: number;
  Name?: any;
  Origin?: any;
  Type: string;
  Number: string;
  InternalNumber?: any;
  Reference?: any;
  State?: any;
  StateFast: string;
  DateInvoice: Date;
  PartnerId: number;
  PartnerDisplayName: string;
  AmountTotal: number;
  Residual?: any;
  UserId?: any;
  UserName: string;
  JournalId: number;
  AccountId: number;
  DateDue?: any;
  CurrencyId: number;
  CompanyId: number;
  ShowState: string;
  ShowType: string;
  MoveName: string;
  AmountTotalSigned: number;
  ResidualSigned?: any;
  ShowStateFast: string;
  PartnerNameNoSign?: any;
  IsFast: boolean;
  IsPurchase: boolean;
}
