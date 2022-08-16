import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ProductCategoryService } from 'src/app/main-app/services/product-category.service';
import { ProductCategoryDTO } from 'src/app/main-app/dto/product/product-category.dto';
import { CompanyDTO } from 'src/app/main-app/dto/company/company.dto';
import { CompanyService } from 'src/app/main-app/services/company.service';
import { showDiscountFixedAmount, showDiscountPercentageOnOrder, showDiscountPercentageSpecificProduct, showProduct } from 'src/app/main-app/services/facades/config-promotion.facede';
import { ProductIndexDBService } from 'src/app/main-app/services/product-indexDB.service';
import { THelperCacheService } from 'src/app/lib';
import { DataPouchDBDTO, ProductPouchDBDTO } from 'src/app/main-app/dto/product-pouchDB/product-pouchDB.dto';
import { ProductTemplateV2DTO } from '@app/dto/product-template/product-tempalte.dto';
import { finalize } from 'rxjs/operators';
import { TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSMessageService } from 'tds-ui/message';

@Component({
  selector: 'app-config-promotion-group',
  templateUrl: './config-promotion-group.component.html'
})
export class ConfigPromotionGroupComponent implements OnInit {
  @Input() form!: FormGroup;
  @Output() getFormData:EventEmitter<FormGroup> = new EventEmitter<FormGroup>();

  companyList:Array<TDSSafeAny> = [];
  discountTypeList: Array<TDSSafeAny>  = [];
  productList:Array<TDSSafeAny> = [];
  productGroupList:Array<TDSSafeAny> = [];
  giftList:Array<TDSSafeAny>  = [];
  sendingData!:FormGroup;
  discountProductTable:Array<TDSSafeAny> = [];
  couponTable:Array<TDSSafeAny> = [];

  lstDiscountType: any = [
    { text: 'Phần trăm', value: 'percentage' },
    { text: 'Tiền cố định', value: 'fixed_amount' }
  ];

  isLoading: boolean = false;

  lstProductCategory: ProductCategoryDTO[] = [];
  lstProduct: DataPouchDBDTO[] = [];
  lstCompany: CompanyDTO[] = [];

  indexDbVersion: number = 0;
  indexDbProductCount: number = -1;
  indexDbStorage!: DataPouchDBDTO[];
  productTmplItems!: ProductTemplateV2DTO;

  constructor(
    private formBuilder:FormBuilder,
    private productCategoryService: ProductCategoryService,
    private companyService: CompanyService,
    private productIndexDBService: ProductIndexDBService,
    private cacheApi: THelperCacheService,
    private message: TDSMessageService,
  ) { }

  get getRewardTypeFormGroup() {
    return this.form.value.RewardType;
  }

  ngOnInit(): void {
    this.loadProductCategory();
    this.loadCompany();
    this.loadProduct();
  }

  loadProductCategory() {
    this.productCategoryService.get().subscribe(res => {
      this.lstProductCategory = res.value;
    });
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

  initForm(){
    this.sendingData = this.formBuilder.group({
      prductGroup: new FormControl('', [Validators.required]),
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

  onChangeRewardType(value: string) {
    this.form.controls.RewardType.setValue(value);
  }
}
