import { QuickReplyDTO } from 'src/app/main-app/dto/quick-reply.dto.ts/quick-reply.dto';
import { ActivityDataFacade } from 'src/app/main-app/services/facades/activity-data.facade';
import { ActivityMatchingService } from 'src/app/main-app/services/conversation/activity-matching.service';
import { ConversationDataFacade } from 'src/app/main-app/services/facades/conversation-data.facade';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { SharedService } from 'src/app/main-app/services/shared.service';
import { takeUntil, finalize } from 'rxjs/operators';
import { CRMMatchingService } from 'src/app/main-app/services/crm-matching.service';
import { ConversationOrderFacade } from 'src/app/main-app/services/facades/conversation-order.facade';
import { DataPouchDBDTO } from 'src/app/main-app/dto/product-pouchDB/product-pouchDB.dto';
import { ModalListProductComponent } from './../modal-list-product/modal-list-product.component';
import { Component, OnInit, ViewContainerRef, ChangeDetectorRef, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { Message } from 'src/app/lib/consts/message.const';
import { ActivityStatus, SendMessageType } from 'src/app/lib/enum/message/coversation-message';
import { TDSHelperObject, TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSModalRef, TDSModalService } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';

@Component({
  selector: 'app-modal-send-message-all',
  templateUrl: './modal-send-message-all.component.html',
})
export class ModalSendMessageAllComponent implements OnInit {
  @Input() setOfCheckedId = new Set<string>();
  @Input() team!: CRMTeamDTO;
  @Input() type!: string;

  messageModel!: string;
  uploadedImages: string[] = [];
  isVisibleReply: boolean = false;
  currentImage: any;
  isSending: boolean = false;
  lstUserCheck: TDSSafeAny
  enumActivityStatus = ActivityStatus;
  sendMessageType!: SendMessageType;

  destroy$ = new Subject<void>();

  constructor(
    private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef,
    private conversationOrderFacade: ConversationOrderFacade,
    private crmMatchingService: CRMMatchingService,
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
        let message = JSON.parse(error.Message);
        this.message.error(`${message.message}`);
      });
  }

  onLoadImage(event: any) {

  }

  closeImages() {

  }
  sendIconLike() {
    this.sendMessageType = SendMessageType.Like;
    const message = "(y)";
    let model = this.prepareModel(message);
    model.attachment = {
      data: []
    }
  }

  loadEmojiMart(event: any) {
    this.sendMessageType = SendMessageType.Icon;
    this.messageModel = `${this.messageModel}${event?.emoji?.native}`;
  }

  onQuickReplySelected(event:QuickReplyDTO){
    this.sendMessageType = SendMessageType.QuickMessage;
    let text = event.BodyPlain || event.BodyHtml;
    this.messageModel = text;
  }

  prepareModel(message: string): any {
    let lstCheck = [...this.setOfCheckedId]
    if (lstCheck.length > 0) {
      this.lstUserCheck = this.lstUserCheck ? this.lstUserCheck : this.conversationDataFacade.getChecked(this.team.Facebook_PageId, this.type, lstCheck);
    }
    if (this.sendMessageType == SendMessageType.QuickMessage) {
      let listToId = this.lstUserCheck.map((x: TDSSafeAny) => { return { to_id: x.to_id, to_name: x.to_name, partner_id: x.partner_id } });
      let model = {
        PageId: this.team.Facebook_PageId,
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


  showModalListProduct() {
    this.sendMessageType = SendMessageType.Product;
    const modal = this.modalService.create({
      title: 'Danh sách sản phẩm',
      content: ModalListProductComponent,
      viewContainerRef: this.viewContainerRef,
      size: 'xl',
      componentParams: {
        useListPrice: true,
        isSelectProduct: true
      }
    });

    modal.componentInstance?.selectProduct.subscribe((res: DataPouchDBDTO) => {
      if (TDSHelperObject.hasValue(res)) {
        this.conversationOrderFacade.onAddProductOrder.emit(res);
      }
    });
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
        .pipe(finalize(() => { this.isSending = false; }))
        .subscribe(res => {
          this.messageModel = '';
          this.currentImage = null;
          this.uploadedImages = [];
          res.forEach((x: TDSSafeAny) => {
            x["status"] = this.enumActivityStatus.sending;
            this.activityDataFacade.messageServer(x);
            this.conversationDataFacade.messageServer(x);
          });
          this.message.success('Gửi tin nhắn thành công');
          this.modal.destroy('success');
        }, error => {
          this.message.error(error.error ? error.error.message : 'không gửi được tin nhắn');
        })
    }
    else {
      this.activityMatchingService.addManyMessage(model, this.team.Facebook_PageId)
        .pipe(takeUntil(this.destroy$))
        .pipe(finalize(() => { this.isSending = false; }))
        .subscribe((data) => {
          this.messageModel = '';
          this.currentImage = null;
          this.uploadedImages = [];
          data.forEach((x: TDSSafeAny) => {
            x["status"] = this.enumActivityStatus.sending;
            this.activityDataFacade.messageServer(x);
            this.conversationDataFacade.messageServer(x);
          });
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
