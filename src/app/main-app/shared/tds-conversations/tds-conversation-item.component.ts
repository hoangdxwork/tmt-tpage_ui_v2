import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ActivityStatus } from "src/app/lib/enum/message/coversation-message";
import { TDSHelperString, TDSMessageService } from "tmt-tang-ui";
import { MakeActivityItemWebHook } from "../../dto/conversation/make-activity.dto";
import { CRMTeamDTO } from "../../dto/team/team.dto";
import { ActivityMatchingService } from "../../services/conversation/activity-matching.service";
import { ActivityDataFacade } from "../../services/facades/activity-data.facade";

@Component({
  selector: "tds-conversation-item",
  templateUrl:'./tds-conversation-item.component.html'
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
  enumActivityStatus = ActivityStatus;
  destroy$ = new Subject();
  isReply: boolean = false;

  @ViewChild('contentReply') contentReply!: ElementRef<any>;
  @ViewChild('contentMessage') contentMessage: any;

  constructor(private element: ElementRef,
    private message: TDSMessageService,
    private activityDataFacade: ActivityDataFacade,
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

  selectOrder(type: string): void {

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
        this.message.success('Thao tác thành công!');
        this.data.comment.user_likes = !this.data.comment.user_likes;
    }, error => {
      this.message.error('Đã xảy ra lỗi');
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
        this.message.success('Thao tác thành công!');
        this.data.comment.is_hidden = !this.data.comment.is_hidden;
    }, error => {
      this.message.error('Đã xảy ra lỗi');
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
        this.message.success('Thao tác thành công');
        this.activityDataFacade.refreshAttachment(res);
    }, error => {
      this.message.success('Thao tác thất bại');
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
          this.message.success("Thao tác thành công.");
      }, error => {
      this.message.success('Thao tác thất bại');
    })
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
