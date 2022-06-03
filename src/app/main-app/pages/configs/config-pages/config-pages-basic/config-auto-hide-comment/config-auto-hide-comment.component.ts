import { TDSMessageService } from 'tmt-tang-ui';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, OnDestroy, OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Message } from 'src/app/lib/consts/message.const';
import { AutoHideCommentDTO } from 'src/app/main-app/dto/configs/page-config.dto';

@Component({
  selector: 'config-auto-hide-comment',
  templateUrl: './config-auto-hide-comment.component.html'
})
export class ConfigAutoHideCommentComponent implements OnInit, OnDestroy, OnChanges {

  @Input() eventOnSave: boolean = false;
  @Output() onSaveSuccess = new EventEmitter();

  formHideComment!: FormGroup;

  isLoading: boolean = false;
  currentTeam!: CRMTeamDTO | null;

  private destroy$ = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    private message: TDSMessageService,
    private crmTeamService: CRMTeamService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes?.eventOnSave?.currentValue) {
      let currentPageId = this.currentTeam?.Facebook_PageId;

      if(!currentPageId) {
        this.message.error(Message.PageNotExist);
        return;
      }

      this.onSave(currentPageId);
    }
  }

  ngOnInit(): void {
    this.createForm();

    this.loadConfigs();
  }

  loadConfigs() {
    this.isLoading = true;
    this.crmTeamService.onChangeTeam().pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.currentTeam = res;

      if(res && res.Facebook_PageId) {
        let pageId = res.Facebook_PageId;
        this.updateAutoHideComment(pageId);
      }

      this.isLoading = false;

    }, error => this.isLoading = false);
  }

  createForm() {
    this.formHideComment = this.formBuilder.group({
      IsEnableAutoHideComment: [false],
      IsEnableAutoHideAllComment: [false],
      IsEnableAutoHideCommentWithPhone: [false],
      IsEnableAutoHideCommentWithEmail: [false],
      ContentOfCommentForAutoHide: [null],
      selectedWord1s: [null],
    });
  }

  updateAutoHideComment(pageId: string) {
    let formControls = this.formHideComment.controls;

    this.crmTeamService.getChannelAutoHiddenConfig(pageId).subscribe(res => {
      formControls["IsEnableAutoHideComment"].setValue(res.IsEnableAutoHideComment);
      formControls["IsEnableAutoHideAllComment"].setValue(res.IsEnableAutoHideAllComment);
      formControls["IsEnableAutoHideCommentWithPhone"].setValue(res.IsEnableAutoHideCommentWithPhone);
      formControls["IsEnableAutoHideCommentWithEmail"].setValue(res.IsEnableAutoHideCommentWithEmail);
      formControls["ContentOfCommentForAutoHide"].setValue(res.ContentOfCommentForAutoHide);

      if (res.ContentOfCommentForAutoHide) {
        formControls['selectedWord1s'].setValue(res.ContentOfCommentForAutoHide.split(','));
      }
    });
  }

  onSave(pageId: string) {
    let model = this.prepareModelHideComment();

    this.isLoading = true;
    this.crmTeamService.insertOrUpdateChannelAutoHiddenConfig(pageId, model).subscribe(res => {
      this.message.success(Message.UpdatedSuccess);
      this.isLoading = false;
      this.onSaveSuccess.emit(true);
    }, error => {
      this.isLoading = false;
      this.onSaveSuccess.emit(false);
      if(error?.error?.message) this.message.error(error?.error?.message);
      else this.message.error(Message.ErrorOccurred);
    });
  }

  prepareModelHideComment(): AutoHideCommentDTO {
    let formValue = this.formHideComment.value;

    let model: AutoHideCommentDTO = {
      IsEnableAutoHideComment: formValue["IsEnableAutoHideComment"],
      IsEnableAutoHideAllComment: formValue["IsEnableAutoHideAllComment"],
      IsEnableAutoHideCommentWithPhone: formValue["IsEnableAutoHideCommentWithPhone"],
      IsEnableAutoHideCommentWithEmail: formValue["IsEnableAutoHideCommentWithEmail"],
      ContentOfCommentForAutoHide: formValue["ContentOfCommentForAutoHide"],
    };

    if (formValue["selectedWord1s"]) {
      model.ContentOfCommentForAutoHide = formValue["selectedWord1s"].join(",");
    }

    return model;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
