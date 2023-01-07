import { ProductTemplateDto } from './../../../../dto/configs/product/config-product-default-v2.dto';
import { AttributeLineDto, ProductVariantDto, AttributeValueDto } from './../../../../dto/configs/product/config-product-variant.dto';
import { TDSDestroyService } from 'tds-ui/core/services';
import { takeUntil } from 'rxjs';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalRef } from 'tds-ui/modal';
import { TDSSafeAny, TDSHelperString, TDSHelperArray } from 'tds-ui/shared/utility';
import { ProductTemplateService } from './../../../../services/product-template.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ConfigAttributeLine } from '../../../../dto/configs/product/config-product-default.dto';
import { Component, Input, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-create-variants-modal',
  templateUrl: './create-variants-modal.component.html',
  providers: [TDSDestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateVariantsModalComponent implements OnInit {

  @Input() listType!: TDSSafeAny[];
  @Input() lstAttributeLine!: AttributeLineDto[];
  @Input() lstProductDefault!: TDSSafeAny;
  @Input() suggestModel!: ProductTemplateDto;
  @Input() lstProductVariant!: ProductVariantDto;

  _form!: FormGroup;
  attributeModel: AttributeLineDto[] = [];
  isEdit = false;
  isRootVariant = false;
  isLoading = false;
  
  numberWithCommas =(value:TDSSafeAny) =>{
    if(value != null)
    {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    return value;
  } ;

  parserComas = (value: TDSSafeAny) =>{
    if(value != null)
    {
      return TDSHelperString.replaceAll(value,'.','');
    }
    return value;
  };

  constructor(private fb: FormBuilder,
    private modal: TDSModalRef,
    private productTemplateService: ProductTemplateService,
    private message: TDSMessageService,
    private cdRef: ChangeDetectorRef,
    private destroy$: TDSDestroyService) {
    this.createForm();
  }

  ngOnInit(): void {
    this._form.controls["ImageUrl"].setValue(this.lstProductVariant?.ImageUrl);

    this.lstAttributeLine.forEach((item) => {
      let editValues = this.lstProductVariant?.AttributeValues.filter(f => f.AttributeId == item.AttributeId);
      this.attributeModel.push({
        AttributeId: item.AttributeId,
        Attribute: item.Attribute,
        Values: editValues || []
      })
    });

    this._form.patchValue(this.lstProductVariant ? this.lstProductVariant : this.lstProductVariant);
    this.getCondition();
    this.cdRef.markForCheck();
  }

  createForm() {
    this._form = this.fb.group({
      NameTemplate: [null],
      Image: [null],
      ImageUrl: [null],
      SaleOK: [true],
      PurchaseOK: [true],
      Active: [true],
      Type: [null],
      PriceVariant: [0],
      DefaultCode: [null],
      Barcode: [null]
    });

    this._form.controls["Type"].disable();
  }

  getCondition(){
    if(this.lstProductVariant){
      if(TDSHelperArray.isArray(this.lstProductVariant.AttributeValues) && TDSHelperArray.hasListValue(this.lstProductVariant.AttributeValues)){
        this.isRootVariant = false;
        this.isEdit = true;
      }else{
        this.isRootVariant = true;
        this.isEdit = true;
      }
    }else{
      this.isEdit = false;
    }
  }

  getImage(url: string) {
    this._form.controls.ImageUrl.setValue(url);
  }

  getBase64(base64: TDSSafeAny) {
    this._form.controls.Image.setValue(base64);
  }

  onChangeAttribute(data: AttributeValueDto, attributeId: number) {
    this.attributeModel.map((item) => {
      if (item.AttributeId == attributeId) {
        item.Values = [data] as AttributeValueDto[];
      }
    }
    )
  }

  checkValidate() {
    let res = true;

    //TODO: check giá trị của thuộc tính có được điền đầy đủ hay chưa
    this.attributeModel.forEach(attr => {
      if (attr.Values.length == 0) {
        res = false;
      }
    });
    return res;
  }

  prepareModel(data: ProductVariantDto) {
    data = {...data, ...this._form.value};
    data.AttributeValues = TDSHelperArray.hasListValue(data.AttributeValues) ? data.AttributeValues : this.lstProductVariant?.AttributeValues;
    return data;
  }

  save() {
    if (this.checkValidate()) {
      if (this.suggestModel) {
        this.suggestModel.AttributeLines = [...this.attributeModel];
      }

      if (this.lstProductVariant) {
        this.message.success('Chỉnh sửa biến thể thành công');
        this.modal.destroy(this.prepareModel(this.lstProductVariant));
      } else {
        this.isLoading = true;

        this.productTemplateService.suggestVariants({ model: this.suggestModel }).pipe(takeUntil(this.destroy$)).subscribe({
            next: (res) => {
              if(res && TDSHelperArray.hasListValue(res.value)) {
                this.modal.destroy(this.prepareModel(res.value[0]));
              } else {
                this.message.error('Không có dữ liệu trả về');
              }

              this.isLoading = false;
            },
            error: (err) => {
              this.isLoading = false;
              this.message.error(err?.error?.message || 'Không thể tải dữ liệu biến thể');
            }
          })
      }
    } else {
      this.message.error('Lỗi dữ liệu');
    }
  }

  cancel() {
    this.modal.destroy(null);
  }
}
