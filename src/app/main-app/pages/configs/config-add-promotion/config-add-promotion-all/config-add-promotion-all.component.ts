import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TDSSafeAny, TDSMessageService } from 'tmt-tang-ui';
import { CompanyService } from 'src/app/main-app/services/company.servive';
import { CompanyDTO } from 'src/app/main-app/dto/company/company.dto';
import { ProductIndexDBService } from 'src/app/main-app/services/product-indexDB.service';
import { THelperCacheService } from 'src/app/lib';
import { DataPouchDBDTO, ProductPouchDBDTO } from 'src/app/main-app/dto/product-pouchDB/product-pouchDB.dto';
import { ProductTemplateV2DTO } from 'src/app/main-app/dto/producttemplate/product-tempalte.dto';
import { finalize, takeUntil } from 'rxjs/operators';
import { PromotionAllDTO } from 'src/app/main-app/dto/configs/promotion/promotion-add.dto';

@Component({
  selector: 'app-config-add-promotion-all',
  templateUrl: './config-add-promotion-all.component.html',
  styleUrls: ['./config-add-promotion-all.component.scss']
})
export class ConfigAddPromotionAllComponent implements OnInit {
  @Output() getFormData:EventEmitter<FormGroup> = new EventEmitter<FormGroup>();

  @Output() changeForm = new EventEmitter<PromotionAllDTO>();

  companyList:Array<TDSSafeAny> = [];
  discountTypeList: Array<TDSSafeAny>  = [];
  productList:Array<TDSSafeAny> = [];
  giftList:Array<TDSSafeAny>  = [];
  sendingData!:FormGroup;
  discountProductTable:Array<TDSSafeAny> = [];
  couponTable:Array<TDSSafeAny> = [];

  formPromotionAll!: FormGroup;

  lstCompany: CompanyDTO[] = [];
  lstProduct: DataPouchDBDTO[] = [];

  lstDiscountType: any = [
    { text: 'Phần trăm', value: 'percentage' },
    { text: 'Tiền cố định', value: 'fixed_amount' }
  ];

