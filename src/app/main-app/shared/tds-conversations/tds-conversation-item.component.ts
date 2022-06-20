import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostBinding, HostListener, Input, OnDestroy, OnInit, ViewChild, ViewContainerRef, ViewEncapsulation } from "@angular/core";
import { Subject } from "rxjs";
import { finalize, takeUntil } from "rxjs/operators";
import { ActivityStatus } from "src/app/lib/enum/message/coversation-message";
import { MakeActivityItemWebHook } from "../../dto/conversation/make-activity.dto";
import { CRMTeamDTO } from "../../dto/team/team.dto";
import { ActivityMatchingService } from "../../services/conversation/activity-matching.service";
import { ActivityDataFacade } from "../../services/facades/activity-data.facade";
import { ConversationDataFacade } from "../../services/facades/conversation-data.facade";
import { ConversationOrderFacade } from "../../services/facades/conversation-order.facade";
import { PhoneHelper } from "../helper/phone.helper";
import { ReplaceHelper } from "../helper/replace.helper";
import { SendMessageModelDTO } from '../../dto/conversation/send-message.dto';
import { eventReplyCommentTrigger } from "../helper/event-animations.helper";
import { TDSHelperArray, TDSHelperString, TDSSafeAny } from "tds-ui/shared/utility";
import { TDSMessageService } from "tds-ui/message";
import { TDSModalService } from "tds-ui/modal";
import { ProductPagefbComponent } from "../../pages/conversations/components/product-pagefb/product-pagefb.component";

@Component({
  selector: "tds-conversation-item",
  templateUrl:'./tds-conversation-item.component.html',
  styleUrls: ['./tds-conversations.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  animations: [eventReplyCommentTrigger]
})

export class TDSConversationItemComponent implements OnInit, OnDestroy {

  @Input() data!: MakeActivityItemWebHook;
  @Input() index!: number;
  @Input() psid!: string;
  @Input() partner: any;
  @Input() team!: CRMTeamDTO;
  @Input() children: any;
  @Input() type: any;
  @Input() name!: string;

  @HostBinding("@eventReplyComment") eventAnimation = true;

  messages: any = [];
  message: string = '';
  enumActivityStatus = ActivityStatus;
  destroy$ = new Subject<void>();
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

  @ViewChild('contentReply') contentReply!: ElementRef<any>;
  @ViewChild('contentMessage') contentMessage: any;

  constructor(private element: ElementRef,
    private modalService: TDSModalService,
    private tdsMessage: TDSMessageService,
    private cdRef : ChangeDetectorRef,
    private viewContainerRef: ViewContainerRef,
    private activityDataFacade: ActivityDataFacade,
    private conversationDataFacade: ConversationDataFacade,
    private conversationOrderFacade: ConversationOrderFacade,
    private activityMatchingService: ActivityMatchingService) {
  }

  ngOnInit(): void {
    //TODO: mapping data from request to Webhook
    if(this.data) {
      this.activityDataFacade.makeActivity(this.team.Facebook_PageId, this.data.from_id, this.type);
      if (!this.data.message_formatted && this.data.id) {
        this.data['attachments'] = this.activityDataFacade.getMessageAttachments(this.team.Facebook_PageId, this.data.from_id, this.data.id);
      }
    }
  }

  selectOrder(type: string): any {
    let data = {
      phone: null,
      address: null,
      note: null
    } as any;

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
    this.conversationOrderFacade.onConversationOrder$.emit(data);
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
      CommentId: this.data.id,
      Content: this.data.comment?.user_likes ? 'hủy thích' : 'thích',
      Message: this.data.message_formatted || this.data.message,
      UserName: this.data.comment?.from?.name,
      fbid: this.data.comment?.from?.id
    }

    this.activityMatchingService.addLikeComment(model)
      .pipe(takeUntil(this.destroy$))
      .pipe(finalize (()=>{this.isLiking = false}))
      .subscribe((res: any) => {
        this.tdsMessage.success('Thao tác thành công!');
        this.data.comment.user_likes = !this.data.comment.user_likes;

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
      CommentId: this.data.id,
      Content: this.data.comment?.is_hidden ? 'hiện' : 'ẩn',
      Message: this.data.comment?.message,
      UserName: this.data.comment?.from.name,
      fbid: this.data.comment?.from?.id
    };

    this.activityMatchingService.hideComment(model).pipe(takeUntil(this.destroy$)).pipe(finalize(()=>{this.isHiding = false})).subscribe((res: any) => {
        this.tdsMessage.success('Thao tác thành công!');
        this.data.comment.is_hidden = !this.data.comment.is_hidden;

        this.cdRef.markForCheck();
    }, error => {
      this.tdsMessage.error(error.error? error.error.message :'đã xảy ra lỗi');
      this.cdRef.markForCheck();
    });
  }

  isErrorAttachment(att: any, data: any){
    if(data && (data.status  != this.enumActivityStatus.fail || data.error_message)) {
      this.data["errorShowAttachment"] = true;
    }
  }

  refreshAttachment(item: any) {
    if(this.reloadingImage){
      return
    }
    this.reloadingImage = true;
    this.activityMatchingService.refreshAttachment(this.team.Facebook_PageId, this.data.fbid || this.data.id , item.id)
      .pipe(takeUntil(this.destroy$))
      .pipe(finalize(()=>{ this.reloadingImage = false})).subscribe((res: any) => {
        this.tdsMessage.success('Thao tác thành công');
        this.activityDataFacade.refreshAttachment(res);
        this.data["errorShowAttachment"] = false;
        this.cdRef.markForCheck();
    }, error => {
      this.tdsMessage.error('Không thành công');
    })
  }

  checkErrorMessage(message: string): Boolean {
    if(message.includes("(#10)")) {
       return true;
    }
    return false;
  }

  retryMessage() {
    this.activityMatchingService.retryMessage(this.data.tpid || this.data.id, this.team.Facebook_PageId)
      .pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
          this.tdsMessage.success("Thao tác thành công");
      }, error => {
      this.tdsMessage.error('Không thành công');
    })
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
      this.onProductSelected(res);
    })
  }

  onProductSelected(event :any) {
    let model = {
      page_id: this.team.Facebook_PageId,
      to_id: this.data.from_id,
      comment_id: this.data.id,
      message: this.message,

      product: {
        Id: event.Id,
        Name: event.Name,
        Picture: event.Picture,
        Price: event.Price
      }
    };

    this.activityMatchingService.addTemplateMessage(this.data.psid, model)
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

  onIconShowButtonSelected(event: any) {
    if (!this.message) {
      this.message = event.emoji.native;
    } else {
      this.message = `${this.message}${event.emoji.native}`;
    }
  }

  onQuickReplySelected(event: any) {
    let text = event.BodyPlain || event.BodyHtml || event.text;
    text = ReplaceHelper.quickReply(text, this.partner);
    this.messageModel = text;
  }

  open_gallery(att: any) {
    this.isShowItemImage = true;
    this.activityDataFacade.getActivity(this.team.Facebook_PageId, this.psid, this.type)
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
      model.post_id = this.data.object_id || this.data.comment?.object?.id || null;
      model.parent_id = this.data.id || this.data?.comment?.id || null;
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

  addQuickReplyComment(message: string, event: any) {
    this.isReply = false;
    const model = this.prepareModel(message);
    model.comment_id = this.data.id;

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
      id: this.team.Facebook_PageId,
      name: this.team.Facebook_PageName
    }
    model.to = {
      id: this.data.from_id,
      name: this.name
    };
    model.to_id = this.data.from_id;
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
