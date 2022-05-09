import { takeUntil } from 'rxjs/operators';
import { ProductTemplateService } from './../../../../services/product-template.service';
import { Subject } from 'rxjs';
import { TDSSafeAny, TDSModalRef, TDSMessageService } from 'tmt-tang-ui';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-config-add-attribute-product-modal',
  templateUrl: './config-add-attribute-product-modal.component.html',
  styleUrls: ['./config-add-attribute-product-modal.component.scss']
})
export class ConfigAddAttributeProductModalComponent implements OnInit, OnDestroy {
  attributeValueList:Array<TDSSafeAny> = [];
  attributeList:Array<TDSSafeAny> = [];
  listOfData:Array<TDSSafeAny> = [];
  createAttributeForm!:FormGroup;
  ModelDefault = {
    AttributeLines:[] as TDSSafeAny[],
    AttributeValues:[] as TDSSafeAny[]
  }
  ValuesList:Array<TDSSafeAny> = [];
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
      Attributes: [null,Validators.required]
    });
  }

  loadProductAttributeValue(){
    this.productTemplateService.getProductAttributeValue().pipe(takeUntil(this.destroy$)).subscribe(
      (res:TDSSafeAny)=>{
        this.attributeValueList = res.value;
        this.attributeList = [];
        this.attributeValueList.forEach(item=>{
          let existedIndex = this.attributeList.findIndex(f=>f.AttributeId === item.AttributeId);
          
          if(existedIndex == -1){
            this.attributeList.push(item);
          }
        });
      },
      err=>{
        this.message.error(err.error.message??'Tải dữ liệu biến thể thất bại');
      }
    )
  }

  onSelectAttribute(){
    this.updateTableData();
    this.createAttributeForm.controls.Attributes.reset();
  }

  deleteAttribute(data:TDSSafeAny){
    this.isLoading = true;
    // remove trên model
    let attributeModel = this.ModelDefault.AttributeLines as Array<TDSSafeAny>;

    this.ModelDefault.AttributeLines = attributeModel.filter(f=>f.Attribute != data.AttributeId);
    // remove trên table data
    this.listOfData = this.listOfData.filter(f=>f.AttributeId != data.AttributeId);
    
    this.isLoading = false;
  }

  onSelectValues(Ids:Array<TDSSafeAny>,AttributeId:TDSSafeAny){
    let attributeModel = this.ModelDefault.AttributeLines as Array<TDSSafeAny>;
    
    attributeModel.forEach((item,i)=> {
      if(item.Attribute == AttributeId){
        this.ModelDefault.AttributeLines[i].Values = Ids;
      }
    });
  }

  updateTableData(){
    this.isLoading = true;
    this.listOfData = [];
    this.ModelDefault = {
      AttributeLines:[] as TDSSafeAny[],
      AttributeValues:[] as TDSSafeAny[]
    };
    let IdList = this.createAttributeForm.controls.Attributes.value as Array<TDSSafeAny>;
    IdList.forEach(id =>{
      let index = this.attributeList.findIndex(f=>f.AttributeId == id);
      if(index > -1){
        let valueList = this.attributeValueList.filter(f=>f.AttributeId == id);
        this.listOfData.push({
          Name: this.attributeList[index].AttributeName,
          AttributeId:this.attributeList[index].AttributeId,
          Values: valueList
        });
        this.ModelDefault.AttributeLines.push({
          Attribute:this.attributeList[index].AttributeId,
          Values:[]
        })
      }
    });
    this.isLoading = false;
  }

  prepareModel(){
    let lines = this.ModelDefault.AttributeLines as Array<TDSSafeAny>;
    let valuesIdList:Array<TDSSafeAny> = [];
    lines.forEach(line => {
      valuesIdList= valuesIdList.concat(line.Values)
    });

    this.ModelDefault.AttributeValues = [];
    valuesIdList.forEach(valueId => {
      let attributeValue = this.attributeValueList.find(f=>f.Id === valueId);
      if(attributeValue){
        this.ModelDefault.AttributeValues.push(attributeValue)
      }
    });

    return this.ModelDefault;
  }

  checkValidate(){
    let lines = this.ModelDefault.AttributeLines as Array<TDSSafeAny>;
    let result= false;
    lines.forEach(line => {
      if(line.Values.length == 0){
        result = true
      }
    });
    if(lines.length == 0){
      result = true
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
