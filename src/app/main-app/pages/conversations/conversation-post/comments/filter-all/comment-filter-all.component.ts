
import { Component, OnDestroy, OnInit, ViewChild, ChangeDetectorRef, Input, HostBinding, ChangeDetectionStrategy, ViewContainerRef, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
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
import { TDSMessageService } from 'tds-ui/message';
import { ConversationOrderFacade } from 'src/app/main-app/services/facades/conversation-order.facade';
import { TDSHelperArray, TDSHelperString } from 'tds-ui/shared/utility';
import { eventFadeStateTrigger } from 'src/app/main-app/shared/helper/event-animations.helper';
import { YiAutoScrollDirective } from 'src/app/main-app/shared/directives/yi-auto-scroll.directive';
import { TDSModalService } from 'tds-ui/modal';
import { ProductPagefbComponent } from '@app/pages/conversations/components/product-pagefb/product-pagefb.component';
import { ReplaceHelper } from '@app/shared/helper/replace.helper';
import { ChatomniCommentService } from '@app/services/chatomni-service/chatomni-comment.service';
import { ChatomniObjectsItemDto } from '@app/dto/conversation-all/chatomni/chatomni-objects.dto';
import { ChatomniDataDto, ChatomniDataItemDto, ChatomniFacebookDataDto } from '@app/dto/conversation-all/chatomni/chatomni-data.dto';
import { TDSDestroyService } from 'tds-ui/core/services';

@Component({
  selector: 'comment-filter-all',
  templateUrl: './comment-filter-all.component.html',
  animations: [eventFadeStateTrigger],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ TDSDestroyService ]
})

export class CommentFilterAllComponent implements OnInit, OnDestroy {


  @ViewChild(YiAutoScrollDirective) yiAutoScroll!: YiAutoScrollDirective;
  @HostBinding("@eventFadeState") eventAnimation = true;
  // @Input() postId!: string;
  // @Input() data: any = { Items: []};
  // @Input() team!: CRMTeamDTO | null;

  @Input() commentOrders!: any;
  @Input() data!: ChatomniObjectsItemDto;
  @Input() team!: CRMTeamDTO;

  dataSource$!: Observable<ChatomniDataDto>;
  dataSource!: ChatomniDataDto;
  childs: any = {};

  enumActivityStatus = ActivityStatus;
  partners$!: Observable<any>;
  messageModel!: string;
  isLoading: boolean = false;
  isHiddenComment: any = {};

  constructor(private message: TDSMessageService,
    private cdRef: ChangeDetectorRef,
    private ngZone: NgZone,
    private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef,
    private crmMatchingService: CRMMatchingService,
    private activityMatchingService: ActivityMatchingService,
    private conversationPostFacade: ConversationPostFacade,
    private chatomniCommentService: ChatomniCommentService,
    public crmService: CRMTeamService,
    private destroy$: TDSDestroyService) {
  }

  ngOnInit() {
    if(this.team && this.data) {
        this.loadData();
    }
  }

  loadData() {
    this.isLoading = true;

    this.ngZone.run(() => {
      this.dataSource$ =  this.chatomniCommentService.makeDataSource(this.team.Id, this.data.ObjectId);
    })

    this.dataSource$.pipe(takeUntil(this.destroy$)).subscribe((res: ChatomniDataDto) => {
        if(res) {
            this.dataSource = res;
        }
        this.isLoading = false;
        this.cdRef.markForCheck();

    }, error => {
        this.isLoading = false;
        this.message.error(`${error?.error?.message}` || 'Đã xảy ra lỗi');
    })
  }

  editOrder(id: any, item: any){
    this.conversationPostFacade.onCommentSelected$.emit(item);
  }

  isPrivateReply(item: ChatomniDataItemDto){
    item.Data.is_private_reply = !item.Data.is_private_reply;
  }

  isReply(item: ChatomniDataItemDto) {
    item.Data.is_reply = !item.Data.is_reply;
  }

  loadEmojiMart(event: any) {
    if (TDSHelperString.hasValueString(this.messageModel)) {
        this.messageModel = `${this.messageModel}${event?.emoji?.native}`;
    } else {
        this.messageModel = `${event?.emoji?.native}`;
    }
  }

  onProductsbypageFb(item: ChatomniDataItemDto) {
    const modal = this.modalService.create({
      title: 'Danh sách sản phẩm',
      content: ProductPagefbComponent,
      viewContainerRef: this.viewContainerRef,
      size: 'xl',
      componentParams: {
        pageId: this.team?.ChannelId,
      }
    });

    modal.componentInstance?.onSendProduct.subscribe(res=>{
      if(res){
          this.onProductSelected(res, item);
      }
    })
  }

