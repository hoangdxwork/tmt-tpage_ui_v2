import { filter } from 'rxjs/operators';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { TDSSafeAny, TDSUploadFile, TDSMessageService, TDSUploadChangeParam, TDSModalRef } from 'tmt-tang-ui';

@Component({
  selector: 'app-config-add-made-in-modal',
  templateUrl: './config-add-made-in-modal.component.html',
  styleUrls: ['./config-add-made-in-modal.component.scss']
})
export class ConfigAddMadeInModalComponent implements OnInit {
  addMadeInForm!:FormGroup;

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
    this.addMadeInForm = this.formBuilder.group({
      nationName: new FormControl('', [Validators.required]),
      nationCode: new FormControl('', [Validators.required]),
      note: new FormControl(''),
    });
  }

  resetForm(){
    this.addMadeInForm.reset({
      nationName: '',
      nationCode: '',
      note:''
    });
  }

  onSubmit() {
    if (!this.addMadeInForm.invalid) {
      this.modal.destroy(this.addMadeInForm);
    }
  }

  cancel() {
      this.modal.destroy(null);
  }

  save() {
      this.onSubmit();
  }
}
