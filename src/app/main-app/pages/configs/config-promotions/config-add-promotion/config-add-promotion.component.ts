import { ConfigPromotionService } from './../config-promotion.service';

import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { HttpRequest, HttpResponse, HttpClient } from '@angular/common/http';
import { TDSSafeAny, TDSMessageService, TDSUploadFile, TDSUploadChangeParam } from 'tmt-tang-ui';
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
    private msg: TDSMessageService, 
    private http: HttpClient, 
    private formBuilder: FormBuilder, 
    private service: ConfigPromotionService,
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
      tabComponent: new FormControl('1'),
    });
  }

  resetForm(){
    this.addProductForm.reset({
      name: '',
      tabComponent: '1',
    });
  }

  getComponentData(data:FormGroup){
    this.tabForm = data;
  }

  backToMain(){
    this.getComponent.emit(1);
    this.resetForm();
  }

  onSubmit(){
    this.getComponent.emit(1);
  }
}
