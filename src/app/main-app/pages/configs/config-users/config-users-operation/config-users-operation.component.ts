import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ModalAddUserComponent } from './../../components/modal-add-user/modal-add-user.component';
import { TDSModalService, TDSHelperObject, TDSSafeAny, TDSMessageService } from 'tmt-tang-ui';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ModalUpdateUserComponent } from '../../components/modal-update-user/modal-update-user.component';
import { ApplicationRoleService } from 'src/app/main-app/services/application-role.service';
import { ApplicationRoleDTO } from 'src/app/main-app/dto/account/application-role.dto';
import { ApplicationUserDTO } from 'src/app/main-app/dto/account/application-user.dto';
import { ApplicationUserService } from 'src/app/main-app/services/application-user.service';
import { Message } from 'src/app/lib/consts/message.const';
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

  lstUsers: ApplicationUserDTO[] = [];
  lstUserRole: ApplicationRoleDTO[] = [];

  isLoading: boolean = false;

  constructor(
    private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef,
    private message: TDSMessageService,
    private applicationUserService: ApplicationUserService,
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

    this.loadUser();
    this.loadUserRole();
  }

  loadUser() {
    this.isLoading = true;
    this.applicationUserService.get()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(res => {
        this.lstUsers = res.value;
      });
  }

  loadUserRole() {
    this.applicationRoleService.get().subscribe(res => {
      this.lstUserRole = res.value;
    });
  }

  getNameRole(id: string) {
    let item = this.lstUserRole.find(x => x.Id == id);
    return item?.Name || "";
  }

  showModalUpdateUser(userId: string){
    const modal = this.modalService.create({
      title: 'Cập nhật người dùng',
      content: ModalUpdateUserComponent,
      size: "lg",
      viewContainerRef: this.viewContainerRef,
      componentParams:{ userId : userId }
    });

    modal.afterClose.subscribe(result => {
      console.log('[afterClose] The result is:', result);
      if (TDSHelperObject.hasValue(result)) {
        this.loadUser();
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

    modal.afterClose.subscribe(result => {
      console.log('[afterClose] The result is:', result);
      if (TDSHelperObject.hasValue(result)) {
        this.loadUser();
      }
    });
  }

  onDelete(id: string) {
    const modal = this.modalService.error({
      title: 'Xác nhận xóa người dùng',
      content: 'Bạn có chắc muốn xóa người dùng này không?',
      iconType: 'tdsi-trash-fill',
      okText: "Xác nhận",
      cancelText: "Hủy bỏ",
      onOk: () => {
        this.delete(id);
      },
      onCancel: () => {
        modal.close();
      },
    })
  }

  delete(id: string) {
    this.isLoading = true;
    this.applicationUserService.delete(id)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(res => {
        this.message.success(Message.DeleteSuccess);
        this.loadUser();
      }, error => {
        if(error?.error?.message) this.message.error(error?.error?.message);
        else this.message.error(Message.ErrorOccurred);
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
