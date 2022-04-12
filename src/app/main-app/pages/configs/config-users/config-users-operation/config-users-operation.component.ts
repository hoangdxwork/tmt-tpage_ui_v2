import { ModalAddUserComponent } from './../../components/modal-add-user/modal-add-user.component';
import { TDSModalService, TDSHelperObject, TDSSafeAny } from 'tmt-tang-ui';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ModalUpdateUserComponent } from '../../components/modal-update-user/modal-update-user.component';
export interface DataUser {
  id: number;
  name: string;
  decentralization: string;
  page: string;
  status: boolean;
}

@Component({
  selector: 'app-config-users-operation',
  templateUrl: './config-users-operation.component.html',
  styleUrls: ['./config-users-operation.component.scss']
})
export class ConfigUsersOperationComponent implements OnInit {

  currentComponent = 1;
  listOfDataUser: readonly DataUser[] = [];
  constructor(
    private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef
  ) { }

  ngOnInit(): void {
    this.listOfDataUser = new Array(66).fill(0).map((_, index) => ({
      id: index,
      name: `Jerome Bell ${index}`,
      decentralization: 'Administrators',
      page:'',
      status: index % 2 === 0
  }));
  }

  showModalUpdateUser(){
    const modal = this.modalService.create({
      title: 'Cập nhập người dùng',
      content: ModalUpdateUserComponent,
      size: "lg",
      viewContainerRef: this.viewContainerRef,
    });
    modal.afterOpen.subscribe(() => console.log('[afterOpen] emitted!'));
    modal.afterClose.subscribe(result => {
      console.log('[afterClose] The result is:', result);
      if (TDSHelperObject.hasValue(result)) {
        
      }
    });
  }

  showModalAddUser(){
    const modal = this.modalService.create({
      title: 'Thêm người dùng mới',
      content: ModalAddUserComponent,
      size: "lg",
      viewContainerRef: this.viewContainerRef,
    });
    modal.afterOpen.subscribe(() => console.log('[afterOpen] emitted!'));
    modal.afterClose.subscribe(result => {
      console.log('[afterClose] The result is:', result);
      if (TDSHelperObject.hasValue(result)) {
        
      }
    });
  }

  decentralizePageManagement(data:TDSSafeAny){
    this.currentComponent = 2;
  }

  getCurrentComponent(i:number){
    this.currentComponent = i;
  }

}
