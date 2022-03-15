import { CompanyDTO } from '../company/company.dto';

export interface AccountDTO {
  id: number;
  name: string;
  code: string;
  userTypeId: number;
  userType: AccountTypeDTO;
  userTypeName: string;
  active?: boolean;
  note: string;
  companyId: number;
  Company: CompanyDTO;
  companyName: string;
  currencyId: number;
  internalType: string;
  nameGet: string;
  reconcile?: boolean;
}

export interface AccountTypeDTO {
  id: number;
  name: string;
  type: string;
  note: string;
}

export interface AccountJournalDTO {
  id: number;
  code: string;
  name: string;
  type: string;

  typeGet: string;

  updatePosted?: boolean;
  currencyId?: number;

  defaultDebitAccountId?: number;
  defaultDebitAccount: AccountDTO;

  defaultCreditAccountId?: number;
  defaultCreditAccount: AccountDTO;

  inboundPaymentMethods: Array<AccountPaymentDTO>;
  outboundPaymentMethods: Array<AccountPaymentDTO>;

  companyId: number;
  company: CompanyDTO;
  companyName: string;
  journalUser?: boolean;

  profitAccountId?: number;
  profitAccount: AccountDTO;

  lossAccountId?: number;
  lossAccount: AccountDTO;

  amountAuthorizedDiff?: number;
  merchantId: string;
  merchantCode: string;

  // Xác định có nên dùng riêng mã phát sinh trả hàng
  dedicatedRefund?: boolean;
}

export interface AccountPaymentDTO {
  id: number;
  name: string;
  code: string;
  paymentType: string;
}

export interface AccountTaxDTO {
  id: number;

  name: string;
  // purchase, sale
  typeTaxUse: string;
  showTypeTaxUse: string;

  amountType: string;
  active?: boolean;
  sequence: number;
  amount: number;
  accountId?: number;
  account: AccountDTO;
  refundAccountId?: number;
  refundAccount: AccountDTO;

  // Check this if the price you use on the product and invoices includes this tax.
  priceInclude?: boolean;

  // Label on Invoices
  description: string;

  companyId: number;
  companyName: string;
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
