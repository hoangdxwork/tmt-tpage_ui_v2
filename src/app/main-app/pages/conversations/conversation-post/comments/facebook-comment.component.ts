import { OrderByCommentItemDto } from './../../../../dto/conversation-all/chatomni/chatomni-data.dto';
import { EnumSendMessageType } from './../../../../dto/conversation-all/chatomni/chatomini-send-message.dto';
import { CommentOrderPost, CommentOrder } from '../../../../dto/conversation/post/comment-order-post.dto';
import { FacebookCommentService } from '../../../../services/facebook-comment.service';
import { ChatmoniSocketEventName } from '../../../../services/socket-io/soketio-event';
import { CRMTagService } from '../../../../services/crm-tag.service';
import { CreateTagModalComponent } from '../../../configs/components/create-tag-modal/create-tag-modal.component';
import { MDBByPSIdDTO } from 'src/app/main-app/dto/crm-matching/mdb-by-psid.dto';
import { ChatomniSendMessageModelDto } from '../../../../dto/conversation-all/chatomni/chatomini-send-message.dto';
import { ChatomniMessageFacade } from '../../../../services/chatomni-facade/chatomni-message.facade';
import { ChatomniSendMessageService } from '../../../../services/chatomni-service/chatomni-send-message.service';
import { ChatomniMessageType, ChatomniStatus } from '../../../../dto/conversation-all/chatomni/chatomni-data.dto';
import { ResponseAddMessCommentDtoV2 } from '../../../../dto/conversation-all/chatomni/response-mess.dto';
import { ChatomniCommentFacade } from '@app/services/chatomni-facade/chatomni-comment.facade';
import { ChatomniConversationFacade } from '@app/services/chatomni-facade/chatomni-conversation.facade';
import { SocketEventSubjectDto, SocketOnEventService } from '@app/services/socket-io/socket-onevent.service';
import { Component, OnInit, ViewChild, ChangeDetectorRef, Input, ChangeDetectionStrategy, ViewContainerRef, OnChanges, SimpleChanges, ElementRef, ViewChildren, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivityStatus } from 'src/app/lib/enum/message/coversation-message';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { ActivityMatchingService } from 'src/app/main-app/services/conversation/activity-matching.service';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
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
import { ChatomniConversationItemDto } from '@app/dto/conversation-all/chatomni/chatomni-conversation';
import { MessageSocketioDto } from '@app/dto/socket-io/chatomni-on-message.dto';
import { OnSocketOnSaleOnline_OrderDto } from '@app/dto/socket-io/chatomni-on-order.dto';
import { LiveCampaignFastSaleOrderDataDto } from '@app/dto/socket-io/livecampain-fastsaleorder.dto';
import { formatDate } from '@angular/common';
import { en_US } from "tds-ui/i18n";

@Component({
  selector: 'facebook-comment',
  templateUrl: './facebook-comment.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ TDSDestroyService ]
})

export class FacebookCommentComponent implements OnInit, OnChanges, OnDestroy {

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
  childs: any = {};

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
  isVisible: string = '';
  order: TDSSafeAny;

  lstOfTag: TDSSafeAny[] = [];
  tags: TDSSafeAny[] = [];
  keyFilterTag: string = '';
  idxClickTag: number = -1;

