export interface TaxDTO  {
  Id: number;
  Name: string;
  TypeTaxUse: string;
  ShowTypeTaxUse: string;
  AmountType: string;
  Active: boolean;
  Sequence: number;
  Amount: number;
  AccountId: number;
  RefundAccountId: number;
  PriceInclude: boolean;
  Description?: any;
  CompanyId: number;
  CompanyName: string;
}

export interface ODataTaxDTO {
  "@odata.context": string;
  value: TaxDTO[];
}
