import { TDSMessageService } from 'tds-ui/message';
import { TpageSearchUOMComponent } from './../../../../shared/tpage-search-uom/tpage-search-uom.component';
import { takeUntil } from 'rxjs';
import { TpageAddUOMComponent } from './../../../../shared/tpage-add-uom/tpage-add-uom.component';
import { TDSModalService, TDSModalRef } from 'tds-ui/modal';
import { TDSSafeAny, TDSHelperString } from 'tds-ui/shared/utility';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TDSDestroyService } from 'tds-ui/core/services';
import { ConfigUOM, UOMLine } from './../../../../dto/configs/product/config-product-default.dto';
import { Component, OnInit, Input, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-create-unit',
  templateUrl: './create-unit.component.html',
  providers: [TDSDestroyService]
})
export class CreateUnitComponent implements OnInit {

  @Input() lstUOM: ConfigUOM[] = [];
  @Input() Item!: UOMLine;

  _form!: FormGroup;

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

  constructor(private destroy$: TDSDestroyService,
    private fb: FormBuilder,
    private modalRef: TDSModalRef,
    private modalService: TDSModalService,
    private message: TDSMessageService,
    private viewContainerRef: ViewContainerRef) { 
      this.createForm();
    }

  ngOnInit(): void {
    if(this.Item){
      this.updateForm(this.Item);
    }
  }

  createForm(){
    this._form = this.fb.group({
      UOM: [null, Validators.required],
      ListPrice: [0],
      Barcode: [null]
    })
  }

  updateForm(data: UOMLine){
    this._form.patchValue(data);
  }

  showCreateUOMModal(){
    const modal = this.modalService.create({
      title: 'Thêm đơn vị tính',
      content: TpageAddUOMComponent,
      size: "lg",
      viewContainerRef: this.viewContainerRef
    });

    modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe(res => {
      if(res){
        delete res["@odata.context"];
        this._form.controls["UOM"].setValue(res);
      }
    });
  }

  onSearchUOM() {
    const modal = this.modalService.create({
      title: 'Tìm kiếm đơn vị tính',
      content: TpageSearchUOMComponent,
      size: 'lg',
      viewContainerRef: this.viewContainerRef
    });

    modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe(res => {
      if(res){
        this._form.controls["UOM"].setValue(res);
      }
    });
  }

  prepareModel(){
    let model = {} as UOMLine;
    let formModel = this._form.value;

    if(formModel.Barcode){
      model.Barcode = formModel.Barcode;
    }

    if(formModel.UOM){
      model.UOM = formModel.UOM;
      model.UOMId = formModel.UOM.Id;
    }

    if(formModel.ListPrice){
      model.ListPrice = formModel.ListPrice;
    }

    return model;
  }

  onSave(){
    if(!this._form.controls["UOM"].value){
      this.message.error('Vui lòng chọn đơn vị tính');
      return;
    }

    let model = this.prepareModel();
    this.modalRef.destroy(model);
  }

  onCancel(){
    this.modalRef.destroy(null);
  }
}
