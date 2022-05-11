import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ActivityStatus } from "src/app/lib/enum/message/coversation-message";
import { TDSHelperString, TDSMessageService } from "tmt-tang-ui";
import { MakeActivityItemWebHook } from "../../dto/conversation/make-activity.dto";
import { CRMTeamDTO } from "../../dto/team/team.dto";
import { ActivityMatchingService } from "../../services/conversation/activity-matching.service";
import { ActivityDataFacade } from "../../services/facades/activity-data.facade";
import { ConversationDataFacade } from "../../services/facades/conversation-data.facade";
import { ConversationOrderFacade } from "../../services/facades/conversation-order.facade";
import { PhoneHelper } from "../helper/phone.helper";
import { ReplaceHelper } from "../helper/replace.helper";

@Component({
  selector: "tds-conversation-item",
  templateUrl:'./tds-conversation-item.component.html',
  styleUrls: ['./tds-conversations.component.sass'],
})

export class TDSConversationItemComponent implements OnInit, OnDestroy {

  @Input() data!: MakeActivityItemWebHook;
  @Input() index!: number;
  @Input() psid!: string;
  @Input() name!: string;
  @Input() partner: any;
  @Input() team!: CRMTeamDTO;
  @Input() children: any;
  @Input() type: any;
  messages: any = [];
  message: string = '';
  enumActivityStatus = ActivityStatus;
  destroy$ = new Subject();
  isReply: boolean = false;
  isPrivateReply: boolean = false;

  @ViewChild('contentReply') contentReply!: ElementRef<any>;
  @ViewChild('contentMessage') contentMessage: any;

  constructor(private element: ElementRef,
    private tdsMessage: TDSMessageService,
    private activityDataFacade: ActivityDataFacade,
    private conversationDataFacade: ConversationDataFacade,
    private conversationOrderFacade: ConversationOrderFacade,
    private activityMatchingService: ActivityMatchingService) {
  }

  ngOnInit(): void {
    //TODO: mapping data from request to Webhook
    if(this.data) {
      this.data = { ...this.data };
      if(TDSHelperString.hasValueString(this.data.page_id)) {
        this.data.page_id = this.team.Facebook_PageId;
      }
      if(TDSHelperString.hasValueString(this.data.psid)) {
        this.data.psid = this.psid;
      }
      if(TDSHelperString.hasValueString(this.data.psid)) {
        this.data.page_id = this.psid;
      }
      if(TDSHelperString.hasValueString(this.data.object_id)) {
        this.data.page_id = this.data.comment?.object?.id || null;
      }
    }
  }

  public getElement(): ElementRef {
      return this.element;
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
        return this.tdsMessage.error("Không tìm thấy số điện thoại.");
      }
      this.tdsMessage.info("Chọn làm số điện thoại thành công.");
      data.phone = phone;
    } else if (type == 'address') {
      data.address = value;
      if (value) {
        this.tdsMessage.info("Chọn làm  địa chỉ thành công.");
      }
    } else if (type == 'note') {
      data.note = value;
      if (value) {
        this.tdsMessage.info("Chọn làm ghi chú thành công.");
      }
    }

    //TODO: load sang tab conversation-order paste lại dữ liệu
    this.conversationOrderFacade.onConversationOrder$.emit(data);
  }

  getTextOfContentMessage() {
    if (this.contentMessage && this.contentMessage.nativeElement && this.contentMessage.nativeElement.outerText) {
      return this.contentMessage.nativeElement.outerText;
    }
    this.tdsMessage.info("Không thể lấy thông tin.");
    return null;
  }


  clickReply(event: any) {
    this.isReply = !this.isReply;
  }

  addLike(event: any) {
    let model = {
        TeamId: this.team.Id,
        CommentId: this.data.id,
        Content: this.data.comment?.user_likes ? 'hủy thích' : 'thích',
        Message: this.data.message_formatted || this.data.message,
        UserName: this.data.comment?.from?.name,
        fbid: this.data.comment?.from?.id
    }

    this.activityMatchingService.addLikeComment(model).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
        this.tdsMessage.success('Thao tác thành công!');
        this.data.comment.user_likes = !this.data.comment.user_likes;
    }, error => {
      this.tdsMessage.error('Đã xảy ra lỗi');
    });
  }

  hideComment(status: any) {
    let model = {
        TeamId: this.team.Id,
        CommentId: this.data.id,
        Content: this.data.comment?.is_hidden ? 'hiện' : 'ẩn',
        Message: this.data.comment?.message,
        UserName: this.data.comment?.from.name,
        fbid: this.data.comment?.from?.id
    };

    this.activityMatchingService.hideComment(model).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
        this.tdsMessage.success('Thao tác thành công!');
        this.data.comment.is_hidden = !this.data.comment.is_hidden;
    }, error => {
      this.tdsMessage.error('Đã xảy ra lỗi');
    });
  }

  isErrorAttachment(att: any, data: any): Boolean{
    if(data && (data.status != this.enumActivityStatus.fail || data.error_message)) {
      return true;
    }
    return false;
  }

  refreshAttachment(item: any) {
    this.activityMatchingService.refreshAttachment(this.team.Facebook_PageId, this.data.fbid || this.data.id , item.id)
      .pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
        this.tdsMessage.success('Thao tác thành công');
        this.activityDataFacade.refreshAttachment(res);
    }, error => {
      this.tdsMessage.error('Thao tác thất bại');
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
          this.tdsMessage.success("Thao tác thành công.");
      }, error => {
      this.tdsMessage.success('Thao tác thất bại');
    })
  }

  changeIsPrivateReply() {
    this.isPrivateReply = !this.isPrivateReply;
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
        Price: event.Price,
      }
    };

    this.activityMatchingService.addTemplateMessage(this.data.psid, model)
      .pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
        this.activityDataFacade.messageServer(res);
        this.conversationDataFacade.messageServer(res);
        this.tdsMessage.success('Gửi thành công sản phẩm.');
    }, error => {
      this.tdsMessage.error('Gửi sản phẩm thất bại');
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
    this.message = text;
  }

  open_gallery(send_picture: any, att: any) {
  }

  replyComment(event :any) {

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
