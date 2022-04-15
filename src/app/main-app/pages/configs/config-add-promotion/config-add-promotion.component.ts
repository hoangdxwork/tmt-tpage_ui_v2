import { Router } from '@angular/router';
import { ConfigPromotionService } from './../config-promotions/config-promotion.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TDSSafeAny } from 'tmt-tang-ui';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-config-add-promotion',
  templateUrl: './config-add-promotion.component.html',
  styleUrls: ['./config-add-promotion.component.scss']
})
export class ConfigAddPromotionComponent implements OnInit {
  @Output() getComponent:EventEmitter<number> = new EventEmitter<number>();

  productTypeList:Array<TDSSafeAny>  = [];
  productGroupList:Array<TDSSafeAny>  = [];
  productUnitList:Array<TDSSafeAny>  = [];
  PosGroupList:Array<TDSSafeAny> = [];

  addProductForm!: FormGroup;
  tabForm!:FormGroup;

  constructor(
    private formBuilder: FormBuilder, 
    private service: ConfigPromotionService,
    private router:Router
    ) {
    this.initForm();
    this.initList();
  }

  ngOnInit(): void {}

  initList(){
    this.productTypeList = this.service.getTypeList();

    this.productGroupList = this.service.getProductGroupList();

    this.productUnitList = this.service.getProductUnitList();

    this.PosGroupList = this.service.getPosGroupList();
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
