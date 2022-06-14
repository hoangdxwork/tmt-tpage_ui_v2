import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewContainerRef, OnDestroy } from '@angular/core';
import { UserRestHandler } from 'src/app/main-app/services/handlers/user-rest.handler';
import { ApplicationRoleService } from 'src/app/main-app/services/application-role.service';
import { ApplicationRoleDTO } from 'src/app/main-app/dto/account/application-role.dto';
import { AddApplicationUserDTO } from 'src/app/main-app/dto/account/application-user.dto';
import { ApplicationUserService } from 'src/app/main-app/services/application-user.service';
import { finalize, takeUntil } from 'rxjs/operators';
import { Message } from 'src/app/lib/consts/message.const';
import { SharedService } from 'src/app/main-app/services/shared.service';
import { Subject } from 'rxjs';
import { TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSModalRef, TDSModalService } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { TDSUploadFile } from 'tds-ui/upload';

@Component({
  selector: 'app-modal-add-user',
  templateUrl: './modal-add-user.component.html'
})
export class ModalAddUserComponent implements OnInit, OnDestroy {

  isLoading: boolean = false;
  public listData = [
    { id: 1, name: 'Nhóm nhân viên' },
    { id: 2, name: 'Administrators' },
    { id: 3, name: 'Nhóm test' },
    { id: 4, name: 'Tester' },
    { id: 5, name: 'Nhân viên' },
    { id: 6, name: 'Ca sáng' },
    { id: 7, name: 'Ca chiều' }
  ];

  formAddUser!: FormGroup;

  fileList: TDSSafeAny[] = [];
  listSelectedRole: ApplicationRoleDTO[] = [];
  lstUserRole: ApplicationRoleDTO[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private modal: TDSModalRef,
    private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef,
    private userRestHandler: UserRestHandler,
    private applicationRoleService: ApplicationRoleService,
    private applicationUserService: ApplicationUserService,
    private sharedService: SharedService,
    private message: TDSMessageService
  ) {
  }

  ngOnInit(): void {
    this.createForm();
    this.loadUserRole();
  }

  createForm(){
    this.formAddUser = this.formBuilder.group({
      Avatar: [""],
      Name: ["", [Validators.required]],
      UserName: ["", [Validators.required], this.userRestHandler.validateExitUsername("null").bind(this)],
      Email: ["", [Validators.required, Validators.email], this.userRestHandler.validateExitEmail("null").bind(this)],
      PhoneNumber: [null, [Validators.required]],
      Active: [true],
      Password: ["", [Validators.required, Validators.minLength(6)]],
      ConfirmPassword: ["", [Validators.required]],
      Roles: [null, [Validators.required]]
    }, {
      validators: this.userRestHandler.validateMustMatch("Password", "ConfirmPassword"),
    });
  }

  loadUserRole() {
    this.applicationRoleService.get().subscribe(res => {
      this.lstUserRole = res.value;
    });
  }

  onSave() {
    let model = this.prepareModel();
    this.isLoading = true;
    this.applicationUserService.insert(model)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(res => {
        this.message.success(Message.UpdatedSuccess);
        this.modal.destroy(true);
      });
  }

  prepareModel() {
    let formValue = this.formAddUser.value;

    let model: AddApplicationUserDTO = {
      Id: null,
      Name: formValue.Name,
      Email: formValue.Email,
      UserName: formValue.UserName,
      Avatar: formValue.Avatar,
      PhoneNumber: formValue.PhoneNumber,
      Active: formValue.Active,
      Roles: formValue.Roles,
      PasswordNew: formValue.Password
    }

    return model;
  }

  onChangeRole(e: Array<TDSSafeAny>)
  {
    let roles = e.map(x => {
      return {
        RoleId: x,
        UserId: null
      };
    });

    this.formAddUser.controls["Roles"].setValue(roles);
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
        this.formAddUser.controls["Avatar"].setValue(res[0].urlImageProxy);
    }, error => {
        let message = JSON.parse(error.Message);
        this.message.error(`${message.message}`);
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
