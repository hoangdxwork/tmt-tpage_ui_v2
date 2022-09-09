import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';
import { ProductUOMService } from '../../services/product-uom.service';
import { Message } from 'src/app/lib/consts/message.const';
import { ProductUOMDTO } from '../../dto/product/product-uom.dto';
import { TDSModalRef } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { TDSSafeAny, TDSHelperString } from 'tds-ui/shared/utility';

@Component({
  selector: 'tpage-add-uom',
  templateUrl: './tpage-add-uom.component.html'
})
export class TpageAddUOMComponent implements OnInit, OnDestroy {

  _form!: FormGroup;

  lstUOMCategory!: Array<ProductUOMDTO>;

  lstUOMType: any[] = [
    {type: "bigger",text: "Lớn hơn đơn vị gốc"},
    {type: "reference",text: "Là đơn vị gốc của nhóm này"},
    {type: "smaller",text: "Nhỏ hơn đơn vị gốc"},
  ];

  private destroy$ = new Subject<void>();

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

  constructor(
    private fb: FormBuilder,
    private modalRef: TDSModalRef,
    private message: TDSMessageService,
    private productUOMService: ProductUOMService
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.loadProductUOMCateg();
  }

  loadProductUOMCateg() {
    this.productUOMService.getUOMCateg().subscribe((res: any) => {
      this.lstUOMCategory = res.value;
    });
  }

  createForm() {
    this._form = this.fb.group({
      Name: [null, Validators.required],
      Category: [null, Validators.required],
      UOMType: ["reference"],
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
      CategoryId: formModel.Category.Id,
      CategoryName: formModel.Category.Name,
      Factor: formModel.Factor,
      FactorInv: formModel.FactorInv,
      Name: formModel.Name,
      Rounding: formModel.Rounding,
      UOMType: formModel.UOMType,
    };

    return model;
  }

  onSave() {
    let model = this.prepareModel();
    
    this.productUOMService.insert(model).subscribe(res => {
      this.message.success(Message.ProductUOM.InsertSuccess);
      this.onCancel(res);
    },
    error=>{
      this.message.error(error?.error?.message || Message.InsertFail);
    });
  }

  onCancel(result: TDSSafeAny) {
    this.modalRef.destroy(result);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
