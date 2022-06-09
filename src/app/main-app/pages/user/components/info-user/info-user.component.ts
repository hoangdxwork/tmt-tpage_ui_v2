import { TDSMessageService } from 'tmt-tang-ui';
import { UserInitDTO, TAuthService } from 'src/app/lib';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { UserRestHandler } from 'src/app/main-app/services/handlers/user-rest.handler';
import { TDSSafeAny, TDSUploadFile } from 'tmt-tang-ui';
import { takeUntil, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SharedService } from 'src/app/main-app/services/shared.service';
import { Message } from 'src/app/lib/consts/message.const';
import { ApplicationUserDTO, UpdateApplicationUserDTO } from 'src/app/main-app/dto/account/application-user.dto';
import { ApplicationUserService } from 'src/app/main-app/services/application-user.service';

@Component({
  selector: 'app-info-user',
  templateUrl: './info-user.component.html',
  styleUrls: ['./info-user.component.scss']
})
export class InfoUserComponent implements OnInit {

  @Output() outputItemIsInfo = new EventEmitter<boolean>();
  userInit!: UserInitDTO;

  isChangeInfoUser: boolean = false;
  isCancelInfoUser: boolean = false;
  isChangeInfoPassword: boolean = false;

  formUser !: FormGroup;
  formPassword!: FormGroup;

  fileList: TDSSafeAny[] = [];
  private destroy$ = new Subject<void>();
  isLoading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private auth: TAuthService,
    private sharedService: SharedService,
    private message: TDSMessageService,
    private userRestHandler: UserRestHandler,
    private applicationUserService: ApplicationUserService,
  ) { }

  ngOnInit(): void {
    this.createFormInfo();
    this.createFormPassword();
    this.loadUserInfo()
  }

  loadUserInfo() {
    this.auth.getUserInit().subscribe(res => {
      this.userInit = res || {};
      console.log(this.userInit);
      this.updateFormInfo(res);
    });
  }

  createFormInfo() {
    this.formUser = this.formBuilder.group({
      Name: [null, [Validators.required]],
      Email: [null, [Validators.required, Validators.email], this.userRestHandler.validateExitEmail(this.userInit?.Id).bind(this)],
      PhoneNumber: [null, [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(11)]],
    });
  }

  updateFormInfo(data: UserInitDTO | undefined) {
    this.createFormInfo();
    let formControl = this.formUser.controls;

    formControl.Name.setValue(data?.Name);
    formControl.Email.setValue(data?.Email);
    formControl.PhoneNumber.setValue(data?.PhoneNumber);
  }

  createFormPassword() {
    this.formPassword = this.formBuilder.group({
      OldPassword:["",[Validators.required,Validators.minLength(6)]],
      NewPassword:["",[Validators.required,Validators.minLength(6)]],
      ConfirmPassword:["", [Validators.required,Validators.minLength(6)]],
    }, {
      validators: this.userRestHandler.validateMustMatch("Password", "ConfirmPassword"),
    });
  }

  onUpdateInfo() {
    let model = this.prepareModalUpdateInfo();

    this.isLoading = true;
    this.applicationUserService.update(model)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(res => {
        this.loadUserInfo();
        this.message.success(Message.UpdatedSuccess);
      }, error => {
        this.message.error(`${error?.error?.message || JSON.stringify(error)}`);
      });
  }

  prepareModalUpdateInfo() {
    let formValue = this.formUser.value;

    let model = {} as UpdateApplicationUserDTO;

    model.Name = formValue.Name;
    model.PhoneNumber = formValue.PhoneNumber;
    model.Email = formValue.Email;
    model.Avatar = this.userInit?.Avatar;
    model.Company = this.userInit?.Company;
    model.Id = this.userInit?.Id;
    model.UserName = this.userInit.UserName;

    return model;
  }

  onSubmitPassword() {
    this.message.info(Message.FunctionNotWorking);
  }

  prepareModalChangePassword() {

  }

  changeInfoUser() {
    this.isChangeInfoUser = true;
  }

  onSubmitUser() {
    this.isChangeInfoUser = false;
    console.log(this.formUser.value)
  }

  cancelChangeInfoUser() {
    this.isChangeInfoUser = false;
    this.updateFormInfo(this.userInit);
  }

  changePassword() {
    this.isChangeInfoPassword = true;
  }

  cancelChangeInfoPassword() {
    this.isChangeInfoPassword = false;
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
        this.userInit.Avatar = res[0].urlImageProxy;
    }, error => {
        let message = JSON.parse(error.Message);
        this.message.error(`${message.message}`);
    });
  }
}
