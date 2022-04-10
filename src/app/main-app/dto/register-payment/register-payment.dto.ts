export interface AccountJournalPaymentDTO {
  Id: number;
  Code: string;
  Name: string;
  Type: string;
  TypeGet: string;
  UpdatePosted: boolean;
  CurrencyId?: any;
  DefaultDebitAccountId: number;
  DefaultCreditAccountId: number;
  CompanyId: number;
  CompanyName: string;
  JournalUser: boolean;
  ProfitAccountId?: any;
  LossAccountId?: any;
  AmountAuthorizedDiff?: any;
  MerchantId?: any;
  MerchantCode?: any;
  DedicatedRefund: boolean;
}

export interface ODataAccountJournalPaymentDTO {
  "@odata.context": string;
  value: AccountJournalPaymentDTO[];
}
