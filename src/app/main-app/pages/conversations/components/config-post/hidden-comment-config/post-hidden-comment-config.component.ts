
import { finalize, takeUntil } from 'rxjs/operators';
import { OnChanges, SimpleChanges } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FacebookPostItem } from 'src/app/main-app/dto/facebook-post/facebook-post.dto';
import { FacebookPostService } from 'src/app/main-app/services/facebook-post.service';
import { AutoHiddenConfigDTO } from 'src/app/main-app/dto/configs/post/order-config.dto';
import { Message } from 'src/app/lib/consts/message.const';
import { TDSModalRef } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { TDSHelperArray, TDSHelperString } from 'tds-ui/shared/utility';
import { Subject } from 'rxjs';
import { ChatomniObjectsItemDto } from '@app/dto/conversation-all/chatomni/chatomni-objects.dto';

@Component({
  selector: 'post-hidden-comment-config',
  templateUrl: './post-hidden-comment-config.component.html'
})
export class PostHiddenCommentConfigComponent implements OnInit, OnChanges {

  @Input() data!: ChatomniObjectsItemDto;

  formHiddenComment!: FormGroup;
  isLoading: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private modalRef: TDSModalRef,
    private message: TDSMessageService,
    private facebookPostService: FacebookPostService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes?.data?.firstChange === true) this.createForm();
    else this.resetForm();

    if(changes?.data?.currentValue) {
      this.loadHiddenComment(this.data.ObjectId);
    }
  }

  ngOnInit(): void {
  }

  loadHiddenComment(postId: string) {
    this.isLoading = true;
    this.facebookPostService.getHiddenCommentConfigs(postId)
      .pipe(takeUntil(this.destroy$))
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(res => {
        this.updateForm(res);
      });
  }

  createForm() {
    this.formHiddenComment = this.formBuilder.group({
        IsEnableAutoHideComment: [false],
        IsEnableAutoHideAllComment: [false],
        IsEnableAutoHideCommentWithPhone: [false],
        IsEnableAutoHideCommentWithEmail: [false],
        ContentOfCommentForAutoHide: [null],
        PhonePattern: [null],
        EmailPattern: [null],
        selectedWord1s: [null]
    });
  }

  resetForm() {
    this.formHiddenComment.reset();
  }

  updateForm(data: AutoHiddenConfigDTO) {
    this.formHiddenComment.patchValue(data);

    if (TDSHelperString.hasValueString(data?.ContentOfCommentForAutoHide)) {
      this.formHiddenComment.controls.selectedWord1s.setValue(data.ContentOfCommentForAutoHide.split(','));
    }
  }

  onSave() {
    let model = this.prepareModel();
    let postId = this.data?.ObjectId;

    this.isLoading = true;
    this.facebookPostService.updateHiddenCommentConfigs(postId, model)
      .pipe(takeUntil(this.destroy$))
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(res => {
        this.message.success(Message.UpdatedSuccess);
      }, error => {
        this.message.error(`${error?.error?.message || JSON.stringify(error)}`);
      });
  }

  prepareModel() {
    let formValue = this.formHiddenComment.value;

    let model = {} as AutoHiddenConfigDTO;

    model.IsEnableAutoHideComment = formValue.IsEnableAutoHideComment;
    model.IsEnableAutoHideAllComment = formValue.IsEnableAutoHideAllComment;
    model.IsEnableAutoHideCommentWithPhone = formValue.IsEnableAutoHideCommentWithPhone;
    model.IsEnableAutoHideCommentWithEmail = formValue.IsEnableAutoHideCommentWithEmail;
    model.ContentOfCommentForAutoHide = formValue.ContentOfCommentForAutoHide;
    model.PhonePattern = formValue.PhonePattern;
    model.EmailPattern = formValue.EmailPattern;

    if (TDSHelperArray.hasListValue(formValue?.selectedWord1s)) {
      model.ContentOfCommentForAutoHide = formValue.selectedWord1s.join(",");
    }

    return model;
  }

  onCannel() {
    this.modalRef.destroy(null);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
