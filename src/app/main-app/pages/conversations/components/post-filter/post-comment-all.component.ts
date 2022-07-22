import { ActivityByGroup } from './../../../../dto/conversation/post/comment-group.dto';
import { ReplaceHelper } from './../../../../shared/helper/replace.helper';
import { Component, OnChanges, OnDestroy, OnInit, Optional, Host, SkipSelf, Self, ViewChild, ChangeDetectorRef, Input, HostBinding } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivityStatus } from 'src/app/lib/enum/message/coversation-message';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { ActivityMatchingService } from 'src/app/main-app/services/conversation/activity-matching.service';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { ConversationPostFacade } from 'src/app/main-app/services/facades/conversation-post.facade';
import { SendMessageModelDTO } from 'src/app/main-app/dto/conversation/send-message.dto';
import { CRMMatchingService } from 'src/app/main-app/services/crm-matching.service';
import { ActivityDataFacade } from 'src/app/main-app/services/facades/activity-data.facade';
import { ConversationDataFacade } from 'src/app/main-app/services/facades/conversation-data.facade';
import { CommentByPost } from 'src/app/main-app/dto/conversation/post/comment-post.dto';
import { ItemPostCommentComponent } from '../../conversation-post/item-post-comment.component';
import { TDSMessageService } from 'tds-ui/message';
import { ConversationOrderFacade } from 'src/app/main-app/services/facades/conversation-order.facade';
import { TDSHelperArray, TDSHelperObject, TDSHelperString } from 'tds-ui/shared/utility';
import { FacebookCommentService } from 'src/app/main-app/services/facebook-comment.service';
import { FacebookPostItem } from 'src/app/main-app/dto/facebook-post/facebook-post.dto';
import { eventFadeStateTrigger } from 'src/app/main-app/shared/helper/event-animations.helper';
import { YiAutoScrollDirective } from 'src/app/main-app/shared/directives/yi-auto-scroll.directive';

@Component({
  selector: 'post-comment-all',
  templateUrl: './post-comment-all.component.html',
  animations: [eventFadeStateTrigger]
})

export class PostCommentAllComponent implements OnInit, OnDestroy {

  @Input() post!: FacebookPostItem;

  @ViewChild(YiAutoScrollDirective) yiAutoScroll!: YiAutoScrollDirective;
  @HostBinding("@eventFadeState") eventAnimation = true;

  team!: CRMTeamDTO | null;
  data: any = { Items: []};
  enumActivityStatus = ActivityStatus;
  childs: any = {};
  commentOrders: any = [];
  partners$!: Observable<any>;
  destroy$ = new Subject<void>();
  messageModel!: string;
  currentId: string = '';
  isLoading: boolean = false;

  constructor(private message: TDSMessageService,
    private cdRef: ChangeDetectorRef,
    private crmMatchingService: CRMMatchingService,
    private activityMatchingService: ActivityMatchingService,
    private activityDataFacade: ActivityDataFacade,
    private facebookCommentService: FacebookCommentService,
    private conversationDataFacade: ConversationDataFacade,
    private conversationPostFacade: ConversationPostFacade,
    private conversationOrderFacade: ConversationOrderFacade,
    @Host() @SkipSelf() @Optional() public itemPostCommentCmp: ItemPostCommentComponent,
    public crmService: CRMTeamService) {
  }

  initialize(){
    if(TDSHelperObject.hasValue(this.itemPostCommentCmp?.data)) {
      this.data = {...this.itemPostCommentCmp.data};
      this.commentOrders = {...this.itemPostCommentCmp.commentOrders};
      this.team = {...this.itemPostCommentCmp.team} as CRMTeamDTO | null;
      this.childs = {...this.itemPostCommentCmp.childs};
      this.partners$ = this.itemPostCommentCmp.partners$;
    }
  }

  ngOnInit() {
    this.initialize();
  }

