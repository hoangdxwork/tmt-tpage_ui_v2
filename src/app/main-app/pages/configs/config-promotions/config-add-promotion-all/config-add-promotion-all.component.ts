import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ConfigPromotionService } from './../config-promotion.service';
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
  data!:FormGroup;
  tableData:Array<TDSSafeAny> = [];
  

  constructor(private service: ConfigPromotionService, private formBuilder:FormBuilder) { 
    this.productList = this.service.getProductList();
    this.companyList = this.service.getCompanyList();
    this.discountTypeList = this.service.getDiscountType();

    this.data = this.formBuilder.group({
      quantity: new FormControl(0, [Validators.required]),
      useFor: new FormControl(0, [Validators.required]),
      minimumPrice: new FormControl(0, [Validators.required]),
      StartDate: new FormControl(0, [Validators.required]),
      companyName: new FormControl('', [Validators.required]),
      endDate: new FormControl(0, [Validators.required]),
      active: new FormControl(true),
      bonusType: new FormControl('1'),
      applyFor: new FormControl('1'),
      applyDiscountType: new FormControl(1, [Validators.required]),
      applyDiscountValue: new FormControl(0, [Validators.required]),
      maximumDiscountValue: new FormControl(0, [Validators.required]),
      discountOn: new FormControl('1'),
      discountOnProduct: new FormControl([{id:1, productName:this.productList[0].name,price:50000,applyDiscountPrice:40000}]),
    });
    
  }

  ngOnInit(): void {
    
  }

  onSelectProduct(id:number, index:number){
    this.data.value.discountOnProduct[index].productName = this.productList.find(f=>f.id==id).name;
  }

  addNewDiscountProduct(){
    this.data.value.discountOnProduct.push(
      {
        id:this.data.value.discountOnProduct.length+1,
        productName:this.productList[0].name,
        price:50000,
        applyDiscountPrice:40000
      }
    );
    console.log(this.data.value.discountOnProduct)
  }

  getData(){
    this.getFormData.emit(this.data)
  }
}
