import { ChatomniMessageFacade } from './../../../../../services/chatomni-facade/chatomni-message.facade';
import { ChatomniSendMessageService } from './../../../../../services/chatomni-service/chatomni-send-message.service';
import { CRMTeamType } from './../../../../../dto/team/chatomni-channel.dto';
import { ChatomniStatus } from './../../../../../dto/conversation-all/chatomni/chatomni-data.dto';
import { ResponseAddMessCommentDto, ResponseAddMessCommentDtoV2 } from './../../../../../dto/conversation-all/chatomni/response-mess.dto';
import { ChatomniCommentFacade } from '@app/services/chatomni-facade/chatomni-comment.facade';
import { ChatomniConversationFacade } from '@app/services/chatomni-facade/chatomni-conversation.facade';
import { ChatomniConversationItemDto } from './../../../../../dto/conversation-all/chatomni/chatomni-conversation';
import { SocketOnEventService } from '@app/services/socket-io/socket-onevent.service';
import { SocketEventSubjectDto } from './../../../../../services/socket-io/socket-onevent.service';
import { Component, OnDestroy, OnInit, ViewChild, ChangeDetectorRef, Input, HostBinding, ChangeDetectionStrategy, ViewContainerRef, NgZone, OnChanges, SimpleChanges, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivityStatus } from 'src/app/lib/enum/message/coversation-message';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { ActivityMatchingService } from 'src/app/main-app/services/conversation/activity-matching.service';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { SendMessageModelDTO } from 'src/app/main-app/dto/conversation/send-message.dto';
import { CRMMatchingService } from 'src/app/main-app/services/crm-matching.service';
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
import { ChatomniDataDto, ChatomniDataItemDto } from '@app/dto/conversation-all/chatomni/chatomni-data.dto';
import { TDSDestroyService } from 'tds-ui/core/services';
import { ChangeTabConversationEnum } from '@app/dto/conversation-all/chatomni/change-tab.dto';
import { PartnerTimeStampItemDto } from '@app/dto/partner/partner-timestamp.dto';
import { ChatomniConversationService } from '@app/services/chatomni-service/chatomni-conversation.service';
import { ChatomniConversationInfoDto } from '@app/dto/conversation-all/chatomni/chatomni-conversation-info.dto';
import { TDSNotificationService } from 'tds-ui/notification';

@Component({
  selector: 'comment-filter-all',
  templateUrl: './comment-filter-all.component.html',
  animations: [eventFadeStateTrigger],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ TDSDestroyService ]
})

export class CommentFilterAllComponent implements OnInit, OnChanges, OnDestroy {

  @ViewChild(YiAutoScrollDirective) yiAutoScroll!: YiAutoScrollDirective;
  @HostBinding("@eventFadeState") eventAnimation = true;

  @Input() commentOrders!: any;
  @Input() data!: ChatomniObjectsItemDto;
  @Input() team!: CRMTeamDTO;
  partnerDict: {[key: string]: PartnerTimeStampItemDto} = {} as any;

  dataSource$!: Observable<ChatomniDataDto>;
  dataSource!: ChatomniDataDto;
  childs: any = {} // dictionary return ChatomniDataItemDto[]
  childsComment: ChatomniDataItemDto[] = [];

  enumActivityStatus = ActivityStatus;
  messageModel!: string;
  isLoading: boolean = false;
  isHiddenComment: any = {};
  isReplyingComment: boolean = false;

  conversationItem!: ChatomniConversationItemDto;
  @ViewChild('contentReply') contentReply!: ElementRef<any>;

  constructor(private message: TDSMessageService,
    private cdRef: ChangeDetectorRef,
    private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef,
    private crmMatchingService: CRMMatchingService,
    private activityMatchingService: ActivityMatchingService,
    private chatomniConversationService: ChatomniConversationService,
    private chatomniCommentService: ChatomniCommentService,
    private chatomniCommentFacade: ChatomniCommentFacade,
    public crmService: CRMTeamService,
    private notification: TDSNotificationService,
    private destroy$: TDSDestroyService,
    private conversationOrderFacade: ConversationOrderFacade,
    private socketOnEventService: SocketOnEventService,
    private chatomniConversationFacade: ChatomniConversationFacade,
    private chatomniSendMessageService: ChatomniSendMessageService) {
  }

  ngOnInit() {
    if(this.data && this.team) {
        this.loadData();
        this.loadPartnersByTimestamp();
    }

    this.onEventSocket();
  }

