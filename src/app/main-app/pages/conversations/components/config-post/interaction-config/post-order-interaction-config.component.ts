import { AutoOrderConfigDTO } from '@app/dto/configs/post/post-order-config.dto';
import { TDSDestroyService } from 'tds-ui/core/services';
import { takeUntil } from 'rxjs/operators';
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { FacebookPostService } from 'src/app/main-app/services/facebook-post.service';
import { Message } from 'src/app/lib/consts/message.const';
import { TDSModalRef } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { TDSHelperString } from 'tds-ui/shared/utility';
import { ChatomniObjectsItemDto } from '@app/dto/conversation-all/chatomni/chatomni-objects.dto';

@Component({
  selector: 'post-order-interaction-config',
  templateUrl: './post-order-interaction-config.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TDSDestroyService]
})
export class PostOrderInteractionConfigComponent implements OnInit {

  @Input() data!: ChatomniObjectsItemDto;

  dataModel!:AutoOrderConfigDTO;
  isLoading: boolean = false;
  isEditSendMess: boolean = false;

  constructor(
    private modalRef: TDSModalRef,
    private message: TDSMessageService,
    private facebookPostService: FacebookPostService,
    private destroy$: TDSDestroyService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadData(this.data.ObjectId);
  }

  loadData(postId: string) {
    this.isLoading = false;

    this.facebookPostService.getOrderConfig(postId).pipe(takeUntil(this.destroy$))
      .subscribe({
        next:(res) => {
          this.dataModel = {...res};

          let temp = document.createElement("div");

          if (TDSHelperString.hasValueString(this.dataModel?.OrderReplyTemplate)) {
            temp.innerHTML = this.dataModel?.OrderReplyTemplate;
            this.dataModel.OrderReplyTemplate = temp.textContent || temp.innerText || "";
          }

          this.isLoading = false;

          this.cdRef.detectChanges();
        },
        error:(err) => {
          this.message.error(err?.error?.message || Message.ConversationPost.CanNotLoadInteractionConfig);
          this.isLoading = false;
        }
      });
  }

  editSendMess(){
    this.isEditSendMess = true;
  }

  prepareModel() {
    let model = {...this.dataModel} as AutoOrderConfigDTO;

    return model;
  }

  onSave() {
    let model = this.prepareModel();
    let postId = this.data?.ObjectId;

    this.isLoading = true;

    this.facebookPostService.updateInteractionConfig(postId, model).pipe(takeUntil(this.destroy$))
      .subscribe({
        next:(res) => {
          this.message.success(Message.UpdatedSuccess);
          this.isLoading = false;

          this.cdRef.detectChanges();
        }, 
        error:(error) => {
          this.message.error(`${error?.error?.message || JSON.stringify(error)}`);
          this.isLoading = false;
        }
      });
  }

  onCannel() {
    this.modalRef.destroy(null);
  }
}
