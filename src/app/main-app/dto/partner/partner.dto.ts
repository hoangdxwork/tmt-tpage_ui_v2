import { AccountDTO, AccountPaymentTermDTO } from '../account/account.dto';
import { AddressDTO } from '../address/address.dto';
import { StockLocationDTO } from '../product/warehouse.dto';
import { TagDTO } from '../tag/tag.dto';

export interface PartnerDTO {
  Id: number;
  Name: string;
  DisplayName: string;
  Street: string;
  Website: string;
  // _phone: string;

  Addresses: Array<AddressDTO>;

  Phone: string;
  PhoneReport?: boolean;
  Mobile: string;
  Fax: string;
  Email: string;
  Supplier?: boolean;
  Customer?: boolean;
  IsContact?: boolean;
  IsCompany?: boolean;
  CompanyId?: number;
  Ref: string;
  Comment: string;

  //salesperson
  UserId: string;
  Active?: boolean;
  Employee?: boolean;

  // Mã số thuế
  TaxCode: string;
  ParentId?: number;
  PurchaseCurrencyId?: number;
  PurchaseCurrency: ResCurrencyDTO;

  // Tổng số tiền khách hàng này nợ bạn.
  Credit?: number;

  //Tổng số tiền bạn phải trả cho nhà cung cấp này.
  Debit?: number;
  TitleId?: number;
  Title: PartnerTitleDTO;
  // Function: string;
  Type: string;
  CompanyType: string;
  Childs: Array<PartnerDTO>;
  Categories: Array<PartnerCategoryDTO>;
  AccountReceivableId?: number;
  AccountReceivable: AccountDTO;
  AccountPayableId?: number;
  AccountPayable: AccountDTO;
  StockCustomerId?: number;
  StockCustomer: StockLocationDTO;
  StockSupplierId?: number;
  StockSupplier: StockLocationDTO;
  City: PartnerCityDTO;
  District: PartnerDistrictDTO;
  Ward: PartnerWardDTO;
  Barcode: string;
  OverCredit: boolean;
  CreditLimit?: number;
  // PropertyProductPricelistId?: number;
  // PropertyProductPricelist?: number;

  // Social Network
  // zalo: string;
  Facebook: string;
  FacebookId: string;
  FacebookASIds: string;
  FacebookPSId: string;

  ///string base 64
  Image: string;
  ImageUrl: string;
  LastUpdated?: Date;

  LoyaltyPoints?: number;
  Discount?: number;
  AmountDiscount?: number;

  CategoryNames: string;

  PartnerCategoryId?: number;
  PartnerCategoryName: string;
  NameNoSign: string;

  // Customer Payment Term
  PropertyPaymentTerm: AccountPaymentTermDTO;
  PropertyPaymentTermId?: number;

  /// Supplier Payment Term
  PropertySupplierPaymentTerm: AccountPaymentTermDTO;
  PropertySupplierPaymentTermId?: number;
  CategoryId: number;
  DateCreated?: Date;
  BirthDay?: Date;
  DepositAmount?: number;

  Status: PartnerStatus;

  // Description Status
  StatusText: string;

  StatusStyle: string;
  ZaloUserId: string;
  ZaloUserName: string;

  CityCode: string;
  CityName: string;
  DistrictCode: string;
  DistrictName: string;
  WardCode: string;
  WardName: string;

  FullAddress: string;

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

export interface TagPartnerDTO {
  Id: number;
  TagId: number;
  Color: string;
  Tags: Array<TagDTO>;
  PartnerId: number;
  TagName: string;
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

