import { OdataCommentOrderPostDTO, CommentOrderPost, CommentOrder } from './../../../../../dto/conversation/post/comment-order-post.dto';
import { FacebookCommentService } from './../../../../../services/facebook-comment.service';
import { ChatmoniSocketEventName } from './../../../../../services/socket-io/soketio-event';
import { CRMTagService } from './../../../../../services/crm-tag.service';
import { CreateTagModalComponent } from './../../../../configs/components/create-tag-modal/create-tag-modal.component';
import { MDBByPSIdDTO } from 'src/app/main-app/dto/crm-matching/mdb-by-psid.dto';
import { ChatomniSendMessageModelDto } from './../../../../../dto/conversation-all/chatomni/chatomini-send-message.dto';
import { ChatomniMessageFacade } from './../../../../../services/chatomni-facade/chatomni-message.facade';
import { ChatomniSendMessageService } from './../../../../../services/chatomni-service/chatomni-send-message.service';
import { CRMTeamType } from './../../../../../dto/team/chatomni-channel.dto';
import { ChatomniStatus } from './../../../../../dto/conversation-all/chatomni/chatomni-data.dto';
import { ResponseAddMessCommentDtoV2 } from './../../../../../dto/conversation-all/chatomni/response-mess.dto';
import { ChatomniCommentFacade } from '@app/services/chatomni-facade/chatomni-comment.facade';
import { ChatomniConversationFacade } from '@app/services/chatomni-facade/chatomni-conversation.facade';
import { ChatomniConversationItemDto } from './../../../../../dto/conversation-all/chatomni/chatomni-conversation';
import { SocketOnEventService } from '@app/services/socket-io/socket-onevent.service';
import { SocketEventSubjectDto } from './../../../../../services/socket-io/socket-onevent.service';
import { Component, OnDestroy, OnInit, ViewChild, ChangeDetectorRef, Input, HostBinding, ChangeDetectionStrategy, ViewContainerRef, OnChanges, SimpleChanges, ElementRef, ViewChildren, AfterViewInit, HostListener } from '@angular/core';
import { Observable, tap, BehaviorSubject, auditTime } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivityStatus } from 'src/app/lib/enum/message/coversation-message';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { ActivityMatchingService } from 'src/app/main-app/services/conversation/activity-matching.service';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { SendMessageModelDTO } from 'src/app/main-app/dto/conversation/send-message.dto';
import { CRMMatchingService } from 'src/app/main-app/services/crm-matching.service';
import { TDSMessageService } from 'tds-ui/message';
import { ConversationOrderFacade } from 'src/app/main-app/services/facades/conversation-order.facade';
import { TDSHelperArray, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
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
import { ConversationPostEvent } from '@app/handler-v2/conversation-post/conversation-post.event';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

@Component({
  selector: 'comment-filter-all',
  templateUrl: './comment-filter-all.component.html',
  animations: [eventFadeStateTrigger],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ TDSDestroyService ]
})

export class CommentFilterAllComponent implements OnInit, OnChanges, AfterViewInit {

  itemSize = 80;
  infinite = new BehaviorSubject<ChatomniDataItemDto[]>([]);
  @ViewChild(CdkVirtualScrollViewport) viewPort!: CdkVirtualScrollViewport;

  @ViewChild(YiAutoScrollDirective) yiAutoScroll!: YiAutoScrollDirective;
  @HostBinding("@eventFadeState") eventAnimation = true;
  @ViewChildren('contentMessage') contentMessage: any;
  @ViewChildren('contentMessageChild') contentMessageChild: any;

  @Input() data!: ChatomniObjectsItemDto;
  @Input() team!: CRMTeamDTO;
  @Input() isShowModal: boolean = false;

  partnerDict: {[key: string]: PartnerTimeStampItemDto} = {} as any;

