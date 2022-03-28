import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-info-user',
  templateUrl: './info-user.component.html',
  styleUrls: ['./info-user.component.scss']
})
export class InfoUserComponent implements OnInit, OnChanges {

  @Output() outputItemIsInfo = new EventEmitter<boolean>();
  isChangeInfoUser = false
  isCancelInfoUser = false

  isChangeInfoPassword = false

  formUser !: FormGroup
  formPassword!: FormGroup
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.formUser = this.fb.group({
      name: new FormControl('Nguyễn Văn A'),
      phone: new FormControl('0321479652', Validators.maxLength(10)),
      email: new FormControl('nguyenvana@gmail.com', Validators.email)
    })
    this.formPassword = this.fb.group({
      passwordOld: new FormControl(''),
      passwordNew: new FormControl(''),
      passwordNewConfirm: new FormControl('')
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isCancel && changes.isCancel.currentValue !== changes.isCancel.previousValue) {
      this.formUser = this.fb.group(
        {
          name: new FormControl('Nguyễn Văn A'),
          phone: new FormControl('0321479652', Validators.maxLength(10)),
          email: new FormControl('nguyenvana@gmail.com', Validators.email)
        }
      )
    }
  }
  changeInfoUser() {
    this.isChangeInfoUser = true
  }

  onSubmitUser() {
    this.isChangeInfoUser = false
    console.log(this.formUser.value)
  }

  cancelChangeInfoUser() {
    this.isChangeInfoUser = false
  }

  changePassword() {
    this.isChangeInfoPassword = true
  }

  cancelChangeInfoPassword() {
    this.isChangeInfoPassword = false
  }

  onSubmitPassword() {
    console.log(this.formPassword.value)
  }
}
