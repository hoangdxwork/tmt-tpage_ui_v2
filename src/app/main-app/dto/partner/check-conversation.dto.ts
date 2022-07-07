import { SaleOnline_OrderDTO } from "../saleonlineorder/sale-online-order.dto";

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
  DisplayName?: any;
  Street?: any;
  Website?: any;
  Addresses: any[];
  Phone?: any;
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
  PurchaseCurrency?: any;
  Credit: number;
  Debit: number;
  TitleId?: any;
  Title?: any;
  Function?: any;
  Type: string;
  CompanyType: string;
  Childs: any[];
  Categories: any[];
  AccountReceivableId?: any;
  AccountReceivable?: any;
  AccountPayableId?: any;
  AccountPayable?: any;
  StockCustomerId?: any;
  StockCustomer?: any;
  StockSupplierId?: any;
  StockSupplier?: any;
  City?: any;
  District?: any;
  Ward?: any;
  Barcode?: any;
  OverCredit: boolean;
  CreditLimit: number;
  PropertyProductPricelistId?: any;
  PropertyProductPricelist?: any;
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
  CategoryNames: string;
  PartnerCategoryId?: any;
  PartnerCategoryName?: any;
  NameNoSign?: any;
  PropertyPaymentTerm?: any;
  PropertyPaymentTermId?: any;
  PropertySupplierPaymentTerm?: any;
  PropertySupplierPaymentTermId?: any;
  CategoryId: number;
  DateCreated: Date;
  BirthDay?: any;
  DepositAmount?: any;
  Status: number;
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
  FullAddress: string;
  Ward_District_City: string;
}

export interface ConversationLastOrderDetailDTO {
  Id: string;
  Quantity: number;
  Price: number;
  ProductId: number;
  ProductName: string;
  ProductNameGet: string;
  ProductCode?: any;
  UOMId: number;
  UOMName: string;
  Note: string;
  Factor: number;
  OrderId?: any;
  Priority: number;
  ImageUrl: string;
  LiveCampaign_DetailId?: any;
  IsOrderPriority?: any;
  QuantityRegex?: any;
}

export interface User {
  Avatar?: any;
  Email?: any;
  Name: string;
  Id: string;
  UserName?: any;
  PasswordNew?: any;
  CompanyId: number;
  Company?: any;
  CompanyName?: any;
  Image?: any;
  Subffix?: any;
  Companies: any[];
  Active: boolean;
  Modules: any[];
  Groups: any[];
  Barcode?: any;
  PosSecurityPin?: any;
  GroupRefs: any[];
  Roles?: any;
  UserShifts?: any;
  CRMTeam_Users: any[];
  InGroupPartnerManager: boolean;
  PartnerId?: any;
  LastUpdated?: any;
  Functions: any[];
  Fields: any[];
  PhoneNumber?: any;
}

export interface CheckConversationData {
  Id: number;
  Name: string;
  Ref: string;
  Phone: string;
  PhoneReport: boolean;
  Status: number;
  StatusText: string;
  Email?: any;
  Street: string;
  Facebook_UserPhone: string;
  Facebook_UserAddress: string;
  Facebook_ASUserId: string;
  Facebook_UserName: string;
  City: City;
  District: District;
  Ward: Ward;
  LastOrder: SaleOnline_OrderDTO;
  Comment?: any;
}

export interface CheckConversationDTO {
  Success: boolean;
  Data: CheckConversationData;
}
