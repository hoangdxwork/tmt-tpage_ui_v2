import { PartnerDTO } from './../partner/partner.dto';
import { AccountJournalDTO } from './../account/account.dto';


export interface AccountRegisterPaymentDTO { // /odata/AccountRegisterPayment/OdataService.OnchangeJournal (input, output) & /odata/AccountRegisterPayment (POST)
  id: number;
  paymentDate: Date;
  communication: string;

  journalId: number;
  journal: AccountJournalDTO;

  currencyId: number;
  partnerType: string;
  amount: number;
  paymentType: string;

  partnerId: number;
  partner: PartnerDTO;

  paymentMethodId: number;

  fastSaleOrderIds: Array<number>;
  fastPurchaseOrderIds: Array<number>;
}

export interface QueryGetInvoiceByShipPaymentDTO { // /rest/v1.0/fastsaleorder/group_invoice_byshippayment
  partnerId: number;
  type: string;
  startDate: Date;
  endDate: Date;
  skip: number;
  limit: number;
  innerText: string;
}
