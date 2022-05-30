import { Component, OnChanges, OnDestroy, OnInit, Optional, Host, SkipSelf, Self } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivityStatus } from 'src/app/lib/enum/message/coversation-message';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { ActivityMatchingService } from 'src/app/main-app/services/conversation/activity-matching.service';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { ConversationPostFacade } from 'src/app/main-app/services/facades/conversation-post.facade';
import { TDSHelperArray, TDSHelperObject, TDSHelperString, TDSMessageService } from 'tmt-tang-ui';
import { SendMessageModelDTO } from 'src/app/main-app/dto/conversation/send-message.dto';
import { CRMMatchingService } from 'src/app/main-app/services/crm-matching.service';
import { ActivityDataFacade } from 'src/app/main-app/services/facades/activity-data.facade';
import { ConversationDataFacade } from 'src/app/main-app/services/facades/conversation-data.facade';
import { CommentByPost } from 'src/app/main-app/dto/conversation/post/comment-post.dto';
import { PartnerService } from 'src/app/main-app/services/partner.service';
import { ItemPostCommentComponent } from '../../conversation-post/components/item-post-comment/item-post-comment.component';
import { ConversationOrderFacade } from 'src/app/main-app/services/facades/conversation-order.facade';

@Component({
  selector: 'post-comment-all',
  templateUrl: './post-comment-all.component.html',
})

export class PostCommentAllComponent implements OnInit, OnDestroy {

  team!: CRMTeamDTO | null;
  data: any = { Items: []};
  enumActivityStatus = ActivityStatus;
  childs: any = {};
  commentOrders: any = [];
  partners$!: Observable<any>;
  destroy$ = new Subject();
  messageModel!: string;

  constructor(private message: TDSMessageService,
    private crmMatchingService: CRMMatchingService,
    private activityMatchingService: ActivityMatchingService,
    private activityDataFacade: ActivityDataFacade,
    private conversationDataFacade: ConversationDataFacade,
    private conversationPostFacade: ConversationPostFacade,
    private conversationOrderFacade: ConversationOrderFacade,
    private partnerService: PartnerService,
    @Host() @SkipSelf() @Optional() public itemPostCommentCmp: ItemPostCommentComponent,
    public crmService: CRMTeamService) {
  }

  initialize(){
    if(TDSHelperObject.hasValue(this.itemPostCommentCmp?.data)) {
      this.data = {...this.itemPostCommentCmp.data};
      this.commentOrders = {...this.itemPostCommentCmp.commentOrders};
      this.team = {...this.itemPostCommentCmp.team} as CRMTeamDTO | null;;
      this.childs = {...this.itemPostCommentCmp.childs};
      this.partners$ = this.itemPostCommentCmp.partners$;
    }
  }

  ngOnInit() {
    this.initialize();
  }

  editOrder(id: any, item: CommentByPost){
    this.conversationPostFacade.onCommentSelected$.emit(item);
  }

  isPrivateReply(item: CommentByPost){
    item.isPrivateReply = !item.isPrivateReply;
  }

  isReply(item: any) {
    item.is_reply = !item.is_reply;
  }

  onEnter(item: CommentByPost, event: any) {
    let message = this.messageModel;
    if(TDSHelperString.hasValueString(message)) {
      const model = this.prepareModel(item, message);

      if(item.isPrivateReply){
        model.comment_id = item.id;
        this.crmMatchingService.addQuickReplyComment(model)
          .pipe(takeUntil(this.destroy$))
          .subscribe((res: any) => {
              this.message.success('Gửi tin thành công');
              if(TDSHelperArray.hasListValue(res)){
                res.forEach((x: any) => {
                    x["status"] = ActivityStatus.sending;
                    this.activityDataFacade.messageServer({...x});
                });
              }
              let items = res.pop();
              this.conversationDataFacade.messageServer(items);
          }, error => {
            this.message.error('Gửi tin nhắn thất bại');
            console.log(error);
         })
      } else {
        // TODO: Trả lời bình luận
        model.parent_id = item.id;
        model.fbid = item.from?.id;

        this.activityMatchingService.replyComment(this.team?.Id, model)
          .pipe(takeUntil(this.destroy$))
          .subscribe((res: any) => {
            this.message.success("Trả lời bình luận thành công.");
            this.addReplyComment(item, model);
        }, error => {
          this.message.error(`${error?.error?.message}` || "Trả lời bình luận thất bại.");
          console.log(error);
        })
      }
    }

    (this.messageModel as any) = null;
    event.preventDefault();
  }

  prepareModel(item: CommentByPost, message: string): any {
    const model = {} as SendMessageModelDTO;
    model.from = {
      id: this.team?.Facebook_PageId,
      name: this.team?.Facebook_PageName
    }
    model.to = {
      id: item.from?.id,
      name: item.from?.name
    }
    model.to_id = item.from?.id;
    model.to_name = item.from?.name;
    model.post_id = item.object?.id;
    model.message = message;
    model.created_time = (new Date()).toISOString();

    return model;
  }

  addReplyComment(item: CommentByPost, model: SendMessageModelDTO) {
    let comment = {
      created_time: model.created_time,
      from: model.from,
      message: model.message,
      parent_id: item.id,
      post_id: item.object?.id
    }

    let replyComment = {
      created_time: model.created_time,
      message_format: model.message,
      message: model.message,
      from_id: item.from?.id,
      comment: comment,
      from: comment.from
    }

    if (this.childs[item.id]) {
      this.childs[item.id].push(replyComment);
    } else {
      this.childs[item.id] = [];
      this.childs[item.id].push(replyComment);
    }

    const addActive = {...item, ...model};
    addActive["status"] = this.enumActivityStatus.sending;
    this.activityDataFacade.messageReplyCommentServer(addActive);
  }

  onInformation(item: any) { // Chưa có dữ liệu DTO cụ thể (any)
    console.log(item);
    this.partnerService.onLoadPartnerFromPostComment.emit(item);
  }

  onCreateOrder(item: any) { // Chưa có dữ liệu DTO cụ thể (any)
    console.log(item);
    this.conversationOrderFacade.onCreateOrderFromPostComment.emit(item);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
