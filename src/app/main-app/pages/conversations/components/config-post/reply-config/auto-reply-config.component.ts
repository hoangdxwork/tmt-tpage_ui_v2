import { Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ChatomniObjectsItemDto } from "@app/dto/conversation-all/chatomni/chatomni-objects.dto";
import { finalize } from "rxjs/operators";
import { Message } from "src/app/lib/consts/message.const";
import { AutoReplyConfigDTO } from "src/app/main-app/dto/configs/page-config.dto";
import { FacebookPostItem } from "src/app/main-app/dto/facebook-post/facebook-post.dto";
import { FacebookPostService } from "src/app/main-app/services/facebook-post.service";
import { TDSMessageService } from "tds-ui/message";
import { TDSModalRef } from "tds-ui/modal";
import { TDSHelperString, TDSSafeAny } from "tds-ui/shared/utility";

@Component({
  selector: 'auto-reply-config',
  templateUrl: './auto-reply-config.component.html'
})

export class AutoReplyConfigComponent implements OnInit, OnChanges {

  @Input() data!: ChatomniObjectsItemDto;

  formReplyConfig!: FormGroup;

  isLoading: boolean = false;
  selectedWord1: any = [];
  selectedWord2: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private modalRef: TDSModalRef,
    private message: TDSMessageService,
    private facebookPostService: FacebookPostService
  ) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes?.data?.firstChange === true) this.createForm();
    else this.resetForm();

    if(changes?.data?.currentValue) {
      this.loadAutoReplyConfigs(this.data.ObjectId);
    }
  }

  ngOnInit(){
  }

  loadAutoReplyConfigs(postId: string) {
    this.isLoading = true;
    this.facebookPostService.getAutoReplyConfigs(postId)
      .pipe(finalize(() => { this.isLoading = false }))
      .subscribe((res: any) => {
        this.updateForm(res);
    });
  }

  createForm() {
    this.formReplyConfig = this.formBuilder.group({
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

  resetForm() {
    this.formReplyConfig.reset();
  }

  selectChange(event: TDSSafeAny){
    console.log(this.selectedWord2)
  }

  keyupWord(event: TDSSafeAny){
    let key = event?.target.value
    if(key){
      this.selectedWord2.push(key)
      console.log(this.selectedWord2)
    }
  }

  onModelChange(event: TDSSafeAny){
    console.log(event)
  }
  updateForm(data: AutoReplyConfigDTO) {
    if(TDSHelperString.hasValueString(data?.ContentOfCommentForAutoReply)) {
      this.selectedWord1 = data.ContentOfCommentForAutoReply.split(',');
    }

    if(TDSHelperString.hasValueString(data?.ContentOfCommentForNotAutoReply)) {
      this.selectedWord2 = data.ContentOfCommentForNotAutoReply.split(',');
    }

    this.formReplyConfig.patchValue(data);
  }

  onSave(){
    let model = this.prepareModel();
    let postId = this.data?.ObjectId;

    this.isLoading = true;
    this.facebookPostService.updateAutoReplyConfigs(postId, model)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe((res: any) => {
          this.message.success(Message.UpdatedSuccess);
      }, error => {
         this.message.error(`${error?.error?.message || JSON.stringify(error)}`);
      });
  }

  prepareModel(): any {
    let formValue = this.formReplyConfig.value;

    let model = {} as AutoReplyConfigDTO;

    model.IsEnableAutoReplyComment = formValue.IsEnableAutoReplyComment;
    model.ContentOfCommentForAutoReply = formValue.ContentOfCommentForAutoReply;
    model.IsEnableAutoReplyMultiple = formValue.IsEnableAutoReplyMultiple;
    model.MaxForAutoReplyMultiple = formValue.MaxForAutoReplyMultiple;
    model.IsEnableAutoReplyAllComment = formValue.IsEnableAutoReplyAllComment;
    model.IsEnableAutoReplyCommentWithPhone = formValue.IsEnableAutoReplyCommentWithPhone;
    model.IsEnableAutoReplyCommentWithEmail = formValue.IsEnableAutoReplyCommentWithEmail;
    model.ContentOfCommentForNotAutoReply = formValue.ContentOfCommentForNotAutoReply;
    model.IsEnableAutoReplyCommentInMessage = formValue.IsEnableAutoReplyCommentInMessage;
    model.ContentForAutoReplyWithComment = formValue.ContentForAutoReplyWithComment;
    model.ContentForAutoReplyWithMessage = formValue.ContentForAutoReplyWithMessage;

    model.ContentOfCommentForAutoReply = this.selectedWord1?.join(',');
    model.ContentOfCommentForNotAutoReply = this.selectedWord2?.join(',');

    return model;
  }

  onCannel() {
    this.modalRef.destroy(null);
  }
}
