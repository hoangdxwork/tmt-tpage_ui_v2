import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { CompanyDTO } from 'src/app/main-app/dto/company/company.dto';
import { CompanyService } from 'src/app/main-app/services/company.service';
import { showDiscountFixedAmount, showDiscountPercentageOnOrder, showDiscountPercentageSpecificProduct, showProduct } from 'src/app/main-app/services/facades/config-promotion.facede';
import { ProductIndexDBService } from 'src/app/main-app/services/product-indexdb.service';
import { THelperCacheService } from 'src/app/lib';
import { DataPouchDBDTO, KeyCacheIndexDBDTO, ProductPouchDBDTO } from 'src/app/main-app/dto/product-pouchDB/product-pouchDB.dto';
import { ProductTemplateV2DTO } from '@app/dto/product-template/product-tempalte.dto';
import { finalize, takeUntil } from 'rxjs/operators';
import { Message } from 'src/app/lib/consts/message.const';
import { TDSMessageService } from 'tds-ui/message';
import { TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSConfigService } from 'tds-ui/core/config';
import { TDSDestroyService } from 'tds-ui/core/services';

@Component({
  selector: 'app-config-promotion-combo',
  templateUrl: './config-promotion-combo.component.html'
})
export class ConfigPromotionComboComponent implements OnInit {
  @Input() form!: FormGroup;

  lstDiscountType: any = [
    { text: 'Phần trăm', value: 'percentage' },
    { text: 'Tiền cố định', value: 'fixed_amount' }
  ];

  lstCompany: CompanyDTO[] = [];
  lstProduct: DataPouchDBDTO[] = [];

  isLoading: boolean = false;

  indexDbVersion: number = 0;
  indexDbProductCount: number = -1;
  indexDbStorage!: DataPouchDBDTO[];
  productTmplItems!: ProductTemplateV2DTO;

  numberWithCommas =(value:TDSSafeAny) =>{
    if(value != null)
    {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    return value;
  } ;

  parserComas = (value: TDSSafeAny) =>{
    if(value != null)
    {
      return TDSHelperString.replaceAll(value,'.','');
    }
    return value;
  };

  constructor(private destroy$: TDSDestroyService,
    private formBuilder:FormBuilder,
    private companyService: CompanyService,
    private message: TDSMessageService,
    private readonly tdsConfigService: TDSConfigService,
    private productIndexDBService: ProductIndexDBService,
    private cacheApi: THelperCacheService,
  ) { }

  get detailsFormGroups() {
    return (this.form?.get("Details") as FormArray);
  }

  get discountApplyOnForm() {
    return this.form?.value.DiscountApplyOn;
  }

  get getRewardTypeFormGroup() {
    return this.form.value.RewardType;
  }

  ngOnInit(): void {
    this.tdsConfigService.set('message', {
      maxStack: 3
    });
    this.loadCompany();
    this.loadProduct();
  }

  loadCompany() {
    this.companyService.get().subscribe(res => {
      this.lstCompany = res.value.filter(x => TDSHelperString.hasValueString(x.Name));
    });
  }

  loadProduct() {
    this.productIndexDBService.setCacheDBRequest();
    this.productIndexDBService.getCacheDBRequest().pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: KeyCacheIndexDBDTO) => {
            this.lstProduct = [...res.cacheDbStorage];
        },
        error: (err: any) => {
            this.message.error(err.message);
        }
    })
  }

  addDetailDiscount(){
    if(this.form.controls['Name'].value == null) {
      this.message.error(Message.Config.Promotion.PromotionNameEmpty);
    } else {
      const model = <FormArray>this.form.controls['Details'];
      model.push(this.initDetailDiscount());
    }
  }

  deleteDetailDiscount(index: number) {
    const model = <FormArray>this.form.controls['Details'];
    model.removeAt(index);
  }

  addDetailCombo() {
    if(this.form.controls['Name'].value == null) {
      this.message.error(Message.Config.Promotion.PromotionNameEmpty);
    } else {
      const model = <FormArray>this.form.controls['Details'];
      model.push(this.initDetailCombo());
    }
  }

  deleteDetailCombo(index: number) {
    const model = <FormArray>this.form.controls['Details'];
    model.removeAt(index);
  }

  isShow(value: string) : boolean {
    let result = false;

    let rewardType = this.form.value.RewardType;
    let discountType = this.form.value.DiscountType;
    let discountApplyOn = this.form.value.DiscountApplyOn;

    // Check các lựa chọn hiện tại trong form => Kiểm tra giá trị đó có trong danh sách cho hiển thị hay không
    if(rewardType === "discount") {
        if(discountType === "percentage") {
            if(discountApplyOn === "on_order") {
                return showDiscountPercentageOnOrder.includes(value);
            }
            if(discountApplyOn === "specific_product") {
                return showDiscountPercentageSpecificProduct.includes(value);
            }
        }
        else if(discountType === "fixed_amount") {
            return showDiscountFixedAmount.includes(value);
        }
    }
    else if(rewardType === "product") {
      return showProduct.includes(value);
    }

    return result;
  }

  initDetailDiscount() {
    let discountType = this.form.value?.DiscountType;
    let discountApplyOn = this.form.value?.DiscountApplyOn;
    let reward = "";

    let discountPercentage = 0;
    let discountFixedAmount = 0;

    if(discountType == "percentage") {
      if(discountApplyOn == "on_order") {
        reward = `Giảm giá ${discountPercentage} % trên tổng tiền`;
      }
      else {
        reward = `Giảm giá ${discountPercentage} trên sản phẩm`;
      }
    }
    else {
      reward = `Giảm giá ${discountFixedAmount} đồng trên tổng tiền`;
      this.form.controls?.DiscountApplyOn?.setValue('on_order');
    }

    let fb = this.formBuilder.group({
      DiscountType: discountType,
      DiscountApplyOn: discountApplyOn,
      DiscountPercentage: discountPercentage,
      DiscountFixedAmount: discountFixedAmount,
      RuleMinQuantity: 1,
      RuleMinimumAmount: 0,
      DiscountMaxAmount: 0,
      RuleProduct: {},
      DiscountSpecificProduct: {},
      Active: true,
      RuleCombo: [],
      RewardCombo: [],
      Reward: reward
    });

    return fb;
  }

  initDetailCombo() {
    let fb = this.formBuilder.group({
      RuleMinQuantity: 1,
      RuleMinimumAmount: 0,
      RewardProductQuantity: 1,
      Active: true,
      RuleCombo: [],
      RewardCombo: []
    });

    return fb;
  }

  onChangeRewardType(value: string) {
    this.form.controls.RewardType.setValue(value);
    (<FormArray>this.form.get('Details')).clear();
  }

}
