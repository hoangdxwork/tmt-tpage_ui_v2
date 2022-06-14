import { ConfigDataFacade } from './../../../../services/facades/config-data.facade';
import { finalize, shareReplay, take, takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ModalAddUserComponent } from './../../components/modal-add-user/modal-add-user.component';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ModalUpdateUserComponent } from '../../components/modal-update-user/modal-update-user.component';
import { ApplicationRoleService } from 'src/app/main-app/services/application-role.service';
import { ApplicationRoleDTO } from 'src/app/main-app/dto/account/application-role.dto';
import { ApplicationUserCRMTeamDTO, ApplicationUserDTO } from 'src/app/main-app/dto/account/application-user.dto';
import { ApplicationUserService } from 'src/app/main-app/services/application-user.service';
import { Message } from 'src/app/lib/consts/message.const';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { Observable } from 'rxjs';
import { TDSHelperObject, TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSModalService } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';

export interface DataUser {
  id: number;
  name: string;
  decentralization: string;
  page: string;
  status: boolean;
}

@Component({
  selector: 'app-config-users-operation',
  templateUrl: './config-users-operation.component.html'
})

export class ConfigUsersOperationComponent implements OnInit {

  currentComponent = 1;
  listOfDataUser: readonly DataUser[] = [];

  lstUsers: ApplicationUserDTO[] = [];
  lstUserRole: ApplicationRoleDTO[] = [];
  lstTeam: CRMTeamDTO[] | undefined;

  isLoading: boolean = false;
  userManagerPage: TDSSafeAny = null;

  // userManagerPage$!: Observable<TDSSafeAny>;
  // userManagerPageNot$!: Observable<TDSSafeAny>;

  userManagerNumber: number = 2;

  constructor(
    private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef,
    private message: TDSMessageService,
    private applicationUserService: ApplicationUserService,
    private applicationRoleService: ApplicationRoleService,
    private router: Router,
    private crmTeamService: CRMTeamService,
    private configDataService: ConfigDataFacade
  ) { }

  ngOnInit(): void {
    this.loadUser();
    this.loadUserRole();
    this.loadListTeam();
  }

  loadUser() {
    this.isLoading = true;
    this.configDataService.onLoading$.emit(this.isLoading);
    this.applicationUserService.get()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(res => {
        this.lstUsers = res.value;
        this.loadCRMTeamUser();
        this.configDataService.onLoading$.emit(false);
      });
  }

  loadUserRole() {
    this.applicationRoleService.get().subscribe(res => {
      this.lstUserRole = res.value;
    });
  }

  loadListTeam() {
    this.crmTeamService.onChangeListFaceBook().subscribe(res => {
      this.lstTeam = res?.Items;
    });
  }

  getNameRole(id: string) {
    let item = this.lstUserRole.find(x => x.Id == id);
    return item?.Name || "";
  }

  loadCRMTeamUser() {
    let ids = this.lstUsers.map(x => x.Id);
    let model: ApplicationUserCRMTeamDTO = {
      Ids: ids
    }

    this.applicationUserService.getCRMTeamUser({model: model}).subscribe(res => {
      let result: TDSSafeAny = {};
      res.value.forEach((x) => {
        result[x.Id] = {
          pageShow: [],
          pageHide: []
        }

        result[x.Id].pageShow = [...x.CRMTeam_Users].splice(0, 2);
        result[x.Id].pageHide = [...x.CRMTeam_Users].splice(2, x.CRMTeam_Users.length - 1);
      });

      this.userManagerPage = result;
    });
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

  updateStatus(id: string) {
    this.isLoading = true;
    this.applicationUserService.updateStatus(id)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe((res) => {
        this.message.success(Message.UpdatedSuccess);
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
