import { AttributeLineDto, AttributeValueDto, AttributeDto } from './../../../../dto/configs/product/config-product-variant.dto';
import { TDSDestroyService } from 'tds-ui/core/services';
import { TDSHelperString } from 'tds-ui/shared/utility';
import { Message } from '../../../../../lib/consts/message.const';
import { ConfigAttributeLine, ConfigAttributeValue, ConfigAttribute } from '../../../../dto/configs/product/config-product-default.dto';
import { takeUntil } from 'rxjs/operators';
import { ProductTemplateService } from '../../../../services/product-template.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, OnDestroy, Input, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalRef } from 'tds-ui/modal';

@Component({
  selector: 'app-config-attribute-modal',
  templateUrl: './config-attribute-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TDSDestroyService]
})
export class ConfigAddAttributeProductModalComponent implements OnInit {
  @Input() lstAttributeLine: Array<AttributeLineDto> = []; //TODO: model thuộc tính- giá trị

  _form!: FormGroup;
  lstData: Array<AttributeValueDto> = [];
  attributeList: Array<AttributeDto> = []; //TODO: list get toàn bộ thuộc tính
  lstValue: Array<AttributeLineDto> = [];//TODO: danh sách value (data của select attribute)
  dataModel: Array<AttributeLineDto> = [];

  isLoading = false;

  constructor(
    private modal: TDSModalRef,
    private message: TDSMessageService,
    private productTemplateService: ProductTemplateService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private destroy$: TDSDestroyService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.loadProductAttributeValue();
  }

  createForm() {
    this._form = this.formBuilder.group({
      Attributes: [[]]
    });
  }

  loadProductAttributeValue() {
    this.isLoading = true;

    this.productTemplateService.getProductAttributeValue().pipe(takeUntil(this.destroy$)).subscribe({
      next:(res: TDSSafeAny) => {
        this.lstData = res.value;
        this.attributeList = [];

        // TODO: lấy danh sách toàn bộ attribute từ danh sách attribute-value
        this.lstData.forEach(item => {
          let exist = this.attributeList.find(f => f.Id === item.AttributeId);

          if (!exist) {
            this.attributeList.push({
              Id: item.AttributeId,
              Name: item.AttributeName,
              Code: item.Code,
              Sequence: item.Sequence,
              CreateVariant: true
            });
          }
        });

        this.dataModel = [...this.lstAttributeLine];
        
        //TODO: lấy danh sách select value cho các dòng attribute
        this.lstValue = this.dataModel.map((data) => {
          return {
            Attribute: data.Attribute,
            AttributeId: data.AttributeId,
            Values: this.lstData.filter(f => f.AttributeId == data.AttributeId)
          }
        });

        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error:(err) => {
        this.isLoading = false;
        this.message.error(err?.error?.message || Message.CanNotLoadData);
        this.cdr.markForCheck();
      }
    })
  }

  onSelectAttribute() {
    if(this.isLoading){
      return;
    }
    
    let lstSelectAttr = this._form.controls.Attributes.value as Array<AttributeDto> || [];

    if (lstSelectAttr.length == 0) {
      this.message.error('Vui lòng chọn thuộc tính');
      return
    }

    this.isLoading = true;
    //TODO: thêm các dòng attribute mới cho modelData và danh sách các thuộc tính của dòng đó
    lstSelectAttr.forEach(attr => {
      let exist = this.dataModel.find(f => f.AttributeId == attr.Id);

      if (!exist) {
        let lstValues = this.lstData.filter(f => f.AttributeId == attr.Id);

        this.dataModel.push({
          Attribute: attr,
          AttributeId: attr.Id,
          Values: []
        });

        this.lstValue.push({
          Attribute: attr,
          AttributeId: attr.Id,
          Values: lstValues
        });

        this.dataModel = [...this.dataModel];
      }
    });

    this._form.controls.Attributes.reset();
    this.isLoading = false;
  }

  deleteAttribute(AttributeId: number) {
    this.isLoading = true;
    // remove trên model
    this.dataModel = this.dataModel.filter(f => f.AttributeId != AttributeId);
    // remove trên table data
    this.lstValue = this.lstValue.filter(f => f.AttributeId != AttributeId);

    this.isLoading = false;
  }

  onSelectValues(data: Array<AttributeValueDto>, AttributeId: number) {
    // TODO: gắn value cho attribute
    this.dataModel.map((model) => {
      if (model.AttributeId == AttributeId) {
        model.Values = data;
      }
    })
  }

  checkValidate() {
    let result = '';

    if (this.dataModel && this.dataModel.length == 0) {
      result = 'Vui lòng chọn thuộc tính';
    }

    this.dataModel.map(x => {
      if (x?.Values?.length == 0) {
        result = 'Vui lòng chọn đầy đủ giá trị thuộc tính';
      }
    });

    return result;
  }

  onCancel() {
    this.modal.destroy(null);
  }

  onSave() {
    if(this.isLoading) {
      return;
    }

    let validate = this.checkValidate();

    if (!TDSHelperString.hasValueString(validate)) {
      this.modal.destroy(this.dataModel);
      this._form.reset();
    } else {
      this.message.error(validate);
    }
  }
}
