import { Subject, finalize } from 'rxjs';
import { takeUntil } from 'rxjs';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalRef } from 'tds-ui/modal';
import { TDSSafeAny, TDSHelperString, TDSHelperArray } from 'tds-ui/shared/utility';
import { ProductTemplateService } from './../../../../services/product-template.service';
import { ConfigProductVariant, ConfigAttributeValue, ConfigSuggestVariants } from './../../../../dto/configs/product/config-product-default.dto';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ConfigAttributeLine } from '../../../../dto/configs/product/config-product-default.dto';
import { Component, Input, OnInit, ChangeDetectorRef, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CreateVariantsHandler } from './create-variants.handler';

@Component({
  selector: 'app-create-variants-modal',
  templateUrl: './create-variants-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateVariantsModalComponent implements OnInit, OnDestroy {

  @Input() listType!: TDSSafeAny[];
  @Input() attributeLines!: ConfigAttributeLine[];
  @Input() defaultModel!: TDSSafeAny;
  @Input() suggestModel!: ConfigSuggestVariants;
  @Input() editModel!: ConfigProductVariant;

  _form!: FormGroup;
  attributeModel: ConfigAttributeLine[] = [];
  isEdit = false;
  isRootVariant = false;
  isLoading = false;
  numberWithCommas = (value: TDSSafeAny) => {
    if (value != null) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    return value
  };
  parserComas = (value: TDSSafeAny) => {
    if (value != null) {
      return TDSHelperString.replaceAll(value, ',', '');
    }
    return value
  };

  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder,
    private modal: TDSModalRef,
    private productTemplateService: ProductTemplateService,
    private message: TDSMessageService,
    private cdRef: ChangeDetectorRef) {
    this.createForm();
  }

  ngOnInit(): void {
    this._form.controls["ImageUrl"].setValue(this.editModel?.ImageUrl);

    this.attributeLines.forEach((item) => {
      let editValues = this.editModel?.AttributeValues.filter(f => f.AttributeId == item.AttributeId);
      this.attributeModel.push({
        AttributeId: item.AttributeId,
        Attribute: item.Attribute,
        Values: editValues || []
      })
    });

    this._form.patchValue(this.editModel ? this.editModel : this.defaultModel);
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
    if(this.editModel){
      if(TDSHelperArray.isArray(this.editModel.AttributeValues) && TDSHelperArray.hasListValue(this.editModel.AttributeValues)){
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

  onChangeAttribute(data: ConfigAttributeValue, attributeId: number) {
    this.attributeModel.map((item) => {
      if (item.AttributeId == attributeId) {
        item.Values = [data] as ConfigAttributeValue[];
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

  prepareModel(data: ConfigProductVariant) {
    CreateVariantsHandler.prepareModel(data, this._form.value);
    data.AttributeValues = TDSHelperArray.hasListValue(data.AttributeValues) ? data.AttributeValues : this.editModel?.AttributeValues;
    return data;
  }

  save() {
    if (this.checkValidate()) {
      if (this.suggestModel) {
        this.suggestModel.AttributeLines = this.attributeModel;
      }

      if (this.editModel) {
        this.message.success('Chỉnh sửa biến thể thành công');
        this.modal.destroy(this.prepareModel(this.editModel));
      } else {
        this.isLoading = true;
        this.productTemplateService.suggestVariants({ model: this.suggestModel })
          .pipe(takeUntil(this.destroy$), finalize(() => { this.isLoading = false }))
          .subscribe(
            (res) => {
              this.modal.destroy(this.prepareModel(res.value[0]));
            },
            (err) => {
              this.message.error(err?.error?.message || 'Không thể tải dữ liệu biến thể');
            }
          )
      }
    } else {
      this.message.error('Lỗi dữ liệu');
    }
  }

  cancel() {
    this.modal.destroy(null);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
