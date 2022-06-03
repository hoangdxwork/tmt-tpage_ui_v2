
export interface ODataRegisterPartnerDTO {
  "@odata.context"?: string;
  Id: number;
  PaymentDate: Date;
  Communication?: any;
  Journal: any;
  JournalId: number;
  CurrencyId: number;
  PartnerType: string;
  Amount: number;
  PaymentType: string;
  PartnerId: number;
  PaymentMethodId: number;
  FastSaleOrderIds: any[];
  FastPurchaseOrderIds: any[];
  Partner: Partner;
}

export interface City {
  name?: any;
  nameNoSign?: any;
  code?: any;
}

export interface CityDTO {
  Name?: any;
  NameNoSign?: any;
  Code?: any;
}

export interface District {
  name?: any;
  nameNoSign?: any;
  code?: any;
  cityName?: any;
  cityCode?: any;
}

export interface DistrictDTO {
  Name?: any;
  NameNoSign?: any;
  Code?: any;
  CityName?: any;
  CityCode?: any;
}

export interface Ward {
  name?: any;
  nameNoSign?: any;
  code?: any;
  cityName?: any;
  cityCode?: any;
  districtName?: any;
  districtCode?: any;
}

export interface WardDTO {
  Name?: any;
  NameNoSign?: any;
  Code?: any;
  CityName?: any;
  CityCode?: any;
  DistrictName?: any;
  DistrictCode?: any;
}

export interface Partner {
  Id: number;
  Name: string;
  DisplayName: string;
  Street?: any;
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
  City: City;
  District: District;
  Ward: Ward;
}
