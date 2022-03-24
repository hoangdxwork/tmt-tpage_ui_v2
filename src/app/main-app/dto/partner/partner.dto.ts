import { AccountDTO, AccountPaymentTermDTO } from '../account/account.dto';
import { AddressDTO } from '../address/address.dto';
import { StockLocationDTO } from '../product/warehouse.dto';
import { TagDTO } from '../tag/tag.dto';

export interface PartnerDTO {
  id: number;
  name: string;
  displayName: string;
  street: string;
  website: string;
  _phone: string;

  addresses: Array<AddressDTO>;

  phone: string;
  phoneReport?: boolean;
  mobile: string;
  fax: string;
  email: string;
  supplier?: boolean;
  customer?: boolean;
  isContact?: boolean;
  isCompany?: boolean;
  companyId?: number;
  ref: string;
  comment: string;

  //salesperson
  userId: string;
  active?: boolean;
  employee?: boolean;

  // Mã số thuế
  taxCode: string;
  parentId?: number;
  purchaseCurrencyId?: number;
  purchaseCurrency: ResCurrencyDTO;

  // Tổng số tiền khách hàng này nợ bạn.
  credit?: number;

  //Tổng số tiền bạn phải trả cho nhà cung cấp này.
  debit?: number;
  titleId?: number;
  title: PartnerTitleDTO;
  function: string;
  type: string;
  companyType: string;
  childs: Array<PartnerDTO>;
  categories: Array<PartnerCategoryDTO>;
  accountReceivableId?: number;
  accountReceivable: AccountDTO;
  accountPayableId?: number;
  accountPayable: AccountDTO;
  stockCustomerId?: number;
  stockCustomer: StockLocationDTO;
  stockSupplierId?: number;
  stockSupplier: StockLocationDTO;
  city: PartnerCityDTO;
  district: PartnerDistrictDTO;
  ward: PartnerWardDTO;
  barcode: string;
  overCredit: boolean;
  creditLimit?: number;
  propertyProductPricelistId?: number;
  propertyProductPricelist?: number;

  // Social Network
  zalo: string;
  facebook: string;
  facebookId: string;
  facebookASIds: string;
  facebookPSId: string;

  ///string base 64
  image: string;
  imageUrl: string;
  lastUpdated?: Date;

  loyaltyPoints?: number;
  discount?: number;
  amountDiscount?: number;

  categoryNames: string;

  partnerCategoryId?: number;
  partnerCategoryName: string;
  nameNoSign: string;

  // Customer Payment Term
  propertyPaymentTerm: AccountPaymentTermDTO;
  propertyPaymentTermId?: number;

  /// Supplier Payment Term
  propertySupplierPaymentTerm: AccountPaymentTermDTO;
  propertySupplierPaymentTermId?: number;
  categoryId: number;
  dateCreated?: Date;
  birthDay?: Date;
  depositAmount?: number;

  status: PartnerStatus;

  // Description Status
  statusText: string;

  statusStyle: string;
  zaloUserId: string;
  zaloUserName: string;

  cityCode: string;
  cityName: string;
  districtCode: string;
  districtName: string;
  wardCode: string;
  wardName: string;

  fullAddress: string;

}

export interface PartnerTitleDTO {
  id: number;
  name: string;
}

export interface PartnerCategoryDTO {
  id: number;
  name: string;
  parentId?: number;
  parent: PartnerCategoryDTO;
  completeName: string;
  active?: boolean;
  parentLeft?: number;
  parentRight?: number;
  discount?: number;
}

export interface PartnerCityDTO {
  name: string;
  nameNoSign: string;
  code: string;
}

export interface PartnerDistrictDTO {
  name: string;
  nameNoSign: string;
  code: string;
  cityName: string;
  cityCode: string;
}

export interface PartnerWardDTO {
  name: string;
  nameNoSign: string;
  code: string;
  cityName: string;
  cityCode: string;
  districtName: string;
  districtCode: string;
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

export interface PartnerExtDTO {
  id: number;
  name: string;
  nameNoSign: string;
  code: string;

  /// <summary>
  /// Nhà sản xuất : NSX
  /// Nhà nhập khẩu: NNK
  /// Nhà phân phối: NPP
  /// </summary>

  type: string;
  address: string;
  phone: string;
  email: string;
  active: boolean;
  dateCreated?: Date;
  note: string;
}

export interface TagPartnerDTO {
  id: number;
  tagId: number;
  color: string;
  tags: Array<TagDTO>;
  partnerId: number;
  tagName: string;
}

export interface ResRevenueCustomerDTO { // /odata/Partner/OdataService.GetPartnerRevenueById?key=14
  revenue: number;
  revenueBegan: number;
  revenueTotal: number;
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

