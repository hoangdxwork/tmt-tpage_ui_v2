import { AccountDTO, AccountJournalDTO } from '../account/account.dto';
import { StockLocationRouteDTO } from './warehouse.dto';

export interface ProductCategoryDTO {
  Id: number;

  Name: string;

  CompleteName: string;

  ParentId?: number;
  Parent: ProductCategoryDTO;
  ParentCompleteName: string;

  ParentLeft?: number;

  ParentRight?: number;

  Sequence?: number;

  Type: string;

  AccountIncomeCategId?: number;
  AccountIncomeCateg: AccountDTO;

  AccountExpenseCategId?: number;
  AccountExpenseCateg: AccountDTO;

  StockJournalId?: number;
  StockJournal: AccountJournalDTO;

  StockAccountInputCategId?: number;
  StockAccountInputCateg: AccountDTO;

  StockAccountOutputCategId?: number;
  StockAccountOutputCateg: AccountDTO;

  StockValuationAccountId?: number;
  StockValuationAccount: AccountDTO;

  PropertyValuation: string;

  PropertyCostMethod: string;

  Routes: Array<StockLocationRouteDTO>;
  NameNoSign: string;
  IsPos: boolean;
  Version?: number;
  IsDelete: boolean;
}
