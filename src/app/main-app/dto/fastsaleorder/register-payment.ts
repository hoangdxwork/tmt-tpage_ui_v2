export interface City {
    name: string;
    nameNoSign?: any;
    code: string;
}

export interface District {
    name: string;
    nameNoSign?: any;
    code: string;
    cityName?: any;
    cityCode?: any;
}

export interface Ward {
    name: string;
    nameNoSign?: any;
    code: string;
    cityName?: any;
    cityCode?: any;
    districtName?: any;
    districtCode?: any;
}

export interface Journal {
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
    Description: string;
}


export interface Partner {
    Id: number;
    Name: string;
    DisplayName: string;
    Street: string;
    Website?: any;
    Phone: string;
    PhoneReport?: any;
    Mobile?: any;
    Fax?: any;
    Email?: any;
    Supplier: boolean;
    Customer: boolean;
    IsContact?: any;
    IsCompany: boolean;
    CompanyId?: any;
    Ref: string;
    Comment?: any;
    UserId?: any;
    Active: boolean;
    Employee: boolean;
    TaxCode?: any;
    ParentId?: any;
    PurchaseCurrencyId?: any;
    Credit: number;
    Debit: number;
    TitleId?: any;
    Function?: any;
    Type: string;
    CompanyType: string;
    AccountReceivableId?: any;
    AccountPayableId?: any;
    StockCustomerId?: any;
    StockSupplierId?: any;
    Barcode?: any;
    OverCredit: boolean;
    CreditLimit: number;
    PropertyProductPricelistId?: any;
    Zalo?: any;
    Facebook?: any;
    FacebookId?: any;
    FacebookASIds?: any;
    FacebookPSId?: any;
    Image?: any;
    ImageUrl?: any;
    LastUpdated?: any;
    LoyaltyPoints?: any;
    Discount: number;
    AmountDiscount: number;
    PartnerCategoryId?: any;
    PartnerCategoryName?: any;
    NameNoSign?: any;
    PropertyPaymentTermId?: any;
    PropertySupplierPaymentTermId?: any;
    CategoryId: number;
    DateCreated: Date;
    BirthDay?: any;
    DepositAmount?: any;
    Status: string;
    StatusText: string;
    StatusStyle?: any;
    ZaloUserId?: any;
    ZaloUserName?: any;
    CityCode?: any;
    CityName?: any;
    DistrictCode?: any;
    DistrictName?: any;
    WardCode?: any;
    WardName?: any;
    Ward_District_City: string;
    City: City;
    District: District;
    Ward: Ward;
}

export interface RegisterPayment {
    Id: number;
    PaymentDate: Date;
    Communication: string;
    JournalId: number;
    CurrencyId: number;
    PartnerType: string;
    Amount: number;
    PaymentType: string;
    PartnerId: number;
    PaymentMethodId: number;
    FastSaleOrderIds: number[];
    FastPurchaseOrderIds: any[];
    Partner: Partner;
    Journal: Journal;
}