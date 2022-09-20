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

  @Input() data!: UserPageDTO;
  @Input() user!: CRMTeamDTO;

  addPageForm!: FormGroup;
  isLoading: boolean = false;

  constructor( private modal: TDSModalRef,
    private fb: FormBuilder,
    private message: TDSMessageService,
    private crmTeamService: CRMTeamService) {
    this.createForm();
  }

  ngOnInit(): void {
    this.updateForm();
  }

  onSubmit(): void {
    let model = this.prepareModel();
    this.isLoading = true;

    this.crmTeamService.insert(model).subscribe(
      {
        next: res => {
          this.message.success(Message.SaveSuccess);
          this.isLoading = false;
          this.onCancel(true);
      }, 
        error: error => {
          if(error?.error?.message) {
            this.message.error(error?.error?.message);
          }
          else {
            this.message.error(Message.ErrorOccurred);
          }
          this.isLoading = false;
        }
      });
  }

  prepareModel() {
    let formValue = this.addPageForm.value;

    let model = {
      Id: 0,
      Facebook_ASUserId: this.user.OwnerId,
      Facebook_Link: this.data.picture.data.url,
      Facebook_PageId: this.data.id,
      Facebook_PageLogo: null,
      Facebook_PageName: this.data.name,
      Facebook_PageToken: this.data.access_token,
      Facebook_TypeId: "Page",
      Facebook_UserAvatar: this.user.Facebook_UserAvatar,
      Facebook_UserId: this.user.Facebook_UserId,
      Facebook_UserName: this.user.Facebook_UserName,
      Facebook_UserToken: this.user.OwnerToken,
      Name: formValue["name"],
      ParentId: this.user.Id,
      Type: "Facebook"
    };

    return model;
  }

  updateForm() {
    if(TDSHelperObject.hasValue(this.data)) {
      this.addPageForm.controls["name"].setValue(this.data.name);
      this.addPageForm.controls["pageName"].setValue(this.data.name);
      this.addPageForm.controls["userName"].setValue(this.user.Name);
    }
  }

  createForm() {
    this.addPageForm = this.fb.group({
      name :['', Validators.required],
      pageName : [{value: '', disabled: true}, Validators.required],
      userName:[{value: '', disabled: true}, Validators.required],
    });
  }

  onCancel(result: TDSSafeAny) {
    this.modal.destroy(result);
  }
}
