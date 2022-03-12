import { AccountDTO, AccountPaymentTermDTO } from '../account/account.dto';
import { AddressDTO } from '../address/address.dto';
import { StockLocationDTO } from '../product/warehouse.dto';
import { TagDTO } from '../tag/tag.dto';

export class PartnerDTO {
  public id: number;
  public name: string;
  public displayName: string;
  public street: string;
  public website: string;
  private _phone: string;

  public addresses: Array<AddressDTO> = new Array<AddressDTO>();

  public phone: string;
  public phoneReport?: boolean;
  public mobile: string;
  public fax: string;
  public email: string;
  public supplier?: boolean;
  public customer?: boolean;
  public isContact?: boolean;
  public isCompany?: boolean;
  public companyId?: number;
  public ref: string;
  public comment: string;

  //salesperson
  public userId: string;
  public active?: boolean;
  public employee?: boolean;

  // Mã số thuế
  public taxCode: string;
  public parentId?: number;
  public purchaseCurrencyId?: number;
  public purchaseCurrency: ResCurrencyDTO;

  // Tổng số tiền khách hàng này nợ bạn.
  public credit?: number;

  //Tổng số tiền bạn phải trả cho nhà cung cấp này.
  public debit?: number;
  public titleId?: number;
  public title: PartnerTitleDTO;
  public function: string;
  public type: string;
  public companyType: string;
  public childs: Array<PartnerDTO>;
  public categories: Array<PartnerCategoryDTO>;
  public accountReceivableId?: number;
  public accountReceivable: AccountDTO;
  public accountPayableId?: number;
  public accountPayable: AccountDTO;
  public stockCustomerId?: number;
  public stockCustomer: StockLocationDTO;
  public stockSupplierId?: number;
  public stockSupplier: StockLocationDTO;
  public city: PartnerCityDTO;
  public district: PartnerDistrictDTO;
  public ward: PartnerWardDTO;
  public barcode: string;
  public overCredit: boolean;
  public creditLimit?: number;
  public propertyProductPricelistId?: number;
  public propertyProductPricelist?: number;

  // Social Network
  public zalo: string;
  public facebook: string;
  public facebookId: string;
  public facebookASIds: string;
  public facebookPSId: string;

  ///string base 64
  public image: string;
  public imageUrl: string;
  public lastUpdated?: Date;

  public loyaltyPoints?: number;
  public discount?: number;
  public amountDiscount?: number;

  public categoryNames: string;

  public partnerCategoryId?: number;
  public partnerCategoryName: string;
  public nameNoSign: string;

  // Customer Payment Term
  public propertyPaymentTerm: AccountPaymentTermDTO;
  public propertyPaymentTermId?: number;

  /// Supplier Payment Term
  public propertySupplierPaymentTerm: AccountPaymentTermDTO;
  public propertySupplierPaymentTermId?: number;
  public categoryId: number;
  public dateCreated?: Date;
  public birthDay?: Date;
  public depositAmount?: number;

  public status: PartnerStatus;

  // Description Status
  public statusText: string;

  public statusStyle: string;
  public zaloUserId: string;
  public zaloUserName: string;

  public cityCode: string;
  public cityName: string;
  public districtCode: string;
  public districtName: string;
  public wardCode: string;
  public wardName: string;

  public fullAddress: string;

  constructor() {
    this.id = 0;
  }
}

export class PartnerTitleDTO {
  public id: number;
  public name: string;
}

export class PartnerCategoryDTO {
  public id: number;
  public name: string;
  public parentId?: number;
  public parent: PartnerCategoryDTO;
  public completeName: string;
  public active?: boolean;
  public parentLeft?: number;
  public parentRight?: number;
  public discount?: number;

  constructor() {
    this.active = true;
    this.discount = 0;
  }
}

export class PartnerCityDTO {
  public name: string;
  public nameNoSign: string;
  public code: string;
}

export class PartnerDistrictDTO {
  public name: string;
  public nameNoSign: string;
  public code: string;
  public cityName: string;
  public cityCode: string;
}

export class PartnerWardDTO {
  public name: string;
  public nameNoSign: string;
  public code: string;
  public cityName: string;
  public cityCode: string;
  public districtName: string;
  public districtCode: string;
}

export class ResCurrencyDTO {
  public id: number;
  public name: string;
  public rounding?: number;
  public symbol: string;
  public active?: boolean;
  public position: string;
  public rate: number;

  public get decimalPlaces(): number {
    if (this.rounding && this.rounding > 0 && this.rounding < 1) {
      return Math.ceil(Math.log10(1 / this.rounding));
    }
    return 0;
  }

  constructor() {
    this.active = true;
    this.rounding = 1;
  }
}

export class PartnerExtDTO {
  public id: number;
  public name: string;
  public nameNoSign: string;
  public code: string;

  /// <summary>
  /// Nhà sản xuất : NSX
  /// Nhà nhập khẩu: NNK
  /// Nhà phân phối: NPP
  /// </summary>

  public type: string;
  public address: string;
  public phone: string;
  public email: string;
  public active: boolean;
  public dateCreated?: Date;
  public note: string;
}

export class TagPartnerDTO {
  public Id: number;
  public TagId: number;
  public Color: string;
  public Tags: Array<TagDTO>;
  public PartnerId: number;
  public TagName: string;
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

