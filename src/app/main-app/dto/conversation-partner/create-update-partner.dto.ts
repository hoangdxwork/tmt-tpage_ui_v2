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

export interface CreateOrUpdatePartnerModel {
  Id: number;
  Name: string;
  DisplayName?: any;
  Street: string;
  Website?: any;
  Phone: string;
  PhoneReport: boolean;
  Mobile?: any;
  Fax?: any;
  Email: string;
  Supplier: boolean;
  Customer: boolean;
  IsContact?: any;
  IsCompany: boolean;
  CompanyId?: any;
  Ref?: any;
  Comment: string;
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
  FacebookId: string;
  FacebookASIds?: any;
  FacebookPSId: string;
  Image?: any;
  ImageUrl?: any;
  LastUpdated?: any;
  LoyaltyPoints?: any;
  Discount: number;
  AmountDiscount: number;
  CategoryNames: string;
  PartnerCategoryId?: any;
  PartnerCategoryName?: any;
  NameNoSign?: any;
  PropertyPaymentTermId?: any;
  PropertySupplierPaymentTermId?: any;
  CategoryId: number;
  DateCreated: Date;
  BirthDay?: any;
  DepositAmount?: any;
  Status?: any;
  StatusText: string;
  StatusStyle: string;
  ZaloUserId?: any;
  ZaloUserName?: any;
  Ward_District_City?: any;
  CityCode?: any;
  CityName?: any;
  DistrictCode?: any;
  DistrictName?: any;
  WardCode?: any;
  WardName?: any;
  City: City;
  District: District;
  Ward: Ward;
}
