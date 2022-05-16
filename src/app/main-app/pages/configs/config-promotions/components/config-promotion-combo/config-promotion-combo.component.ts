import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { TDSHelperString, TDSMessageService, TDSSafeAny } from 'tmt-tang-ui';
import { CompanyDTO } from 'src/app/main-app/dto/company/company.dto';
import { CompanyService } from 'src/app/main-app/services/company.service';
import { showDiscountFixedAmount, showDiscountPercentageOnOrder, showDiscountPercentageSpecificProduct, showProduct } from 'src/app/main-app/services/facades/config-promotion.facede';
import { ProductIndexDBService } from 'src/app/main-app/services/product-indexDB.service';
import { THelperCacheService } from 'src/app/lib';
import { DataPouchDBDTO, ProductPouchDBDTO } from 'src/app/main-app/dto/product-pouchDB/product-pouchDB.dto';
import { ProductTemplateV2DTO } from 'src/app/main-app/dto/producttemplate/product-tempalte.dto';
import { finalize } from 'rxjs/operators';
import { Message } from 'src/app/lib/consts/message.const';

@Component({
  selector: 'app-config-promotion-combo',
  templateUrl: './config-promotion-combo.component.html',
  styleUrls: ['./config-promotion-combo.component.scss']
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

  constructor(
    private formBuilder:FormBuilder,
    private companyService: CompanyService,
    private message: TDSMessageService,
    private productIndexDBService: ProductIndexDBService,
    private cacheApi: THelperCacheService,
  ) { }

  get detailsFormGroups() {
    return (this.form?.get("Details") as FormArray).controls;
  }

  get discountApplyOnForm() {
    return this.form?.value.DiscountApplyOn;
  }

  ngOnInit(): void {
    this.loadCompany();
    this.loadProduct();
  }

  loadCompany() {
    this.companyService.get().subscribe(res => {
      this.lstCompany = res.value.filter(x => TDSHelperString.hasValueString(x.Name));
    });
  }

  loadProduct() {
    let keyCache = this.productIndexDBService._keyCacheProductIndexDB;
    this.cacheApi.getItem(keyCache).subscribe((obs: TDSSafeAny) => {

      // if(TDSHelperString.hasValueString(obs)) {
      //     let cache = JSON.parse(obs['value']) as TDSSafeAny;
      //     let cacheDB = JSON.parse(cache['value']) as KeyCacheIndexDBDTO;

      //     this.indexDbVersion = cacheDB.cacheVersion;
      //     this.indexDbProductCount = cacheDB.cacheCount;
      //     this.indexDbStorage = cacheDB.cacheDbStorage;
      // }

      // if(this.indexDbProductCount == -1 && this.indexDbVersion == 0) {
        this.loadProductIndexDB(this.indexDbProductCount, this.indexDbVersion);
      // } else {
          // this.loadDataTable();
      // }

    });
  }

  loadProductIndexDB(productCount: number, version: number): any {
    this.isLoading = true;
    this.productIndexDBService.getLastVersionV2(productCount, version)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe((res: ProductPouchDBDTO) => {
          this.lstProduct = res.Datas;
      }, error => {
          this.message.error('Load danh sách sản phẩm đã xảy ra lỗi!');
      });
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

  onChangeRewardType(event: TDSSafeAny) {
    (<FormArray>this.form.get('Details')).clear();
  }

}
