
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
  id: number;
  name: string;
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
  name: string;
  nameNoSign: string;
  code?: number;
}

export interface PartnerDistrictDTO {
  name: string;
  nameNoSign: string;
  code?: number;
  cityName: string;
  cityCode?: number;
}

export interface PartnerWardDTO {
  name: string;
  nameNoSign: string;
  code?: number;
  cityName: string;
  cityCode?: number;
  districtName: string;
  districtCode?: number;
}

export class ResCurrencyDTO {
  public id?: number;
  public name?: string;
  public rounding?: number;
  public symbol?: string;
  public active?: boolean;
  public position?: string;
  public rate?: number;

  get decimalPlaces(): number {
    if (this.rounding && this.rounding > 0 && this.rounding < 1) {
      return Math.ceil(Math.log10(1 / this.rounding));
    }
    return 0;
  }
}

export interface ResRevenueCustomerDTO { // /odata/Partner/OdataService.GetPartnerRevenueById?key=14
  revenue: number;
  revenueBegan: number;
  revenueTotal: number;
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

