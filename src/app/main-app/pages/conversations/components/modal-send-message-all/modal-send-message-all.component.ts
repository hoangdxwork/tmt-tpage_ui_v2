import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { SharedService } from 'src/app/main-app/services/shared.service';
import { takeUntil } from 'rxjs/operators';
import { CRMMatchingService } from 'src/app/main-app/services/crm-matching.service';
import { ConversationOrderFacade } from 'src/app/main-app/services/facades/conversation-order.facade';
import { DataPouchDBDTO } from 'src/app/main-app/dto/product-pouchDB/product-pouchDB.dto';
import { ModalListProductComponent } from './../modal-list-product/modal-list-product.component';
import { ModalAddQuickReplyComponent } from './../modal-add-quick-reply/modal-add-quick-reply.component';
import { TDSModalService, TDSHelperObject, TDSMessageService } from 'tmt-tang-ui';
import { Component, OnInit, ViewContainerRef, ChangeDetectorRef, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { Message } from 'src/app/lib/consts/message.const';

@Component({
  selector: 'app-modal-send-message-all',
  templateUrl: './modal-send-message-all.component.html',
})
export class ModalSendMessageAllComponent implements OnInit {
  @Input() lstUserCheck= new Set<string>();
  @Input() team!: CRMTeamDTO | null;

  messageModel!: string;
  uploadedImages: string[] = [];
  isVisibleReply: boolean = false;
  currentImage: any;

  destroy$ = new Subject();

  constructor(
    private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef,
    private conversationOrderFacade: ConversationOrderFacade,
    private crmMatchingService: CRMMatchingService,
    private sharedService: SharedService,
    private cdr: ChangeDetectorRef,
    private message: TDSMessageService,

  ) { }

  ngOnInit(): void {
  }
  
  handleUpload = (item: any) => {
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

  onLoadImage(event: any){

  }

  closeImages(){

  }
  sendIconLike() {
    const message = "(y)";
    let model = this.prepareModel(message);
    model.attachment = {
      data: []
    }

    // this.crmMatchingService.addMessage(this.data.psid, model)
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((res: any) => {
    //     this.messageResponse(res, model);
    //   }, error => {
    //     this.message.error("Like thất bại");
    //   });
  }

  loadEmojiMart(event: any) {
    this.messageModel = `${this.messageModel}${event?.emoji?.native}`;
  }


  prepareModel(message: string): any {
    // const model = {} as SendMessageModelDTO;
    // model.from = {
    //   id: this.team.Facebook_PageId,
    //   name: this.team.Facebook_PageName
    // }
    // model.to = {
    //   id: this.data.psid,
    //   name: this.data.name
    // };
    // model.message = message;
    // model.created_time = (new Date()).toISOString();
    // model.attachments = {
    //   data: []
    // }

    // let exist = TDSHelperArray.hasListValue(this.uploadedImages) && this.type != 'comment'
    // if (exist) {
    //   this.uploadedImages.map((x: string) => {
    //     (model.attachments?.data as any[]).push({
    //       image_data: {
    //         url: x
    //       }
    //     });
    //   });
    // }
    // return model;
  }

  showModalAddQuickReply() {
    const modal = this.modalService.create({
      title: 'Thêm mới trả lời nhanh',
      content: ModalAddQuickReplyComponent,
      viewContainerRef: this.viewContainerRef,
      size: 'md',
      componentParams: {

      }
    });
    modal.afterOpen.subscribe(() => {

    });
    // Return a result when closed
    modal.afterClose.subscribe(result => {
      if (TDSHelperObject.hasValue(result)) {
      }
    });
  }

  showModalListProduct() {
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

    modal.componentInstance?.selectProduct.subscribe((res: DataPouchDBDTO) =>{
      if(TDSHelperObject.hasValue(res)) {
        this.conversationOrderFacade.onAddProductOrder.emit(res);
      }
    });
  }

  onClickSender(){
    if (!this.messageModel) {
      this.message.error("Hãy nhập nội dung cần gửi.");
      return;
    }

    if(this.lstUserCheck.size < 1) {
      this.message.error("Hãy chọn người bạn muốn gửi.");
      return;
    }
  }
  onCancel(){

  }
}
