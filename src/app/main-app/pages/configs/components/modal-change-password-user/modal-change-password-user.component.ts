import { TDSModalRef, TDSHelperObject } from 'tmt-tang-ui';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal-change-password-user',
  templateUrl: './modal-change-password-user.component.html',
  styleUrls: ['./modal-change-password-user.component.scss']
})
export class ModalChangePasswordUserComponent implements OnInit {

  formChangePassword!: FormGroup
  constructor(
    private fb: FormBuilder,
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
      this.onSubmitChangePassword();
  }
}
