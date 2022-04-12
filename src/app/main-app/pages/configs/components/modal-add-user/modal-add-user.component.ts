import { TDSModalRef, TDSModalService, TDSHelperObject, TDSSafeAny } from 'tmt-tang-ui';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Component, OnInit, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-modal-add-user',
  templateUrl: './modal-add-user.component.html',
  styleUrls: ['./modal-add-user.component.scss']
})
export class ModalAddUserComponent implements OnInit {

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
      nameUser: new FormControl('' ),
      status: new FormControl(true ),
      phone: new FormControl('' ),
      email: new FormControl('' ),
      userName:  new FormControl('' ),
      password:  new FormControl('' ),
      passwordConfirm: new FormControl('' ),
      decentralization:  new FormControl([]),
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

}
