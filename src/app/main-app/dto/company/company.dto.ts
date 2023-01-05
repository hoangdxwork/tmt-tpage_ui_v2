import { number } from "echarts";
import { AccountDTO, AccountJournalDTO } from "../account/account.dto";
import { PartnerCityDTO, PartnerDistrictDTO, PartnerDTO, PartnerWardDTO, ResCurrencyDTO } from "../partner/partner.dto";
import { StockWarehouseDTO } from "../product/warehouse.dto";

export interface CompanyDTO {
  Id: number;
  Name: string;
  Sender: string;
  MoreInfo: string;
  PartnerId: number;
  ProductId?: number;
  Partner: PartnerDTO;
  Email: string;
  Phone: string;
  CurrencyId: number;
  Currency: ResCurrencyDTO;
  Fax: string;
  Street: string;
  DepositAccountId?: number;
  CurrencyExchangeJournalId?: number;
  CurrencyExchangeJournal: AccountJournalDTO;
  IncomeCurrencyExchangeAccountId?: number;
  IncomeCurrencyExchangeAccount: AccountDTO;
  ExpenseCurrencyExchangeAccountId?: number;
  ExpenseCurrencyExchangeAccount: AccountDTO;
  SecurityLead?: number;
  Logo: string;
  LastUpdated?: Date;
  TransferAccountId?: number;
  TransferAccount: AccountDTO;
  City: PartnerCityDTO;
  District: PartnerDistrictDTO;
  Ward: PartnerWardDTO;
  // Default Terms and Conditions
  SaleNote: string;
  TaxCode: string;
  WarehouseId?: number;
  Warehouse: StockWarehouseDTO;
  // Create Sale Orders when buying to this company
  SoFromPO?: boolean;
  // Create Purchase Orders when selling to this company
  PoFromSO?: boolean;
  // When a Sale Order or a Purchase Order is created by a multi company rule for this company, it will automatically validate it
  AutoValidation?: boolean;
  Customer?: boolean;
  Supplier?: boolean;
  Active?: boolean;
  // Khóa sổ, chỉ có quyền kế toán/cố vấn mới có thể chỉnh sửa sổ sách
  PeriodLockDate?: Date;
  QuatityDecimal?: number;
  ExtRegexPhone: string;
  ImageUrl: string;
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