  dataSource$!: Observable<ChatomniDataDto> | any;
  dataSource!: ChatomniDataDto | any;
  childs: any = {} // dictionary return ChatomniDataItemDto[]
  childsComment: ChatomniDataItemDto[] = [];

  enumActivityStatus = ActivityStatus;
  messageModel!: string;
  isLoading: boolean = false;
  currentId: string = '';
  isHiddenComment: any = {};
  isReplyingComment: boolean = false;
  isOpenDrawer: boolean = false;

  lstOfTag: TDSSafeAny[] = [];
  tags: TDSSafeAny[] = [];
  keyFilterTag: string = '';
  idxClickTag: number = -1;

  conversationItem!: ChatomniConversationItemDto;
  currentConversation!: ChatomniConversationItemDto;
  commentOrders?: any = {};

  @ViewChild('contentReply') contentReply!: ElementRef<any>;

  constructor(private message: TDSMessageService,
    private cdRef: ChangeDetectorRef,
    private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef,
    private crmMatchingService: CRMMatchingService,
    private activityMatchingService: ActivityMatchingService,
    private chatomniConversationService: ChatomniConversationService,
    private facebookCommentService: FacebookCommentService,
    private chatomniCommentService: ChatomniCommentService,
    private chatomniCommentFacade: ChatomniCommentFacade,
    public crmService: CRMTeamService,
    private postEvent: ConversationPostEvent,
    private notification: TDSNotificationService,
    private destroy$: TDSDestroyService,
    private conversationOrderFacade: ConversationOrderFacade,
    private socketOnEventService: SocketOnEventService,
    private chatomniConversationFacade: ChatomniConversationFacade,
    private chatomniSendMessageService: ChatomniSendMessageService,
    private chatomniMessageFacade: ChatomniMessageFacade,
    private omniMessageFacade: ChatomniMessageFacade,
    private crmTagService: CRMTagService) {
  }

  ngOnInit() {
    if(this.data && this.team) {
        this.loadData();
        this.loadPartnersByTimestamp();
        this.loadTags();
        this.loadCommentsOrderByPost()
    }

    this.onEventSocket();
    this.eventEmitter();
  }

