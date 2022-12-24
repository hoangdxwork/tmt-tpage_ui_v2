import { TDSDestroyService } from 'tds-ui/core/services';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { ChatomniObjectsItemDto } from "@app/dto/conversation-all/chatomni/chatomni-objects.dto";
import { takeUntil } from "rxjs/operators";
import { Message } from "src/app/lib/consts/message.const";
import { AutoReplyConfigDTO } from "src/app/main-app/dto/configs/page-config.dto";
import { FacebookPostService } from "src/app/main-app/services/facebook-post.service";
import { TDSMessageService } from "tds-ui/message";
import { TDSModalRef } from "tds-ui/modal";
import { TDSSafeAny, TDSHelperString } from "tds-ui/shared/utility";

@Component({
  selector: 'auto-reply-config',
  templateUrl: './auto-reply-config.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TDSDestroyService]
})

export class AutoReplyConfigComponent implements OnInit {

  @Input() data!: ChatomniObjectsItemDto;

  postId!: string;
  dataModel!: AutoReplyConfigDTO;
  isLoading: boolean = false;

  lstCommentAutoReply: string[] = [];
  lstCommentNotAutoReply: string[] = [];

  numberWithCommas =(value:TDSSafeAny) =>{
    if(value != null)
    {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    return value;
  } ;
  
  parserComas = (value: TDSSafeAny) =>{
    if(value != null)
    {
      return TDSHelperString.replaceAll(value,'.','');
    }
    return value;
  };

  constructor(private modalRef: TDSModalRef,
    private message: TDSMessageService,
    private facebookPostService: FacebookPostService,
    private destroy$: TDSDestroyService,
    private cdRef: ChangeDetectorRef,
  ) { }

  ngOnInit(){
    this.postId = this.data?.ObjectId;
    if(!this.postId) return;

    this.loadData();
  }

  loadData() {
    this.isLoading = true;

    this.facebookPostService.getAutoReplyConfigs(this.postId).pipe(takeUntil(this.destroy$))
      .subscribe({
        next:(res: AutoReplyConfigDTO) => {
          this.dataModel = {...res};

          if(TDSHelperString.hasValueString(res.ContentOfCommentForNotAutoReply)) {
            this.lstCommentNotAutoReply = res.ContentOfCommentForNotAutoReply?.split(",");
          }

          this.isLoading = false;
          this.cdRef.detectChanges();
        },
        error:(err) => {
          this.isLoading = false;
          this.message.error(err?.error?.message || Message.ConversationPost.CanNotLoadReplyConfig);
        }
      });
  }

  changeCommentNotAutoReply(event: string[]){
    event.forEach(x => {
      if(x.includes(',')){
        this.message.error('Ký tự không hợp lệ');
        event.pop();
      }
    });

    this.lstCommentNotAutoReply = [...event];
  }

  prepareModel(): any {
    let model = {...this.dataModel} as AutoReplyConfigDTO;
    model.ContentOfCommentForAutoReply = this.lstCommentAutoReply?.join(',');
    model.ContentOfCommentForNotAutoReply = this.lstCommentNotAutoReply?.join(',');

    return model;
  }

  onSave(){
    if(!this.postId) {
      this.message.error('Cập nhật thất bại');
      return;
    }

    let model = this.prepareModel();
    this.isLoading = true;
    this.facebookPostService.onChangeDisable$.emit(true);

    this.facebookPostService.updateAutoReplyConfigs(this.postId, model).pipe(takeUntil(this.destroy$))
      .subscribe({
        next:(res: any) => {
          this.message.success(Message.UpdatedSuccess);
          this.isLoading = false;
          this.facebookPostService.onChangeDisable$.emit(false);
          this.cdRef.detectChanges();
        }, 
        error:(err) => {
          this.message.error(`${err?.error?.message || JSON.stringify(err)}` || Message.ConversationPost.updateConfigFail);
          this.isLoading = false;
          this.facebookPostService.onChangeDisable$.emit(false);
        }
      });
  }

  onCannel() {
    this.modalRef.destroy(null);
  }
}
