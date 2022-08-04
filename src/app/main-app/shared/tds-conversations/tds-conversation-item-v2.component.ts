import { CRMTeamType } from './../../dto/team/chatomni-channel.dto';
import { Facebook } from './../../../lib/dto/facebook.dto';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostBinding, HostListener, Input, OnDestroy, OnInit, ViewChild, ViewContainerRef } from "@angular/core";
import { finalize, Subject, takeUntil } from "rxjs";
import { CRMTeamDTO } from "../../dto/team/team.dto";
import { ActivityMatchingService } from "../../services/conversation/activity-matching.service";
import { ActivityDataFacade } from "../../services/facades/activity-data.facade";
import { ConversationDataFacade } from "../../services/facades/conversation-data.facade";
import { ConversationOrderFacade } from "../../services/facades/conversation-order.facade";
import { PhoneHelper } from "../helper/phone.helper";
import { ReplaceHelper } from "../helper/replace.helper";
import { eventReplyCommentTrigger } from "../helper/event-animations.helper";
import { TDSHelperArray, TDSHelperObject, TDSHelperString, TDSSafeAny } from "tds-ui/shared/utility";
import { TDSMessageService } from "tds-ui/message";
import { TDSModalService } from "tds-ui/modal";
import { ProductPagefbComponent } from "../../pages/conversations/components/product-pagefb/product-pagefb.component";
import { FormatIconLikePipe } from "../pipe/format-icon-like.pipe";
import { ChatomniMessageDetail, ChatomniMessageType, Datum } from "../../dto/conversation-all/chatomni/chatomni-message.dto";
import { TDSDestroyService } from 'tds-ui/core/services';
import { ActivityStatus } from '@core/enum/message/coversation-message';
import { SendMessageModelDTO } from '@app/dto/conversation/send-message.dto';

