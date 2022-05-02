import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TDSHelperArray, TDSHelperString, TDSSafeAny, TDSMessageService, TDSHelperObject } from 'tmt-tang-ui';
import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CompanyDTO } from 'src/app/main-app/dto/company/company.dto';
import { CompanyService } from 'src/app/main-app/services/company.servive';
import { ProductCategoryService } from 'src/app/main-app/services/product-category.service';
import { ProductCategoryDTO } from 'src/app/main-app/dto/product/product-category.dto';
import { ProductIndexDBService } from 'src/app/main-app/services/product-indexDB.service';
import { THelperCacheService } from 'src/app/lib';
import { DataPouchDBDTO, KeyCacheIndexDBDTO, ProductPouchDBDTO } from 'src/app/main-app/dto/product-pouchDB/product-pouchDB.dto';
import { ProductTemplateV2DTO } from 'src/app/main-app/dto/producttemplate/product-tempalte.dto';
import { takeUntil, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { PromotionAllDTO } from 'src/app/main-app/dto/configs/promotion/promotion-add.dto';

@Component({
  selector: 'app-config-add-promotion',
  templateUrl: './config-add-promotion.component.html',
  styleUrls: ['./config-add-promotion.component.scss']
})
export class ConfigAddPromotionComponent implements OnInit, OnDestroy {
  @Output() getComponent:EventEmitter<number> = new EventEmitter<number>();

  productTypeList:Array<TDSSafeAny>  = [];
  productGroupList:Array<TDSSafeAny>  = [];
  productUnitList:Array<TDSSafeAny>  = [];
  PosGroupList:Array<TDSSafeAny> = [];

  addProductForm!: FormGroup;
  tabForm!:FormGroup;

  //////////

  lstDiscountType: any = [
    { text: 'Phần trăm', value: 'percentage' },
    { text: 'Tiền cố định', value: 'fixed_amount' }
  ]

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
    private companyService: CompanyService,
    private productCategoryService: ProductCategoryService,
    private productIndexDBService: ProductIndexDBService,
    private cacheApi: THelperCacheService,
    private message: TDSMessageService
    ) {
    // this.initForm();
    // this.initList();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.createForm();
    this.loadCompany();
    this.loadProductCategory();
    this.loadProduct();
  }

  createForm(){
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
      RuleDateFrom: [null],
      RuleDateTo: [null],
      RuleMinimumAmount: [0],
      RuleMinQuantity: [1],
      RuleProductId: [null],
      RuleProductUOMId: [null],
      ValidityDuration: [1],
    });
  }

  updateForm(value: TDSSafeAny) {

  }

  loadCompany() {
    this.companyService.getCompanyList().subscribe(res => {
      this.lstCompany = res.value;
    })
  }

  loadProductCategory() {
    this.productCategoryService.get().subscribe(res => {
      this.lstProductCategory = res;
    });
  }

  loadProduct() {
    let keyCache = JSON.stringify(this.productIndexDBService._keyCacheProductIndexDB);
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
      .pipe(takeUntil(this.destroy$), finalize(() => this.isLoading = false))
      .subscribe((res: ProductPouchDBDTO) => {
          this.lstProduct = res.Datas;
      }, error => {
          this.message.error('Load danh sách sản phẩm đã xảy ra lỗi!');
      });
  }

  changeFormAll(event: PromotionAllDTO) {
    this.formAddPromotion.patchValue(event);
    console.log(this.formAddPromotion.value);
  }

  initList(){
    // this.productTypeList = this.service.getTypeList();

    // this.productGroupList = this.service.getProductGroupList();

    // this.productUnitList = this.service.getProductUnitList();

    // this.PosGroupList = this.service.getPosGroupList();
  }

  initForm(){
    this.addProductForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      tabComponent: new FormControl('all'),
    });

    this.tabForm = this.formBuilder.group({});
  }

  resetForm(){
    this.addProductForm.reset({
      name: '',
      tabComponent: 'all',
    });
  }

  getComponentData(data:FormGroup){
    this.tabForm = data;
  }

  onChangeTabForm(){
    this.tabForm = new FormGroup({});
  }

  backToMain(){
    this.router.navigate(['configs/promotions']);
    this.resetForm();
  }

  onSubmit(){
    this.router.navigate(['configs/promotions']);
  }
}
