import { ModalChangePasswordComponent } from '../modal-change-password/modal-change-password.component';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, ViewContainerRef, Input, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ApplicationUserService } from 'src/app/main-app/services/application-user.service';
import { ApplicationUserDTO, UpdateApplicationUserDTO } from 'src/app/main-app/dto/account/application-user.dto';
import { ApplicationRoleService } from 'src/app/main-app/services/application-role.service';
import { ApplicationRoleDTO } from 'src/app/main-app/dto/account/application-role.dto';
import { SharedService } from 'src/app/main-app/services/shared.service';
import { Message } from 'src/app/lib/consts/message.const';
import { takeUntil, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TAuthService, UserInitDTO } from 'src/app/lib';
import { TDSHelperObject, TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSModalRef, TDSModalService } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { TDSUploadFile } from 'tds-ui/upload';
import { UserRestHandler } from 'src/app/main-app/handler-v2/user-rest.handler';
const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
@Component({
  selector: 'app-modal-update-user',
  templateUrl: './modal-update-user.component.html'
})
export class ModalUpdateUserComponent implements OnInit, OnDestroy {

  @Input() userId!: string;

  isLoading: boolean = false;
  _form!: FormGroup;

  userInit!: UserInitDTO;
  listSelectedRole: ApplicationRoleDTO[] = [];
  lstUserRole: ApplicationRoleDTO[] = [];
  fileList: TDSSafeAny[] = [];
  previewImage: string | undefined = '';
  previewVisible = false;
  private destroy$ = new Subject<void>();

  constructor(private cdRef : ChangeDetectorRef,
    private fb: FormBuilder,
    private modal: TDSModalRef,
    private modalService: TDSModalService,
    private userRestHandler: UserRestHandler,
    private viewContainerRef: ViewContainerRef,
    private applicationUserService: ApplicationUserService,
    private applicationRoleService: ApplicationRoleService,
    private sharedService: SharedService,
    private message: TDSMessageService,
    private auth: TAuthService) {
    this.createForm();
  }

  ngOnInit(): void {
    this.loadUserLogged();
    this.loadUserRole();
    this.loadUser(this.userId);
  }

  createForm(){
    this._form = this.fb.group({
      Avatar: [""],
      Name: ["", [Validators.required]],
      UserName: ["", [Validators.required]],
      Email: ["", [Validators.required, Validators.email], this.userRestHandler.validateExitEmail(this.userId).bind(this)],
      PhoneNumber: [null, [Validators.required]],
      Active: [false],
      Roles: [null, [Validators.required]]
    });
  }

  loadUserLogged() {
    this.auth.getUserInit().subscribe(res => {
        if(res) {
            this.userInit = res || {};
        }
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
    let formControls = this._form.controls;

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
    let formValue = this._form.value;

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
        this._form.controls["Avatar"].setValue(res[0].urlImageProxy);
        this.cdRef.markForCheck();
    }, error => {
      this.message.error(error.Message ? error.Message : 'Upload xảy ra lỗi');
    });
  }

  getAvatar(url: string) {
    this._form.controls["ImageUrl"].setValue(url);
  }

  getBase64(base64: TDSSafeAny) {
    this._form.controls["Image"].setValue(base64);
  }

  onChangeRole(e: Array<TDSSafeAny>){
    let roles = e.map(x => {
      return {
        RoleId: x,
        UserId: this.userId
      };
    });

    this._form.controls["Roles"].setValue(roles);
  }

  showModalChangePassword(){
    const modal = this.modalService.create({
      title: 'Thay đổi mật khẩu',
      content: ModalChangePasswordComponent,
      size: "md",
      viewContainerRef: this.viewContainerRef,
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
