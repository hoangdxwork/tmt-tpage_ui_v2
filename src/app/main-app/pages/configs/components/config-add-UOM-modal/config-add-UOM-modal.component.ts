import { filter } from 'rxjs/operators';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { TDSSafeAny, TDSUploadFile, TDSMessageService, TDSUploadChangeParam, TDSModalRef } from 'tmt-tang-ui';

@Component({
  selector: 'app-config-add-uom-modal',
  templateUrl: './config-add-uom-modal.component.html',
  styleUrls: ['./config-add-uom-modal.component.scss']
})
export class ConfigAddUOMModalComponent implements OnInit {
  addmanufacturerForm!:FormGroup;

  constructor(
    private modal: TDSModalRef, 
    private msg: TDSMessageService, 
    private http: HttpClient, 
    private formBuilder: FormBuilder
  ) { 
    this.initForm();
  }

  ngOnInit(): void {
  }

  initForm(){
    this.addmanufacturerForm = this.formBuilder.group({
      manufacturerName: new FormControl('', [Validators.required]),
      manufacturerCode: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required]),
      email: new FormControl(''),
      note: new FormControl(''),
    });
  }

  resetForm(){
    this.addmanufacturerForm.reset({
      manufacturerName: '',
      manufacturerCode: '',
      address: '',
      phone: '',
      email: '',
      note:''
    });
  }

  onSubmit() {
    if (!this.addmanufacturerForm.invalid) {
      this.modal.destroy(this.addmanufacturerForm);
    }
  }

  cancel() {
      this.modal.destroy(null);
  }

  save() {
      this.onSubmit();
  }
}
