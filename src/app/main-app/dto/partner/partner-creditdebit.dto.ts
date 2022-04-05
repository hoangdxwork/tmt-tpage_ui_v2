
export interface ODataCreditDebitDTO {
  "@odata.context"?: string;
  "@odata.count"?: number;
  value: Array<CreditDebitDTO>;
}

export interface CreditDebitDTO {
  Date: Date;
  JournalCode?: any;
  AccountCode?: any;
  DisplayedName: string;
  AmountResidual: number;
}