  showDiscountPercentageOnOrder = ['DiscountType', 'DiscountApplyOn', 'DiscountMaxAmount', 'DiscountPercentage'];
  showDiscountPercentageSpecificProduct = ['DiscountType', 'DiscountApplyOn', 'DiscountSpecificProduct', 'DiscountMaxAmount', 'DiscountPercentage', 'DiscountMaxAmount'];
  showDiscountFixedAmount = ['DiscountFixedAmount', 'DiscountType'];
  showProduct = ['DiscountSpecificProduct', 'RewardProductQuantity'];

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
  ) {
    // this.initForm();
    // this.getFormData.emit(this.sendingData);
    // this.productList = this.service.getProductList();
    // this.companyList = this.service.getCompanyList();
    // this.discountTypeList = this.service.getDiscountType();
    // this.giftList = this.service.getGiftList();

  }

  ngOnInit(): void {
    // this.initTableData();
    this.createForm();
    this.onChangeForm();

    this.loadCompany();
    this.loadProduct();
  }

  createForm() {
    this.formPromotionAll = this.formBuilder.group({
      Active: [true],
      Company: [null],
      DiscountApplyOn: ['on_order'],
      DiscountMaxAmount: [0],
      DiscountPercentage: [0],
      DiscountSpecificProduct: [null],
      DiscountType: ['percentage'],
      MaximumUseNumber: [0],
      NoIncrease: [false],
      PromoApplicability: ['on_current_order'],
      RewardProductQuantity: [1],
      RewardType: ['discount'],
      RuleDateFrom: [null],
      RuleDateTo: [null],
      RuleMinimumAmount: [0],
      RuleMinQuantity: [1],
      DiscountFixedAmount: [0]
      // RuleProductId: [null],
    });
  }

  onChangeForm() {
    this.formPromotionAll.valueChanges.subscribe(res => {
      let value = this.prepareModel();
      this.changeForm.emit(value);
    });
  }

  prepareModel() {
    let formValue = this.formPromotionAll.value;

    let model: PromotionAllDTO = {
      Active: formValue.Active,
      Company: formValue.Company,
      DiscountApplyOn: formValue.DiscountApplyOn,
      DiscountMaxAmount: formValue.DiscountMaxAmount,
      DiscountPercentage: formValue.DiscountPercentage,
      DiscountSpecificProduct: formValue.DiscountSpecificProduct,
      DiscountType: formValue.DiscountType,
      MaximumUseNumber: formValue.MaximumUseNumber,
      NoIncrease: formValue.NoIncrease,
      PromoApplicability: formValue.PromoApplicability,
      RewardProductQuantity: formValue.RewardProductQuantity,
      RewardType: formValue.RewardType,
      RuleDateFrom: formValue.RuleDateFrom,
      RuleDateTo: formValue.RuleDateTo,
      RuleMinimumAmount: formValue.RuleMinimumAmount,
      RuleMinQuantity: formValue.RuleMinQuantity,
      DiscountFixedAmount: formValue.DiscountFixedAmount
    };

    return model;
  }

  loadCompany() {
    this.companyService.get().subscribe(res => {
      this.lstCompany = res.value;
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
      .pipe(finalize(() => this.isLoading = false))
      .subscribe((res: ProductPouchDBDTO) => {
          this.lstProduct = res.Datas;
      }, error => {
          this.message.error('Load danh sách sản phẩm đã xảy ra lỗi!');
      });
  }

  isShow(value: string) : boolean {
    let result = false;

    let rewardType = this.formPromotionAll.value.RewardType;
    let discountType = this.formPromotionAll.value.DiscountType;
    let discountApplyOn = this.formPromotionAll.value.DiscountApplyOn;

    if(rewardType === "discount") {
        if(discountType === "percentage") {
            if(discountApplyOn === "on_order") {
                return this.showDiscountPercentageOnOrder.includes(value);
            }
            if(discountApplyOn === "specific_product") {
                return this.showDiscountPercentageSpecificProduct.includes(value);
            }
        }
        else if(discountType === "fixed_amount") {
            return this.showDiscountFixedAmount.includes(value);
        }
    }
    else if(rewardType === "product") {
      return this.showProduct.includes(value);
    }

    return result;
  }

  initForm(){
    this.sendingData = this.formBuilder.group({
      quantity: new FormControl(0, [Validators.required]),
      useFor: new FormControl(0, [Validators.required]),
      minimumPrice: new FormControl(0, [Validators.required]),
      startDate: new FormControl(0, [Validators.required]),
      companyName: new FormControl('', [Validators.required]),
      endDate: new FormControl(0, [Validators.required]),
      active: new FormControl(true),
      bonusType: new FormControl('discount'),
      applyFor: new FormControl('1'),
      applyDiscountType: new FormControl(1, [Validators.required]),
      applyDiscountValue: new FormControl(0, [Validators.required]),
      maximumDiscountValue: new FormControl(0, [Validators.required]),
      discountOn: new FormControl('1'),
      listOfDiscountOnProduct: new FormControl([]),
      gift: new FormControl(1, [Validators.required]),
      quantityGift: new FormControl(0, [Validators.required]),
      duplicateQuantity: new FormControl(false),
      couponList: new FormControl([]),
    });
  }

  resetForm(){
    this.sendingData.reset({
      quantity: 0,
      useFor: 0,
      minimumPrice: 0,
      startDate: 0,
      companyName: '',
      endDate: 0,
      active: true,
      bonusType: 'discount',
      applyFor: '1',
      applyDiscountType: 1,
      applyDiscountValue: 0,
      maximumDiscountValue: 0,
      discountOn: '1',
      listOfDiscountOnProduct: [],
      gift: 1,
      quantityGift: 0,
      duplicateQuantity: false,
      couponList: [],
    });
  }

  initTableData(){
    this.discountProductTable = [
      {
        id:1,
        name:'',
        price:50000,
        applyDiscountPrice:40000
      }
    ];
    this.couponTable = [
      {
        id:1,
        name:'',
        active:true
      }
    ];
  }

  onSelectProduct(id:number, i:number){
    this.discountProductTable[i].name = this.productList.find(f=>f.id==id).name;
    this.getData();
  }

  onChangeCouponName(event:TDSSafeAny,i:number){
    this.couponTable[i].name = event.target.value;
    this.getData();
  }

  onActiveChange(i:number){
    this.couponTable[i].active = !this.couponTable[i].active;
    this.getData();
  }

  addNewDiscountProduct(){
    this.discountProductTable.push(
      {
        id:this.discountProductTable.length + 1,
        name:'',
        price:50000,
        applyDiscountPrice:40000
      }
    );
  }

  addNewCoupon(){
    this.couponTable.push(
      {
        id: this.couponTable.length + 1,
        name:'',
        active: true
      }
    );
  }

  removeDiscountProduct(i:number){
    this.discountProductTable.splice(i,1);
    this.getData();
  }

  removeCoupon(i:number){
    this.couponTable.splice(i,1);
    this.getData();
  }

  getData(){
    // this.getFormData.emit(this.sendingData);
    // this.updateDiscountProductTable();
    // this.updateCouponTable();
  }

  updateDiscountProductTable(){
    this.sendingData.value.listOfDiscountOnProduct = [];
    let id = 1;
    this.discountProductTable.forEach(rs => {
      if(rs.name !== ''){
        rs.id = id;
        this.sendingData.value.listOfDiscountOnProduct.push(rs);
        id++;
      }
    });
  }

  updateCouponTable(){
    this.sendingData.value.couponList = [];
    let id = 1;
    this.couponTable.forEach(rs=>{
      if(rs.name !== ''){
        rs.id = id;
        this.sendingData.value.couponList.push(rs);
        id++;
      }
    });
  }
}