  editOrder(id: any, item: CommentByPost){
    this.currentId = item.id;
    this.conversationPostFacade.onCommentSelected$.emit(item);
  }

  isPrivateReply(item: CommentByPost){
    item.isPrivateReply = !item.isPrivateReply;
  }

  isReply(item: any) {
    item.is_reply = !item.is_reply;
  }

  loadEmojiMart(event: any) {
    if (TDSHelperString.hasValueString(this.messageModel)) {
      this.messageModel = `${this.messageModel}${event?.emoji?.native}`;
    } else {
      this.messageModel = `${event?.emoji?.native}`;
    }
  }

  onProductSelected(event :any) {
    let model = {
      page_id: this.team?.Facebook_PageId,
      to_id: this.data.from_id,
      comment_id: this.data.id,
      message: this.messageModel,

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

        this.message.success('Gửi thành công sản phẩm');
    }, error => {
      this.message.error('Gửi sản phẩm thất bại');
    });

    this.message += event.Name, + " - " + event.Price;
  }

  onQuickReplySelected(event: any) {
    let text = event.BodyPlain || event.BodyHtml || event.text;
    if(this.partners$){
      this.partners$.pipe(takeUntil(this.destroy$)).subscribe((res:any)=>{
          text = ReplaceHelper.quickReply(text, res);
          this.message = text;
        }, (err)=>{
          this.message.error(`${err.error.message}` || 'Đã xảy ra lỗi');
        }
      )
    } else{
      this.message.error('Không lấy được thông tin khách hàng');
    }
  }

  onEnter(item: CommentByPost, event: any) {
    let message = this.messageModel;
    this.replyComment(item,message);

    (this.messageModel as any) = null;
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  messageSendingToServer(item: CommentByPost) {
    let message = this.messageModel;

    if (!TDSHelperString.hasValueString(message)) {
      this.message.error('Hãy nhập nội dung cần gửi');
    }

    this.replyComment(item, message);
    (this.messageModel as any) = null;
  }

  replyComment(item: CommentByPost, msg:string){
    if(TDSHelperString.hasValueString(msg)) {
      const model = this.prepareModel(item, msg);

      if(item.isPrivateReply){
        model.comment_id = item.id;
        this.crmMatchingService.addQuickReplyComment(model)
          .pipe(takeUntil(this.destroy$)).subscribe((res: any) => {

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
            this.message.error(`${error.error?.message}` || 'Gửi tin nhắn thất bại');
         })

      } else {
        // TODO: Trả lời bình luận
        model.parent_id = item.id;
        model.fbid = item.from?.id;

        this.activityMatchingService.replyComment(this.team?.Id, model)
          .pipe(takeUntil(this.destroy$)).subscribe((res: any) => {

            this.message.success("Trả lời bình luận thành công.");
            this.addReplyComment(item, model);

        }, error => {
          this.message.error(`${error.error?.message}` || "Trả lời bình luận thất bại.");
        })
      }
    }
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

  onInformation(item: ActivityByGroup) {
    this.currentId = item.id;
    this.conversationOrderFacade.commentFormPost(item, false);
  }

  onCreateOrder(item: ActivityByGroup) {
    this.currentId = item.id;
    this.conversationOrderFacade.commentFormPost(item, true);
  }

  nextData(event: any) {
    if(this.isLoading) {
      return;
    }
    if(this.data && this.data.HasNextPage && TDSHelperString.hasValueString(this.data.NextPage)) {
      let postId = this.itemPostCommentCmp.post.fbid;
      this.isLoading = true;

      this.facebookCommentService.getCommentsByQuery(this.data.NextPage, postId)
        .pipe(takeUntil(this.destroy$)).subscribe((res: any)=> {

          res.Items = [...this.data.Items, ...res.Items];
          this.data = res;

          this.isLoading = false;
          this.cdRef.detectChanges();
      }, error => {
          this.isLoading = false;
          this.message.error(`${error.error?.message}`)
      });
    }
  }

  trackByIndex(i: any) {
    return i;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
