import { ConfigPromotionService } from './../../config-promotions/config-promotion.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TDSSafeAny } from 'tmt-tang-ui';

@Component({
  selector: 'app-config-add-promotion-all',
  templateUrl: './config-add-promotion-all.component.html',
  styleUrls: ['./config-add-promotion-all.component.scss']
})
export class ConfigAddPromotionAllComponent implements OnInit {
  @Output() getFormData:EventEmitter<FormGroup> = new EventEmitter<FormGroup>();

  companyList:Array<TDSSafeAny> = [];
  discountTypeList: Array<TDSSafeAny>  = [];
  productList:Array<TDSSafeAny> = [];
  giftList:Array<TDSSafeAny>  = [];
  sendingData!:FormGroup;
  discountProductTable:Array<TDSSafeAny> = [];
  couponTable:Array<TDSSafeAny> = [];
  
  constructor(private service: ConfigPromotionService, private formBuilder:FormBuilder) { 
    this.initForm();
    this.getFormData.emit(this.sendingData);
    this.productList = this.service.getProductList();
    this.companyList = this.service.getCompanyList();
    this.discountTypeList = this.service.getDiscountType();
    this.giftList = this.service.getGiftList();
    
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
    this.getFormData.emit(this.sendingData);
    this.updateDiscountProductTable();
    this.updateCouponTable();
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
