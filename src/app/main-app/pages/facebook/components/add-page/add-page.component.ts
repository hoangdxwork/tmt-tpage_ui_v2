import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { Message } from 'src/app/lib/consts/message.const';
import { TDSModalRef } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { TDSHelperObject, TDSSafeAny } from 'tds-ui/shared/utility';

@Component({
  selector: 'app-add-page',
  templateUrl: './add-page.component.html'
})

export class AddPageComponent implements OnInit {

  @Input() data!: CRMTeamDTO;

  _form!: FormGroup;
  isLoading: boolean = false;

  constructor(private modal: TDSModalRef,
    private fb: FormBuilder,
    private message: TDSMessageService,
    private crmTeamService: CRMTeamService) {
    this.createForm();
  }

  ngOnInit(): void {
    this.updateForm();
  }

  onSave() {
    if(this.isLoading) {
      return;
    }

    if(!this._form.valid){
      this.message.error("Vui lòng nhập tên page");
      return;
    }

    this.isLoading = true;
    let model = this.prepareFacebookModel(this.data);

    this.crmTeamService.insert(model).subscribe({
        next: (res : CRMTeamDTO[]) => {

          this.message.success(Message.SaveSuccess);
          this.isLoading = false;
          this.onCancel(res);
      },
        error: error => {
          this.isLoading = false;
          this.message.error(error?.error?.message || 'Đã xảy ra lỗi');
        }
      });
  }

  updateForm() {
    if(TDSHelperObject.hasValue(this.data)) {
      this._form.controls["Name"].setValue(this.data.Name);
      this._form.controls["PageName"].setValue(this.data.Facebook_PageName);
      this._form.controls["UserName"].setValue(this.data.Facebook_UserName);
    }
  }

  createForm() {
    this._form = this.fb.group({
      Name :[null, Validators.required],
      PageName : [{value: null, disabled: true}, Validators.required],
      UserName:[{value: null, disabled: true}, Validators.required],
    });
  }

  onCancel(result: TDSSafeAny) {
    this.modal.destroy(result);
  }

  prepareFacebookModel(data: CRMTeamDTO) {
    return {
        Id: 0,
        ParentId: data.ParentId,
        Facebook_TypeId: 'Page',
        Facebook_UserId: data.Facebook_UserId,
        Facebook_ASUserId: data.Facebook_ASUserId,
        Facebook_UserToken: data.Facebook_UserToken,
        Facebook_UserName: data.Facebook_UserName,
        Facebook_UserAvatar: data.Facebook_UserAvatar,
        Name: data.Name,
        Facebook_PageId: data.Facebook_PageId,
        Facebook_PageName: data.Facebook_PageName,
        Facebook_PageLogo: data.Facebook_PageLogo,
        Facebook_PageToken: data.Facebook_PageToken,
        Facebook_Link: data.Facebook_Link,
        Type: data.Type,
    }
  }
}
