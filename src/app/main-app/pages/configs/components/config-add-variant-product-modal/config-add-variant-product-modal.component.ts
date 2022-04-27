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
  @Input() name!:string;

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
    this.modelDefault = {
      Name:this.name,
      Active: false,
      AttributeValues: '',
      Barcode: '',
      DefaultCode: '',
      Image: null,
      ListPrice: 0,
      PurchaseOK: false,
      SaleOK: false,
      Type: 'product'
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  initForm(){
    this.addProductVariantForm = this.formBuilder.group({
      Name: [null],
      Image: [null],
      SaleOK: [false],
      PurchaseOK: [false],
      Active: [false],
      Type: ['product'],
      DefaultCode: [null],
      Barcode: [null],
      AttributeValues: [null,Validators.required],
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
    if(formModel.AttributeValues) {
      this.modelDefault.AttributeValues = formModel.AttributeValues;
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
