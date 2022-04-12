import { ModalChangePasswordUserComponent } from './../modal-change-password-user/modal-change-password-user.component';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { TDSSafeAny, TDSModalRef, TDSHelperObject, TDSModalService } from 'tmt-tang-ui';
import { Component, OnInit, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-modal-update-user',
  templateUrl: './modal-update-user.component.html',
  styleUrls: ['./modal-update-user.component.scss']
})
export class ModalUpdateUserComponent implements OnInit {
  
  isLoading: boolean = false;
  formUpdateUser!: FormGroup
  public listData = [
    { id: 1, name: 'Nhóm nhân viên' },
    { id: 2, name: 'Administrators' },
    { id: 3, name: 'Nhóm test' },
    { id: 4, name: 'Tester' },
    { id: 5, name: 'Nhân viên' },
    { id: 6, name: 'Ca sáng' },
    { id: 7, name: 'Ca chiều' }

]
  constructor(
    private fb: FormBuilder,
    private modal: TDSModalRef,
    private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef
  ) { 
    this.creatForm()
  }

  ngOnInit(): void {
    
  }

  creatForm(){
    this.isLoading = true
    this.formUpdateUser = this.fb.group({
      nameUser: new FormControl('Cameron Williamson' ),
      status: new FormControl(true ),
      phone: new FormControl('0869197692' ),
      email: new FormControl('tpagetest@gmail.com' ),
      userName:  new FormControl('vboutique' ),
      password:  new FormControl('*******' ),
      decentralization:  new FormControl([1,2]),
    })
    this.isLoading = false
  }

  checkForm(){
    if(TDSHelperObject.hasValue(this.formUpdateUser))
      return true
    return false
  }
  onModelChange(e:TDSSafeAny)
  {
      console.log(e)
  }

  onSubmitUpdateUser(){
    this.modal.destroy(this.formUpdateUser);
  }
  cancel() {
    this.modal.destroy(null);
}

  save() {
      this.onSubmitUpdateUser();
  }

  ShowModalChangePassword(){
    const modal = this.modalService.create({
      title: 'Thay đổi mật khẩu',
      content: ModalChangePasswordUserComponent,
      size: "md",
      viewContainerRef: this.viewContainerRef,
    });
    modal.afterOpen.subscribe(() => console.log('[afterOpen] emitted!'));
    modal.afterClose.subscribe(result => {
      console.log('[afterClose] The result is:', result);
      if (TDSHelperObject.hasValue(result)) {
        
      }
    });
  }
}
