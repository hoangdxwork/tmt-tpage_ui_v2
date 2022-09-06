import { TDSSafeAny } from 'tds-ui/shared/utility';
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
    Ref?: any;
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
    NameNoSign: string;
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
    CityCode: string;
    CityName?: any;
    DistrictCode: string;
    DistrictName?: any;
    WardCode: string;
    WardName?: any;
    City: City;
    District: District;
    Ward: Ward;
}

export interface DataErrorDefaultDTO {
    Id: string;
    Ids: any[];
    PartnerId: number;
    FacebookId?: any;
    FacebookName: string;
    Comment: string;
    ProductNote?: any;
    COD?: any;
    TotalAmount: number;
    ShipAmount: number;
    DepositAmount: number;
    ShipWeight: number;
    IsPayment: boolean;
    CarrierId?: any;
    CarrierName: string;
    SaleOnlineIds: string[];
    TimeLock?: any;
    CompanyId?: any;
    WarehouseId?: any;
    Reference: string;
    Partner: Partner;
}

export interface CreateBillDefaultErrorDTO {
    "@odata.context": string;
    Id: number;
    Success: boolean;
    Warning?: any;
    Error: string;
    Errors: any[];
    OrderId?: any;
    Ids: any[];
    IsAprove: boolean;
    DataErrorDefault?: DataErrorDefaultDTO[];
    DataErrorFast?: TDSSafeAny[];
}