import { QuickReplyDTO } from 'src/app/main-app/dto/quick-reply.dto.ts/quick-reply.dto';
import { ActivityDataFacade } from 'src/app/main-app/services/facades/activity-data.facade';
import { ActivityMatchingService } from 'src/app/main-app/services/conversation/activity-matching.service';
import { ConversationDataFacade } from 'src/app/main-app/services/facades/conversation-data.facade';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { SharedService } from 'src/app/main-app/services/shared.service';
import { takeUntil, finalize } from 'rxjs/operators';
import { Component, OnInit, ViewContainerRef, ChangeDetectorRef, Input, EventEmitter, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { Message } from 'src/app/lib/consts/message.const';
import { ActivityStatus, SendMessageType } from 'src/app/lib/enum/message/coversation-message';
import { TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSModalRef, TDSModalService } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { ProductPagefbComponent } from '../product-pagefb/product-pagefb.component';

@Component({
  selector: 'app-modal-send-message-all',
  templateUrl: './modal-send-message-all.component.html',
})

export class ModalSendMessageAllComponent implements OnInit {

  @Input() setOfCheckedId = new Set<string>();
  @Input() team!: CRMTeamDTO;
  @Input() type!: string;

  messageModel!: string;
  uploadedImages: any[] = [];
  isVisibleReply: boolean = false;
  currentImage: any;
  isSending: boolean = false;
  lstUserCheck: TDSSafeAny
  enumActivityStatus = ActivityStatus;
  sendMessageType!: SendMessageType;

  destroy$ = new Subject<void>();
  @Output() onSentSucceed = new EventEmitter<any>();

  constructor(private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef,
    private sharedService: SharedService,
    private cdr: ChangeDetectorRef,
    private message: TDSMessageService,
    private modal: TDSModalRef,
    private conversationDataFacade: ConversationDataFacade,
    private activityMatchingService: ActivityMatchingService,
    private activityDataFacade: ActivityDataFacade) { }

  ngOnInit(): void {
    this.sendMessageType = SendMessageType.Message;
  }

  handleUpload = (item: any) => {
    this.sendMessageType = SendMessageType.Images;
    const formData = new FormData();
    formData.append('files', item.file as any, item.file.name);
    formData.append('id', '0000000000000051');

    return this.sharedService.saveImageV2(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        if (Message.Upload.Success) {
          let x = res[0].urlImageProxy as string;
          this.currentImage = x;
          const dataItem = [...this.uploadedImages, x];
          this.uploadedImages = dataItem;
          this.cdr.markForCheck();
        }
      }, error => {
        this.message.error(error.Message ? error.Message : 'Upload xảy ra lỗi');
      });
  }

  onLoadImage(event: any) {
  }

  closeImages() {
  }

  sendIconLike() {
    this.sendMessageType = SendMessageType.Like;
    const message = '👍';
    if (TDSHelperString.hasValueString(this.messageModel)) {
      this.messageModel = `${this.messageModel}${message}`;
    } else {
      this.messageModel = `${message}`;
    }

    let model = this.prepareModel(this.messageModel);
    model.attachment = {
      data: []
    }
  }

  loadEmojiMart(event: any) {
    this.sendMessageType = SendMessageType.Icon;
    if (TDSHelperString.hasValueString(this.messageModel)) {
      this.messageModel = `${this.messageModel}${event?.emoji?.native}`;
    } else {
      this.messageModel = `${event?.emoji?.native}`;
    }
  }

  onQuickReplySelected(event:QuickReplyDTO){
    this.sendMessageType = SendMessageType.QuickMessage;
    let text = event.BodyPlain || event.BodyHtml;
    this.messageModel = text;
  }

  prepareModel(message: string): any {
    let lstCheck = [...this.setOfCheckedId]
    if (lstCheck.length > 0) {
      this.lstUserCheck = this.lstUserCheck ? this.lstUserCheck : this.conversationDataFacade.getChecked(this.team.ChannelId, this.type, lstCheck);
    }
    if (this.sendMessageType == SendMessageType.QuickMessage) {
      let listToId = this.lstUserCheck.map((x: TDSSafeAny) => { return { to_id: x.to_id, to_name: x.to_name, partner_id: x.partner_id } });
      let model = {
        PageId: this.team.ChannelId,
        ToUsers: listToId,
        Message: message
      }
      return model
    } else {
      let model = {
        from: {
          id: this.team.Facebook_PageId,
          name: this.team.Facebook_PageName,
        },
        user: this.lstUserCheck,
        message: message,
      };
      return model
    }
  }

  onProductsbypageFb() {
    const modal = this.modalService.create({
      title: 'Danh sách sản phẩm',
      content: ProductPagefbComponent,
      viewContainerRef: this.viewContainerRef,
      size: 'xl',
      componentParams: {
        pageId: this.team.Facebook_PageId,
      }
    });

    modal.afterClose.subscribe((res: any) => {debugger
      this.onProductSelected(res);
    })
  }

  onProductSelected(res: any) {
    if (this.setOfCheckedId.size < 1) {
      this.message.error("Hãy chọn người bạn muốn gửi.");
      return;
    }

    this.sendMessageType = SendMessageType.Product;
    let lstCheck = [...this.setOfCheckedId]

    if (lstCheck.length > 0) {
      this.lstUserCheck = this.lstUserCheck ? this.lstUserCheck : this.conversationDataFacade.getChecked(this.team.Facebook_PageId, this.type, lstCheck);
    }

    let listToId = this.lstUserCheck.map((x: TDSSafeAny) => x.to_id);
    let model = {
      page_id: this.team.Facebook_PageId ,
      list_to_id: listToId,
      product: {
          Id: res.Id,
          Name: res.Name,
          Picture: res.Picture,
          Price: res.Price
      }
    };

    this.isSending = true;
    this.activityMatchingService.addTemplateManyMessage(model)
      .pipe(takeUntil(this.destroy$))
      .pipe(finalize(() => { this.isSending = false }))
      .subscribe((res: any) => {

        res.map((x: any, i: number) => {
          x["status"] = this.enumActivityStatus.sending;
          x["message"] = this.activityDataFacade.createDataAttachments(this.uploadedImages[i]);

          this.activityDataFacade.messageServer(x);
          this.conversationDataFacade.messageServer(x);
        });

        this.messageModel = '';
        this.currentImage = null;
        this.uploadedImages = [];

        this.message.success('Gửi sản phẩm thành công');
        this.modal.destroy('success');

    }, error => {
      this.message.error(error.error ? error.error.message : 'không gửi được tin nhắn');
    })
  }

  onClickSender() {
    if (!this.messageModel) {
      this.message.error("Hãy nhập nội dung cần gửi.");
      return;
    }

    if (this.setOfCheckedId.size < 1) {
      this.message.error("Hãy chọn người bạn muốn gửi.");
      return;
    }

    this.isSending = true;
    let model = this.prepareModel(this.messageModel);
    if (this.sendMessageType == SendMessageType.QuickMessage) {
      this.activityMatchingService.addManyMailTemplateMessage(model)
        .pipe(takeUntil(this.destroy$))
        .pipe(finalize(() => { this.isSending = false }))
        .subscribe(res => {

          res.forEach((x: TDSSafeAny) => {
              x["status"] = this.enumActivityStatus.sending;
              this.activityDataFacade.messageServer(x);
              this.conversationDataFacade.messageServer(x);
          });

          this.messageModel = '';
          this.currentImage = null;
          this.uploadedImages = [];

          this.message.success('Gửi tin nhắn thành công');
          this.modal.destroy('success');

        }, error => {
          this.message.error(error.error ? error.error.message : 'không gửi được tin nhắn');
        })

    } else {
      this.activityMatchingService.addManyMessage(model, this.team.Facebook_PageId)
        .pipe(takeUntil(this.destroy$))
        .pipe(finalize(() => { this.isSending = false; }))
        .subscribe((data) => {

            data.forEach((x: TDSSafeAny) => {
              x["status"] = this.enumActivityStatus.sending;
              this.activityDataFacade.messageServer(x);
              this.conversationDataFacade.messageServer(x);
            });

            this.messageModel = '';
            this.currentImage = null;
            this.uploadedImages = [];

            this.message.success('Gửi tin nhắn thành công');
            this.modal.destroy('success');

          }, (error) => {
            this.message.error(error.error ? error.error.message : 'không gửi được tin nhắn')
          }
        );
    }
  }

  onCancel() {
    this.modal.destroy(null);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