  onProductSelected(event: any, item: ChatomniDataItemDto) {
    let model = {
      page_id: this.team?.ChannelId,
      to_id: item.UserId,
      comment_id: item.Id,
      message: `${ event.Name} - ${event.Price}`,

      product: {
        Id: event.Id,
        Name: event.Name,
        Picture: event.Picture,
        Price: event.Price,
      }
    };

    // this.activityMatchingService.addTemplateMessage(this.data.psid, model)
    //   .pipe(takeUntil(this.destroy$)).subscribe((res: any) => {

    //     this.activityDataFacade.messageServer(res);
    //     this.conversationDataFacade.messageServer(res);

    //     this.message.success('Gửi thành công sản phẩm');
    // }, error => {
    //     this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Gửi sản phẩm thất bại');
    // });

  }

  onQuickReplySelected(event: any) {
    let text = event.BodyPlain || event.BodyHtml || event.text;
    if(this.partners$){
      this.partners$.pipe(takeUntil(this.destroy$)).subscribe((partner: any) => {

          text = ReplaceHelper.quickReply(text, partner);
          this.message = text;

        }, (error)=>{
          this.message.error(`${error.error.message}` || 'Đã xảy ra lỗi');
        })
    } else{
        this.message.error('Không lấy được thông tin khách hàng');
    }
  }

  onEnter(item: ChatomniDataItemDto, event: any) {
    if(event) {
      let message = this.messageModel;
      this.replyComment(item, message);

      (this.messageModel as any) = null;
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }

  messageSendingToServer(item: ChatomniDataItemDto) {
    let message = this.messageModel;

    if (!TDSHelperString.hasValueString(message)) {
      this.message.error('Hãy nhập nội dung cần gửi');
    }

    this.replyComment(item, message);
    (this.messageModel as any) = null;
  }

  replyComment(item: ChatomniDataItemDto, msg:string){
    if(TDSHelperString.hasValueString(msg)) {
      const model = this.prepareModel(item, msg);

      // TODO: gửi về tin nhắn
      if(item.Data.is_private_reply){

          model.comment_id = item.Id;
          this.crmMatchingService.addQuickReplyComment(model)
            .pipe(takeUntil(this.destroy$)).subscribe((res: any) => {

                this.message.success('Gửi tin thành công');
                if(TDSHelperArray.hasListValue(res)){
                  res.forEach((x: any) => {
                      x["status"] = ActivityStatus.sending;
                      // this.activityDataFacade.messageServer({...x});
                  });
                }

                // let items = res.pop();
                // this.conversationDataFacade.messageServer(items);
            }, error => {
              this.message.error(`${error.error?.message}` || 'Gửi tin nhắn thất bại');
          })

      } else {
          // TODO: Trả lời bình luận
          model.parent_id = item.Id;
          model.fbid = item.UserId;

          this.activityMatchingService.replyComment(this.team!.Id, model)
            .pipe(takeUntil(this.destroy$)).subscribe((res: any) => {

              this.message.success("Trả lời bình luận thành công.");
              this.addReplyComment(item, model);

          }, error => {
            this.message.error(`${error.error?.message}` || "Trả lời bình luận thất bại.");
          })
      }
    }
  }

  prepareModel(item: ChatomniDataItemDto, message: string): any {
    const model = {} as SendMessageModelDTO;
    model.from = {
      id: this.team?.ChannelId,
      name: this.team?.Facebook_PageName
    }
    model.to = {
      id: item.UserId,
      name: item.Data?.from?.name
    }
    model.to_id = item.UserId;
    model.to_name = item.Data?.from?.name;
    model.post_id = item.Data.object?.id;
    model.message = message;
    model.created_time = (new Date()).toISOString();

    return model;
  }

  addReplyComment(item: ChatomniDataItemDto, model: SendMessageModelDTO) {
    // let comment = {
    //   created_time: model.created_time,
    //   from: model.from,
    //   message: model.message,
    //   parent_id: item.id,
    //   post_id: item.object?.id
    // }

    // let replyComment = {
    //   created_time: model.created_time,
    //   message_format: model.message,
    //   message: model.message,
    //   from_id: item.from?.id,
    //   comment: comment,
    //   from: comment.from
    // }

    // if (this.childs[item.id]) {
    //   this.childs[item.id].push(replyComment);
    // } else {
    //   this.childs[item.id] = [];
    //   this.childs[item.id].push(replyComment);
    // }

    // const addActive = {...item, ...model};
    // addActive["status"] = this.enumActivityStatus.sending;
    // this.activityDataFacade.messageReplyCommentServer(addActive);
  }

  onInformation(item: any) {
    // this.conversationOrderFacade.commentFormPost(item, false);
  }

  onCreateOrder(item: any) {
    // this.conversationOrderFacade.commentFormPost(item, true);
  }

  nextData(event: any) {

  }

  trackByIndex(i: any) {
    return i;
  }

  hiddenComment(item: any, isHidden: boolean){
      if(isHidden) {
          this.isHiddenComment[item.id] = false;
      } else {
          this.isHiddenComment[item.id] = true;
      }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
