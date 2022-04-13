export interface City {
  name: string;
  nameNoSign?: any;
  code: any;
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
  code: any;
  cityName?: any;
  cityCode?: any;
  districtName?: any;
  districtCode?: any;
}

export interface Category {
  Id: number;
  Name: string;
  ParentId?: any;
  CompleteName: string;
  Active: boolean;
  ParentLeft?: any;
  ParentRight?: any;
  Discount: number;
}

export interface AccountPayable {
  Id: number;
  Name: string;
  Code: string;
  UserTypeId: number;
  UserTypeName?: any;
  Active: boolean;
  Note?: any;
  CompanyId: number;
  CompanyName?: any;
  CurrencyId?: any;
  InternalType?: any;
  NameGet: string;
  Reconcile: boolean;
}

export interface AccountReceivable {
  Id: number;
  Name: string;
  Code: string;
  UserTypeId: number;
  UserTypeName?: any;
  Active: boolean;
  Note?: any;
  CompanyId: number;
  CompanyName?: any;
  CurrencyId?: any;
  InternalType?: any;
  NameGet: string;
  Reconcile: boolean;
}

export interface PropertyProductPricelist {
  Id: number;
  Name: string;
  CurrencyId: number;
  CurrencyName: string;
  Active: boolean;
  CompanyId: number;
  PartnerCateName?: any;
  Sequence: number;
  DateStart?: any;
  DateEnd?: any;
}

export interface AddressesV2 {
  Id: number;
  PartnerId: number;
  CityCode: string;
  CityName: string;
  DistrictCode: string;
  DistrictName: string;
  WardCode: string;
  WardName: string;
  IsDefault?: any;
  Street: string;
  Address: string;
}

export interface PartnerDetailDTO {
  Id: number;
  Name: string;
  DisplayName: string;
  Street: string;
  Website: string;
  Phone: string;
  PhoneReport?: any;
  Mobile?: any;
  Fax?: any;
  Email: string;
  Supplier: boolean;
  Customer: boolean;
  IsContact?: any;
  IsCompany: boolean;
  CompanyId: number;
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
  Zalo: string;
  Facebook: string;
  FacebookId: string;
  FacebookASIds?: any;
  FacebookPSId?: any;
  Image?: any;
  ImageUrl: string;
  LastUpdated: Date;
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
  BirthDay: Date;
  DepositAmount?: any;
  Status: string;
  StatusText: string;
  StatusStyle?: any;
  ZaloUserId?: any;
  ZaloUserName?: any;
  CityCode: string;
  CityName: string;
  DistrictCode: string;
  DistrictName: string;
  WardCode: string;
  WardName: string;
  City: City;
  District: District;
  Ward: Ward;
  PurchaseCurrency?: any;
  Categories: Category[];
  AccountPayable: AccountPayable;
  AccountReceivable: AccountReceivable;
  StockCustomer?: any;
  StockSupplier?: any;
  Title?: any;
  PropertyProductPricelist: PropertyProductPricelist;
  PropertySupplierPaymentTerm?: any;
  PropertyPaymentTerm?: any;
  Addresses: AddressesV2[];
}
