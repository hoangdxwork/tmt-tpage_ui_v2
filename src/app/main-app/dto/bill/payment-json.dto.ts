
export interface ODataPaymentJsonDTO {
  "@odata.context": string;
  value: Array<PaymentJsonDTO>;
}

export interface PaymentJsonDTO {
  Name: string;
  JournalName: string;
  Amount: number;
  Currency: string;
  Date: Date;
  PaymentId: number;
  MoveId: number;
  Ref: string;
  AccountPaymentId: number;
  PaymentPartnerType: string;
}
