import { ProductTemplateService } from './../../../../services/product-template.service';
import { Subject } from 'rxjs';
import { SharedService } from './../../../../services/shared.service';
import { takeUntil } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { TDSSafeAny, TDSMessageService, TDSModalRef } from 'tmt-tang-ui';

@Component({
  selector: 'app-config-add-variant-product-modal',
  templateUrl: './config-add-variant-product-modal.component.html',
  styleUrls: ['./config-add-variant-product-modal.component.scss']
})
export class ConfigAddVariantProductModalComponent implements OnInit, OnDestroy {
  @Input() data!:TDSSafeAny;

  productTypeList:Array<TDSSafeAny> = [];
  attributeValueList:Array<TDSSafeAny> = [];
  attributeList:Array<TDSSafeAny> = [];
  valueList:Array<TDSSafeAny> = [];
  addProductVariantForm!:FormGroup;
  private destroy$ = new Subject<void>();
  modelDefault:TDSSafeAny;

  constructor(
    private modal: TDSModalRef, 
    private message: TDSMessageService, 
    private sharedService: SharedService,
    private productTemplateService: ProductTemplateService,
    private formBuilder: FormBuilder
  ) { 
      this.initForm();
      this.loadProductTypeList();
      this.loadProductAttributeValue();
  }

  ngOnInit(): void {
    this.addProductVariantForm.controls.Barcode.setValue(this.data.Barcode);
    this.addProductVariantForm.controls.DefaultCode.setValue(this.data.DefaultCode);

    this.modelDefault = {
      Active: true,
      AttributeLines:{
        Attribute:null,
        Values:[]
      },
      AttributeValues:[],
      Barcode: '',
      DefaultCode: '',
      Image: null,
      ImageUrl:null,
      ListPrice: 0,
      PurchaseOK: true,
      SaleOK: true,
      Type: 'product'
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  initForm(){
    this.addProductVariantForm = this.formBuilder.group({
      Image: [null],
      ImageUrl: [null],
      SaleOK: [true],
      PurchaseOK: [true],
      Active: [true],
      Type: ['product'],
      DefaultCode: [null],
      Barcode: [null],
      Attributes: [null,Validators.required],
      Values: [[],Validators.required],
      ListPrice: [0],
    });
  }

  loadProductTypeList(){
    this.productTypeList = [
      { value: 'product', text: 'Có thể lưu trữ' },
      { value: 'consu', text: 'Có thể tiêu thụ' },
      { value: 'service', text: 'Dịch vụ' }
    ];
  }

  loadProductAttributeValue(){
    return this.productTemplateService.getProductAttributeValue().pipe(takeUntil(this.destroy$)).subscribe(
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

  onSelectAttribute(attributeId:TDSSafeAny){
    this.valueList = [];
    this.addProductVariantForm.controls.Values.reset(null);
    this.valueList = this.attributeValueList.filter(f=>f.AttributeId == attributeId);
  }

  onSelectFile(item: TDSSafeAny) {
    if(item.target.files && item.target.files[0]){
      let file = item.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        let url = reader.result as string;
        let base64 = url.split(",")[1];
        let model = {
          Base64: base64,
          Name: file.name
        }

        this.sharedService.uploadImage(model).pipe(takeUntil(this.destroy$)).subscribe(
          (res:TDSSafeAny)=>{
            if (res) {
              this.addProductVariantForm.controls.Image.setValue(res);
            } else {
              this.message.error("Không upload được file lớn hơn 3Mb");
            }
          },
          (err)=>{
            this.message.error("Upload thất bại");
          }
        )
      }
    }
  }
  prepareModel(){
    let formModel = this.addProductVariantForm.value;
    
    if(formModel.Name){
      this.modelDefault.Name = formModel.Name;
    }
    if(formModel.Image) {
      this.modelDefault.Image = formModel.Image;
    }
    if(formModel.ImageUrl) {
      this.modelDefault.ImageUrl = formModel.ImageUrl;
    }
    if(formModel.SaleOK) {
        this.modelDefault.SaleOK = formModel.SaleOK;
    }
    if(formModel.PurchaseOK) {
        this.modelDefault.PurchaseOK = formModel.PurchaseOK;
    }
    if(formModel.Active) {
      this.modelDefault.Active = formModel.Active;
    }
    if(formModel.Type) {
      this.modelDefault.Type = formModel.Type;
    }
    if(formModel.ListPrice) {
      this.modelDefault.ListPrice = formModel.ListPrice;
    }
    if(formModel.DefaultCode) {
      this.modelDefault.DefaultCode = formModel.DefaultCode;
    }
    if(formModel.Barcode) {
      this.modelDefault.Barcode = formModel.Barcode;
    }
    if(formModel.Attributes && formModel.Values) {      
      let attributeId = this.addProductVariantForm.controls.Attributes.value;
      let valueIdList = this.addProductVariantForm.controls.Values.value as Array<TDSSafeAny>;
      
      let valuesList = this.attributeValueList.filter(f=> valueIdList.includes(f.Id));
      this.modelDefault.AttributeValues = valuesList;

      let values:TDSSafeAny[] = [];
      valuesList.forEach(value => {
        values.push({
          Id: value.Id,
          Name: value.Name,
          NameGet: value.NameGet,
          PriceExtra: value.PriceExtra,
          Sequence: value.Sequence
        })
      });
      
      let attributes = this.attributeValueList.find(f=> f.AttributeId == attributeId);

      this.modelDefault.AttributeLines = {
        Attribute: {
          AttributeId: attributes.AttributeId,
          AttributeName: attributes.AttributeName,
          Code: attributes.Code
        },
        Values: values
      };
    }

    return this.modelDefault;
  }

  onSubmit() {
    if (!this.addProductVariantForm.invalid) {
      let model = this.prepareModel();
      
      this.modal.destroy(model);
      this.addProductVariantForm.reset();
    }
  }

  cancel() {
      this.modal.destroy(null);
  }

  save() {
      this.onSubmit();
  }
}
