import { ModalChangePasswordComponent } from './../modal-change-password/modal-change-password.component';
import { ModalEditInfoUserComponent } from './../modal-edit-info-user/modal-edit-info-user.component';
import { TDSModalService } from 'tds-ui/modal';
import { UserInitDTO, TAuthService } from 'src/app/lib';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewContainerRef } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { UserRestHandler } from 'src/app/main-app/services/handlers/user-rest.handler';
import { takeUntil, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SharedService } from 'src/app/main-app/services/shared.service';
import { Message } from 'src/app/lib/consts/message.const';
import { ApplicationUserDTO, UpdateApplicationUserDTO } from 'src/app/main-app/dto/account/application-user.dto';
import { ApplicationUserService } from 'src/app/main-app/services/application-user.service';
import { TDSSafeAny, TDSHelperObject } from 'tds-ui/shared/utility';
import { TDSUploadFile } from 'tds-ui/upload';
import { TDSMessageService } from 'tds-ui/message';

@Component({
  selector: 'app-info-user',
  templateUrl: './info-user.component.html'
})
export class InfoUserComponent implements OnInit {

  @Output() outputItemIsInfo = new EventEmitter<boolean>();
  userInit!: UserInitDTO;

  fileList: TDSSafeAny[] = [];
  private destroy$ = new Subject<void>();
  isLoading: boolean = false;

  constructor(private cdRef: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private auth: TAuthService,
    private sharedService: SharedService,
    private message: TDSMessageService,
    private userRestHandler: UserRestHandler,
    private applicationUserService: ApplicationUserService,
    private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef) {
  }

  ngOnInit(): void {
    this.loadUserInfo()
  }

  loadUserInfo() {
    this.isLoading = true;
    this.auth.getUserInit().pipe(finalize(()=>{ this.isLoading = false })).subscribe(res => {
      this.userInit = res || {};
    });
  }


  onSubmitPassword() {
    this.message.info(Message.FunctionNotWorking);
  }

  prepareModalChangePassword() {
  }

  changeInfoUser() {
    const modal = this.modalService.create({
      title: 'Chỉnh sửa thông tin',
      content: ModalEditInfoUserComponent,
      size: "lg",
      viewContainerRef: this.viewContainerRef,
    });
    modal.afterClose.subscribe(result => {
      if (TDSHelperObject.hasValue(result)) {
        this.loadUserInfo();
      }
    });
  }

  changePassword(){
    const modal = this.modalService.create({
      title: 'Đổi mật khẩu',
      content: ModalChangePasswordComponent,
      size: "lg",
      viewContainerRef: this.viewContainerRef,
    });
    modal.afterClose.subscribe(result => {
      if (TDSHelperObject.hasValue(result)) {

      }
    });
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

    this.isLoading = true;
    return this.sharedService.saveImageV2(formData)
      .pipe(finalize(() => this.isLoading = false))
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
          this.message.success(Message.Upload.Success);
          this.userInit.Avatar = res[0].urlImageProxy;
          this.cdRef.markForCheck();
      }, error => {
        this.message.error(error.Message ? error.Message : 'Upload xảy ra lỗi');
      });
  }
}
