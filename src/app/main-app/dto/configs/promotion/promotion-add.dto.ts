import { CompanyDTO } from "../../company/company.dto";
import { DataPouchDBDTO } from "../../product-pouchDB/product-pouchDB.dto";

export interface PromotionAllDTO {
  Active: boolean,
  Company: CompanyDTO,
  DiscountApplyOn: string,
  DiscountMaxAmount: number,
  DiscountPercentage: number,
  DiscountSpecificProduct: DataPouchDBDTO,
  DiscountType: string,
  MaximumUseNumber: number,
  NoIncrease: boolean,
  PromoApplicability: string,
  RewardProductQuantity: number,
  RewardType:  string,
  RuleDateFrom: Date,
  RuleDateTo: Date,
  RuleMinimumAmount: number,
  RuleMinQuantity: number,
  DiscountFixedAmount: number
  // RuleProductId: [null],
}
