import { TDSDestroyService } from 'tds-ui/core/services';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { ChatomniObjectsItemDto } from "@app/dto/conversation-all/chatomni/chatomni-objects.dto";
import { takeUntil } from "rxjs/operators";
import { Message } from "src/app/lib/consts/message.const";
import { AutoReplyConfigDTO } from "src/app/main-app/dto/configs/page-config.dto";
import { FacebookPostService } from "src/app/main-app/services/facebook-post.service";
import { TDSMessageService } from "tds-ui/message";
import { TDSModalRef } from "tds-ui/modal";
import { TDSSafeAny } from "tds-ui/shared/utility";

@Component({
  selector: 'auto-reply-config',
  templateUrl: './auto-reply-config.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TDSDestroyService]
})

export class AutoReplyConfigComponent implements OnInit {

  @Input() data!: ChatomniObjectsItemDto;

  dataModel!: AutoReplyConfigDTO;
  isLoading: boolean = false;

  lstCommentAutoReply: string[] = [];
  lstCommentNotAutoReply: string[] = [];

  constructor(private modalRef: TDSModalRef,
    private message: TDSMessageService,
    private facebookPostService: FacebookPostService,
    private destroy$: TDSDestroyService,
    private cdRef: ChangeDetectorRef,
  ) { }

  ngOnInit(){
    this.loadData(this.data.ObjectId);
  }

  loadData(postId: string) {
    this.isLoading = true;

    this.facebookPostService.getAutoReplyConfigs(postId).pipe(takeUntil(this.destroy$))
      .subscribe({
        next:(res: AutoReplyConfigDTO) => {
          this.dataModel = {...res};
          this.lstCommentNotAutoReply = res.ContentOfCommentForNotAutoReply?.split(",") || [];

          this.isLoading = false;
          this.cdRef.detectChanges();
        },
        error:(err) => {
          this.message.error(err?.error?.message || Message.ConversationPost.CanNotLoadReplyConfig);
          this.isLoading = false;
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
    let model = Object.assign(this.dataModel) as AutoReplyConfigDTO;

    model.ContentOfCommentForAutoReply = this.lstCommentAutoReply?.join(',');
    model.ContentOfCommentForNotAutoReply = this.lstCommentNotAutoReply?.join(',');

    return model;
  }

  onSave(){
    let model = this.prepareModel();
    let postId = this.data?.ObjectId;
    
    this.isLoading = true;

    this.facebookPostService.updateAutoReplyConfigs(postId, model).pipe(takeUntil(this.destroy$))
      .subscribe({
        next:(res: any) => {
          this.message.success(Message.UpdatedSuccess);
          this.isLoading = false;

          this.cdRef.detectChanges();
        }, 
        error:(err) => {
          this.message.error(`${err?.error?.message || JSON.stringify(err)}` || Message.ConversationPost.updateConfigFail);
          this.isLoading = false;
        }
      });
  }

  onCannel() {
    this.modalRef.destroy(null);
  }
}
