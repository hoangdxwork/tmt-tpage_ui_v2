import { Subject, finalize } from 'rxjs';
import { takeUntil } from 'rxjs';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalRef } from 'tds-ui/modal';
import { TDSSafeAny, TDSHelperString } from 'tds-ui/shared/utility';
import { ProductTemplateService } from './../../../../services/product-template.service';
import { ConfigProductVariant, ConfigAttributeValue, ConfigSuggestVariants } from './../../../../dto/configs/product/config-product-default.dto';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ConfigAttributeLine } from '../../../../dto/configs/product/config-product-default.dto';
import { Component, Input, OnInit, ChangeDetectorRef, AfterViewInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-create-variants-modal',
  templateUrl: './create-variants-modal.component.html'
})
export class CreateVariantsModalComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() attributeLines!:ConfigAttributeLine[];
  @Input() productTypeList!:TDSSafeAny[];
  @Input() defaultModel!:TDSSafeAny;
  @Input() suggestModel!:ConfigSuggestVariants;
  @Input() editModel!:ConfigProductVariant;
  
  _form!:FormGroup;
  attributeModel:ConfigAttributeLine[] = [];
  isLoading = false;
  numberWithCommas =(value:TDSSafeAny) =>{
    if(value != null){
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    return value
  };
  parserComas = (value: TDSSafeAny) =>{
    if(value != null)
    {
      return TDSHelperString.replaceAll(value,',','');
    }
    return value
  };

  private destroy$ = new Subject<void>();

  constructor(private fb:FormBuilder,
    private modal:TDSModalRef,
    private productTemplateService:ProductTemplateService,
    private message: TDSMessageService,
    private cdRef:ChangeDetectorRef) {
      this.createForm();
    }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.attributeLines.forEach((item)=>{
      let editValues = this.editModel?.AttributeValues.filter(f=>f.AttributeId == item.AttributeId);
      this.attributeModel.push({
        AttributeId: item.AttributeId,
        Attribute: item.Attribute,
        Values: editValues || []
      })
    });
    
    if(this.editModel){
      this._form.patchValue(this.editModel);
      this.defaultModel = {
        Name:this.editModel.NameTemplate
      }
      this.cdRef.detectChanges();
    }else{
      this._form.patchValue(this.defaultModel);
      this.cdRef.detectChanges();
    }
  }

  createForm(){
    this._form = this.fb.group({
      ImageUrl:[null],
      SaleOK:[true],
      PurchaseOK:[true],
      Active:[true],
      Type:[null],
      PriceVariant:[0],
      DefaultCode:[null],
      Barcode:[null]
    });
  }

  getImage(url:string){
    this._form.controls.ImageUrl.setValue(url);
  }

  onChangeAttribute(data:ConfigAttributeValue, attributeId:number){
    this.attributeModel.forEach(
      (item,i)=>{
        if(item.AttributeId == attributeId){
          this.attributeModel[i].Values = [data] as ConfigAttributeValue[];
        }
      }
    )
  }

  checkValidate(){
    let res = true;
    
    //TODO: check giá trị của thuộc tính có được điền đầy đủ hay chưa
    this.attributeModel.forEach(attr => {
      if(attr.Values.length == 0){
        res = false;
      }
    });
    return res;
  }

  prepareModel(data:ConfigProductVariant){
    let formModel = this._form.value;
    data.PriceVariant = formModel.PriceVariant || data.PriceVariant;
    data.ImageUrl = formModel.ImageUrl || data.ImageUrl;
    data.SaleOK = formModel.SaleOK || formModel.SaleOK == false ? formModel.SaleOK : data.SaleOK;
    data.PurchaseOK = formModel.PurchaseOK || formModel.PurchaseOK == false ? formModel.PurchaseOK : data.PurchaseOK;
    data.Active = formModel.Active || formModel.Active == false ? formModel.Active : data.Active;
    data.Type = formModel.Type || data.Type;
    data.DefaultCode = formModel.DefaultCode || data.DefaultCode;
    data.Barcode = formModel.Barcode || data.Barcode;

    return data;
  }

  save(){
    if(this.checkValidate()){
      if(this.suggestModel){
        this.suggestModel.AttributeLines = this.attributeModel;
      }
      
      this.isLoading = true;
      this.productTemplateService.suggestVariants({model: this.suggestModel})
        .pipe(takeUntil(this.destroy$), finalize(()=>this.isLoading = false))
        .subscribe(
          (res)=>{
            let dataModel = this.prepareModel(res.value[0]);
            this.message.success(this.editModel ? 'Chỉnh sửa biến thể thành công' : 'Thêm biến thể thành công');
            this.modal.destroy(dataModel);
          },
          (err)=>{
            this.message.error(err?.error?.message || 'Không thể tải dữ liệu biến thể');
          }
        )
    }else{
      this.message.error('Lỗi dữ liệu');
    }
  }

  cancel(){
    this.modal.destroy(null);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
