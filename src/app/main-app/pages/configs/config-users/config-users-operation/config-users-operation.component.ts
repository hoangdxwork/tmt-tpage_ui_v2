import { Router } from '@angular/router';
import { ModalAddUserComponent } from './../../components/modal-add-user/modal-add-user.component';
import { TDSModalService, TDSHelperObject, TDSSafeAny } from 'tmt-tang-ui';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ModalUpdateUserComponent } from '../../components/modal-update-user/modal-update-user.component';
import { ApplicationRoleService } from 'src/app/main-app/services/application-role.service';
import { ApplicationRoleDTO } from 'src/app/main-app/dto/account/application-role.dto';
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

  lstUserRole: ApplicationRoleDTO[] = [];

  constructor(
    private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef,
    private applicationRoleService: ApplicationRoleService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.listOfDataUser = new Array(66).fill(0).map((_, index) => ({
      id: index,
      name: `Jerome Bell ${index}`,
      decentralization: 'Administrators',
      page:'',
      status: index % 2 === 0
    }));

    this.loadUserRole();
  }

  loadUserRole() {
    this.applicationRoleService.get().subscribe(res => {
      this.lstUserRole = res.value;
    });
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

  decentralizePageManagement(){
    var returnUrl = '/configs/users/decentralize'
    this.router.navigate([returnUrl]);
  }

  getCurrentComponent(i:number){
    this.currentComponent = i;
  }

}
