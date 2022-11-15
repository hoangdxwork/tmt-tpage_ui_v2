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
import { Component, OnInit, ViewChild, ChangeDetectorRef, Input, ChangeDetectionStrategy, ViewContainerRef, OnChanges, SimpleChanges, ElementRef, ViewChildren, AfterViewInit, HostListener } from '@angular/core';
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
import { TDSHelperArray, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
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
import { NgxVirtualScrollerDto } from '@app/dto/conversation-all/ngx-scroll/ngx-virtual-scroll.dto';
import { VirtualScrollerComponent } from 'ngx-virtual-scroller';
import { LiveCampaignService } from '@app/services/live-campaign.service';
import { OrderPartnerByLivecampaignDto } from '@app/dto/partner/order-partner-livecampaign.dto';
import { ChatomniObjectFacade } from '@app/services/chatomni-facade/chatomni-object.facade';

@Component({
  selector: 'comment-filter-all',
  templateUrl: './comment-filter-all.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ TDSDestroyService ]
})

export class CommentFilterAllComponent implements OnInit, OnChanges {

  @ViewChildren('contentMessage') contentMessage: any;
  @ViewChildren('contentMessageChild') contentMessageChild: any;

  @ViewChild(VirtualScrollerComponent) virtualScroller!: VirtualScrollerComponent;
  vsStartIndex: number = 0;
  vsSocketImports: ChatomniDataItemDto[] = [];

  @Input() data!: ChatomniObjectsItemDto;
  @Input() team!: CRMTeamDTO;
  @Input() isShowModal: boolean = false;
  @Input() innerText!: string;

  partnerDict: {[key: string]: PartnerTimeStampItemDto} = {} as any;
  invoiceDict: {[key: number]: OrderPartnerByLivecampaignDto[]} = {} as any;

  dataSource$!: Observable<ChatomniDataDto> | any;
  dataSource!: ChatomniDataDto | any;
  childs: any = {} // dictionary return ChatomniDataItemDto[]

  enumActivityStatus = ActivityStatus;
  messageModel!: string;
  isLoading: boolean = false;
  isLoadingNextdata: boolean = false;
  disableNextUrl: boolean = false;
  currentId: string = '';
  isHiddenComment: any = {};
  isReplyingComment: boolean = false;
  isOpenDrawer: boolean = false;
  isShowAllNumber: boolean = false;
  visibleDrawerBillDetail: boolean = false;
  idPopoverVisible: string = '';
  order: TDSSafeAny;

  lstOfTag: TDSSafeAny[] = [];
  tags: TDSSafeAny[] = [];
  keyFilterTag: string = '';
  idxClickTag: number = -1;

  conversationItem!: ChatomniConversationItemDto;
  currentConversation!: ChatomniConversationItemDto | any;
  commentOrders?: any = {};
  filterObj : TDSSafeAny;
  lengthDataSource: number = 0;

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
    private liveCampaignService: LiveCampaignService,
    public crmService: CRMTeamService,
    private postEvent: ConversationPostEvent,
    private notification: TDSNotificationService,
    private destroy$: TDSDestroyService,
    private chatomniObjectFacade: ChatomniObjectFacade,
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
      this.loadPartnersByTimestamp(this.team);
      this.loadTags();
      this.loadCommentsOrderByPost();
      this.loadOrderPartnerbylLivecampaign();
      this.reloadDataCommentsOrder();
    }

    this.onEventSocket();
    this.eventEmitter();
  }

  loadOrderPartnerbylLivecampaign() {
    if(this.data && this.data.LiveCampaignId) {
      let id = this.data.LiveCampaignId as string;
      this.liveCampaignService.orderPartnerbyLivecampaign(id).pipe(takeUntil(this.destroy$))
        .subscribe({
            next: (res: any) => {
              if(res && Object.keys(res).length > 0){
                this.invoiceDict = res;
                this.cdRef.markForCheck();
              }
            }
        })
    }
  }

  loadPartnersByTimestamp(team: CRMTeamDTO) {
    this.partnerDict = {};
    this.chatomniCommentFacade.loadPartnerTimestampByCache(team);
    this.chatomniCommentFacade.partnerTimeStamp().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          this.partnerDict = res.Data;
          this.cdRef.markForCheck();
      }
    })
  }

  onEventSocket(){
    this.socketOnEventService.onEventSocket().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: SocketEventSubjectDto) => {
        switch(res.EventName) {

          case ChatmoniSocketEventName.chatomniOnMessage:
            let exist = this.team?.ChannelId == res.Data?.Conversation?.ChannelId && this.data.ObjectId == res.Data?.Message?.ObjectId && this.dataSource;
            if(exist) {
                let itemNewComment = { ...this.chatomniConversationFacade.preapreMessageOnEventSocket(res.Data, this.conversationItem) };

                // TODO: nếu là comment child thì cũng push thẳng xóa parentId
                if(itemNewComment && TDSHelperString.hasValueString(itemNewComment.ParentId)) {
                    itemNewComment.ParentId = null;
                }

                if(this.vsStartIndex <= 1) {
                    this.dataSource.Items = [...[itemNewComment], ...(this.dataSource?.Items || [])];
                    this.dataSource.Items = [...this.dataSource.Items];

                    this.lengthDataSource = this.dataSource.Items.length;

                    if(this.virtualScroller) {
                      this.virtualScroller.scrollToPosition(0);
                    }
                } else {
                    this.vsSocketImports = [...[itemNewComment], ...this.vsSocketImports];
                    this.vsSocketImports = [...this.vsSocketImports];

                    this.lengthDataSource = this.lengthDataSource + 1;
                }

                this.postEvent.lengthLstObject$.emit(this.lengthDataSource);
            }

            this.cdRef.detectChanges();
          break;

          case ChatmoniSocketEventName.chatomniOnUpdate:
          break;

          default:
            break;
        }
      }
    })
  }

  eventEmitter() {
    // TODO: tạo đơn hàng, phiếu bán hàng ở conversation-order
    this.chatomniObjectFacade.onLoadCommentOrderByPost$.pipe(takeUntil(this.destroy$)).subscribe({
      next:(res) => {
        setTimeout(() => {
          this.loadCommentsOrderByPost();
        }, 350);
      }
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["data"] && !changes["data"].firstChange) {
        delete this.dataSource$;
        this.dataSource = null;
        this.filterObj = {};
        this.innerText = '';

        this.data = {...changes["data"].currentValue};
        this.loadData();
        this.loadPartnersByTimestamp(this.team);
        this.loadCommentsOrderByPost();
        this.loadOrderPartnerbylLivecampaign();
    }

    if (changes["innerText"] && !changes["innerText"].firstChange && TDSHelperString.isString(changes["innerText"].currentValue)) {
        let text = changes["innerText"].currentValue;
        this.filterObj = {
            Keywords: text
        }
        this.loadData();
    }
  }

  loadData() {
    this.isLoading = true;
    this.disableNextUrl = false;
    this.isLoadingNextdata = false;

    if(this.virtualScroller) {
        this.virtualScroller.refresh();
        this.virtualScroller.scrollToPosition(0);
    }

    this.dataSource$ = this.chatomniCommentService.makeDataSource(this.team.Id, this.data.ObjectId, this.filterObj);
    if(this.dataSource$) {
      this.dataSource$.pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: ChatomniDataDto) => {
            this.dataSource = { ...res };

            this.postEvent.lengthLstObject$.emit(this.dataSource.Items.length);
            this.dataSource.Items = [...this.dataSource.Items];
            this.lengthDataSource = this.dataSource.Items.length;

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

    modal.componentInstance?.onSendProduct.subscribe({
      next: (res: TDSSafeAny)=>{
        if(res){
            this.onProductSelected(res, item);
            modal.destroy(null);
        }
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

    this.activityMatchingService.addTemplateMessageV2(this.team.ChannelId, model)
    .pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        item.Data.is_reply = false;
        this.isReplyingComment = false;
        this.message.success('Gửi tin thành công');

        this.cdRef.markForCheck();
      },
      error: error => {
        item.Data.is_reply = false;
        this.isReplyingComment = false;
        this.message.error(`${error.error?.message}` || 'Gửi sản phẩm thất bại');

        this.cdRef.detectChanges();
      }
    });
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

    this.dataSource.Items = [...this.dataSource.Items, ...[data]];
    this.postEvent.lengthLstObject$.emit(this.dataSource.Items.length);
  }

  loadPartnerTab(item: ChatomniDataItemDto, commentOrder?: any) {
    let psid = item.UserId || item.Data?.from?.id;
    if (!psid) {
        this.message.error("Không truy vấn được thông tin người dùng!");
        return;
    }

    let orderCode = commentOrder?.[psid]?.[0]?.code || '';
    let orderId = commentOrder?.[psid]?.[0]?.id || '';

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
              if(orderCode && TDSHelperString.hasValueString(orderCode)){
                  // Truyền sang coversation-post
                  this.conversationOrderFacade.loadOrderFromCommentPost$.emit({orderId: orderId, comment: item} );
                  this.conversationOrderFacade.hasValueOrderCode$.emit(orderCode);
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

  onInsertFromPost(item: ChatomniDataItemDto, commentOrder: any) {
    let psid = item.UserId || item.Data?.from?.id;
    if (!psid) {
        this.message.error("Không truy vấn được thông tin người dùng!");
        return;
    }

    let orderCode = commentOrder[psid]?.[0]?.code;

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
            this.conversationOrderFacade.hasValueOrderCode$.emit(orderCode);
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

  reloadDataCommentsOrder() {
    let m = 10;
    setTimeout(() => {
      this.loadCommentsOrderByPost();
      this.reloadDataCommentsOrder();
    }, m * 60 * 1000);
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

  nextData(event: any) {
    let id = `${this.team.Id}_${this.data.ObjectId}`;
    let dataSourceItem = (this.dataSource?.Items || []);

    this.dataSource$ = this.chatomniCommentService.nextDataSource(id, dataSourceItem);

    this.dataSource$?.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: ChatomniDataDto) => {

          if(res && res.Items && res.Items.length > 0) {
              this.dataSource.Items = [...(res.Items || [])];

              this.postEvent.lengthLstObject$.emit(this.dataSource.Items.length);

              this.dataSource.Items = [...this.dataSource.Items];
              this.lengthDataSource = this.dataSource.Items.length;

          } else {
              this.disableNextUrl = true;// check dk dừng phân trang
          }

          this.isLoadingNextdata = false;
          this.cdRef.detectChanges();
      },
      error: (error: any) => {
          this.isLoadingNextdata = false;
          this.cdRef.detectChanges();
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

  openMiniChat(data: ChatomniDataItemDto) {
    if(data && this.team){
        this.isLoading = true;
        this.loadMDBByPSId(this.team.Id, data.UserId);
    }
  }

  loadMDBByPSId(channelId: number, psid: string) {
    // Xoá hội thoại hiện tại
    delete this.currentConversation;

    // get data currentConversation
    this.chatomniConversationService.getById(channelId, psid).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: ChatomniConversationItemDto) => {
        if (res) {
            // let model = this.chatomniMessageFacade.mappingCurrentConversation(res)
            this.currentConversation = { ...res };

            this.isOpenDrawer = true;
            this.isLoading = false;
            this.cdRef.detectChanges();
        }
      },
      error: (error: any) => {
          this.isLoading = false;
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

  onChangeShowMore(value: boolean){
    this.isShowAllNumber = value;
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
  }

  assignIndexDbTag(item: any) {
  }

  removeTagOnView(tag: any) {
  }

  onVisibleDrawer(event: boolean){
    this.visibleDrawerBillDetail = event;
  }

  onOpenDrawerBillDetail(item : TDSSafeAny){
    this.idPopoverVisible = '';
    if(item) {
      this.visibleDrawerBillDetail = true;
      let model = {
        Id: item.Id,
        Number: item.Number
      }
      this.order = {...model};

      this.cdRef.detectChanges();
    }
  }

  onPopoverVisible(id: string) {
    this.idPopoverVisible = id;
  }

  vsEnd(event: NgxVirtualScrollerDto) {
    let exisData = this.dataSource && this.dataSource.Items && this.dataSource.Items.length > 0 && event && event.scrollStartPosition > 0;
    if(exisData) {
        const vsEnd = Number(this.dataSource.Items.length - 1 ) == Number(event.endIndex) && !this.disableNextUrl as boolean;
        if(vsEnd) {

            if (this.isLoading || this.isLoadingNextdata) {
                return;
            }

            this.isLoadingNextdata = true;
            setTimeout(() => {
                this.nextData(event);
            }, 500);
        }
    }
  }

  vsStart(event: NgxVirtualScrollerDto) {
    if(event && Number(event.startIndex) >= 0) {
        // TODO: mapping dữ liệu socket ko có trong danh sách
        let exist = (event.startIndex < this.vsStartIndex) && this.vsStartIndex > 1  && event.startIndex <= 2
            && this.vsSocketImports && this.vsSocketImports.length > 0;

        if(exist) {
            this.isLoadingNextdata = true;
            setTimeout(() => {
                this.dataSource.Items = [...this.vsSocketImports, ...this.dataSource.Items];
                this.dataSource.Items = [...this.dataSource.Items];
                this.lengthDataSource = this.dataSource.Items.length;

                this.postEvent.lengthLstObject$.emit(this.lengthDataSource);
                this.vsSocketImports = [];
                this.isLoadingNextdata = false;

                this.cdRef.detectChanges();
            }, 350);

        }

        this.vsStartIndex = event.startIndex;
    }
  }
}
