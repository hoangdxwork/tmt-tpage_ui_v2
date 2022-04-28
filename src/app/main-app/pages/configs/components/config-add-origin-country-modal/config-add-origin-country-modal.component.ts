import { ProductTemplateService } from './../../../../services/product-template.service';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { TDSSafeAny, TDSUploadFile, TDSMessageService, TDSUploadChangeParam, TDSModalRef } from 'tmt-tang-ui';

@Component({
  selector: 'app-config-add-origin-country-modal',
  templateUrl: './config-add-origin-country-modal.component.html',
  styleUrls: ['./config-add-origin-country-modal.component.scss']
})
export class ConfigAddOriginCountryModalComponent implements OnInit, OnDestroy {
  originCountyForm!:FormGroup;
  private destroy$ = new Subject<void>();

  constructor(
    private modal: TDSModalRef, 
    private message: TDSMessageService, 
    private productTemplateService: ProductTemplateService,
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
    this.originCountyForm = this.formBuilder.group({
      Code: [null],
      Name: [null,Validators.required],
      Note: [null]
    });
  }

  repareModel() {
    let formModel = this.originCountyForm.value;
    let model = {
      Code: formModel.Code,
      Name: formModel.Name,
      Note: formModel.Note
    };

    return model;
  }

  onSubmit() {
    if (!this.originCountyForm.invalid) {
      let model = this.repareModel();
      this.productTemplateService.insertOriginCountry(model).pipe(takeUntil(this.destroy$)).subscribe(
        (res:TDSSafeAny)=>{
          this.message.success('Thêm mới thành công');
          this.modal.destroy(this.originCountyForm);
          this.originCountyForm.reset();
        },
        err=>{ 
          this.message.error(err.error.message??'Thêm thất bại');
        }
      )
      
    }
  }

  cancel() {
      this.modal.destroy(null);
  }

  save() {
      this.onSubmit();
  }
}
