import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { UserPageDTO } from 'src/app/main-app/dto/team/user-page.dto';
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
    let model = this.prepareFacebookModel();

    this.crmTeamService.insert(model).subscribe(
      {
        next: (res : CRMTeamDTO[]) => {
          console.log(res);
          
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

  // prepareModel() {
  //   let model = {};

  //   if(this.user.Type == "Facebook") {
  //     model = this.prepareModelFacebook();
  //   }
  //   else if(this.user.Type == "TUser")
  //   {
  //     model = this.prepareModelTShop();
  //   }

  //   return model;
  // }

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

  prepareFacebookModel() {
    return {
      Facebook_ASUserId: this.data.Facebook_ASUserId,
      Facebook_Link: this.data.Facebook_Link,
      Facebook_PageId: this.data.Facebook_PageId,
      Facebook_PageLogo: this.data.Facebook_PageLogo,
      Facebook_PageName: this.data.Facebook_PageName,
      Facebook_PageToken: this.data.Facebook_PageToken,
      Facebook_TypeId: this.data.Facebook_TypeId,
      Facebook_UserAvatar: this.data.Facebook_UserAvatar,
      Facebook_UserId: this.data.Facebook_UserId,
      Facebook_UserName: this.data.Facebook_UserName,
      Facebook_UserToken: this.data.Facebook_UserToken,
      Id: 0,
      Name: this.data.Name,
      ParentId: this.data.ParentId,
      Type: this.data.Type
    }
  }

  // prepareModelTShop()
  // {
  //   let formValue = this.addPageForm.value;

  //   let model = {
  //     Id: 0,
  //     OwnerId: this.user.OwnerId,
  //     Name: formValue["name"],
  //     Type: "TShop",
  //     ParentId: this.user.Id,
  //     ShopId: this.data.id,
  //     ChannelId: this.data.id,
  //     ChannelToken: this.data.access_token,
  //     ChannelAvatar: this.data.picture?.data?.url
  //   };

  //   return model;
  // }
}
