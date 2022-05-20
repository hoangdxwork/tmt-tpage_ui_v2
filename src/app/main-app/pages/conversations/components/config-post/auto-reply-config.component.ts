import { Component, Input, OnDestroy, OnInit, ViewContainerRef } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Subject } from "rxjs";
import { finalize, takeUntil } from "rxjs/operators";
import { AutoReplyConfigDTO } from "src/app/main-app/dto/configs/page-config.dto";
import { FacebookPostItem } from "src/app/main-app/dto/facebook-post/facebook-post.dto";
import { FacebookPostService } from "src/app/main-app/services/facebook-post.service";
import { TDSHelperString, TDSMessageService, TDSModalService } from "tmt-tang-ui";

@Component({
  selector: 'auto-reply-config',
  templateUrl: './auto-reply-config.component.html'
})

export class AutoReplyConfigComponent  {

  _form!: FormGroup;
  @Input() data!: FacebookPostItem;

  isLoading: boolean = false;
  dataModel!: AutoReplyConfigDTO;
  fbid!: any;
  selectedWord1: any = [];
  selectedWord2: any = [];

  private destroy$ = new Subject();

  constructor(private modalService: TDSModalService,
    private fb: FormBuilder,
    private message: TDSMessageService,
    private facebookPostService: FacebookPostService,
    private viewContainerRef: ViewContainerRef) {
      this.createForm();
  }

  createForm() {
    this._form = this.fb.group({
      IsEnableAutoReplyComment: [false],
      IsEnableAutoReplyMultiple: [false],
      MaxForAutoReplyMultiple: [0],
      IsEnableAutoReplyAllComment: [false],
      IsEnableAutoReplyCommentWithPhone: [false],
      IsEnableAutoReplyCommentWithEmail: [false],
      ContentOfCommentForAutoReply: [null],
      ContentOfCommentForNotAutoReply: [null],
      IsEnableAutoReplyCommentInMessage: [false],
      ContentForAutoReplyWithComment: [null],
      ContentForAutoReplyWithMessage: [null],
      PhonePattern: [null],
      EmailPattern: [null],
    })
  }

  ngOnInit(){
    this.fbid = this.data?.fbid;
    if(TDSHelperString.hasValueString(this.fbid)){
      this.isLoading = true;

      this.facebookPostService.getAutoReplyConfigs(this.fbid)
        .pipe(takeUntil(this.destroy$)).pipe(finalize(() => { this.isLoading = false }))
        .subscribe((res: any) => {
            this.dataModel = res;;
            this.updateForm(res);
      })
    }
  }

  updateForm(data: AutoReplyConfigDTO) {
    if(TDSHelperString.hasValueString(data.ContentOfCommentForAutoReply)) {
      this.selectedWord1 = data.ContentOfCommentForAutoReply?.split(',');
    }
    if(TDSHelperString.hasValueString(data.ContentOfCommentForNotAutoReply)) {
      this.selectedWord2 = data.ContentOfCommentForNotAutoReply?.split(',');
    }
    this._form.patchValue(data);
  }

  onSave(){
    let model = this.prepareModel();
    this.facebookPostService.updateAutoReplyConfigs(this.fbid, model)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
          this.message.success("Thao tác thành công");
      }, error => {
         this.message.error('Đã xảy ra lỗi!');
    });
  }

  onClose() {
  }

  prepareModel(): any {
    const model = this.dataModel;
    const formModel = this._form.value;

    model.IsEnableAutoReplyComment = formModel.IsEnableAutoReplyComment ? formModel.IsEnableAutoReplyComment : model.IsEnableAutoReplyComment;
    model.IsEnableAutoReplyMultiple = formModel.IsEnableAutoReplyMultiple ? formModel.IsEnableAutoReplyMultiple : model.IsEnableAutoReplyMultiple;
    model.MaxForAutoReplyMultiple = formModel.MaxForAutoReplyMultiple ? formModel.MaxForAutoReplyMultiple : model.MaxForAutoReplyMultiple;
    model.IsEnableAutoReplyAllComment = formModel.IsEnableAutoReplyAllComment ? formModel.IsEnableAutoReplyAllComment : model.IsEnableAutoReplyAllComment;
    model.IsEnableAutoReplyCommentWithPhone = formModel.IsEnableAutoReplyCommentWithPhone ? formModel.IsEnableAutoReplyCommentWithPhone : model.IsEnableAutoReplyCommentWithPhone;
    model.IsEnableAutoReplyCommentWithEmail = formModel.IsEnableAutoReplyCommentWithEmail ? formModel.IsEnableAutoReplyCommentWithEmail : model.IsEnableAutoReplyCommentWithEmail;
    model.ContentOfCommentForAutoReply = this.selectedWord1?.join(',');
    model.ContentOfCommentForNotAutoReply = this.selectedWord2?.join(',');
    model.ContentForAutoReplyWithComment = formModel.ContentForAutoReplyWithComment ? formModel.ContentForAutoReplyWithComment : model.ContentForAutoReplyWithComment;
    model.IsEnableAutoReplyCommentInMessage = formModel.IsEnableAutoReplyCommentInMessage ? formModel.IsEnableAutoReplyCommentInMessage : model.IsEnableAutoReplyCommentInMessage;
    model.ContentForAutoReplyWithMessage = formModel.ContentForAutoReplyWithMessage ? formModel.ContentForAutoReplyWithMessage : model.ContentForAutoReplyWithMessage;
    model.PhonePattern = formModel.PhonePattern ? formModel.PhonePattern : model.PhonePattern;
    model.EmailPattern = formModel.EmailPattern ? formModel.EmailPattern : model.EmailPattern;

    return model;
  }

  changeIsEnableAutoReplyComment(event: any) {

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