@Component({
  selector: "tds-conversation-item-v2",
  templateUrl:'./tds-conversation-item-v2.component.html',
  styleUrls: ['./tds-conversations.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [eventReplyCommentTrigger],
  providers: [ TDSDestroyService ]
})

export class TDSConversationItemV2Component implements OnInit {

  @Input() dataItem!: ChatomniMessageDetail;
  @Input() csid!: string;
  @Input() partner: any;
  @Input() team!: CRMTeamDTO;
  @Input() children!: any;
  @Input() type: any;
  @Input() name!: string;

  @HostBinding("@eventReplyComment") eventAnimation = true;

  messages: any = [];
  message: string = '';
  isReply: boolean = false;
  isPrivateReply: boolean = false;
  messageModel: any
  isLiking: boolean = false;
  isHiding: boolean = false;
  isReplyingComment: boolean = false;
  reloadingImage: boolean = false;
  gallery: TDSSafeAny[] = [];
  listAtts: TDSSafeAny[] = [];
  isShowItemImage: boolean = false;
  imageClick!: number;
  enumActivityStatus = ActivityStatus;

  @ViewChild('contentReply') contentReply!: ElementRef<any>;
  @ViewChild('contentMessage') contentMessage: any;

  constructor(private element: ElementRef,
    private modalService: TDSModalService,
    private tdsMessage: TDSMessageService,
    private cdRef : ChangeDetectorRef,
    private formatIconLike: FormatIconLikePipe,
    private viewContainerRef: ViewContainerRef,
    private activityDataFacade: ActivityDataFacade,
    private conversationDataFacade: ConversationDataFacade,
    private conversationOrderFacade: ConversationOrderFacade,
    private activityMatchingService: ActivityMatchingService,
    private destroy$: TDSDestroyService) {
  }

  ngOnInit(): void {
    if(TDSHelperObject.hasValue(this.children) && this.dataItem) {
        let type = this.team.Type;

        switch(type) {
          case CRMTeamType._Facebook:
            break;
          case CRMTeamType._TShop:
            if(this.dataItem.Type == ChatomniMessageType.TShopComment) {
                let tshopPost = this.children.Data
            }
            break;

          default:
            break;
        }
    }
  }

  selectOrder(type: string): any {
    let data = { phone: null, address: null, note: null } as any;

    let value = this.getTextOfContentMessage();
    if (type == 'phone') {
      let phone = PhoneHelper.getMultiplePhoneFromText(value);
      if (!phone) {
        return this.tdsMessage.error("Không tìm thấy số điện thoại");
      }
      this.tdsMessage.info("Chọn làm số điện thoại thành công");
      data.phone = phone;

    } else if (type == 'address') {
      data.address = value;
      if (value) {
        this.tdsMessage.info("Chọn làm  địa chỉ thành công");
      }

    } else if (type == 'note') {
      data.note = value;
      if (value) {
        this.tdsMessage.info("Chọn làm ghi chú thành công");
      }
    }

    //TODO: load sang tab conversation-order paste lại dữ liệu
    this.conversationOrderFacade.onSelectOrderFromMessage$.emit(data);
  }

  getTextOfContentMessage() {//TODO: thêm xử lý với tin nhắn phản hồi
    if (this.contentMessage && this.contentMessage.nativeElement && this.contentMessage.nativeElement.outerText) {
      return this.contentMessage.nativeElement.outerText;
    }

    this.tdsMessage.info("Không thể lấy thông tin");
    return null;
  }

  loadEmojiMart(event: any) {
    if(TDSHelperString.hasValueString(this.messageModel)) {
      this.messageModel = `${this.messageModel}${event?.emoji?.native}`;
    } else {
      this.messageModel = `${event?.emoji?.native}`;
    }
  }

  clickReply(event: any) {
    this.isReply = !this.isReply;
    setTimeout(() => {
      if(this.contentReply)
        this.contentReply.nativeElement.focus();
      }, 350);
  }

  addLike(event: any) {
    if(this.isLiking){
      return
    }
    this.isLiking = true;
    let model = {
      TeamId: this.team.Id,
      CommentId:  this.dataItem.Data?.id,
      Content: this.dataItem.Data?.user_likes ? 'hủy thích' : 'thích',
      Message: this.dataItem.Data?.message,
      UserName: this.dataItem.Data?.from?.name,
      fbid: this.dataItem.Data?.from?.id
    }

    this.activityMatchingService.addLikeComment(model)
      .pipe(takeUntil(this.destroy$), finalize (()=>{this.isLiking = false}))
      .subscribe((res: any) => {
        this.tdsMessage.success('Thao tác thành công!');
        this.dataItem.Data.user_likes = !this.dataItem.Data.user_likes;

        this.cdRef.markForCheck();
      }, error => {
      this.tdsMessage.error(error.error? error.error.message : 'đã xảy ra lỗi');
      this.cdRef.markForCheck();
    });
  }

  hideComment(status: any) {
    if(this.isHiding){
      return
    }
    this.isHiding = true;
    let model = {
      TeamId: this.team.Id,
      CommentId: this.dataItem.Data?.id,
      Content: this.dataItem.Data?.is_hidden ? 'hiện' : 'ẩn',
      Message: this.dataItem.Data?.message,
      UserName: this.dataItem.Data?.from.name,
      fbid: this.dataItem.Data?.from?.id
    };

    this.activityMatchingService.hideComment(model).pipe(takeUntil(this.destroy$)).pipe(finalize(()=>{this.isHiding = false})).subscribe((res: any) => {
        this.tdsMessage.success('Thao tác thành công!');
        this.dataItem.Data.is_hidden = !this.dataItem.Data?.is_hidden;

        this.cdRef.markForCheck();
    }, error => {
      this.tdsMessage.error(error.error? error.error.message :'đã xảy ra lỗi');
      this.cdRef.markForCheck();
    });
  }

  isErrorAttachment(att: Datum, dataItem: ChatomniMessageDetail){
    if(dataItem && (dataItem.Status != 2 || dataItem.Error?.Message)) {
        this.dataItem.Data['is_error_attachment'] = true;
    }
  }

  //chưa test
  refreshAttachment(item: any) {
    if(this.reloadingImage){
      return
    }
    this.reloadingImage = true;
    this.activityMatchingService.refreshAttachment(this.team.Facebook_PageId, this.dataItem.Data.id || this.csid , item.id)
      .pipe(takeUntil(this.destroy$))
      .pipe(finalize(()=>{ this.reloadingImage = false})).subscribe((res: any) => {

        this.tdsMessage.success('Thao tác thành công');
        this.activityDataFacade.refreshAttachment(res);
        this.dataItem.Data["errorShowAttachment"] = false;
        this.cdRef.markForCheck();

    }, error => {
        this.tdsMessage.error('Không thành công');
    })
  }

  checkErrorMessage(message: string): boolean {
    if(message.includes("(#10)")) {
        return true;
    }
    return false;
  }

  //chưa test
  retryMessage() {
    this.activityMatchingService.retryMessage(this.dataItem.Id, this.team.Facebook_PageId )
      .pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
          this.tdsMessage.success("Thao tác thành công");
      }, error => {
          this.tdsMessage.error('Không thành công');
      })
  }

  // has_admin_required: copy lại tn đẩy qua input tds-conversation để gửi lại
  copyMessage() {
    if(this.contentMessage?.nativeElement?.innerText) {
        let message = this.contentMessage.nativeElement.innerText;
        this.activityMatchingService.onCopyMessageHasAminRequired$.emit(message);
    }
  }

  changeIsPrivateReply() {
    this.isPrivateReply = !this.isPrivateReply;
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

    modal.afterClose.subscribe((res: any) => {
      if(res){
        this.onProductSelected(res);
      }
    })
  }

  //chưa có dữ liệu chưa test lại
  onProductSelected(event :any) {
    if(event && event.Id){
      let model = {
        page_id: this.team.Facebook_PageId,
        to_id: this.dataItem.Data.from.id,
        comment_id: this.dataItem.Data.id,
        message: this.message,

        product: {
          Id: event.Id,
          Name: event.Name,
          Picture: event.Picture,
          Price: event.Price
        }
      };

      this.activityMatchingService.addTemplateMessage(this.team.ChannelId, model)
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: any) => {
          this.activityDataFacade.messageServer(res);
          this.conversationDataFacade.messageServer(res);

          this.tdsMessage.success('Gửi thành công sản phẩm');
          this.cdRef.markForCheck();
      }, error => {
        this.tdsMessage.error(`${error.error.message}` ? `${error.error.message}`  : 'Gửi sản phẩm thất bại');
        this.cdRef.markForCheck();
      });

      this.message += event.Name, + " - " + event.Price;
    }
  }

  onIconShowButtonSelected(event: any) {
    if (!this.message) {
      this.message = event.emoji.native;
    } else {
      this.message = `${this.message}${event.emoji.native}`;
    }
  }

  onQuickReplySelected(event: any) {
    if(event) {
      let text = event.BodyPlain || event.BodyHtml || event.text;
      text = ReplaceHelper.quickReply(text, this.partner);
      this.messageModel = text;
    }
  }

  open_gallery(att: any) {
    this.isShowItemImage = true;
    this.activityDataFacade.getActivity(this.team.Facebook_PageId, this.csid, this.type)
    .pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      // this.messages = res.items;
      this.gallery = res.items.filter((x: TDSSafeAny) => x.message && x.message.attachments != null);
      let result:TDSSafeAny[]= [];

      this.gallery.map((obj: any) => {
        obj.message.attachments.data.map((data: any) => {
          if(data.mime_type != 'audio/mpeg') {
            result.push({
              date_time: obj.DateCreated,
              id: obj.from_id,
              url: data.image_data ? data.image_data.url : data.video_data.url,
              type: data.mime_type ? data.mime_type : null
            });
          }
        })
      });

      this.listAtts = result;
    });

    if(att.image_data && att.image_data.url) this.imageClick = this.listAtts.findIndex(x => x.url == att.image_data.url);
    if(att.video_data && att.video_data.url) this.imageClick = this.listAtts.findIndex(x => x.url == att.video_data.url);
  }

  onCloseShowItemImage(ev: boolean){
    this.isShowItemImage = ev;
  }

  onEnter(event: any): any{
    let message = this.messageModel;
    if (!TDSHelperString.hasValueString(message)) {
      return this.tdsMessage.error('Hãy nhập nội dung cần gửi');
    }
    this.replyComment(message, event);
  }

  replyComment(message: string, event: any) {
    if(this.isReplyingComment){
      return;
    }

    this.isReplyingComment = true;
    if(this.isPrivateReply) {
      this.addQuickReplyComment(message, event);
    } else {
      const model = this.prepareModel(message);
      model.post_id = this.dataItem.ObjectId || this.dataItem.Data?.object?.id || null;
      model.parent_id = this.dataItem.ParentId || this.dataItem?.Data?.id || null;
      this.activityMatchingService.replyComment(this.team?.Id, model)
        .pipe(takeUntil(this.destroy$))
        .pipe(finalize(()=> {this.isReplyingComment = false;} )).subscribe((res: any) => {
          this.activityDataFacade.messageReplyCommentServer({ ...res, ...model });
          this.conversationDataFacade.messageServer(res);

          this.messageModel = null;
          this.tdsMessage.success("Trả lời bình luận thành công");

          this.isReply = false;
          event.preventDefault();
          event.stopImmediatePropagation();
          this.cdRef.markForCheck();

        }, error => {
          this.tdsMessage.error(`${error?.error?.message}` ? `${error?.error?.message}` : "Trả lời bình luận thất bại");
          event.preventDefault();
          event.stopImmediatePropagation();
          this.cdRef.markForCheck();

        });
    }
  }

  // hiện thông báo trả lời thanh công nhưng chưa add, chưa gửi vào fb
  addQuickReplyComment(message: string, event: any) {
    this.isReply = false;
    const model = this.prepareModel(message);
    model.comment_id = this.dataItem.Data.id;

    this.activityMatchingService.addQuickReplyComment(model)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {

        if(TDSHelperArray.hasListValue(res)){
          res.forEach((item: any) => {
            item["status"] = this.enumActivityStatus.sending;
            this.activityDataFacade.messageServer({ ...item });
          });
        }

        this.conversationDataFacade.messageServer(res.pop());

        this.messageModel = null;
        this.isReplyingComment = false;
        this.tdsMessage.success('Gửi tin thành công');

        event.preventDefault();
        event.stopImmediatePropagation();
        this.cdRef.markForCheck();

    }, error => {
      this.tdsMessage.error(`${error?.error?.message}` ? `${error?.error?.message}` : "Gửi tin nhắn thất bại");
      this.isReplyingComment = false;

      event.preventDefault();
      event.stopImmediatePropagation();
      this.cdRef.markForCheck();
    });
  }

  prepareModel(message: string): any {
    const model = {} as SendMessageModelDTO;
    model.from = {
      id: this.team.ChannelId || this.team.Facebook_PageId,
      name: this.team.Name
    }
    model.to = {
      id: this.dataItem.Data.from.id,
      name: this.name
    };
    model.to_id = this.dataItem.Data.from.id;
    model.to_name = this.name;
    model.message = message;
    model.created_time = (new Date()).toISOString();

    return model
  }

  @HostListener('click', ['$event']) onClick(e: TDSSafeAny) {
    let className = JSON.stringify(e.target.className);
    if(className.includes('text-copyable')){
      if (e.target.className.indexOf('text-copyable') >= 0) {
        let selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = e.target.getAttribute('data-value') || e.target.innerHTML;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
        this.tdsMessage.info('Đã copy số điện thoại');
      }
    }
  }
}
