import { TDSModalRef } from 'tds-ui/modal';
import { Message } from './../../../../../lib/consts/message.const';
import { TDSMessageService } from 'tds-ui/message';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { UserRestHandler } from 'src/app/main-app/handler-v2/user-rest.handler';

@Component({
  selector: 'app-modal-change-password',
  templateUrl: './modal-change-password.component.html'
})
export class ModalChangePasswordComponent implements OnInit {

  isLoading: boolean = false;
  _form!: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private userRestHandler: UserRestHandler,
    private message: TDSMessageService,
    private modal: TDSModalRef,
  ) { 
    this.createForm();
  }

  ngOnInit(): void {
  }

  createForm() {
    this._form = this.formBuilder.group({
      OldPassword:["",[Validators.required,Validators.minLength(8)]],
      NewPassword:["",[Validators.required,Validators.minLength(8)]],
      ConfirmPassword:["", [Validators.required,Validators.minLength(8)]],
    }, {
      validators: this.userRestHandler.validateMustMatch("Password", "ConfirmPassword"),
    });
  }
  onCancel(){
    this.modal.destroy(null);
  }

  onSave(){
    this.message.info(Message.FunctionNotWorking);
  }
}
