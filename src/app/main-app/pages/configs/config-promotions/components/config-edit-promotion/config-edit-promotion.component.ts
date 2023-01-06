import { finalize } from 'rxjs/operators';
import { pipe } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SaleCouponProgramDetailDTO, SaleCouponProgramDTO } from 'src/app/main-app/dto/configs/sale-coupon-program.dto';
import { SaleCouponProgramService } from 'src/app/main-app/services/sale-coupon-program.service';
import { Message } from 'src/app/lib/consts/message.const';
import { ProductDTO } from 'src/app/main-app/dto/product/product.dto';
import { TDSMessageService } from 'tds-ui/message';
import { TDSHelperArray } from 'tds-ui/shared/utility';

@Component({
  selector: 'app-config-edit-promotion',
  templateUrl: './config-edit-promotion.component.html',
  host: {
    class: 'w-full h-full flex'
  }
})
export class ConfigEditPromotionComponent implements OnInit {

  promotionId!: number;
  formEditPromotion!: FormGroup;

  isLoading: boolean = false;
  dataEdit!: SaleCouponProgramDTO;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private message: TDSMessageService,
    private saleCouponProgramService: SaleCouponProgramService
  ) { }

  ngOnInit(): void {
    this.promotionId = parseFloat(this.route.snapshot.paramMap.get('id') || "-1");
    this.createForm();
    this.getById(this.promotionId);
  }

  createForm() {
    this.formEditPromotion = this.formBuilder.group({
      Active: [true],
      Company: [null],
      CompanyId: [null],
      CouponCount: [null],
      DateCreated: [null],
      Details: this.formBuilder.array([]),
      DiscountApplyOn: ['on_order'],
      DiscountFixedAmount: [0],
      DiscountLineProductId: [null],
      DiscountLineProduct: [null],
      DiscountMaxAmount: [0],
      DiscountPercentage: [0],
      DiscountSpecificCategoryId: [null],
      DiscountSpecificProduct: [null],
      DiscountSpecificProductId: [null],
      DiscountSpecificProductUOMId: [null],
      DiscountType: ['percentage'],
      Id: [0],
      MaximumUseNumber: [0],
      Name: [null],
      NoIncrease: [false],
      NoteReward: [null],
      OrderCount: [null],
      ProgramType: ['promotion_program'],
      PromoApplicability: ['on_current_order'],
      RewardDescription: [null],
      RewardProductId: [null],
      RewardProduct: [null],
      RewardProductQuantity: [1],
      RewardProductUOMId: [null],
      RewardType: ['discount'],
      RuleBasedOn: ['combo'],
      RuleCategory: [null],
      RuleCategoryId: [null],
      RuleDateFrom: [null, Validators.required],
      RuleDateTo: [null, Validators.required],
      RuleMinimumAmount: [0],
      RuleMinQuantity: [1],
      RuleProductId: [null],
      RuleProduct: [null],
      RuleProductUOMId: [null],
      ValidityDuration: [1],
    });
  }

  getById(id: number) {
    this.isLoading = true;

    this.saleCouponProgramService.getById(id).pipe().subscribe({
      next: (res: any) => {
        this.dataEdit = res;
        this.updateForm(res);
        this.isLoading = false;
      }, error : (err) => {
        this.isLoading = false;
        this.message.error(`${err?.error?.message}` || Message.ErrorOccurred);
        this.redirectList();
      }
    })
  }

  updateForm(value: SaleCouponProgramDTO) {
    this.formEditPromotion.patchValue(value);
    this.updateDetails(value.Details);
  }

  updateDetails(details: SaleCouponProgramDetailDTO[] | undefined){
    const model = <FormArray>this.formEditPromotion.controls['Details'];

    if(TDSHelperArray.hasListValue(details) && details != undefined) {
      details.forEach(data => {
        model.push(this.initDetail(data));
      });
    }
  }

  initDetail(data: any | null) {
    return this.formBuilder.group({
      DiscountType: [data.DiscountType],
      DiscountApplyOn: [data.DiscountApplyOn],
      DiscountPercentage: [data.DiscountPercentage],
      DiscountFixedAmount: [data.DiscountFixedAmount],
      RuleMinQuantity: [data.RuleMinQuantity],
      RuleMinimumAmount: [data.RuleMinimumAmount],
      DiscountMaxAmount: [data.DiscountMaxAmount],
      RuleProduct: [data.RuleProduct],
      DiscountSpecificProduct: [data.DiscountSpecificProduct],
      Active: [data.Active],
      RuleCombo: [data.RuleCombo],
      RewardCombo: [data.RewardCombo],
      RewardProductQuantity: [data.RewardProductQuantity]
    });
  }

  onSave() {
    if(this.isLoading) return;
    this.isLoading = true;
    this.prepareModel();

    if(this.checkValueForm(this.dataEdit) == 1) {
      this.saleCouponProgramService.update(this.promotionId, this.dataEdit).pipe().subscribe({
        next: (res) => {
          this.redirectList();
          this.isLoading = false
          this.message.success(Message.UpdatedSuccess);
        }, error: (err) => {
          this.isLoading = false
          this.message.error(`${err?.error?.message}` || Message.ErrorOccurred);
        }
      })
    }
    else {
      this.isLoading = false;
    }
  }

  checkValueForm(data: SaleCouponProgramDTO): number {
    if(!data.Name) {
      this.message.error(Message.Config.Promotion.PromotionNameEmpty);
      return 0;
    }

    if(data.Details && data.Details.length > 0) {
      let ruleCombo = data.Details.findIndex(x => (!x.RuleCombo || x.RuleCombo.length < 1)) as number;
      if(Number(ruleCombo) > -1) {
        this.message.error(Message.Config.Promotion.ProductBuyEmpty);
        return 0;
      }
    }

    if(data.RuleBasedOn == 'product_category' && !data.RuleCategoryId) {
      this.message.error(Message.Config.Promotion.RuleBasedOnEmpty);
      return 0;
    }

    return 1;
  }

  prepareModel() {
    let formValue = this.formEditPromotion.value;

    this.dataEdit.Name = formValue.Name;
    this.dataEdit.Details = formValue.Details;
    this.dataEdit.RuleBasedOn = formValue.RuleBasedOn;
    this.dataEdit.RuleCategoryId = formValue.RuleCategory?.Id;
    this.dataEdit.RuleMinQuantity = formValue.RuleMinQuantity;
    this.dataEdit.RuleMinimumAmount = formValue.RuleMinimumAmount;
    this.dataEdit.Company = formValue.Company;
    this.dataEdit.CompanyId = formValue.Company?.Id;
    this.dataEdit.RewardType = formValue.RewardType;
    this.dataEdit.RewardProductId = formValue.RewardProductId;
    this.dataEdit.RewardProduct = formValue.RewardProduct;
    this.dataEdit.PromoApplicability = formValue.PromoApplicability;
    this.dataEdit.DiscountType = formValue.DiscountType;
    this.dataEdit.DiscountPercentage = formValue.DiscountPercentage;
    this.dataEdit.DiscountApplyOn = formValue.DiscountApplyOn;
    this.dataEdit.DiscountSpecificProductId = formValue.DiscountSpecificProductId;
    this.dataEdit.DiscountMaxAmount = formValue.DiscountMaxAmount;
    this.dataEdit.DiscountFixedAmount = formValue.DiscountFixedAmount;
    this.dataEdit.RuleDateFrom = formValue.RuleDateFrom;
    this.dataEdit.RuleDateTo = formValue.RuleDateTo;
    this.dataEdit.Active = formValue.Active;
    this.dataEdit.NoIncrease = formValue.NoIncrease;
    this.dataEdit.MaximumUseNumber = formValue.MaximumUseNumber;

    this.prepareDetail();
  }

  prepareDetail() {
    if(TDSHelperArray.hasListValue(this.dataEdit?.Details)) {
      this.dataEdit?.Details?.forEach(detail => {
        this.setReward(detail);
      });
    }
  }

  setReward(detail: SaleCouponProgramDetailDTO) {
    const sale_off = `Giảm giá`;
    const on_total_amount_percent = `% trên tổng tiền`;
    const on_total_amount = `trên tổng tiền`;
    const on_product_percent = `% trên sản phẩm`;
    const not_too_max = `tối đa không quá`;

    let maximum = detail.DiscountMaxAmount > 0 ? `, ${not_too_max} ${detail.DiscountMaxAmount} đ` : ``;

    if(this.dataEdit.DiscountType == "percentage") {
      if(this.dataEdit.DiscountApplyOn == "on_order") {
        detail.Reward = `${sale_off} ${detail.DiscountPercentage} ${on_total_amount_percent}${maximum}`;
      }
      else if (this.dataEdit.DiscountApplyOn == "specific_product") {
        if (this.dataEdit.RuleBasedOn != "combo") {
          detail.Reward = `${sale_off} ${detail.DiscountPercentage} % ${on_product_percent} ${detail?.DiscountSpecificProduct?.NameTemplate}${maximum}`;
        }
        else {
          detail?.RewardCombo.forEach((product: ProductDTO) => {
            product.RewardName = `${sale_off} ${detail.DiscountPercentage} % ${on_product_percent} ${product.NameGet}${maximum}`;
          });
        }
      }
    }
    else {
      detail.Reward = `${sale_off} ${detail.DiscountFixedAmount} ${on_total_amount}`;
      this.dataEdit.DiscountApplyOn = "on_order";
      this.formEditPromotion.controls.DiscountApplyOn.setValue("on_order");
    }
  }

  redirectList() {
    this.router.navigate(['configs/promotions']);
  }

}
