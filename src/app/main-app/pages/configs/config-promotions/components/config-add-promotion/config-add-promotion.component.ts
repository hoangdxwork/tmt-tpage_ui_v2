import { Router } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import {
  TDSHelperArray,
  TDSHelperString,
  TDSSafeAny,
  TDSMessageService,
  TDSHelperObject,
} from 'tmt-tang-ui';
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { CompanyDTO } from 'src/app/main-app/dto/company/company.dto';
import { CompanyService } from 'src/app/main-app/services/company.service';
import { ProductCategoryService } from 'src/app/main-app/services/product-category.service';
import { ProductCategoryDTO } from 'src/app/main-app/dto/product/product-category.dto';
import { ProductIndexDBService } from 'src/app/main-app/services/product-indexDB.service';
import { THelperCacheService } from 'src/app/lib';
import { DataPouchDBDTO } from 'src/app/main-app/dto/product-pouchDB/product-pouchDB.dto';
import { ProductTemplateV2DTO } from 'src/app/main-app/dto/producttemplate/product-tempalte.dto';
import { takeUntil, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { PromotionAllDTO } from 'src/app/main-app/dto/configs/promotion/promotion-add.dto';
import { SaleCouponProgramDetailDTO, SaleCouponProgramDTO } from 'src/app/main-app/dto/configs/sale-coupon-program.dto';
import { SaleCouponProgramService } from 'src/app/main-app/services/sale-coupon-program.service';
import { Message } from 'src/app/lib/consts/message.const';
import { ProductDTO } from 'src/app/main-app/dto/product/product.dto';

@Component({
  selector: 'app-config-add-promotion',
  templateUrl: './config-add-promotion.component.html'
})
export class ConfigAddPromotionComponent implements OnInit, OnDestroy {
  lstDiscountType: any = [
    { text: 'Phần trăm', value: 'percentage' },
    { text: 'Tiền cố định', value: 'fixed_amount' },
  ];

  dataDefault!: SaleCouponProgramDTO;
  formAddPromotion!: FormGroup;

  indexDbVersion: number = 0;
  indexDbProductCount: number = -1;
  indexDbStorage!: DataPouchDBDTO[];
  productTmplItems!: ProductTemplateV2DTO;

  lstCompany: CompanyDTO[] = [];
  lstProductCategory: ProductCategoryDTO[] = [];
  lstProduct: DataPouchDBDTO[] = [];

  private destroy$ = new Subject();
  isLoading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private message: TDSMessageService,
    private saleCouponProgramService: SaleCouponProgramService
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.getDefault('promotion_program');
  }

  createForm() {
    this.formAddPromotion = this.formBuilder.group({
      Active: [true],
      Company: [null],
      CompanyId: [null],
      CouponCount: [null],
      DateCreated: [null],
      Details: this.formBuilder.array([]),
      DiscountApplyOn: ['on_order'],
      DiscountFixedAmount: [0],
      DiscountLineProductId: [null],
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
      RuleProductUOMId: [null],
      ValidityDuration: [1],
    });
  }

  getDefault(type: string) {
    this.isLoading = true;
    let model = { ProgramType: type };

    this.saleCouponProgramService.getDefault({model: model})
      .pipe(finalize(() => this.isLoading = false))
      .subscribe((res: any) => {
        delete res['@odata.context'];
        this.dataDefault = res;
        this.updateForm(this.dataDefault);
      }, error => {
        this.message.error(`${error?.error?.message}` || Message.ErrorOccurred);
      });
  }

  updateForm(value: SaleCouponProgramDTO) {
    this.formAddPromotion.patchValue(value);
  }

  onSave() {
    this.isLoading = true;
    this.prepareModel();

    if(this.checkValueForm(this.dataDefault) == 1) {
      this.saleCouponProgramService.insert(this.dataDefault)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe(res => {
          this.redirectList();
          this.message.success(Message.InsertSuccess);
        }, error => {
          this.message.error(`${error?.error?.message}` || Message.ErrorOccurred);
        });
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
      let ruleCombo = data.Details.findIndex(x => !x.RuleCombo || x.RuleCombo.length < 1);
      if(ruleCombo < 0) {
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
    let formValue = this.formAddPromotion.value;

    this.dataDefault.Name = formValue.Name;
    this.dataDefault.Details = formValue.Details;

    this.dataDefault.RuleBasedOn = formValue.RuleBasedOn;
    this.dataDefault.RuleCategoryId = formValue.RuleCategory?.Id;
    this.dataDefault.RuleMinQuantity = formValue.RuleMinQuantity;
    this.dataDefault.RuleMinimumAmount = formValue.RuleMinimumAmount;

    this.dataDefault.Company = formValue.Company;
    this.dataDefault.CompanyId = formValue.Company?.Id;

    this.dataDefault.RewardType = formValue.RewardType;
    this.dataDefault.PromoApplicability = formValue.PromoApplicability;

    this.dataDefault.DiscountType = formValue.DiscountType;
    this.dataDefault.DiscountPercentage = formValue.DiscountPercentage;

    this.dataDefault.DiscountApplyOn = formValue.DiscountApplyOn;
    this.dataDefault.DiscountSpecificProductId = formValue.DiscountSpecificProduct?.Id;
    this.dataDefault.DiscountMaxAmount = formValue.DiscountMaxAmount;
    this.dataDefault.DiscountFixedAmount = formValue.DiscountFixedAmount;

    this.dataDefault.RuleDateFrom = formValue.RuleDateFrom;
    this.dataDefault.RuleDateTo = formValue.RuleDateTo;

    this.dataDefault.Active = formValue.Active;
    this.dataDefault.NoIncrease = formValue.NoIncrease;
    this.dataDefault.MaximumUseNumber = formValue.MaximumUseNumber;
    this.prepareReward();
  }

  prepareReward() {
    if(TDSHelperArray.hasListValue(this.dataDefault?.Details)) {
      this.dataDefault?.Details?.forEach(detail => {
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

    if(this.dataDefault.DiscountType == "percentage") {
      if(this.dataDefault.DiscountApplyOn == "on_order") {
        detail.Reward = `${sale_off} ${detail.DiscountPercentage} ${on_total_amount_percent}${maximum}`;
      }
      else if (this.dataDefault.DiscountApplyOn == "specific_product") {
        if (this.dataDefault.RuleBasedOn != "combo") {
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
      this.dataDefault.DiscountApplyOn = "on_order";
      this.formAddPromotion.controls.DiscountApplyOn.setValue("on_order");
    }
  }

  redirectList() {
    this.router.navigate(['configs/promotions']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
