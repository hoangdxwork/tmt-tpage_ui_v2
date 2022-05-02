import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TDSSafeAny } from 'tmt-tang-ui';

@Component({
  selector: 'app-config-add-promotion-combo',
  templateUrl: './config-add-promotion-combo.component.html',
  styleUrls: ['./config-add-promotion-combo.component.scss']
})
export class ConfigAddPromotionComboComponent implements OnInit {
  @Output() getFormData:EventEmitter<FormGroup> = new EventEmitter<FormGroup>();

  companyList:Array<TDSSafeAny> = [];
  discountTypeList: Array<TDSSafeAny>  = [];
  productList:Array<TDSSafeAny> = [];
  giftList:Array<TDSSafeAny>  = [];
  sendingData!:FormGroup;
  couponTable:Array<TDSSafeAny> = [];
  comboPromotionTable:Array<TDSSafeAny> = [];
  giftComboPromotionTable:Array<TDSSafeAny> = [];
  isLoading= false;

  constructor(private formBuilder:FormBuilder) {
    this.initForm();
    this.getFormData.emit(this.sendingData);
    // this.productList = this.service.getProductList();
    // this.companyList = this.service.getCompanyList();
    // this.giftList = this.service.getGiftList();
  }

  ngOnInit(): void {
    this.initTableData();
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
      comboPromotionList: new FormControl([]),
      giftComboPromotionList: new FormControl([]),
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
      comboPromotionList: [],
      giftComboPromotionList: [],
      gift: 1,
      quantityGift: 0,
      duplicateQuantity: false,
      couponList: [],
    });
  }

  initTableData(){
    this.comboPromotionTable = [
      {
        id:1,
        name:[],
        quantity:100000,
        discountPercent:10,
        fixedValue:0,
        maximumDiscountValue:100000,
        gift:'Giảm giá 0 % trên tổng tiền',
        active:true
      },
    ];

    this.giftComboPromotionTable = [
      {
        id:1,
        name:[],
        productQuantity:10,
        gift:[],
        giftQuantity:1,
        active:true
      },
    ];

    this.couponTable = [
      {
        id:1,
        name:'',
        active:true
      }
    ];
  }

  // onSelectProduct(id:number, i:number){

  //   this.getData();
  // }

  onChangeCouponName(event:TDSSafeAny,i:number){
    this.couponTable[i].name = event.target.value;
    this.getData();
  }

  onActiveCouponChange(i:number){
    this.couponTable[i].active = !this.couponTable[i].active;
    this.getData();
  }

  onActiveComboChange(i:number){
    this.comboPromotionTable[i].active = !this.comboPromotionTable[i].active;
    this.getData();
  }

  onActiveGiftComboChange(i:number){
    this.giftComboPromotionTable[i].active = !this.giftComboPromotionTable[i].active;
    this.getData();
  }

  addNewComboPromotion(){
    this.isLoading= true;
    this.comboPromotionTable.push(
      {
        id:this.comboPromotionTable.length + 1,
        name:[],
        quantity:0,
        discountPercent:0,
        fixedValue:0,
        maximumDiscountValue:0,
        gift:'',
        active:true
      }
    );
    setTimeout(()=>{this.isLoading = false;},500);
  }

  addNewGiftComboPromotion(){
    this.giftComboPromotionTable.push(
      {
        id:this.giftComboPromotionTable.length + 1,
        name:[],
        productQuantity:0,
        gift:[],
        giftQuantity:0,
        active:true
      }
    );
  }

  addNewCoupon(){
    this.couponTable.push(
      {
        id: this.couponTable.length + 1,
        name:'',
        active:true
      }
    );
  }

  removeComboPromotion(i:number){
    this.comboPromotionTable.splice(i,1);
    this.getData();
  }

  removeGiftComboPromotion(i:number){
    this.giftComboPromotionTable.splice(i,1);
    this.getData();
  }

  removeCoupon(i:number){
    this.couponTable.splice(i,1);
    this.getData();
  }

  getData(){
    this.getFormData.emit(this.sendingData);
    this.updateComboPromotionTable();
    this.updategiftComboPromotionTable();
    this.updateCouponTable();
  }

  updateComboPromotionTable(){
    this.sendingData.value.comboPromotionList = [];
    let id = 1;
    this.comboPromotionTable.forEach(rs => {
      if(rs.name.length != 0){
        rs.id = id;
        this.sendingData.value.comboPromotionList.push(rs);
        id++;
      }
    });
  }

  updategiftComboPromotionTable(){
    this.sendingData.value.comboPromotionList = [];
    let id = 1;
    this.comboPromotionTable.forEach(rs => {
      if(rs.name.length != 0 && rs.gift.length != 0){
        rs.id = id;
        this.sendingData.value.comboPromotionList.push(rs);
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
