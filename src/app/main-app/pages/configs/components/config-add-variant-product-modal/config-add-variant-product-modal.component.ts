import { Subject } from 'rxjs';
import { SharedService } from './../../../../services/shared.service';
import { takeUntil } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { TDSSafeAny, TDSMessageService, TDSModalRef } from 'tmt-tang-ui';

@Component({
  selector: 'app-config-add-variant-product-modal',
  templateUrl: './config-add-variant-product-modal.component.html'
})
export class ConfigAddVariantProductModalComponent implements OnInit, OnDestroy {
  @Input() data!:TDSSafeAny;
  @Input() attributeList:Array<TDSSafeAny> = [];

  productTypeList:Array<TDSSafeAny> = [];
  
  addProductVariantForm!:FormGroup;
  private destroy$ = new Subject<void>();
  modelDefault:TDSSafeAny;

  constructor(
    private modal: TDSModalRef, 
    private message: TDSMessageService, 
    private sharedService: SharedService,
    private formBuilder: FormBuilder
  ) { 
      this.initForm();
      this.loadProductTypeList();
  }

  ngOnInit(): void {
    this.addProductVariantForm.controls.Barcode.setValue(this.data.Barcode);
    this.addProductVariantForm.controls.DefaultCode.setValue(this.data.DefaultCode);

    this.modelDefault = {
      Active: true,
      AttributeLines:[],
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
      ListPrice: [0]
    });
  }

  loadProductTypeList(){
    this.productTypeList = [
      { value: 'product', text: 'Có thể lưu trữ' },
      { value: 'consu', text: 'Có thể tiêu thụ' },
      { value: 'service', text: 'Dịch vụ' }
    ];
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

  onSelectAttribute(Value:TDSSafeAny,Attribute:TDSSafeAny){
    let lines = this.modelDefault.AttributeLines as Array<TDSSafeAny>;
    let index = lines.findIndex(f=>f.AttributeId == Attribute.AttributeId);
    if(Value == null){
      this.modelDefault.AttributeLines.splice(index,1);
    }else{
      if(index > -1){
        this.modelDefault.AttributeLines[index].Values[0] = {
          AttributeId: Attribute.AttributeId,
          AttributeName: Attribute.AttributeName,
          Code: Attribute.Code,
          Id: Value.Id,
          Name: Value.Name,
          NameGet: Value.NameGet,
          PriceExtra: Value.PriceExtra,
          Sequence: Value.Sequence
        }
      }else{
        this.modelDefault.AttributeLines.push({
          Attribute:{
            Code: Attribute.Code,
            CreateVariant: true,
            Id: Attribute.AttributeId,
            Name: Attribute.AttributeName,
            Sequence: Attribute.Sequence
          },
          AttributeId: Attribute.AttributeId,
          Values:[
            {
              AttributeId: Attribute.AttributeId,
              AttributeName: Attribute.AttributeName,
              Code: Attribute.Code,
              Id: Value.Id,
              Name: Value.Name,
              NameGet: Value.NameGet,
              PriceExtra: Value.PriceExtra,
              Sequence: Value.Sequence
            }
          ]
        });
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
