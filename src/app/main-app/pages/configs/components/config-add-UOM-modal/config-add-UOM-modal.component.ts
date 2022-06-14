import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProductTemplateService } from './../../../../services/product-template.service';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalRef } from 'tds-ui/modal';
import { TDSSafeAny } from 'tds-ui/shared/utility';

@Component({
  selector: 'app-config-add-uom-modal',
  templateUrl: './config-add-uom-modal.component.html'
})
export class ConfigAddUOMModalComponent implements OnInit, OnDestroy {
  @Input() type!:string;

  addUOMForm!:FormGroup;
  private destroy$ = new Subject<void>();

  constructor(
    private modal: TDSModalRef,
    private message: TDSMessageService,
    private productTemplate:ProductTemplateService,
    private formBuilder: FormBuilder
  ) {
    this.initForm();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initForm(){
    this.addUOMForm = this.formBuilder.group({
      Address: [null],
      Code: [null],
      Email: [null],
      Name: [null,Validators.required],
      Note: [null],
      Phone: [null],
      Type: [null]
    });
  }

  prepareModel() {
    let formModel = this.addUOMForm.value;
    let model = {
      Address: formModel.Address,
      Code: formModel.Code,
      Email: formModel.Email,
      Name: formModel.Name,
      Note: formModel.Note,
      Phone: formModel.Phone,
      Type: this.type
    };

    return model;
  }

  onSubmit() {
    if (!this.addUOMForm.invalid) {
      if(this.type){
        let model = this.prepareModel();
        this.productTemplate.insertPartnerExt(model).pipe(takeUntil(this.destroy$)).subscribe(
          (res:TDSSafeAny)=>{
            this.message.success('Thêm thành công');
            this.modal.destroy(model);
            this.addUOMForm.reset();
          },
          err=>{
            this.message.error(err.error.message??'Thêm thất bại');
          }
        )
      }else{
        this.message.error('Chưa xác định type');
      }
    }
  }

  cancel() {
      this.modal.destroy(null);
  }

  save() {
      this.onSubmit();
  }
}
