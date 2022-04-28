import { ModalChangePasswordUserComponent } from './../modal-change-password-user/modal-change-password-user.component';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { TDSSafeAny, TDSModalRef, TDSHelperObject, TDSModalService, TDSUploadFile, TDSMessageService } from 'tmt-tang-ui';
import { Component, OnInit, ViewContainerRef, Input, OnDestroy } from '@angular/core';
import { UserRestHandler } from 'src/app/main-app/services/handlers/user-rest.handler';
import { ApplicationUserService } from 'src/app/main-app/services/application-user.service';
import { ApplicationUserDTO, UpdateApplicationUserDTO } from 'src/app/main-app/dto/account/application-user.dto';
import { ApplicationRoleService } from 'src/app/main-app/services/application-role.service';
import { ApplicationRoleDTO } from 'src/app/main-app/dto/account/application-role.dto';
import { SharedService } from 'src/app/main-app/services/shared.service';
import { Message } from 'src/app/lib/consts/message.const';
import { takeUntil, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TAuthService, UserInitDTO } from 'src/app/lib';

@Component({
  selector: 'app-modal-update-user',
  templateUrl: './modal-update-user.component.html',
  styleUrls: ['./modal-update-user.component.scss']
})
export class ModalUpdateUserComponent implements OnInit, OnDestroy {

  @Input() userId!: string;

  isLoading: boolean = false;
  formUpdateUser!: FormGroup;

  public listData = [
    { id: 1, name: 'Nhóm nhân viên' },
    { id: 2, name: 'Administrators' },
    { id: 3, name: 'Nhóm test' },
    { id: 4, name: 'Tester' },
    { id: 5, name: 'Nhân viên' },
    { id: 6, name: 'Ca sáng' },
    { id: 7, name: 'Ca chiều' }
  ];

  userInit!: UserInitDTO;
  listSelectedRole: ApplicationRoleDTO[] = [];
  lstUserRole: ApplicationRoleDTO[] = [];
  fileList: TDSSafeAny[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private modal: TDSModalRef,
    private modalService: TDSModalService,
    private userRestHandler: UserRestHandler,
    private viewContainerRef: ViewContainerRef,
    private applicationUserService: ApplicationUserService,
    private applicationRoleService: ApplicationRoleService,
    private sharedService: SharedService,
    private message: TDSMessageService,
    private auth: TAuthService,
  ) {
  }

  ngOnInit(): void {
    this.createForm();
    this.loadUserLogged();
    this.loadUserRole();
    this.loadUser(this.userId);
  }

  createForm(){
    this.formUpdateUser = this.formBuilder.group({
      Avatar: [""],
      Name: ["", [Validators.required]],
      UserName: ["", [Validators.required]],
      Email: ["", [Validators.required, Validators.email], this.userRestHandler.validateExitEmail(this.userId).bind(this)],
      PhoneNumber: [null, [Validators.required]],
      Active: [false],
      // Password: ["", [Validators.required, Validators.minLength(6)]],
      // ConfirmPassword: ["", [Validators.required]],
      Roles: [null, [Validators.required]]
    });
    // , {
      // validators: this.userRestHandler.validateMustMatch("Password", "ConfirmPassword"),
    // });
  }

  loadUserLogged() {
    this.auth.getUserInit().subscribe(res => {
      console.log(res);
      this.userInit = res || {};
    });
  }

  loadUser(userId: string) {
    this.isLoading = true;
    this.applicationUserService.getById(userId)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(res => {
        this.updateForm(res);
      });
  }

  loadUserRole() {
    this.applicationRoleService.get().subscribe(res => {
      this.lstUserRole = res.value;
    });
  }

  updateForm(value: ApplicationUserDTO) {
    let formControls = this.formUpdateUser.controls;

    formControls.Name.setValue(value.Name);
    formControls.UserName.setValue(value.UserName);
    formControls.Email.setValue(value.Email);
    formControls.Avatar.setValue(value.Avatar);
    formControls.PhoneNumber.setValue(value.PhoneNumber);
    formControls.Active.setValue(value.Active);
    formControls.Roles.setValue(value.Roles);

    let userRoleIds = value.Roles.map(x => x.RoleId);

    this.listSelectedRole = this.lstUserRole.filter(x => userRoleIds.includes(x.Id));
  }

  onSave(){
    let model = this.prepareModel();
    this.isLoading = true;
    this.applicationUserService.update(model)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(res => {
        this.message.success(Message.UpdatedSuccess);
        this.modal.destroy(true);
      });
  }

  prepareModel() {
    let formValue = this.formUpdateUser.value;

    let model: UpdateApplicationUserDTO = {
      Id: this.userId,
      Name: formValue.Name,
      Email: formValue.Email,
      UserName: formValue.UserName,
      Avatar: formValue.Avatar,
      PhoneNumber: formValue.PhoneNumber,
      Active: formValue.Active,
      Roles: formValue.Roles
    }

    return model;
  }

  beforeUpload = (file: TDSUploadFile): boolean => {
    this.fileList = this.fileList.concat(file);

    this.handleUpload(file);
    return false;
  };

  handleUpload(file: TDSUploadFile) {
    let formData: any = new FormData();
    formData.append("files", file as any, file.name);
    formData.append('id', '0000000000000051');

    return this.sharedService.saveImageV2(formData).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
        this.message.success(Message.Upload.Success);
        this.formUpdateUser.controls["Avatar"].setValue(res[0].urlImageProxy);
    }, error => {
        let message = JSON.parse(error.Message);
        this.message.error(`${message.message}`);
    });
  }

  onChangeRole(e: Array<TDSSafeAny>)
  {
    let roles = e.map(x => {
      return {
        RoleId: x,
        UserId: this.userId
      };
    });

    this.formUpdateUser.controls["Roles"].setValue(roles);
  }

  showModalChangePassword(){
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

  cancel() {
    this.modal.destroy(null);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
