import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Message } from 'src/app/lib/consts/message.const';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalRef } from 'tds-ui/modal';

@Component({
  selector: 'app-modal-change-password',
  templateUrl: './modal-change-password.component.html'
})
export class ModalChangePasswordComponent implements OnInit {

  formChangePassword!: FormGroup
  constructor(
    private fb: FormBuilder,
    private message: TDSMessageService,
    private modal: TDSModalRef,
  ) { }

  ngOnInit(): void {
    this.formChangePassword = this.fb.group({
      passwordNew: new FormControl('' , [Validators.required]),
      passwordNewConfirm: new FormControl('' , [Validators.required]),
    })
  }

  onSubmitChangePassword(){
    this.modal.destroy(this.formChangePassword);
  }
  cancel() {
    this.modal.destroy(null);
  }

  save() {
    this.message.info(Message.FunctionNotWorking);
    this.onSubmitChangePassword();
  }
}
