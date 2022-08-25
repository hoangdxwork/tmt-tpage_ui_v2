import { AutoOrderConfigDTO } from '@app/dto/configs/post/post-order-config.dto';
import { TDSDestroyService } from 'tds-ui/core/services';
import { takeUntil } from 'rxjs/operators';
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { FacebookPostService } from 'src/app/main-app/services/facebook-post.service';
import { Message } from 'src/app/lib/consts/message.const';
import { TDSModalRef } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
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
  isEditReply: boolean = false;

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
          this.dataModel.OrderReplyTemplate = this.dataModel.OrderReplyTemplate.replace(/<p>|<\/p>/g, '');

          this.isLoading = false;
          this.cdRef.detectChanges();
        },
        error:(err) => {
          this.message.error(err?.error?.message || Message.ConversationPost.CanNotLoadInteractionConfig);
          this.isLoading = false;
        }
      });
  }

  onEditReply(){
    this.isEditReply = !this.isEditReply;
  }

  prepareModel() {
    return {
      IsEnableOrderReplyAuto: this.dataModel.IsEnableOrderReplyAuto,
      IsEnableShopLink: this.dataModel.IsEnableShopLink,
      IsOrderAutoReplyOnlyOnce: this.dataModel.IsOrderAutoReplyOnlyOnce,
      OrderReplyTemplate: `<p>${this.dataModel.OrderReplyTemplate}</p>`,
      ShopLabel: this.dataModel.ShopLabel,
      ShopLabel2: this.dataModel.ShopLabel2
    } as AutoOrderConfigDTO;
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
