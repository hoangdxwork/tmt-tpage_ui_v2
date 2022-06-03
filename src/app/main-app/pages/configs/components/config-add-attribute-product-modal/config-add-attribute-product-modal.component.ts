import { ConfigAttributeLine, ConfigAttributeValue, ConfigAttribute } from './../../../../dto/configs/product/config-product-default.dto';
import { takeUntil } from 'rxjs/operators';
import { ProductTemplateService } from './../../../../services/product-template.service';
import { Subject } from 'rxjs';
import { TDSSafeAny, TDSModalRef, TDSMessageService } from 'tmt-tang-ui';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-config-add-attribute-product-modal',
  templateUrl: './config-add-attribute-product-modal.component.html'
})
export class ConfigAddAttributeProductModalComponent implements OnInit, OnDestroy {
  ValuesList:Array<ConfigAttributeValue> = [];
  attributeList:Array<ConfigAttribute> = [];
  lstOfData:Array<ConfigAttributeLine> = [];
  createAttributeForm!:FormGroup;
  ModelDefault:Array<ConfigAttributeLine> = [];
  private destroy$ = new Subject<void>();

  isLoading = false;

  constructor(
    private modal: TDSModalRef, 
    private message: TDSMessageService, 
    private productTemplateService: ProductTemplateService,
    private formBuilder: FormBuilder
  ) {
    this.loadProductAttributeValue();
    this.createForm();
   }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  createForm(){
    this.createAttributeForm = this.formBuilder.group({
      Attributes: [[],Validators.required]
    });
  }

  loadProductAttributeValue(){
    this.productTemplateService.getProductAttributeValue().pipe(takeUntil(this.destroy$)).subscribe(
      (res:TDSSafeAny)=>{
        this.ValuesList = res.value;
        this.attributeList = [];
        this.ValuesList.forEach(item=>{
          let existedIndex = this.attributeList.findIndex(f=>f.Id === item.AttributeId);
          
          if(existedIndex == -1){
            this.attributeList.push({
              Id: item.AttributeId,
              Name: item.AttributeName,
              Code: item.Code,
              Sequence: item.Sequence,
              CreateVariant: true
            });
          }
        });
      },
      err=>{
        this.message.error(err.error.message??'Tải dữ liệu biến thể thất bại');
      }
    )
  }

  onSelectAttribute(){
    this.isLoading = true;
    this.lstOfData = [];
    this.ModelDefault = [];

    let lstSelectAttr = this.createAttributeForm.controls.Attributes.value as Array<ConfigAttribute>;
    
    lstSelectAttr.forEach(attr => {
      let lstValues = this.ValuesList.filter(f=>f.AttributeId == attr.Id);
      this.ModelDefault.push({
        Attribute: attr,
        AttributeId: attr.Id,
        Values : []
      });

      this.lstOfData.push({
        Attribute: attr,
        AttributeId: attr.Id,
        Values : lstValues
      });
    });

    this.createAttributeForm.controls.Attributes.reset();
    this.isLoading = false;
  }

  deleteAttribute(AttributeId:number){
    this.isLoading = true;
    // remove trên model
    this.ModelDefault = this.ModelDefault.filter(f=>f.AttributeId != AttributeId);
    // remove trên table data
    this.lstOfData = this.lstOfData.filter(f=>f.AttributeId != AttributeId);
    
    this.isLoading = false;
  }

  onSelectValues(data:Array<ConfigAttributeValue>,AttributeId:number){
    this.ModelDefault.map((model)=>{
      if(model.AttributeId == AttributeId){
        model.Values = data;
      }
    })
  }

  prepareModel(){
    return this.ModelDefault;
  }

  checkValidate(){
    let result= false;

    if(this.ModelDefault.length == 0){
      result= true;
    }else{
      this.ModelDefault.forEach(model => {
        if(model.Values.length == 0){
          result = true
        }
      });
    }
    return result
  }

  onSubmit() {
    let model = this.prepareModel();
    this.modal.destroy(model);
    this.createAttributeForm.reset();
  }

  cancel() {
    this.modal.destroy(null);
  }

  save() {
      this.onSubmit();
  }
}
