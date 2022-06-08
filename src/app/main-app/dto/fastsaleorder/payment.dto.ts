import { PartnerDTO } from './../partner/partner.dto';
import { AccountJournalDTO } from './../account/account.dto';


export interface AccountRegisterPaymentDTO { // /odata/AccountRegisterPayment/OdataService.OnchangeJournal (input, output) & /odata/AccountRegisterPayment (POST)
  Id: number;
  PaymentDate: Date;
  Communication: string;

  JournalId?: number;
  Journal?: AccountJournalDTO;

  CurrencyId: number;
  PartnerType: string;
  Amount: number;
  PaymentType: string;

  PartnerId: number;
  Partner: PartnerDTO;

  PaymentMethodId: number;

  FastSaleOrderIds: Array<number>;
  FastPurchaseOrderIds: Array<number>;
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
