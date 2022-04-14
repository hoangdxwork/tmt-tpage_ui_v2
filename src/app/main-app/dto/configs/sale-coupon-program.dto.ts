import { ProductDTO } from "../product/product.dto";

export interface SaleCouponProgramDTO {
  Id: number;
  Name: string;
  Active: boolean;
  RuleBasedOn: string;
  RuleProductId?: any;
  RuleCategoryId?: any;
  DiscountLineProductId?: any;
  RuleMinQuantity: number;
  RuleMinimumAmount: number;
  CompanyId: number;
  PromoApplicability: string;
  RewardType: string;
  RewardProductId?: any;
  RewardProductQuantity: number;
  DiscountType: string;
  DiscountApplyOn: string;
  DiscountPercentage: number;
  DiscountFixedAmount: number;
  DiscountMaxAmount: number;
  DiscountSpecificProductId?: any;
  DiscountSpecificCategoryId?: any;
  RuleProductUOMId?: any;
  DiscountSpecificProductUOMId?: any;
  Details?: Array<SaleCouponProgramDetailDTO>;
  MaximumUseNumber: number;
  RuleDateFrom?: any;
  RuleDateTo?: any;
  ProgramType: string;
  ValidityDuration: number;
  CouponCount?: any;
  OrderCount?: any;
  DateCreated: Date;
  RewardDescription?: any;
  NoIncrease: boolean;
  RewardProductUOMId?: any;
  NoteReward?: any;
}

export interface SaleCouponProgramDetailDTO {
  Id: number;
  Active: boolean;
  RewardProductName?: any;
  SaleCouponProgramId?: any;
  RuleProductId?: any;
  RuleProductName?: any;
  RuleMinQuantity: number;
  RuleMinimumAmount: number;
  RewardType: string;
  RewardProductId?: any;
  RewardProductQuantity: number;
  DiscountType: string;
  DiscountApplyOn: string;
  DiscountPercentage: number;
  DiscountFixedAmount: number;
  DiscountMaxAmount: number;
  DiscountSpecificProductId?: any;
  DiscountLineProductId?: any;
  DiscountSpecificCategoryId?: any;
  Reward: string;
  EditMode: boolean;
  RuleProduct?: any;
  RewardProduct?: any;
  DiscountSpecificProduct?: any;
  RuleCombo: ProductDTO[];
  RewardCombo: any[];
}
