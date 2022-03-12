import { CompanyDTO } from '../company/company.dto';

export class AccountDTO {
  public id: number;
  public name: string;
  public code: string;
  public userTypeId: number;
  public userType: AccountTypeDTO;
  public userTypeName: string;
  public active?: boolean;
  public note: string;
  public companyId: number;
  public Company: CompanyDTO;
  public companyName: string;
  public currencyId: number;
  public internalType: string;
  public nameGet: string;
  public reconcile?: boolean;

  constructor() {
    this.active = true;
    this.reconcile = false;
  }
}

export class AccountTypeDTO {
  public id: number;
  public name: string;
  public type: string;
  public note: string;
}

export class AccountJournalDTO {
  public id: number;
  public code: string;
  public name: string;
  public type: string;

  public get typeGet(): string {
    switch (this.type) {
      case 'sale':
        return 'Bán hàng';
      case 'purchase':
        return 'Mua hàng';
      case 'cash':
        return 'Tiền mặt';
      case 'bank':
        return 'Ngân hàng';
      case 'general':
        return 'Hỗn hợp';
      default:
        return '';
    }
  }

  public set typeGet(str: string) {
    this.typeGet = str;
  }

  public updatePosted?: boolean;
  public currencyId?: number;

  public defaultDebitAccountId?: number;
  public defaultDebitAccount: AccountDTO;

  public defaultCreditAccountId?: number;
  public defaultCreditAccount: AccountDTO;

  public inboundPaymentMethods: Array<AccountPaymentDTO>;
  public outboundPaymentMethods: Array<AccountPaymentDTO>;

  public companyId: number;
  public company: CompanyDTO;
  public companyName: string;
  public journalUser?: boolean;

  public profitAccountId?: number;
  public profitAccount: AccountDTO;

  public lossAccountId?: number;
  public lossAccount: AccountDTO;

  public amountAuthorizedDiff?: number;
  public merchantId: string;
  public merchantCode: string;

  // Xác định có nên dùng riêng mã phát sinh trả hàng
  public dedicatedRefund?: boolean;

  constructor() {
    this.inboundPaymentMethods = new Array<AccountPaymentDTO>();
    this.outboundPaymentMethods = new Array<AccountPaymentDTO>();
    this.updatePosted = false;
    this.journalUser = false;
    this.amountAuthorizedDiff = 0;
    this.type = 'general';
    this.dedicatedRefund = false;
  }
}

export class AccountPaymentDTO {
  public id: number;
  public name: string;
  public code: string;
  public paymentType: string;
}

export class AccountTaxDTO {
  public id: number;

  public name: string;
  // purchase, sale
  public typeTaxUse: string;
  public get showTypeTaxUse() {
    switch (this.typeTaxUse) {
      case 'sale':
        return 'Bán hàng';
      case 'purchase':
        return 'Mua hàng';
      case 'none':
        return 'Không';
      default:
        return 'Bán hàng';
    }
  }

  public set showTypeTaxUse(str: string) {
    this.showTypeTaxUse = str;
  }

  public amountType: string;
  public active?: boolean;
  public sequence: number;
  public amount: number;
  public accountId?: number;
  public account: AccountDTO;
  public refundAccountId?: number;
  public refundAccount: AccountDTO;

  // Check this if the price you use on the product and invoices includes this tax.
  public priceInclude?: boolean;

  // Label on Invoices
  public description: string;

  public companyId: number;
  public companyName: string;

  constructor() {
    this.typeTaxUse = 'sale';
    this.active = true;
    this.amountType = 'percent';
    this.sequence = 1;
    this.priceInclude = false;
  }
}

export class AccountPaymentTermDTO {
  public Id: number;

  // Payment Terms
  public Name: string;

  // If the active field is set to False, it will allow you to hide the payment term without removing it.
  public Active?: boolean;

  // Description on the Invoice
  public Note: string;
  public Lines: Array<AccountPaymentTermLineDTO>;
  public CompanyId: number;
  public Company: CompanyDTO;
}

export class AccountPaymentTermLineDTO {
  public Id: number;

  /// Select here the kind of valuation related to this payment term line.
  public Value: string;

  /// For percent enter a ratio between 0-100.
  public ValueAmount?: number;

  /// Number of Days
  public Days: number;
  public Option: string;

  /// Gives the sequence order when displaying a list of payment term lines.
  public Sequence?: number;
}
