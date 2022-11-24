import { IndexDBHelperService } from '../../../../../services/indexdb-helper.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CompanyService } from 'src/app/main-app/services/company.service';
import { CompanyDTO } from 'src/app/main-app/dto/company/company.dto';
import { ProductIndexDBService } from 'src/app/main-app/services/product-indexdb.service';
import { THelperCacheService } from 'src/app/lib';
import { DataPouchDBDTO, ProductPouchDBDTO } from 'src/app/main-app/dto/product-pouchDB/product-pouchDB.dto';
import { ProductTemplateV2DTO } from '@app/dto/product-template/product-tempalte.dto';
import { finalize, takeUntil } from 'rxjs/operators';
import { PromotionAllDTO } from 'src/app/main-app/dto/configs/promotion/promotion-add.dto';
import { showDiscountFixedAmount, showDiscountPercentageOnOrder, showDiscountPercentageSpecificProduct, showProduct } from 'src/app/main-app/services/facades/config-promotion.facede';
import { TDSMessageService } from 'tds-ui/message';
import { TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';

@Component({
  selector: 'app-config-promotion-all',
  templateUrl: './config-promotion-all.component.html'
})
export class ConfigPromotionAllComponent implements OnInit {
  @Input() form!: FormGroup;

  lstCompany: CompanyDTO[] = [];
  lstProduct: DataPouchDBDTO[] = [];

  lstDiscountType: any = [
    { text: 'Phần trăm', value: 'percentage' },
    { text: 'Tiền cố định', value: 'fixed_amount' }
  ];

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

  constructor(
    private formBuilder:FormBuilder,
    private companyService: CompanyService,
    private message: TDSMessageService,
    private productIndexDBService: ProductIndexDBService,
    private indexdbHelperService: IndexDBHelperService,
    private cacheApi: THelperCacheService,
  ) { }

  get getRewardTypeFormGroup() {
    return this.form.value.RewardType;
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

    this.indexdbHelperService.loadLastVersionV2(productCount, version);
    this.indexdbHelperService.getLastVersionV2().pipe(finalize(() => this.isLoading = false))
      .subscribe((res: ProductPouchDBDTO) => {debugger
          this.lstProduct = res.Datas;
      }, error => {
          this.message.error('Load danh sách sản phẩm đã xảy ra lỗi!');
      });
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

  onChangeRewardType(value: string) {
    this.form.controls.RewardType.setValue(value);
  }

}
