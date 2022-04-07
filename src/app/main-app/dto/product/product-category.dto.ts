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


export interface ProductCategoryDTOV2 {
  Id: number;
  Name: string;
  CompleteName: string;
  ParentId?: number;
  ParentCompleteName: string;
  ParentLeft?: any;
  ParentRight?: any;
  Sequence?: number;
  Type: string;
  AccountIncomeCategId?: any;
  AccountExpenseCategId?: any;
  StockJournalId?: any;
  StockAccountInputCategId?: any;
  StockAccountOutputCategId?: any;
  StockValuationAccountId?: any;
  PropertyValuation?: any;
  PropertyCostMethod: string;
  NameNoSign: string;
  IsPos: boolean;
  Version?: any;
  IsDelete: boolean;
}

export interface ODataProductCategoryDTOV2 {
  "@odata.context": string;
  "@odata.count": number;
  value: ProductCategoryDTOV2[];
}
