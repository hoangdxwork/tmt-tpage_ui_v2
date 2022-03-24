import { number } from "echarts";
import { AccountDTO, AccountJournalDTO } from "../account/account.dto";
import { PartnerCityDTO, PartnerDistrictDTO, PartnerDTO, PartnerWardDTO, ResCurrencyDTO } from "../partner/partner.dto";
import { StockWarehouseDTO } from "../product/warehouse.dto";

export interface CompanyDTO {
  id: number;
  name: string;
  sender: string;
  moreInfo: string;
  partnerId: number;
  productId?: number;
  partner: PartnerDTO;
  email: string;
  phone: string;
  currencyId: number;
  currency: ResCurrencyDTO;
  fax: string;
  street: string;
  depositAccountId?: number;

  currencyExchangeJournalId?: number;
  currencyExchangeJournal: AccountJournalDTO;

  incomeCurrencyExchangeAccountId?: number;
  incomeCurrencyExchangeAccount: AccountDTO;

  expenseCurrencyExchangeAccountId?: number;
  expenseCurrencyExchangeAccount: AccountDTO;

  securityLead?: number;
  logo: string;
  lastUpdated?: Date;
  transferAccountId?: number;
  transferAccount: AccountDTO;
  city: PartnerCityDTO;
  district: PartnerDistrictDTO;
  ward: PartnerWardDTO;

  // Default Terms and Conditions
  saleNote: string;
  taxCode: string;
  warehouseId?: number;
  warehouse: StockWarehouseDTO;

  // Create Sale Orders when buying to this company
  soFromPO?: boolean;

  // Create Purchase Orders when selling to this company
  poFromSO?: boolean;

  // When a Sale Order or a Purchase Order is created by a multi company rule for this company, it will automatically validate it
  autoValidation?: boolean;
  customer?: boolean;
  supplier?: boolean;
  active?: boolean;

  // Khóa sổ, chỉ có quyền kế toán/cố vấn mới có thể chỉnh sửa sổ sách
  periodLockDate?: Date;
  quatityDecimal?: number;
  extRegexPhone: string;
  imageUrl: string;
}

export interface ResCompanyCurrentDTO { // /api/common/getcompanycurrent
  companyId: number;
  partnerId?: number;
  productId?: number;
  companyName: string;
  quantityDecimal: number;
  dateServer: Date;
  configs: string;
  baseUrlShip: string;
  requestLimit: number;
  symbolPrice: string;
  roundingPrice?: number;
  isMultiCompany: boolean;
  defaultWarehouseId?: number;
  shipDefault?: number;
  weightDefault?: number;
  defaultWarehouseName: string;
}
