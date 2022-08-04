import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Component, Input, OnInit, OnChanges, SimpleChanges, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { Message } from 'src/app/lib/consts/message.const';
import { AutoReplyConfigDTO } from 'src/app/main-app/dto/configs/page-config.dto';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { TDSMessageService } from 'tds-ui/message';

@Component({
  selector: 'config-auto-reply',
  templateUrl: './config-auto-reply.component.html',

})
export class ConfigAutoReplyComponent implements OnInit, OnChanges, OnDestroy {

  @Input() eventOnSave: boolean = false;
  @Output() onSaveSuccess = new EventEmitter();

  formConfigAutoReply!: FormGroup;

  currentTab: number = 0;
  currentTeam!: CRMTeamDTO | null;
  isLoading: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private crmTeamService: CRMTeamService,
    private message: TDSMessageService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes?.eventOnSave?.currentValue) {
      let currentPageId = this.currentTeam?.ChannelId;

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

      if(res && res.Facebook_PageId || res?.ChannelId) {
        let pageId = res.Facebook_PageId || res?.ChannelId;
        this.updateAutoReplyConfig(pageId);
      }

      this.isLoading = false;

    }, error => this.isLoading = false);
  }

  createForm() {
    // Bật auto phản hồi
    this.formConfigAutoReply = this.formBuilder.group({
      IsEnableAutoReplyComment: [false],
      IsEnableAutoReplyMultiple: [false],
      MaxForAutoReplyMultiple: [1],
      IsEnableAutoReplyAllComment: [false],
      IsEnableAutoReplyCommentWithPhone: [false],
      IsEnableAutoReplyCommentWithEmail: [false],
      ContentOfCommentForAutoReply: [null],
      ContentOfCommentForNotAutoReply: [null],
      IsEnableAutoReplyCommentInMessage: [false],
      ContentForAutoReplyWithComment: [null],
      ContentForAutoReplyWithMessage: [null],
      selectedWord1s: [null],
      selectedWord2s: [null],
      selectedWord3s: [null]
    });
  }

  updateAutoReplyConfig(pageId: string) {
    let formControls = this.formConfigAutoReply.controls;

    this.crmTeamService.getChannelAutoReplyConfig(pageId).subscribe(res => {
      console.log(res);
      formControls["IsEnableAutoReplyComment"].setValue(res.IsEnableAutoReplyComment);
      formControls["IsEnableAutoReplyMultiple"].setValue(res.IsEnableAutoReplyMultiple);
      formControls["MaxForAutoReplyMultiple"].setValue(res.MaxForAutoReplyMultiple);
      formControls["IsEnableAutoReplyAllComment"].setValue(res.IsEnableAutoReplyAllComment);
      formControls["IsEnableAutoReplyCommentWithPhone"].setValue(res.IsEnableAutoReplyCommentWithPhone);
      formControls["IsEnableAutoReplyCommentWithEmail"].setValue(res.IsEnableAutoReplyCommentWithEmail);
      formControls["ContentOfCommentForAutoReply"].setValue(res.ContentOfCommentForAutoReply);
      formControls["IsEnableAutoReplyCommentInMessage"].setValue(res.IsEnableAutoReplyCommentInMessage);
      formControls["ContentForAutoReplyWithComment"].setValue(res.ContentForAutoReplyWithComment);
      formControls["ContentForAutoReplyWithMessage"].setValue(res.ContentForAutoReplyWithMessage);

      if (res.ContentOfCommentForAutoReply) {
        formControls['selectedWord2s'].setValue(res.ContentOfCommentForAutoReply.split(','));
      }

      if (res.ContentOfCommentForNotAutoReply) {
        formControls['selectedWord3s'].setValue(res.ContentOfCommentForNotAutoReply.split(','));
      }
    });
  }

  onSave(pageId: string) {
    let model = this.prepareModelAutoReply();
    this.isLoading = true;
    this.crmTeamService.insertOrUpdateChannelAutoReplyConfig(pageId, model).subscribe(res => {
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

  prepareModelAutoReply(): AutoReplyConfigDTO {
    let formValue = this.formConfigAutoReply.value;

    let model: AutoReplyConfigDTO = {
      IsEnableAutoReplyComment: formValue["IsEnableAutoReplyComment"],
      IsEnableAutoReplyMultiple: formValue["IsEnableAutoReplyMultiple"],
      MaxForAutoReplyMultiple: formValue["MaxForAutoReplyMultiple"],
      IsEnableAutoReplyAllComment: formValue["IsEnableAutoReplyAllComment"],
      IsEnableAutoReplyCommentWithPhone: formValue["IsEnableAutoReplyCommentWithPhone"],
      IsEnableAutoReplyCommentWithEmail: formValue["IsEnableAutoReplyCommentWithEmail"],
      ContentOfCommentForAutoReply: formValue["ContentOfCommentForAutoReply"],
      ContentOfCommentForNotAutoReply: formValue["ContentOfCommentForAutoReply"],
      IsEnableAutoReplyCommentInMessage: formValue["IsEnableAutoReplyCommentInMessage"],
      ContentForAutoReplyWithComment: formValue["ContentForAutoReplyWithComment"],
      ContentForAutoReplyWithMessage: formValue["ContentForAutoReplyWithMessage"],
    };

    if (formValue["selectedWord2s"]) {
      model.ContentOfCommentForAutoReply = formValue["selectedWord2s"].join(",");
    }

    if (formValue["selectedWord3s"]) {
      model.ContentOfCommentForNotAutoReply = formValue["selectedWord3s"].join(",");
    }

    return model;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
