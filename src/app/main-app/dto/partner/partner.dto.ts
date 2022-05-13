
export interface ODataPartnerDTO {
  "@odata.context"?: string,
  "@odata.count"?: number,
  value: Array<PartnerDTO>
}

export interface PartnerDTO {
  NameNetwork: string;
  FullAddress: string;
  Ward_District_City: string;
  Tags: string;
  Id: number;
  Name: string;
  DisplayName: string;
  Street: string;
  Website: string;
  Phone: string;
  Fax?: any;
  Email: string;
  Supplier: boolean;
  Customer: boolean;
  IsContact?: any;
  IsCompany: boolean;
  CompanyId: number;
  Ref: string;
  Comment: string;
  UserId?: any;
  Active: boolean;
  TaxCode?: any;
  Credit: number;
  Debit: number;
  Type: string;
  CompanyType: string;
  CityName: string;
  CityCode: string;
  DistrictName: string;
  DistrictCode: string;
  WardName: string;
  WardCode: string;
  Zalo: string;
  Facebook: string;
  FacebookId: string;
  FacebookASIds?: any;
  ImageUrl: string;
  LastUpdated: Date;
  LoyaltyPoints?: any;
  Discount: number;
  PartnerCategoryId?: number;
  NameNoSign: string;
  DateCreated: Date;
  BirthDay?: Date;
  Status: string;
  StatusText: string;
  ZaloUserId?: any;
  ZaloUserName?: any;
  PartnerCategoryName: string;
  CreatedByName: string;
}

export interface PartnerTitleDTO {
  Id: number;
  Name: string;
}

export interface PartnerCategoryDTO {
  Id: number;
  Name: string;
  ParentId?: number;
  Parent: PartnerCategoryDTO;
  CompleteName: string;
  Active?: boolean;
  ParentLeft?: number;
  ParentRight?: number;
  Discount?: number;
}

export interface PartnerCityDTO {
  Name: string;
  NameNoSign: string;
  Code?: number;
}

export interface PartnerDistrictDTO {
  Name: string;
  NameNoSign: string;
  Code?: number;
  CityName: string;
  CityCode?: number;
}

export interface PartnerWardDTO {
  Name: string;
  NameNoSign: string;
  Code?: number;
  CityName: string;
  CityCode?: number;
  DistrictName: string;
  DistrictCode?: number;
}

export interface PartnerStatusDTO {
  text: string;
  value: string;
}

export class ResCurrencyDTO {
  public Id?: number;
  public Name?: string;
  public Rounding?: number;
  public Symbol?: string;
  public Active?: boolean;
  public Position?: string;
  public Rate?: number;

  get decimalPlaces(): number {
    if (this.Rounding && this.Rounding > 0 && this.Rounding < 1) {
      return Math.ceil(Math.log10(1 / this.Rounding));
    }
    return 0;
  }
}

export interface ResRevenueCustomerDTO { // /odata/Partner/OdataService.GetPartnerRevenueById?key=14
  Revenue: number;
  RevenueBegan: number;
  RevenueTotal: number;
}


export interface PartnerExtDTO {
  Id: number;
  Name: string;
  NameNoSign: string;
  Code: string;
  /// Nhà sản xuất : NSX
  /// Nhà nhập khẩu: NNK
  /// Nhà phân phối: NPP
  Type: string;
  Address: string;
  Phone: string;
  Email: string;
  Active: boolean;
  DateCreated?: Date;
  Note: string;
}

export enum PartnerStatus {
  Undefined = -1, // Không xác định
  Normal = 0, // Bình thường
  Warning = 1, // Cảnh báo
  Danger = 2, // Nguy hiểm
  Bomb = 3, // Bom hàng
  Vip1 = 4, // Khách sỉ
  Primary = 5, // Vip
  Info = 6, // Thân thiết
}

export interface StatusDTO {
  value: string;
  text: string;
}

export interface MDBFacebookMappingNoteDTO {
  id: string;
  host: string;
  page_id: string;
  psid: string;
  message: string;
  DateCreated?: Date;
  LastUpdated?: Date;
  CreatedBy?: any;
}

export interface ListItemStatusDTO {
  value: string;
  text: string;
}

export interface InputReasonCannelOrderDTO {
  phone: string;
  reason: string;
  company?: string;
}

export interface MDBPhoneReportDTO {
  id: string;
  phone: string;
  host: string;
  reasons: InnerReasonReportDTO[];
  DateCreated: Date;
  LastUpdated?: Date;
}

export interface InnerReasonReportDTO {
  id: string;
  reason: string;
  host: string;
  company: string;
  un_check: boolean;
  created_time?: Date;
  last_update?: Date;
}

export interface PartnerTempDTO {
  // @odata.context: string;
  Id: number;
  Name: string;
  DisplayName: string;
  Street?: string;
  Website: string;
  Phone?: string;
  PhoneReport?: boolean;
  Mobile: string;
  Fax: string;
  Email: string;
  Supplier?: boolean;
  Customer?: boolean;
  IsContact?: boolean;
  IsCompany: boolean;
  CompanyId?: number;
  Ref: string;
  Comment: string;
  UserId: string;
  Active?: boolean;
  Employee?: boolean;
  TaxCode: string;
  ParentId?: number;
  PurchaseCurrencyId?: number;
  PurchaseCurrency: any;
  Credit?: number;
  Debit: number;
  TitleId?: number;
  Function?: string;
  Type: string;
  CompanyType: string;
  AccountReceivableId?: number;
  AccountPayableId?: number;
  StockCustomerId?: number;
  StockSupplierId?: number;
  Barcode: string;
  OverCredit: boolean;
  CreditLimit?: number;
  PropertyProductPricelistId?: number;
  Zalo?: string;
  Facebook?: string;
  FacebookId?: string;
  FacebookASIds?: string;
  FacebookPSId: string;
  Image: string;
  ImageUrl: string;
  LastUpdated?: Date;
  LoyaltyPoints?: number;
  Discount: number;
  AmountDiscount: number;
  CategoryNames: string;
  PartnerCategoryId?: number;
  PartnerCategoryName: string;
  NameNoSign: string;
  PropertyPaymentTermId?: number;
  PropertySupplierPaymentTermId?: number;
  CategoryId: number;
  DateCreated?: Date;
  BirthDay?: Date;
  DepositAmount?: number;
  Status: string;
  StatusText: string;
  StatusStyle: string;
  ZaloUserId: string;
  ZaloUserName: string;
  Ward_District_City: string;
  CityCode: string;
  CityName: string;
  DistrictCode: string;
  DistrictName: string;
  WardCode: string;
  WardName: string;
  City: string;
  District: string;
  Ward: string;
}
