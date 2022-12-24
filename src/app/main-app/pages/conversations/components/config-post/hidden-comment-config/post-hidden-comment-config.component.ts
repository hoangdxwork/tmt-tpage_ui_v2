import { TDSHelperString } from 'tds-ui/shared/utility';
import { TDSDestroyService } from 'tds-ui/core/services';
import { takeUntil } from 'rxjs/operators';
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { FacebookPostService } from 'src/app/main-app/services/facebook-post.service';
import { AutoHiddenConfigDTO } from 'src/app/main-app/dto/configs/post/post-order-config.dto';
import { Message } from 'src/app/lib/consts/message.const';
import { TDSModalRef } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { ChatomniObjectsItemDto } from '@app/dto/conversation-all/chatomni/chatomni-objects.dto';

@Component({
  selector: 'post-hidden-comment-config',
  templateUrl: './post-hidden-comment-config.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TDSDestroyService]
})
export class PostHiddenCommentConfigComponent implements OnInit {

  @Input() data!: ChatomniObjectsItemDto;

  dataModel!: AutoHiddenConfigDTO;
  postId!: string;
  lstContentOfCommentForAutoHide: string[] = [];
  isLoading: boolean = false;

  constructor(
    private modalRef: TDSModalRef,
    private message: TDSMessageService,
    private facebookPostService: FacebookPostService,
    private destroy$: TDSDestroyService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.postId = this.data?.ObjectId;
    if(!this.postId) return;
    
    this.isLoading = true;
    this.facebookPostService.getHiddenCommentConfigs(this.postId).pipe(takeUntil(this.destroy$))
      .subscribe({
        next:(res) => {
          this.dataModel = {...res};

          if(TDSHelperString.hasValueString(res.ContentOfCommentForAutoHide)){
            this.lstContentOfCommentForAutoHide = res.ContentOfCommentForAutoHide.split(",");
          }

          this.isLoading = false;
          this.cdRef.detectChanges();
        },
        error:(err) => {
          this.isLoading = false;
          this.message.error(err?.error?.message || Message.ConversationPost.CanNotLoadHiddenCommentConfig);
        }
      });
  }

  changeContentOfCommentForAutoHide(event:string[]){

    event.forEach(x => {
      if(x.includes(',')){
        this.message.error('Ký tự không hợp lệ');
        
        event.pop();
      }
    });

    this.lstContentOfCommentForAutoHide = [...event];
  }

  prepareModel() {
    let model = {...this.dataModel} as AutoHiddenConfigDTO;
    model.ContentOfCommentForAutoHide = this.lstContentOfCommentForAutoHide?.length > 0 ? this.lstContentOfCommentForAutoHide?.join(",") : "";

    return model;
  }

  onSave() {
    if(!this.postId) {
      this.message.error('Cập nhật thất bại');
      return;
    }

    let model = this.prepareModel();
    this.isLoading = true;
    this.facebookPostService.onChangeDisable$.emit(true);

    this.facebookPostService.updateHiddenCommentConfigs(this.postId, model).pipe(takeUntil(this.destroy$))
      .subscribe({
        next:(res) => {
          this.message.success(Message.UpdatedSuccess);
          this.isLoading = false;
          
          this.facebookPostService.onChangeDisable$.emit(false);
          this.cdRef.detectChanges();
        },
        error:(error) => {
          this.isLoading = false;
          this.facebookPostService.onChangeDisable$.emit(false);
          this.message.error(`${error?.error?.message || JSON.stringify(error)}`);
        }
      });
  }

  onCannel() {
    this.modalRef.destroy(null);
  }
}