  loadPartnersByTimestamp() {
    this.partnerDict = {};
    this.chatomniCommentFacade.getPartnerTimeStamp(this.team.Id);
    this.chatomniCommentFacade.partnerDict().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          this.partnerDict = res;
          this.cdRef.detectChanges();
      }
    })
  }

  onEventSocket(){
    this.socketOnEventService.onEventSocket().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: SocketEventSubjectDto) => {
        if(this.team?.ChannelId == res.Data?.Conversation?.ChannelId && this.data.ObjectId == res.Data?.Message?.ObjectId){
          let item = {...this.chatomniConversationFacade.preapreMessageOnEventSocket(res.Data, this.conversationItem)}

          this.dataSource.Items = [...[item], ...(this.dataSource?.Items || [])]
          this.sortChildComment(this.dataSource.Items);
        }

        this.cdRef.detectChanges();
      }
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["data"] && !changes["data"].firstChange) {
      (this.dataSource$ as any) = null;
      (this.dataSource as any) = null;

      this.data = {...changes["data"].currentValue};
      this.loadData();
      this.loadPartnersByTimestamp();
    }
  }

  loadData() {
    this.isLoading = true;
      this.dataSource$ = this.chatomniCommentService.makeDataSource(this.team.Id, this.data.ObjectId);

      if(this.dataSource$) {
        this.dataSource$.pipe(takeUntil(this.destroy$)).subscribe((res: ChatomniDataDto) => {
            this.dataSource = {...res};
            this.sortChildComment(this.dataSource.Items);

            this.isLoading = false;
            this.cdRef.markForCheck();
        }, error => {
            this.isLoading = false;
            this.message.error(`${error?.error?.message}` || 'Đã xảy ra lỗi');
            this.cdRef.markForCheck();
        })
      }
  }

  isPrivateReply(item: ChatomniDataItemDto){
    item.Data.is_private_reply = !item.Data.is_private_reply;
  }

  isReply(item: ChatomniDataItemDto, child?: string) {
    if(child){
      item.Data.is_reply = true;
      return
    }
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

  onQuickReplySelected(event: any, partner?: PartnerTimeStampItemDto) {
    let text = event.BodyPlain || event.BodyHtml || event.text;

    text = ReplaceHelper.quickReply(text, partner);
    this.message = text;
  }

  onEnter(item: ChatomniDataItemDto, event: any) {
    if(event) {
        let message = this.messageModel as string;
        this.replyComment(item, message);

        (this.messageModel as any) = null;
    }

    event.preventDefault();
    event.stopImmediatePropagation();
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
    this.isReplyingComment = true;
    if(TDSHelperString.hasValueString(msg)) {
        const model = this.prepareModel(item, msg);

        // TODO: gửi về tin nhắn
        if(item.Data.is_private_reply){

          model.comment_id = item.Id;
          this.chatomniSendMessageService.sendMessage(this.team.Id, item.UserId, model).pipe(takeUntil(this.destroy$)).subscribe(
            {
              next: (res: ResponseAddMessCommentDtoV2[]) => {

                item.Data.is_reply = false;
                this.isReplyingComment = false;
                this.message.success('Gửi tin thành công'); 

              },
              error: error => {

                item.Data.is_reply = false;
                this.isReplyingComment = false;
                this.message.error(`${error.error?.message}` || 'Gửi tin nhắn thất bại');
              
              }
            }
          )

      } else {
          // TODO: Trả lời bình luận
          model.parent_id = item.ParentId || item.Data?.id || null;
          model.fbid = item.UserId;

          this.activityMatchingService.replyComment(this.team!.Id, model)
            .pipe(takeUntil(this.destroy$)).subscribe({
              next:(res: any) => {

                res["status"] = ChatomniStatus.Pending;
                res.type =  this.team.Type == CRMTeamType._Facebook ? 12 :(this.team.Type == CRMTeamType._TShop? 91 : 0);
                res.name = this.team.Name;
                let data = this.chatomniCommentFacade.mappingExtrasChildsDto(res)
                
                this.message.success("Trả lời bình luận thành công.");

                this.addReplyComment(item, model, data);

                item.Data.is_reply = false;
                this.isReplyingComment = false;

                this.cdRef.detectChanges();
              },
              error: error => {

                item.Data.is_reply = false;
                this.isReplyingComment = false;
                this.message.error(`${error.error?.message}` || "Trả lời bình luận thất bại.");
              
              }
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
    model.post_id = item.Data.object?.id || item.ObjectId;
    model.message = message;
    model.created_time = (new Date()).toISOString();

    return model;
  }

  addReplyComment(item: ChatomniDataItemDto, model: SendMessageModelDTO, data: ChatomniDataItemDto) {
    if(data){
      data.ParentId = model.parent_id;
      data.ObjectId = item.ObjectId
      
    }

    this.childsComment = [...this.childsComment, ...[data]];
  }

  loadPartnerTab(item: ChatomniDataItemDto) {
    let psid = item.UserId || item.Data?.from?.id;
    if (!psid) {
        this.message.error("Không truy vấn được thông tin người dùng!");
        return;
    }

    // TODO: Đẩy dữ liệu sang conversation-partner để hiển thị thông tin khách hàng
    this.chatomniConversationService.getInfo(this.team.Id, psid).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: ChatomniConversationInfoDto) => {
          if(res) {
              // Thông tin khách hàng
              this.conversationOrderFacade.loadPartnerByPostComment$.emit(res);
              // Thông tin đơn hàng
              this.conversationOrderFacade.loadOrderByPartnerComment$.emit(res);
              this.conversationOrderFacade.onChangeTab$.emit(ChangeTabConversationEnum.partner);
          }
        },
        error: (error: any) => {
            this.notification.error('Lỗi tải thông tin khách hàng', `${error?.error?.message}`);
        }
    })
  }

  loadOrderByCode(orderId: any, item: ChatomniDataItemDto){
    let psid = item.UserId || item.Data?.from?.id;
    if (!psid) {
        this.message.error("Không truy vấn được thông tin người dùng!");
        return;
    }

    // TODO: Đẩy dữ liệu sang conversation-partner để hiển thị thông tin khách hàng
    this.chatomniConversationService.getInfo(this.team.Id, psid).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: ChatomniConversationInfoDto) => {
        if(res) {
            // Thông tin khách hàng
            this.conversationOrderFacade.loadPartnerByPostComment$.emit(res);

            this.conversationOrderFacade.loadOrderFromCommentPost$.emit({orderId: orderId, comment: item} );
            this.conversationOrderFacade.onChangeTab$.emit(ChangeTabConversationEnum.order);
        }
      },
      error: (error: any) => {
          this.notification.error('Lỗi tải thông tin khách hàng', `${error?.error?.message}`);

          this.conversationOrderFacade.loadOrderFromCommentPost$.emit({orderId: orderId, comment: item} );
          this.conversationOrderFacade.onChangeTab$.emit(ChangeTabConversationEnum.order);
      }
    })
  }

  onInsertFromPost(item: ChatomniDataItemDto) {
    let psid = item.UserId || item.Data?.from?.id;
    if (!psid) {
        this.message.error("Không truy vấn được thông tin người dùng!");
        return;
    }

    // TODO: Đẩy dữ liệu sang conversation-orer để tạo hàm insertfrompost
    this.conversationOrderFacade.loadInsertFromPostFromComment$.emit(item);
    this.conversationOrderFacade.onChangeTab$.emit(ChangeTabConversationEnum.order);
  }

  nextData(event: any) {
    if(event) {
      this.isLoading = true;
      let id = `${this.team.Id}_${this.data.ObjectId}`;

      this.dataSource$ = this.chatomniCommentService.nextDataSource(id);
      this.dataSource$?.pipe(takeUntil(this.destroy$)).subscribe((res: ChatomniDataDto) => {

          if(TDSHelperArray.hasListValue(res?.Items)) {
              this.dataSource.Items = [...res.Items];
              this.sortChildComment(this.dataSource.Items);
          }

          this.isLoading = false;
          this.yiAutoScroll.scrollToElement('scrollCommentAll', 750);
          this.cdRef.markForCheck();
      }, error => {
          this.isLoading = false;
      })
    }
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

  sortChildComment(data: ChatomniDataItemDto[]){
    let model: ChatomniDataItemDto[] = [];
      data.map(x=>{
          if(x.ParentId){
            model = [...model, ...[x]]
          }
      })
      model = model.sort((a: ChatomniDataItemDto, b: ChatomniDataItemDto) => Date.parse(a.CreatedTime) - Date.parse(b.CreatedTime)) 

      this.childsComment = [...model];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
