import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { TDSDestroyService } from 'tds-ui/core/services';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ProductUOMService } from '../../services/product-uom.service';
import { Message } from 'src/app/lib/consts/message.const';
import { ProductUOMDTO } from '../../dto/product/product-uom.dto';
import { TDSModalRef } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { TDSSafeAny, TDSHelperString, TDSHelperArray } from 'tds-ui/shared/utility';

@Component({
  selector: 'tpage-add-uom',
  templateUrl: './tpage-add-uom.component.html',
  providers: [TDSDestroyService]
})
export class TpageAddUOMComponent implements OnInit {

  _form!: FormGroup;
  lstUOMCategory!: Array<ProductUOMDTO>;
  isLoading: boolean = false;

  lstUOMType: any[] = [
    {type: "bigger",text: "Lớn hơn đơn vị gốc"},
    {type: "reference",text: "Là đơn vị gốc của nhóm này"},
    {type: "smaller",text: "Nhỏ hơn đơn vị gốc"},
  ];

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
    private modalRef: TDSModalRef,
    private message: TDSMessageService,
    private productUOMService: ProductUOMService,
    private destroy$: TDSDestroyService) { 
      this.createForm();
  }

  ngOnInit(): void {
    this.loadProductUOMCateg();
  }

  loadProductUOMCateg() {
    this.isLoading = true;

    this.productUOMService.getUOMCateg().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        if(res && TDSHelperArray.hasListValue(res.value)) {
          this.lstUOMCategory = [...res.value];
        }
        
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.message.error(err?.error?.message || 'Đã xảy ra lỗi');
      }
    });
  }

  createForm() {
    this._form = this.fb.group({
      Name: [null, Validators.required],
      Category: [null, Validators.required],
      UOMType: ["reference", Validators.required],
      Factor: [1],
      FactorInv: [1],
      Active: [true],
      Rounding: [0.01]
    });
  }

  prepareModel() {
    const formModel = this._form.value;

    let model = {
      Active: formModel.Active,
      Category: formModel.Category,
      CategoryId: formModel.Category?.Id,
      CategoryName: formModel.Category?.Name,
      Factor: formModel.Factor,
      FactorInv: formModel.FactorInv,
      Name: formModel.Name,
      Rounding: formModel.Rounding,
      UOMType: formModel.UOMType,
    };

    return model;
  }

  onSave() {
    if(this.isLoading) {
      return;
    }
    
    if(!this._form.valid) {
      this._form.markAllAsTouched(); //TODO: set touched cho toàn bộ formcontrol
      this.message.error('Dữ liệu không hợp lệ');
      return;
    }

    let model = this.prepareModel();
    this.isLoading = true;

    this.productUOMService.insert(model).subscribe({
      next:(res) => {

        if(res) {
          delete res['@odata.context'];
          
          this.message.success(Message.ProductUOM.InsertSuccess);
          this.onCancel(res);
        }
        
        this.isLoading = false;
      },
      error:(err) => {
        this.isLoading = false;
        this.message.error(err?.error?.message || Message.InsertFail);
      }
    });
  }

  onCancel(result: TDSSafeAny) {
    this.modalRef.destroy(result);
  }
}
