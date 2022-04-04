import { CompanyDTO } from '../company/company.dto';

export interface AccountDTO {
  Id: number;
  Name: string;
  Code: string;
  UserTypeId: number;
  UserType: AccountTypeDTO;
  UserTypeName: string;
  Active?: boolean;
  Note: string;
  CompanyId: number;
  Company: CompanyDTO;
  CompanyName: string;
  CurrencyId: number;
  InternalType: string;
  NameGet: string;
  reconcile?: boolean;
}

export interface AccountTypeDTO {
  Id: number;
  Name: string;
  Type: string;
  Note: string;
}

export interface AccountJournalDTO {
  Id: number;
  Code: string;
  Name: string;
  Type: string;

  TypeGet: string;

  UpdatePosted?: boolean;
  CurrencyId?: number;

  DefaultDebitAccountId?: number;
  DefaultDebitAccount: AccountDTO;

  DefaultCreditAccountId?: number;
  DefaultCreditAccount: AccountDTO;

  InboundPaymentMethods: Array<AccountPaymentDTO>;
  OutboundPaymentMethods: Array<AccountPaymentDTO>;

  CompanyId: number;
  Company: CompanyDTO;
  CompanyName: string;
  JournalUser?: boolean;

  ProfitAccountId?: number;
  ProfitAccount: AccountDTO;

  LossAccountId?: number;
  LossAccount: AccountDTO;

  AmountAuthorizedDiff?: number;
  MerchantId: string;
  MerchantCode: string;

  // Xác định có nên dùng riêng mã phát sinh trả hàng
  DedicatedRefund?: boolean;
}

export interface AccountPaymentDTO {
  Id: number;
  Name: string;
  Code: string;
  PaymentType: string;
}

export interface AccountTaxDTO {
  Id: number;

  Name: string;
  // purchase, sale
  TypeTaxUse: string;
  ShowTypeTaxUse: string;

  AmountType: string;
  Active?: boolean;
  Sequence: number;
  Amount: number;
  AccountId?: number;
  Account: AccountDTO;
  RefundAccountId?: number;
  RefundAccount: AccountDTO;

  // Check this if the price you use on the product and invoices includes this tax.
  PriceInclude?: boolean;

  // Label on Invoices
  Description: string;

  CompanyId: number;
  CompanyName: string;
}

export interface AccountPaymentTermDTO {
  id: number;

  // Payment Terms
  name: string;

  // If the active field is set to False, it will allow you to hide the payment term without removing it.
  active?: boolean;

  // Description on the Invoice
  note: string;
  lines: Array<AccountPaymentTermLineDTO>;
  companyId: number;
  company: CompanyDTO;
}

export interface AccountPaymentTermLineDTO {
  id: number;

  /// Select here the kind of valuation related to this payment term line.
  value: string;

  /// For percent enter a ratio between 0-100.
  valueAmount?: number;

  /// Number of Days
  days: number;
  option: string;

  /// Gives the sequence order when displaying a list of payment term lines.
  sequence?: number;
}
