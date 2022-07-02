import { TDSModalRef } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { Message } from './../../../../../lib/consts/message.const';
import { TAuthService } from './../../../../../lib/services/auth.service';
import { UserRestHandler } from './../../../../services/handlers/user-rest.handler';
import { ApplicationUserService } from './../../../../services/application-user.service';
import { finalize } from 'rxjs';
import { UpdateApplicationUserDTO } from './../../../../dto/account/application-user.dto';
import { UserInitDTO } from './../../../../../lib/dto/user-init.dto';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal-edit-info-user',
  templateUrl: './modal-edit-info-user.component.html'
})
export class ModalEditInfoUserComponent implements OnInit {

  isLoading: boolean = false;
  _form!: FormGroup;
  userInit!: UserInitDTO;

  constructor(
    private applicationUserService: ApplicationUserService,
    private formBuilder: FormBuilder,
    private auth: TAuthService,
    private message: TDSMessageService,
    private modal: TDSModalRef
  ) { 
    this.createFormInfo();
  }

  ngOnInit(): void {
    this.loadUserInfo()
  }

  loadUserInfo() {
    this.isLoading = true;
    this.auth.getUserInit().pipe(finalize(()=>{ this.isLoading = false })).subscribe(res => {
      this.userInit = res || {};
      this.updateFormInfo(this.userInit);
    });
  }

  updateFormInfo(data: UserInitDTO | undefined) {
    let formControl = this._form.controls;

    formControl.Name.setValue(data?.Name);
    formControl.Email.setValue(data?.Email);
    formControl.PhoneNumber.setValue(data?.PhoneNumber);
  }

  createFormInfo() {
    this._form = this.formBuilder.group({
      Name: [null, [Validators.required]],
      Email: [null, [Validators.required, Validators.email]],
      //this.userRestHandler.validateExitEmail(this.userInit?.Id).bind(this) check mail trùng
      PhoneNumber: [null, [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(11)]],
      Website: [null],
    });
  }

  prepareModal() {
    let formValue = this._form.value;

    let model = {} as UpdateApplicationUserDTO;

    model.Name = formValue.Name;
    model.PhoneNumber = formValue.PhoneNumber;
    model.Email = formValue.Email;
    model.Avatar = this.userInit?.Avatar;
    model.Company = this.userInit?.Company;
    model.Id = this.userInit?.Id;
    model.UserName = this.userInit.UserName;

    return model;
  }

  onSave(){
    let model = this.prepareModal();

    this.isLoading = true;
    this.applicationUserService.update(model)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(res => {
        this.loadUserInfo();
        this.message.success(Message.UpdatedSuccess);
      }, error => {
        this.message.error(`${error?.error?.message || JSON.stringify(error)}`);
      });
  }

  onCancel(){
    this.modal.destroy(null);
  }
}