  loadPartnersByTimestamp() {
    this.partnerDict = {};
    this.chatomniCommentFacade.getPartnerTimeStamp(this.team.Id);
    this.chatomniCommentFacade.partnerDict().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          this.partnerDict = res;
          this.cdRef.markForCheck();
      }
    })
  }

  onEventSocket(){
    this.socketOnEventService.onEventSocket().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: SocketEventSubjectDto) => {
        switch(res.EventName){

          case ChatmoniSocketEventName.chatomniOnMessage:
            if(this.team?.ChannelId == res.Data?.Conversation?.ChannelId && this.data.ObjectId == res.Data?.Message?.ObjectId){
                let item = {...this.chatomniConversationFacade.preapreMessageOnEventSocket(res.Data, this.conversationItem)};
                this.dataSource.Items = [...[item], ...(this.dataSource?.Items || [])];
                this.infinite.next([...this.dataSource.Items]);
            }


            this.cdRef.detectChanges();
          break;

          case ChatmoniSocketEventName.chatomniOnUpdate:
          break;

          case ChatmoniSocketEventName.onUpdate:
          break;

        default: break;
        }
      }
    })
  }

  eventEmitter() {
    this.conversationOrderFacade.onChangeCommentsOrderByPost$.pipe(takeUntil(this.destroy$)).subscribe({
      next:(res) => {
        switch(res?.type){

          case 'deleteCode':

            if(this.data.LiveCampaignId) {
                delete this.commentOrders[res.data?.Facebook_ASUserId];
            }
            break;

          case 'addCode':
            this.loadCommentsOrderByPost();
            break;

          default: break;
        }

        this.cdRef.detectChanges();
      }
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["data"] && !changes["data"].firstChange) {
        delete this.dataSource$;
        delete this.dataSource;

        this.data = {...changes["data"].currentValue};
        this.loadData();
        this.loadPartnersByTimestamp();
        this.loadCommentsOrderByPost()
    }
  }

  loadData() {
    this.isLoading = true;
    this.infinite.next([]);

    this.dataSource$ = this.chatomniCommentService.makeDataSource(this.team.Id, this.data.ObjectId);
    
    if(this.dataSource$) {
      this.dataSource$.pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: ChatomniDataDto) => {
            this.dataSource = {...res};

            this.sortChildComment(this.dataSource.Items);
            this.cdkVirtualScroll();

            this.isLoading = false;
            this.cdRef.markForCheck();
        },
        error: (error: any) => {
            this.isLoading = false;
            this.message.error(`${error?.error?.message}` || 'Đã xảy ra lỗi');
            this.cdRef.markForCheck();
        }
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

    modal.componentInstance?.onSendProduct.subscribe(res => {
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

          let modelv2 = this.prepareModelV2(msg);
          modelv2.RecipientId = item.Data?.id || item.ObjectId || null;
          modelv2.MessageType = 2;

          this.chatomniSendMessageService.sendMessage(this.team.Id, item.UserId, modelv2).pipe(takeUntil(this.destroy$)).subscribe({
              next: (res: ResponseAddMessCommentDtoV2[]) => {

                  item.Data.is_reply = false;
                  this.isReplyingComment = false;
                  this.message.success('Gửi tin thành công');

                  this.cdRef.detectChanges();
              },
              error: error => {

                  item.Data.is_reply = false;
                  this.isReplyingComment = false;
                  this.message.error(`${error.error?.message}` || 'Gửi tin nhắn thất bại');

                  this.cdRef.detectChanges();
              }
            }
          )

      } else {
          // TODO: Trả lời bình luận
          model.parent_id = item.ParentId || item.Data?.id || null;
          model.fbid = item.UserId;

          this.activityMatchingService.replyComment(this.team!.Id, model).pipe(takeUntil(this.destroy$)).subscribe({
              next:(res: any) => {

                  res["status"] = ChatomniStatus.Done;
                  res.type =  this.team.Type == CRMTeamType._Facebook ? 12 :(this.team.Type == CRMTeamType._TShop? 91 : 0);
                  res.name = this.team.Name;
                  let data = this.chatomniCommentFacade.mappingExtrasChildsDto(res);

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
                  this.cdRef.detectChanges();
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

  prepareModelV2(message: string): any {
    const model = {} as ChatomniSendMessageModelDto;
    model.Message = message;

    return model;
  }

  addReplyComment(item: ChatomniDataItemDto, model: SendMessageModelDTO, data: ChatomniDataItemDto) {
    if(data){
      data.ParentId = model.parent_id;
      data.ObjectId = item.ObjectId;
    }

    this.childsComment = [...this.childsComment, ...[data]];
  }

  loadPartnerTab(item: ChatomniDataItemDto, order?: any[]) {
    let psid = item.UserId || item.Data?.from?.id;
    if (!psid) {
        this.message.error("Không truy vấn được thông tin người dùng!");
        return;
    }

    // TODO: gán sự kiện loading cho tab
    this.postEvent.spinLoadingTab$.emit(true);

    // TODO: Đẩy dữ liệu sang conversation-partner để hiển thị thông tin khách hàng
    this.chatomniConversationService.getInfo(this.team.Id, psid).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: ChatomniConversationInfoDto) => {
          if(res) {
              // Thông tin khách hàng
              this.conversationOrderFacade.loadPartnerByPostComment$.emit(res);

              // Thông tin đơn hàng
              this.conversationOrderFacade.loadOrderByPartnerComment$.emit(res);
              this.conversationOrderFacade.onChangeTab$.emit(ChangeTabConversationEnum.partner);

              // TODO: Nếu khách hàng có mã đơn hàng thì load đơn hàng
              if(order && TDSHelperString.hasValueString(order[0]?.code)){
                  // Truyền sang coversation-post
                  this.conversationOrderFacade.loadOrderFromCommentPost$.emit({orderId: order[0].id, comment: item} );
                  this.conversationOrderFacade.hasValueOrderCode$.emit(order[0]?.code);
              }
          }
        },
        error: (error: any) => {
            this.notification.error('Lỗi tải thông tin khách hàng', `${error?.error?.message}`);
        }
    })
  }

  loadOrderByCode(order: any, item: ChatomniDataItemDto){
    let psid = item.UserId || item.Data?.from?.id;
    if (!psid) {
        this.message.error("Không truy vấn được thông tin người dùng!");
        return;
    }

    // TODO: gán sự kiện loading cho tab
    this.postEvent.spinLoadingTab$.emit(true);

    // TODO: Đẩy dữ liệu sang conversation-partner để hiển thị thông tin khách hàng
    this.chatomniConversationService.getInfo(this.team.Id, psid).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: ChatomniConversationInfoDto) => {
          if(res) {
              // Thông tin khách hàng
              this.conversationOrderFacade.loadPartnerByPostComment$.emit(res);

              this.conversationOrderFacade.loadOrderFromCommentPost$.emit({orderId: order.id, comment: item} );
              this.conversationOrderFacade.onChangeTab$.emit(ChangeTabConversationEnum.order);

              // Truyền sang coversation-post
              this.conversationOrderFacade.hasValueOrderCode$.emit(order.code);
          }
      },
      error: (error: any) => {
          // TODO: gán sự kiện loading cho tab
          this.postEvent.spinLoadingTab$.emit(false);
          this.notification.error('Lỗi tải thông tin khách hàng', `${error?.error?.message}`);
      }
    })
  }

  onInsertFromPost(item: ChatomniDataItemDto, order?: any[]) {
    let psid = item.UserId || item.Data?.from?.id;
    if (!psid) {
        this.message.error("Không truy vấn được thông tin người dùng!");
        return;
    }

    // TODO: gán sự kiện loading cho tab
    this.postEvent.spinLoadingTab$.emit(true);

    // TODO: Đẩy dữ liệu sang conversation-partner để hiển thị thông tin khách hàng
    this.chatomniConversationService.getInfo(this.team.Id, psid).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: ChatomniConversationInfoDto) => {

        if(res) {
            // Thông tin khách hàng
            this.conversationOrderFacade.loadPartnerByPostComment$.emit(res);
            // TODO: Đẩy dữ liệu sang conversation-orer để tạo hàm insertfrompost
            this.conversationOrderFacade.loadInsertFromPostFromComment$.emit(item);
            // Truyền sang coversation-post
            this.conversationOrderFacade.hasValueOrderCode$.emit(order?.[0]?.code);
            this.conversationOrderFacade.onChangeTab$.emit(ChangeTabConversationEnum.order);
        }
      },
      error: (error: any) => {
          this.currentId = '';
          this.postEvent.spinLoadingTab$.emit(false);
          this.notification.error('Lỗi tải thông tin khách hàng', `${error?.error?.message}`);
      }
    });
  }

  loadCommentsOrderByPost() {
    this.commentOrders = {};
    this.facebookCommentService.getCommentsOrderByPost(this.data.ObjectId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: OdataCommentOrderPostDTO) => {
        if(res && res.value) {
            let comments = [...res.value];

            comments.map((x: CommentOrderPost) => {
                this.commentOrders[x.asuid] = [];
                this.commentOrders[x.uid] = [];
                //gán lại data bằng syntax
                x.orders?.map((a: CommentOrder) => {
                    this.commentOrders![x.asuid].push(a);
                });

                if (x.uid && x.uid != x.asuid) {
                  x.orders?.map((a: any) => {
                      this.commentOrders[x.uid].push(a);
                  });
                }
            });
        }
        this.cdRef.detectChanges();
        this.isLoading = false;
      },
      error: (error: any) => {
        this.isLoading = false;
        this.cdRef.detectChanges();
      }
    });
  }

  onIndexChange(index: any){
    if(this.dataSource && this.dataSource?.Items?.length > 0 && this.viewPort) {
        this.infinite.next([...this.dataSource.Items]);
    }
  }

  cdkVirtualScroll() {
    if(this.viewPort && this.viewPort.scrolledIndexChange && this.dataSource?.Items) {
        this.viewPort.scrolledIndexChange.pipe(auditTime(350), tap(() => {
       
            const end = this.viewPort.getRenderedRange().end;
            const total = this.viewPort.getDataLength();

            if(end == total && !this.isLoading) {
                this.nextBatch();
            }

        })).pipe(takeUntil(this.destroy$)).subscribe();
      }

    setTimeout(() => this.infinite.next([...this.dataSource?.Items]), 750);
  }

  nextBatch() {
    this.isLoading = true;
    let id = `${this.team.Id}_${this.data.ObjectId}`;
    this.dataSource$ = this.chatomniCommentService.nextDataSource(id, this.dataSource.Items);

    this.dataSource$?.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: ChatomniDataDto) => {

          if(res && TDSHelperArray.hasListValue(res?.Items)) {
              this.dataSource.Items = [...res.Items];
              // TODO: merge bình luận đã gửi
              this.dataSource.Items = this.mergeUpdatedData(this.dataSource.Items, this.childsComment);
              this.sortChildComment(this.dataSource.Items);

              this.infinite.next([...this.dataSource.Items]);
          }

          this.isLoading = false;
          this.cdRef.markForCheck();
      },
      error: (error: any) => {
          this.isLoading = false;
          this.cdRef.markForCheck();
      }
    })
  }

  nextData(event: any) {
    if(this.isLoading) {
        return;
    }

    this.isLoading = true;
    let id = `${this.team.Id}_${this.data.ObjectId}`;
    this.dataSource$ = this.chatomniCommentService.nextDataSource(id, this.dataSource.Items);
    this.dataSource$?.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: ChatomniDataDto) => {
          if(TDSHelperArray.hasListValue(res?.Items)) {
              this.dataSource.Items = [...res.Items];
              // TODO: merge bình luận đã gửi
              this.dataSource.Items = this.mergeUpdatedData(this.dataSource.Items, this.childsComment);
              this.sortChildComment(this.dataSource.Items);
          }

          this.yiAutoScroll.scrollToElement('scrollCommentAll', 750);
          this.isLoading = false;
          this.cdRef.markForCheck();
      },
      error: (error: any) => {
          this.isLoading = false;
      }
    })
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

      data.map(x => {
        if(x.ParentId){
            model = [...model, ...[x]];
        }
      });

      model = model.sort((a: ChatomniDataItemDto, b: ChatomniDataItemDto) => Date.parse(a.CreatedTime) - Date.parse(b.CreatedTime));
      this.childsComment = [...model];
  }

  mergeUpdatedData(data: ChatomniDataItemDto[], updateData: ChatomniDataItemDto[]){
    let ids = data.map(x => { return x.Id });
    //TODO: check bình luận mới gán vào data
    updateData.forEach(f => {
      if(!ids.includes(f.Id)){
          data.push(f);
      }
    });

    return [...data];
  }

  openMiniChat(data: ChatomniDataItemDto) {
    if(data && this.team){
      this.loadMDBByPSId(this.team.ChannelId, data.UserId);
    }
  }

  loadMDBByPSId(pageId: string, psid: string) {
    // Xoá hội thoại hiện tại
    (this.currentConversation as any) = null;

    // get data currentConversation
    this.crmMatchingService.getMDBByPSId(pageId, psid).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: MDBByPSIdDTO) => {
        if (res) {
            let model = this.chatomniMessageFacade.mappingCurrentConversation(res)
            this.currentConversation = { ...model };

            this.isOpenDrawer = true;
            this.cdRef.detectChanges();
        }
      },
      error: (error: any) => {
          this.message.error(error?.error?.message || 'Đã xảy ra lỗi');
      }
    })
  }

  closeDrawer(){
    this.isOpenDrawer = false;
  }

  selectNote(index: number, child?: string){
    let data = { phone: null, address: null, note: null } as any;

    let value = this.getTextOfContentMessage(index);
    if (child && index && this.contentMessageChild && this.contentMessageChild._results[index] && this.contentMessageChild._results[index].nativeElement && this.contentMessageChild._results[index].nativeElement.outerText){
      data.note = this.contentMessageChild._results[index].nativeElement.outerText;
    }
    else {
      data.note = value;
    }

    this.conversationOrderFacade.onSelectOrderFromMessage$.emit(data);
  }

  getTextOfContentMessage(index: number) {//TODO: thêm xử lý với tin nhắn phản hồi
    if (this.contentMessage && this.contentMessage._results[index] && this.contentMessage._results[index].nativeElement && this.contentMessage._results[index].nativeElement.outerText) {
      return this.contentMessage._results[index].nativeElement.outerText;
    }

    this.message.info("Không thể lấy thông tin");
    return null;
  }

  loadTags() {
    if (!TDSHelperArray.hasListValue(this.tags)) {
      this.crmTagService.dataActive$.subscribe({
        next: (res: any) => {
          this.tags = res;
          this.lstOfTag = this.tags;
          this.searchTag();
      }})
    }
  }

  callbackTag(ev: boolean, index: number) {
    this.idxClickTag = index
    if(!ev){
      this.searchTag();
    }
  }

  searchTag() {
    let data = this.tags;
    let key = this.keyFilterTag;
    if (TDSHelperString.hasValueString(key)) {
      key = TDSHelperString.stripSpecialChars(key.trim());
    }
    data = data.filter((x) =>
      (x.Name && TDSHelperString.stripSpecialChars(x.Name.toLowerCase()).indexOf(TDSHelperString.stripSpecialChars(key.toLowerCase())) !== -1))
    this.lstOfTag = data
  }

  showModalAddTag() {
    this.idxClickTag = -1;
    let modal = this.modalService.create({
      title: 'Thêm thẻ hội thoại',
      content: CreateTagModalComponent,
      viewContainerRef: this.viewContainerRef,
    });
    modal.afterClose.subscribe({
      next: (result: TDSSafeAny)=>{
      if(result){
        this.lstOfTag = [...this.lstOfTag, result];
        this.tags = [...this.tags, result];
      }
    }})
  }

  onSelectTag(item: any) {
    let tags = [...this.partnerDict[item.UserId].t];

    if (tags.findIndex(x=> x.tpid == item.Id) > 0) {
      let modelTag = this.omniMessageFacade.mappingModelTag(item);
      this.removeIndexDbTag(modelTag);
    } else {
      this.assignIndexDbTag(item);
    }
  }

  removeIndexDbTag(item: any): void {
    // this.activityMatchingService.removeTagFromConversation(this.data.ConversationId, item.Id, this.team.ChannelId)
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe({
    //   next: () => {
    //     this.removeTagOnView(item);
    //   },
    //   error: err=>{
    //     this.message.error(err.error? err.error.message : 'Xóa nhãn thất bại');
    //   }
    // });
  }

  assignIndexDbTag(item: any) {
    // this.activityMatchingService.assignTagToConversation(this.data.ConversationId, item.Id, this.team.ChannelId)
    //   .pipe(takeUntil(this.destroy$)).subscribe({
    //   next: ()=> {
    //     this.assignTagOnView(item);
    //     this.crmTagService.addTagLocalStorage(item.Id);
    //   },
    //   error: err => {
    //     this.message.error(err.error? err.error.message : 'Gắn nhãn thất bại');
    //   }
    // });
  }

  removeTagOnView(tag: any) {

  }

  ngAfterViewInit() {
    this.cdkVirtualScroll();
  }
}
