export interface AccountRegisterPayment {
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
    MerchantId: string;
    MerchantCode?: any;
    DedicatedRefund: boolean;
    Description: string;
}

export interface OdataAccountRegisterPayment {
    "@odata.context": string;
    value: AccountRegisterPayment[];
}
