import { AccountDTO, AccountJournalDTO } from "../account/account.dto";
import { PartnerCityDTO, PartnerDistrictDTO, PartnerDTO, PartnerWardDTO, ResCurrencyDTO } from "../partner/partner.dto";
import { StockWarehouseDTO } from "../product/warehouse.dto";

export class CompanyDTO {
  public id: number;
  public name: string;
  public sender: string;
  public moreInfo: string;
  public partnerId: number;
  public productId?: number;
  public partner: PartnerDTO;
  public email: string;
  public phone: string;
  public currencyId: number;
  public currency: ResCurrencyDTO;
  public fax: string;
  public street: string;
  public depositAccountId?: number;

  public currencyExchangeJournalId?: number;
  public currencyExchangeJournal: AccountJournalDTO;

  public incomeCurrencyExchangeAccountId?: number;
  public incomeCurrencyExchangeAccount: AccountDTO;

  public expenseCurrencyExchangeAccountId?: number;
  public expenseCurrencyExchangeAccount: AccountDTO;

  public securityLead?: number;
  public logo: string;
  public lastUpdated?: Date;
  public transferAccountId?: number;
  public transferAccount: AccountDTO;
  public city: PartnerCityDTO;
  public district: PartnerDistrictDTO;
  public ward: PartnerWardDTO;

  // Default Terms and Conditions
  public saleNote: string;
  public taxCode: string;
  public warehouseId?: number;
  public warehouse: StockWarehouseDTO;

  // Create Sale Orders when buying to this company
  public soFromPO?: boolean;

  // Create Purchase Orders when selling to this company
  public poFromSO?: boolean;

  // When a Sale Order or a Purchase Order is created by a multi company rule for this company, it will automatically validate it
  public autoValidation?: boolean;
  public customer?: boolean;
  public supplier?: boolean;
  public active?: boolean;

  // Khóa sổ, chỉ có quyền kế toán/cố vấn mới có thể chỉnh sửa sổ sách
  public periodLockDate?: Date;
  public quatityDecimal?: number;
  public extRegexPhone: string;
  public imageUrl: string;

  constructor() {
    this.active = true;
  }
}