  conversationItem!: ChatomniConversationItemDto;
  currentConversation!: ChatomniConversationItemDto | any;
  commentOrders?: any = {};
  filterObj : TDSSafeAny;
  isLoadingInsertFromPost: boolean = false;
  isLoadingiconMess: boolean = false;
  nextDataTimer: TDSSafeAny;
  preDataTimer: TDSSafeAny;
  refreshTimer: TDSSafeAny;
  dictActiveComment: {[key: string] : boolean } = {};

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
    private conversationOrderFacade: ConversationOrderFacade,
    private socketOnEventService: SocketOnEventService,
    private chatomniConversationFacade: ChatomniConversationFacade,
    private chatomniSendMessageService: ChatomniSendMessageService,
    private chatomniMessageFacade: ChatomniMessageFacade,
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
    this.onEventEmitter();
  }

  onEventEmitter() {
    this.postEvent.isLoadingInsertFromPost$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: boolean) =>{
          this.isLoadingInsertFromPost = false;
          this.cdRef.detectChanges();
      }
    });
  }

  loadOrderPartnerbylLivecampaign() {
    let id = this.data.LiveCampaignId as string;
    if(!id) return;

    this.invoiceDict = {};
    this.liveCampaignService.orderPartnerbyLivecampaign(id).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {
            if(res && Object.keys(res).length > 0){
              this.invoiceDict = res;
            }
            this.cdRef.markForCheck();
        },
        error: (err: any) => {
            this.message.error(err?.error?.message);
        }
    });
  }

  loadPartnersByTimestamp(team: CRMTeamDTO) {
    this.partnerDict = {};
    this.chatomniCommentFacade.loadPartnerTimestampByCache(team);
    this.chatomniCommentFacade.partnerTimeStamp().pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {
            this.partnerDict = res.Data;
            this.cdRef.markForCheck();
        },
        error: (err: any) => {
            this.message.error(err?.error?.message);
        }
    })
  }

  onEventSocket(){
    this.socketOnEventService.onEventSocket().pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: SocketEventSubjectDto) => {
            if(!res) return;

            switch(res.EventName) {
                // Cập nhật bình luận
                case ChatmoniSocketEventName.chatomniOnMessage:
                    let fbComment = {...res.Data?.Message} as MessageSocketioDto;

                    let exist1 = fbComment && fbComment.MessageType == ChatomniMessageType.FacebookComment
                        && this.team?.ChannelId == res.Data?.Conversation?.ChannelId
                        && this.data.ObjectId == fbComment?.ObjectId && this.dataSource;

                    if(!exist1) break;
                    this.setCommentRealtime(res);
                break;

                // Tạo đơn hàng
                case ChatmoniSocketEventName.onCreatedSaleOnline_Order:
                    let fbCreated = {...res?.Data} as OnSocketOnSaleOnline_OrderDto;
                    let exit2 = res && fbCreated && this.data
                          && fbCreated.Data?.Facebook_PostId == this.data?.ObjectId;

                    if(!exit2) break;
                    this.setCommentUpdateOrderCode(fbCreated);
                break;

                // Cập nhật đơn hàng
                case ChatmoniSocketEventName.onUpdateSaleOnline_Order:
                    let fbOrder = {...res?.Data} as OnSocketOnSaleOnline_OrderDto;
                    let exit3 = res && fbOrder && this.data
                          && fbOrder.Data?.Facebook_PostId == this.data?.ObjectId;

                    if(!exit3) break;
                    this.setCommentUpdateOrderCode(fbOrder);
                break;

                // Xóa đơn hàng
                case ChatmoniSocketEventName.onDeleteSaleOnline_Order:
                    let fbDelete = {...res?.Data} as OnSocketOnSaleOnline_OrderDto;
                    let exist4 = res && fbDelete && this.data
                          && fbDelete.Data?.Facebook_PostId == this.data?.ObjectId;

                    if(!exist4) break;
                    this.setCommentDeleteOrderCode(fbDelete);
                break;

                // Tạo hóa đơn
                case ChatmoniSocketEventName.livecampaign_CartCheckout:
                    let fbInvoice = {...res?.Data?.Data} as LiveCampaignFastSaleOrderDataDto;
                    let exist5 = res && fbInvoice && this.data
                          && fbInvoice.LiveCampaignId == this.data?.LiveCampaignId;

                    if(!exist5) break;
                    this.setCommentNumberInvoice(fbInvoice);
                break;

                default:
                break;
            }
        }
    })
  }

  setCommentRealtime(response: any) {
    let itemNewComment = {...this.chatomniConversationFacade.preapreMessageOnEventSocket(response.Data, this.conversationItem) };
    if(TDSHelperString.isString(this.innerText) && TDSHelperString.hasValueString(this.innerText)) return;

    if(itemNewComment && TDSHelperString.hasValueString(itemNewComment.ParentId) && this.dataSource.Extras && this.dataSource.Extras.Childs && this.dataSource.Extras.Childs[itemNewComment.ParentId]) {
        let index = this.dataSource.Extras.Childs[itemNewComment.ParentId].findIndex((x: ChatomniDataItemDto)=> x.Id == response?.Data?.Message?.Id);
        if(Number(index) >= 0) return;
    }

    if(this.vsStartIndex <= 1) {
        this.dataSource.Items = [...[itemNewComment], ...(this.dataSource?.Items || [])];
        this.dataSource.Items = [...this.dataSource.Items];
        // this.virtualScroller?.scrollToPosition(0);
    } else {
        this.vsSocketImports = [...[itemNewComment], ...this.vsSocketImports];
        this.vsSocketImports = [...this.vsSocketImports];
    }

    this.postEvent.countRealtimeMessage$.emit(true);
    this.cdRef.detectChanges();
  }

  setCommentUpdateOrderCode(model: OnSocketOnSaleOnline_OrderDto) {
    let item: CommentOrder = {
      id: model.Data.Id,
      session: model.Data.Session,
      index: model.Data.SessionIndex,
      code: model.Data.Code
    };

    let exist = this.commentOrders && this.commentOrders[model.Data?.Facebook_ASUserId] && Object.keys(this.commentOrders[model.Data?.Facebook_ASUserId]).length > 0;
    if(exist) {
        let orders = this.commentOrders[model.Data.Facebook_ASUserId] as any[];
        let index = orders.findIndex(x => x.id == item.id);
        if(index >= 0) {
            orders[index] = {...item};
        } else {
            orders.push(item);
        }

        this.commentOrders[model.Data.Facebook_ASUserId] = [...orders];
    } else {
        this.commentOrders[model.Data.Facebook_ASUserId] = [item];
    }

    this.commentOrders = {...this.commentOrders};
    this.cdRef.detectChanges();
  }

  setCommentDeleteOrderCode(model: OnSocketOnSaleOnline_OrderDto) {
    let item: CommentOrder = {
      id: model.Data.Id,
      session: model.Data.Session,
      index: model.Data.SessionIndex,
      code: model.Data.Code
    };

    let exist = this.commentOrders[model.Data?.Facebook_ASUserId] && Object.keys(this.commentOrders[model.Data?.Facebook_ASUserId]).length > 0;
    if(exist) {
        let orders = this.commentOrders[model.Data.Facebook_ASUserId] as any[];
        orders = orders.filter(x => x.id != item.id);
        this.commentOrders[model.Data.Facebook_ASUserId] = [...orders];

        if(orders && orders.length == 0) {
            delete this.commentOrders[model.Data.Facebook_ASUserId];
        }
    }

    this.commentOrders = {...this.commentOrders};
    this.cdRef.detectChanges();
  }

  setCommentNumberInvoice(model: LiveCampaignFastSaleOrderDataDto) {
    let item = {
      Id: model.FastSaleOrderId,
      Number: model.Number,
      ShowState: '',
      State: ''
    } as OrderPartnerByLivecampaignDto;

    let exist = this.invoiceDict[model.PartnerId] && Object.keys(this.invoiceDict[model.PartnerId]).length > 0;
    if(exist) {
        let invoices = this.invoiceDict[model.PartnerId] as any[];
        let index = invoices.findIndex(x => x.Id == item.Id);

        if(index >= 0) {
            invoices[index] = {...item};
        } else {
            invoices.push(item);
        }

        this.invoiceDict[model.PartnerId] = [...invoices];
    } else {
        this.invoiceDict[model.PartnerId] = [item];
    }

    this.invoiceDict = {...this.invoiceDict};
    this.cdRef.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["data"] && !changes["data"].firstChange) {
        delete this.dataSource$;
        this.dataSource = null;
        this.filterObj = {};
        this.innerText = '';
        this.partnerDict = {};
        this.invoiceDict = {};
        this.dictActiveComment = {};

        this.data = {...changes["data"].currentValue};
        this.loadData();
        this.loadPartnersByTimestamp(this.team);
        this.loadCommentsOrderByPost();
        this.loadOrderPartnerbylLivecampaign();
    }

    if (changes["innerText"] && !changes["innerText"].firstChange && TDSHelperString.isString(changes["innerText"].currentValue)) {
        let text = changes["innerText"].currentValue;
        this.filterObj = { Keywords: text };
        this.loadData();
    }
  }

  loadData() {
    this.isLoading = true;
    this.disableNextUrl = false;
    this.isLoadingNextdata = false;

    this.virtualScroller?.refresh();
    this.virtualScroller?.scrollToPosition(0);

    this.dataSource$ = this.chatomniCommentService.makeDataSource(this.team.Id, this.data.ObjectId, this.filterObj);
    if(this.dataSource$) {
      this.dataSource$.pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: ChatomniDataDto) => {
            this.dataSource = { ...res };
            this.dataSource.Items = [...this.dataSource.Items];

            this.isLoading = false;
            this.cdRef.detectChanges();
        },
        error: (error: any) => {
            this.isLoading = false;
            this.message.error(error?.error?.message);
            this.cdRef.detectChanges();
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

    modal.componentInstance?.onSendProduct.pipe(takeUntil(this.destroy$)).subscribe({
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
      product: {
        Id: event.Id,
        Name: event.Name,
        Picture: event.Picture,
        Price: event.Price,
      }
    };

    this.activityMatchingService.addTemplateMessageV3(this.team?.Id, item.UserId, model).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {
            item.Data.is_reply = false;
            this.isReplyingComment = false;

            this.message.success('Gửi tin thành công');
            this.cdRef.markForCheck();
        },
        error: error => {
            item.Data.is_reply = false;
            this.isReplyingComment = false;

            this.message.error(error.error?.message);
            this.cdRef.detectChanges();
        }
    });
  }

  onQuickReplySelected(event: any, partner?: PartnerTimeStampItemDto) {
    let text = event.BodyPlain || event.BodyHtml || event.text;
    text = ReplaceHelper.quickReply(text, partner);
    this.messageModel = text;
  }

  onEnter(item: ChatomniDataItemDto, event: any) {
    if(event) {
      let message = this.messageModel as string;
      this.replyComment(item, message);
      this.messageModel = null as any;
    }

    event.preventDefault();
    event.stopImmediatePropagation();
  }

  messageSendingToServer(item: ChatomniDataItemDto) {
    let message = this.messageModel;

    if (!TDSHelperString.hasValueString(message)) {
      this.message.error('Hãy nhập nội dung cần gửi');
      return;
    }

    this.replyComment(item, message);
    this.messageModel = null as any;
  }

  replyComment(item: ChatomniDataItemDto, msg:string){
    this.isReplyingComment = true;
    if(!TDSHelperString.hasValueString(msg)) return;
      let model = this.prepareModelV2(msg);
      model.RecipientId = item.Data?.id || null;

    if(item.Data.is_private_reply) {
      // TODO: gửi về tin nhắn
      model.MessageType = EnumSendMessageType._REPLY;

      this.chatomniSendMessageService.sendMessage(this.team.Id, item.UserId, model).pipe(takeUntil(this.destroy$)).subscribe({
          next: (res: ResponseAddMessCommentDtoV2[]) => {
              item.Data.is_reply = false;
              this.isReplyingComment = false;

              this.message.success('Gửi tin thành công');
              this.cdRef.detectChanges();
          },
          error: error => {
              item.Data.is_reply = false;
              this.isReplyingComment = false;

              this.message.error(error.error?.message);
              this.cdRef.detectChanges();
          }
        })

    } else {
        // TODO: Trả lời bình luận
        model.ObjectId = item.ObjectId || item.Data?.object?.id as string;

        this.chatomniCommentService.replyComment(this.team!.Id, item.UserId, model).pipe(takeUntil(this.destroy$)).subscribe({
            next:(res: ResponseAddMessCommentDtoV2[]) => {
              res.map((resItem: ResponseAddMessCommentDtoV2)=> {
                let x = resItem as ChatomniDataItemDto;

                  x["Status"] = ChatomniStatus.Done;
                  x.Type = ChatomniMessageType.FacebookComment;

                  this.addReplyComment(x);
                  item.Data.is_reply = false;
                  this.isReplyingComment = false;

                  this.message.success("Trả lời bình luận thành công.");
                  this.cdRef.detectChanges();
              })
            },
            error: error => {
                item.Data.is_reply = false;
                this.isReplyingComment = false;

                this.message.error(error.error?.message);
                this.cdRef.detectChanges();
            }
        })
    }
  }

  prepareModelV2(message: string): any {
    const model = {} as ChatomniSendMessageModelDto;
    model.Message = message;

    return model;
  }

  addReplyComment(data: ChatomniDataItemDto) {
    let exist = data && data.ParentId && this.dataSource && this.dataSource.Extras && this.dataSource.Extras.Childs
    if(exist) {
        this.dataSource.Extras.Childs[data.ParentId] = [...(this.dataSource.Extras.Childs[data.ParentId] || []), ...[data]];
        let index = this.dataSource.Items.findIndex((x: ChatomniDataItemDto)=> x.Id == data.Id); // lọc lại vì nếu sokect trả về trước res
        if(Number(index) >=0 ) {
          this.dataSource.Items.splice(index, 1);
          return;
        }
        this.postEvent.countRealtimeMessage$.emit(true);
    }
  }

  loadPartnerTab(item: ChatomniDataItemDto, orders: CommentOrder[] | any) {
    this.conversationOrderFacade.onChangeTab$.emit(ChangeTabConversationEnum.partner);

    let order = null as any;
    if(orders && orders.length > 0) {
      order = orders[0] as any;
    }

    this.prepareLoadTab(item, order, null);
  }

  getFormatDate(date: any) {
    return formatDate(new Date(date), 'dddd-MM-dd', en_US.locale);
  }

  loadOrderItemByComment(item: ChatomniDataItemDto, order: OrderByCommentItemDto | any) {
    if(order.DateDeleted) {
      let format = this.getFormatDate(order.DateDeleted);
      if(format != '0101-01-01') {
          this.message.info('Đơn hàng không tồn tại');
          return;
      }
    }

    let model = {
        id: order.Id,
        code: order.Code,
        session: 0,
        index: 0
    } as CommentOrder;

    this.isVisible = '';
    this.idPopoverVisible = '';
    this.loadOrderByCode(item, model);
  }

  loadOrderByCode(item: ChatomniDataItemDto, order: CommentOrder | any) {
    this.conversationOrderFacade.onChangeTab$.emit(ChangeTabConversationEnum.order);
    this.prepareLoadTab(item, order, null);
  }

  onInsertFromPost(item: ChatomniDataItemDto) {
    this.isLoadingInsertFromPost = true;
    this.conversationOrderFacade.onChangeTab$.emit(ChangeTabConversationEnum.order);
    this.prepareLoadTab(item, null, 'SALEONLINE_ORDER');
  }

  prepareLoadTab(item: ChatomniDataItemDto, order: CommentOrder | null, type: any) {
    this.postEvent.spinLoadingTab$.emit(true);

    let psid = item.ParentId ? (item.Data?.from?.id) : (item.UserId || item.Data?.from?.id);
    if (!psid) {
      this.message.error("Không truy vấn được thông tin người dùng!");
      return;
    }

    this.chatomniConversationService.getInfo(this.team.Id, psid).pipe(takeUntil(this.destroy$)).subscribe({
      next: (info: ChatomniConversationInfoDto) => {
          if(!info) return;

          if(order && order.id) {
              this.conversationOrderFacade.hasValueOrderCode$.emit(order.code);
              this.conversationOrderFacade.loadOrderFromCommentPost$.emit({
                  orderId: order.id,
                  comment: item
              });
          } else {
              this.conversationOrderFacade.hasValueOrderCode$.emit('');
          }

          if(type == 'SALEONLINE_ORDER') {
              this.conversationOrderFacade.loadInsertFromPostFromComment$.emit(item);
          }

          this.conversationOrderFacade.loadPartnerByPostComment$.emit(info);
          this.cdRef.detectChanges();
      },
      error: (error: any) => {
          this.postEvent.spinLoadingTab$.emit(false);
          this.isLoadingInsertFromPost = false;

          this.notification.error('Lỗi tải thông tin khách hàng', `${error?.error?.message}`);
          this.cdRef.detectChanges();
      }
    })
  }

  reloadDataCommentsOrder() {
    let m = 10;
    this.refreshTimer = setTimeout(() => {
      this.loadCommentsOrderByPost();
      this.reloadDataCommentsOrder();
    }, m * 60 * 1000);
  }

  loadCommentsOrderByPost() {
    this.commentOrders = {};
    this.facebookCommentService.chatomniGetCommentsOrders(this.team.Id, this.data.ObjectId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        if(res) {
            let comments = [...res];
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

        this.isLoading = false;
        this.cdRef.detectChanges();
      },
      error: (error: any) => {
        this.isLoading = false;
        this.cdRef.detectChanges();
      }
    });
  }

  nextData(event: any) {
    if(this.dataSource?.Items?.length == 0) return;
    let dataSourceItem = (this.dataSource?.Items || []);

    let id = `${this.team.Id}_${this.data.ObjectId}`;
    this.dataSource$ = this.chatomniCommentService.nextDataSource(id, dataSourceItem);

    this.dataSource$?.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: ChatomniDataDto) => {

          if(res && res.Extras) {
              this.dataSource!.Extras = res.Extras;
          }

          if(res && res.Items && res.Items.length > 0) {
              this.dataSource.Items = [...(res.Items || [])];
              this.dataSource.Items = [...this.dataSource.Items];
          } else {
              this.disableNextUrl = true;
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
        this.isLoadingiconMess = true;
        this.loadMDBByPSId(this.team.ChannelId, data.UserId);
    }
  }

  loadMDBByPSId(pageId: string, psid: string) {
    // Xoá hội thoại hiện tại
    delete this.currentConversation;

    // get data currentConversation
    this.crmMatchingService.getMDBByPSId(pageId, psid).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: MDBByPSIdDTO) => {
        if (res) {
            let model = this.chatomniMessageFacade.mappingCurrentConversation(res)
            this.currentConversation = { ...model };
            this.isOpenDrawer = true;
            this.isLoadingiconMess = false;

            this.cdRef.detectChanges();
        }
      },
      error: (error: any) => {
          this.isLoadingiconMess = false;

          this.message.error(error?.error?.message);
          this.cdRef.detectChanges();
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
      this.crmTagService.dataActive$.pipe(takeUntil(this.destroy$)).subscribe({
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

    data = data.filter((x) => (x.Name && TDSHelperString.stripSpecialChars(x.Name.toLowerCase()).indexOf(TDSHelperString.stripSpecialChars(key.toLowerCase())) !== -1))
    this.lstOfTag = data
  }

  showModalAddTag() {
    this.idxClickTag = -1;
    let modal = this.modalService.create({
      title: 'Thêm thẻ hội thoại',
      content: CreateTagModalComponent,
      viewContainerRef: this.viewContainerRef,
    });

    modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe({
      next: (result: TDSSafeAny)=>{
        if(result){
            this.lstOfTag = [...this.lstOfTag, result];
            this.tags = [...this.tags, result];
        }
    }})
  }

  onVisibleDrawer(event: boolean){
    this.visibleDrawerBillDetail = event;
  }

  onOpenDrawerBillDetail(item : TDSSafeAny){
    this.idPopoverVisible = '';
    if(!item) return;

    this.visibleDrawerBillDetail = true;
    let model = { Id: item.Id, Number: item.Number };

    this.order = {...model};
    this.cdRef.detectChanges();
  }

  onPopoverVisible(id: string) {
    this.idPopoverVisible = id;
  }

  vsEnd(event: NgxVirtualScrollerDto) {
    this.isVisible = '';
    this.idPopoverVisible ='';

    let exisData = this.dataSource && this.dataSource.Items && this.dataSource.Items.length > 0 && event && event.scrollStartPosition > 0;
    if(exisData) {
      const vsEnd = Number(this.dataSource.Items.length - 1 ) == Number(event.endIndex) && !this.disableNextUrl as boolean;
      if(vsEnd) {
          if(this.isLoading || this.isLoadingNextdata) return;
          this.isLoadingNextdata = true;

          this.destroyTimer();
          this.nextDataTimer = setTimeout(() => {
              this.nextData(event);
          }, 500);
      }
    }
  }

  vsStart(event: NgxVirtualScrollerDto) {
    this.isVisible = '';
    this.idPopoverVisible = '';

    if(event && Number(event.startIndex) >= 0) {
        let exist = (event.startIndex < this.vsStartIndex) && this.vsStartIndex > 1  && event.startIndex <= 2
            && this.vsSocketImports && this.vsSocketImports.length > 0;

        if(exist) {
            this.isLoadingNextdata = true;
              this.preDataTimer = setTimeout(() => {
                this.dataSource.Items = [...this.vsSocketImports, ...this.dataSource.Items];
                this.dataSource.Items = [...this.dataSource.Items];

                this.vsSocketImports = [];
                this.isLoadingNextdata = false;
                this.cdRef.detectChanges();
            }, 350);
        }

        this.vsStartIndex = event.startIndex;
    }
  }

  openPopover(id: string) {
    this.isVisible = id;
  }

  destroyTimer() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }
    if (this.nextDataTimer) {
      clearTimeout(this.nextDataTimer);
    }
    if (this.preDataTimer) {
      clearTimeout(this.preDataTimer);
    }
  }

  onDictActiveComment(item: any) {
    this.dictActiveComment = {};
    this.dictActiveComment[item.Id] = true;
  }

  ngOnDestroy(): void {
      this.destroyTimer();
  }
}
