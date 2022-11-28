import { QuickReplyService } from 'src/app/main-app/services/quick-reply.service';
import { ChatmoniSocketEventName } from './../../services/socket-io/soketio-event';
import { ChatomniConversationFacade } from '@app/services/chatomni-facade/chatomni-conversation.facade';
import { SocketOnEventService, SocketEventSubjectDto } from '@app/services/socket-io/socket-onevent.service';
import { ChatomniSendMessageService } from './../../services/chatomni-service/chatomni-send-message.service';
import { ChatomniCommentFacade } from '@app/services/chatomni-facade/chatomni-comment.facade';
import { CRMTeamType } from './../../dto/team/chatomni-channel.dto';
import { ResponseAddMessCommentDto, ResponseAddMessCommentDtoV2 } from './../../dto/conversation-all/chatomni/response-mess.dto';
import { ChatomniStatus, ChatomniDataDto, ChatomniMessageType, ExtrasChildsDto } from './../../dto/conversation-all/chatomni/chatomni-data.dto';
import { ReplaceHelper } from '../helper/replace.helper';
import { QuickReplyDTO } from '../../dto/quick-reply.dto.ts/quick-reply.dto';
import { CreateTagModalComponent } from '../../pages/configs/components/create-tag-modal/create-tag-modal.component';
import { ModalListBillComponent } from '../../pages/conversations/components/modal-list-bill/modal-list-bill.component';
import { ModalListProductComponent } from '../../pages/conversations/components/modal-list-product/modal-list-product.component';
import { ModalImageStoreComponent } from '../../pages/conversations/components/modal-image-store/modal-image-store.component';
import {
  Component, Input, OnChanges, OnInit,
  SimpleChanges, TemplateRef, ViewContainerRef, OnDestroy, ChangeDetectorRef, HostListener, AfterViewInit, ViewChild, ElementRef, ChangeDetectionStrategy, AfterViewChecked, NgZone, HostBinding, Inject
} from '@angular/core';

import { Observable } from 'rxjs';
import { StateChatbot } from '../../dto/conversation-all/conversation-all.dto';
import { CRMTeamDTO } from '../../dto/team/team.dto';
import { takeUntil } from 'rxjs/operators';
import { ApplicationUserService } from '../../services/application-user.service';
import { ActivityMatchingService } from '../../services/conversation/activity-matching.service';
import { Router } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { CRMMatchingService } from '../../services/crm-matching.service';
import { SendMessageModelDTO } from '../../dto/conversation/send-message.dto';
import { CRMTagService } from '../../services/crm-tag.service';
import { Message } from 'src/app/lib/consts/message.const';
import { YiAutoScrollDirective } from '../directives/yi-auto-scroll.directive';
import { eventFadeStateTrigger } from '../helper/event-animations.helper';
import { TDSHelperArray, TDSHelperObject, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSModalService } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { TDSUploadChangeParam } from 'tds-ui/upload';
import { ProductPagefbComponent } from '../../pages/conversations/components/product-pagefb/product-pagefb.component';
import { ChatomniMessageService } from '../../services/chatomni-service/chatomni-message.service';
import { ChatomniMessageFacade } from '../../services/chatomni-facade/chatomni-message.facade';
import { ChatomniConversationItemDto } from '../../dto/conversation-all/chatomni/chatomni-conversation';
import { TDSDestroyService } from 'tds-ui/core/services';
import { ChatomniEventEmiterService } from '@app/app-constants/chatomni-event/chatomni-event-emiter.service';
import { DOCUMENT } from '@angular/common';
import { ChatomniSendMessageModelDto } from '@app/dto/conversation-all/chatomni/chatomini-send-message.dto';

@Component({
  selector: 'shared-tds-conversations',
  templateUrl: './tds-conversations.component.html',
  styleUrls: ['./tds-conversations.component.sass'],
  animations: [eventFadeStateTrigger],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ TDSDestroyService ]
})

export class TDSConversationsComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {

  @ViewChild(YiAutoScrollDirective) yiAutoScroll!: YiAutoScrollDirective;
  @ViewChild('scrollToIndex') scrollToIndex!: ElementRef<any>;
  @ViewChild('viewchildSearchMess') viewchildSearchMess!: ElementRef<any>;
  @ViewChild('viewChildQuickRepply') viewChildQuickRepply!: ElementRef<any>;
  @ViewChild('viewChildInputMessage') viewChildInputMessage!: ElementRef<any>;
  @HostBinding("@eventFadeState") eventAnimation = true;
  @Input() partner?: any;

  @Input() isLoadingAll: boolean = false;
  @Input() tdsHeader?: string | TemplateRef<void>;
  @Input() data!: ChatomniConversationItemDto;
  @Input() type!: string;
  @Input() team!: CRMTeamDTO;
  @Input() miniChat!: boolean;
  @Input() state!: number | undefined;

  isLoading: boolean = false;
  isLoadingSpin: boolean = false;
  isProcessing: boolean = false;

  dataSource$!: Observable<ChatomniDataDto>;
  dataSource!: ChatomniDataDto;

  isEnterSend: boolean = true;
  uploadedImages: string[] = [];
  currentImage: TDSSafeAny;
  isLoadingImage: boolean = false
  displayDropZone: boolean = false;
  markSeenTimer: TDSSafeAny;
  messageModel: string | undefined;
  isLoadingSendMess: boolean = false;

  lstUser!: TDSSafeAny[];
  users: TDSSafeAny[] = [];
  keyFilterUser: string = '';
  isLoadingSelectUser: boolean = false;

  lstOfTag: TDSSafeAny[] = [];
  tags: TDSSafeAny[] = [];
  keyFilterTag: string = '';
  isVisbleTag: boolean = false;
  userLogged!: any;

  isEnableChatbot: boolean = false;
  pageId!: string;
  isAlertChatbot: boolean = true;

  visibleDrawerBillDetail: boolean = false;
  isOpenSearch!: boolean;
  searchText: string = '';
  filterObj: TDSSafeAny;
  order: TDSSafeAny;
  companyCurrents: TDSSafeAny;

  quickReplies: Array<QuickReplyDTO> = [];
  objQuickReply: TDSSafeAny = {};

  constructor(private modalService: TDSModalService,
    private chatomniMessageService: ChatomniMessageService,
    private omniMessageFacade: ChatomniMessageFacade,
    private omniCommentFacade: ChatomniCommentFacade,
    private message: TDSMessageService,
    private activityMatchingService: ActivityMatchingService,
    private applicationUserService: ApplicationUserService,
    private sharedService: SharedService,
    private crmMatchingService: CRMMatchingService,
    private crmTagService: CRMTagService,
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
    private cdRef: ChangeDetectorRef,
    private viewContainerRef: ViewContainerRef,
    private destroy$: TDSDestroyService,
    private chatomniEventEmiter: ChatomniEventEmiterService,
    private chatomniSendMessageService: ChatomniSendMessageService,
    private socketOnEventService: SocketOnEventService,
    private chatomniConversationFacade: ChatomniConversationFacade,
    private quickReplyService: QuickReplyService) {

      this.sharedService.getUserLogged().pipe(takeUntil(this.destroy$)).subscribe({
          next: (user: any) => {
              this.userLogged = user;
          }
      })
  }

  ngOnInit() {
    this.validateData();

    if (this.data && this.team && TDSHelperString.hasValueString(this.type)) {
      this.pageId = this.team.ChannelId;
      this.loadData(this.data);
    }

    // TODO: has_admin_required nhận từ tds-conversation-item để gửi lại tn
    this.onRetryMessage();

    this.eventEmitter();
    this.onEventSocket();
    this.yiAutoScroll?.forceScrollDown();
    this.loadCurrentCompany();
    this.loadDataQuickRepply();
  }

  eventEmitter(){
    this.chatomniEventEmiter.quick_Reply_DataSourceEmiter$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: TDSSafeAny) => {
        if(res.UserId == this.data.ConversationId){
            this.dataSource.Items = [...(this.dataSource?.Items || []), ...[res]];

            this.yiAutoScroll.forceScrollDown();
            this.cdRef.detectChanges();
        }
      }
    })

    this.chatomniEventEmiter.childCommentConversationEmiter$.pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: ExtrasChildsDto) => {
          if(res && res.Data.id && this.dataSource.Extras!.Childs && this.dataSource.Extras!.Childs[res.Data.id]){
              this.dataSource.Extras!.Childs[res.Data.id] = [...this.dataSource.Extras!.Childs[res.Data.id], res];
          }
        }
      }
    )
  }

  onEventSocket() {
    // TODO: mapping tin nhắn từ socket-io
    this.socketOnEventService.onEventSocket().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: SocketEventSubjectDto) => {
        switch(res.EventName) {

          case ChatmoniSocketEventName.chatomniOnMessage:
            if(res.Data && res.Data.Conversation && this.data) {

              // TODO: mapping dữ liệu khung chat hiện tại
              let exist = this.data.ConversationId == res.Data.Conversation?.UserId;
              let index = (this.dataSource?.Items || []).findIndex(x => x.Id == res.Data.Message?.Id);

              if(exist && index < 0 && this.dataSource) {
                  let item = {...this.chatomniConversationFacade.preapreMessageOnEventSocket(res.Data, this.data)};

                  switch (this.type) {
                    case 'message':
                      if((item.Type == ChatomniMessageType.FacebookMessage || item.Type == ChatomniMessageType.TShopMessage)) {
                          this.dataSource.Items = [...(this.dataSource?.Items || []), ...[item]];
                      }
                      break;

                    case 'comment':
                      if ((item.Type == ChatomniMessageType.FacebookComment || item.Type == ChatomniMessageType.TShopComment)) {
                        // TODO: trường hợp trả về comment child và tồn tại comment parent trên dữ liệu trên dataSource.Items
                        if(this.checkCommentSocket(item)) return;
                        this.dataSource.Items = [...(this.dataSource?.Items || []), ...[item]];
                      }
                      break;

                    default:
                      if ((item.Type == ChatomniMessageType.FacebookComment || item.Type == ChatomniMessageType.TShopComment)) {
                        // TODO: trường hợp trả về comment child và tồn tại comment parent trên dữ liệu trên dataSource.Items
                        if(this.checkCommentSocket(item)) return;
                      }
                      this.dataSource.Items = [...(this.dataSource?.Items || []), ...[item]];
                      break;
                  }

                  this.yiAutoScroll.forceScrollDown();
                  this.cdRef.detectChanges();
              }
            }
            break;

          case ChatmoniSocketEventName.chatomniOnUpdate:
              let exist =  res.Data && this.data && this.data.ConversationId == res.Data.Data?.UserId;
              let index = (this.dataSource?.Items || []).findIndex(x => x.Id == res.Data?.Data?.MessageId);

              if(exist && Number(index) >= 0) {
                  if(res.Data.Data.Status == 1) { // gửi lỗi
                      let error = {} as any;
                      error.Code = null;
                      error.Message = res.Data.Data.MessageError;

                      this.dataSource.Items[index].Status = ChatomniStatus.Error;
                      this.dataSource.Items[index].Error = {...error};
                  } else if(res.Data.Data.Status == 0) { // gửi thành công
                      this.dataSource.Items[index].Status = ChatomniStatus.Done;
                      delete this.dataSource.Items[index].Error;
                  }

                  this.dataSource.Items[index] = {...this.dataSource.Items[index]};
                  this.dataSource.Items = [...this.dataSource.Items]

                  this.cdRef.markForCheck();
              }
            break;

          case ChatmoniSocketEventName.onUpdateSaleOnline_Order:
            break;

          default:
            break;
        }
      }
    })

    // TODO: sự kiện thêm mẫu mẫu tin nhắn nhanh
    this.quickReplyService.onChangeQuickReply.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res :any) => {
          this.quickReplies = [...[res], ...this.quickReplies];
          this.cdRef.detectChanges();
      }
    })
  }

  checkCommentSocket(item: TDSSafeAny) {
    let indexChild = (this.dataSource.Items || []).findIndex(x => x.Data.Id == item?.ParentId);

    if (item.ParentId && this.dataSource.Extras?.Childs && Number(indexChild) >= 0) {
        this.dataSource.Extras.Childs[item.ParentId] = [...(this.dataSource.Extras?.Childs[item.ParentId] || []), ...[item]];

        this.cdRef.detectChanges();
        return true;
    }

    return false;
  }

  loadCurrentCompany() {
    this.sharedService.setCurrentCompany();
    this.sharedService.getCurrentCompany().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: any) => {
          this.companyCurrents = data;
      }
    })
  }

  loadData(data: ChatomniConversationItemDto) {
    this.loadTags(data);
    this.loadUser();

    // TODO: Nội dung tin nhắn
    this.loadMessages(data);
    this.initiateTimer();
  }

  loadMessages(data: ChatomniConversationItemDto): any {
    if(this.isLoadingAll) {
        this.isLoading = true;
    } else {
        this.isLoadingSpin = true;
        this.isLoading = true;
    }

    this.dataSource$ = this.chatomniMessageService.makeDataSource(this.team.Id, data.ConversationId, this.type, this.filterObj);
    this.dataSource$?.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: ChatomniDataDto) => {
          if(res) {
              this.dataSource = { ...res };

              //TODO: truyền về conversation-all
              setTimeout(() => {
                  this.chatomniEventEmiter.countUnreadEmiter$.emit(this.data.ConversationId);
              }, 300);
          }

          this.isLoading = false;
          this.isLoadingSpin = false;
          this.cdRef.detectChanges();
      },
      error: (error: any) => {
          this.isLoading = false;
          this.isLoadingSpin = false;
          this.message.error(`${error?.error?.message}` || 'Đã xảy ra lỗi');
          this.cdRef.detectChanges();
      }
    })
  }

  loadUser() {
    this.applicationUserService.setUserActive();
    this.applicationUserService.getUserActive().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          this.users = [...res];
          this.lstUser = [...res];
      },
      error: (error: any) => {
          this.message.error(`${error?.error?.message}` || 'Load user đã xảy ra lỗi');
      }
    })
  }

  initiateTimer() {
    this.destroyTimer();
    this.markSeenTimer = setTimeout(() => {
      let teamId = this.team.Id;
      let csid = this.data!.ConversationId;

      if(!teamId && !csid) return;
      this.crmMatchingService.markSeenV2(teamId, csid).pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
            // Cập nhật count_unread
            let model = {
              pageId: this.pageId,
              type: this.type,
              csid: this.data!.ConversationId
            } as any;

            this.chatomniEventEmiter.updateMarkSeenBadge$.emit(model);
            this.cdRef.markForCheck();
        },
        error: (error: any) => {
            this.message.error(`markseen: ${error?.error?.message}`);
        }
      })
    }, 3 * 1000); // Ở lại ít nhất 3s mới gọi markSeen
  }

  destroyTimer() {
    if (this.markSeenTimer) {
      clearTimeout(this.markSeenTimer);
    }
  }

  showImageStore(): void {
    const modal = this.modalService.create({
        title: 'Kho hình ảnh',
        content: ModalImageStoreComponent,
        centered: true,
        size: "xl",
        viewContainerRef: this.viewContainerRef
    });

    modal.afterClose.subscribe({
      next: (result : string[]) => {
        if(TDSHelperArray.hasListValue(result)){
          let data = this.uploadedImages;

          result.forEach((x: string)=>{
              data.push(x);
          })

          this.uploadedImages = [...data];
          this.cdRef.markForCheck();
        }
      }
    });
  }

  onProductsbypageFb() {
    const modal = this.modalService.create({
      title: 'Danh sách sản phẩm',
      content: ProductPagefbComponent,
      viewContainerRef: this.viewContainerRef,
      size: 'xl',
      componentParams: {
        pageId: this.team.ChannelId,
      }
    });

    modal.componentInstance?.onSendProduct.subscribe({
      next: (res: TDSSafeAny)=>{
        if(res){
            this.onProductSelected(res);
        }
      }
    })
  }

  onProductSelected(event: any) {
    let that= this;
    let model = {
      page_id: this.pageId,
      to_id: this.data.ConversationId,

      product: {
        Id: event.Id,
        Name: event.Name,
        Picture: event.Picture,
        Price: event.Price,
      }
    };

    this.activityMatchingService.addTemplateMessageV2(this.data.ConversationId, model)
      .pipe(takeUntil(this.destroy$)).subscribe({
          next: (res: any) => {
              that.message.success('Gửi thành công sản phẩm');
              this.messageResponseV2(res, {} as any);
          },
          error: error=> {
              this.message.error('Gửi sản phẩm thất bại');
          }
      })
  }

  onProductLastV2() {
    this.modalService.create({
        title: 'Danh sách sản phẩm',
        content: ModalListProductComponent,
        viewContainerRef: this.viewContainerRef,
        size: 'xl',
        bodyStyle: {
            padding: '0px'
        },
    });
  }

  showModalListBill(data: ChatomniConversationItemDto) {
    let modal= this.modalService.create({
        title: 'Phiếu bán hàng',
        content: ModalListBillComponent,
        viewContainerRef: this.viewContainerRef,
        size: 'xl',
        componentParams: {
            page_id: this.pageId,
            psid: data.ConversationId,
        }
    });

    modal.afterClose.subscribe({
        next: (res: TDSSafeAny) => {
          if(res && res.type == 'img'){
            this.uploadedImages = [...this.uploadedImages, ...[res.value]];

            this.cdRef.detectChanges();
          }
        }
      }
    )
  }

  showModalAddTag() {
    this.isVisbleTag = false
    let modal = this.modalService.create({
        title: 'Thêm thẻ hội thoại',
        content: CreateTagModalComponent,
        viewContainerRef: this.viewContainerRef,
    });

    modal.afterClose.subscribe({
      next: (result: TDSSafeAny) => {
        if(result){
            this.lstOfTag = [...this.lstOfTag, result];
            this.tags = [...this.tags, result];
            this.crmTagService.addData(result);
        }
    }})
  }

  callbackTag(ev: boolean) {
    this.isVisbleTag = ev
    if(!ev){
        this.searchTag();
    }
  }

  loadEmojiMart(event: any) {
    if (TDSHelperString.hasValueString(this.messageModel)) {
        this.messageModel = `${this.messageModel}${event?.emoji?.native}`;
    } else {
        this.messageModel = `${event?.emoji?.native}`;
    }
  }

  validateData() {
    (this.dataSource as any) = null;
    (this.dataSource$ as any) = null;
    delete this.messageModel;

    this.isLoading = false;
    this.isLoadingSpin = false;
    this.isProcessing = false;
    this.uploadedImages = [];
    this.filterObj = null;
  }

  nextData() {
    if (this.isProcessing || this.isLoading) {
      return;
    }

    this.isProcessing = true;
    let id = `${this.team.Id}_${this.data.ConversationId}`;

    this.dataSource$ = this.chatomniMessageService.nextDataSource(id, this.dataSource);
    this.dataSource$?.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: ChatomniDataDto) => {
          if(res) {
              if(res.Extras) {
                this.dataSource.Extras = res.Extras;
              }

              if(TDSHelperArray.hasListValue(res.Items)) {
                this.dataSource.Items = [...res.Items];
              }

              this.dataSource.Paging = {...res.Paging};
              this.srcollBehavior();
          }

          this.isProcessing = false;
          this.cdRef.markForCheck();
      },
      error: (error: any) => {
          this.isProcessing = false;
          this.message.error(`${error?.error?.message}` || 'Đã xảy ra lỗi');
          this.cdRef.markForCheck();
      }
    })
  }

  srcollBehavior() {
    setTimeout(() => {
      let element = this.document.getElementById('dataSourceScroll') as any;

      if(element) {
        const top = (element.scrollHeight / element.offsetHeight) * 100;
        element?.scroll({
            top: top,
            behavior: 'smooth',
        })
      }
    }, 500)
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['isLoadingAll'] && !changes['isLoadingAll'].firstChange) {
        this.isLoadingAll = changes['isLoadingAll'].currentValue;
    }

    if (changes["data"] && !changes["data"].firstChange) {
      this.validateData();
      (this.data as any) = null;

      this.data = changes["data"].currentValue;
      this.loadData(this.data);
    }

    if(changes["state"] && !changes["state"].firstChange) {
        this.state = changes["state"].currentValue;
        if(this.state) {
            this.data.State = this.state;
        }
    }

    if(changes["partner"] && !changes["partner"].firstChange) {
        this.partner = changes["partner"].currentValue;
    }
  }

  loadTags(data: ChatomniConversationItemDto) {
    if (data && data.Tags) {
      if (!TDSHelperArray.hasListValue(this.tags)) {
        this.crmTagService.dataActive$.subscribe({
          next: (res: any) => {
            this.tags = [...res];
            this.lstOfTag = [...this.tags];

            this.sortTagsByParent();
            this.searchTag();
        }})
      } else {
        this.sortTagsByParent();
      }
    }
  }

  sortTagsByParent() {
    let tags = this.tags || [];
    let local = this.crmTagService.getTagLocalStorage() as any;

    if (TDSHelperArray.hasListValue(tags) && local) {
      tags.sort((a: any, b: any) => {
        if (!local[a.Id]) {
          local[a.Id] = { "point": 0 };
        }

        if (!local[b.Id]) {
          local[b.Id] = { "point": 0 };
        }

        if (this.data && this.data.Tags) {
          if ((this.data.Tags as any)[a.Id] && !(this.data.Tags as any)[b.Id]) {
            return -1;
          }
        }

        if ((local[a.Id].point > local[b.Id].point) && !(this.data.Tags as any)[b.Id]) {
          return -1;
        }

        return 0;
      });
    }
  }

  onClickSender() {
    this.messageSendingToServer();
  }

  onEnter(event: any) {
    if (this.isEnterSend) {
        this.messageSendingToServer();

        event.preventDefault();
        event.stopImmediatePropagation();
    }
  }

  messageSendingToServer(): any {
    let message = this.messageModel as string;

    if (!TDSHelperArray.hasListValue(this.uploadedImages) && !TDSHelperString.hasValueString(message)) {
      return this.message.error('Hãy nhập nội dung cần gửi');
    }

    if (this.isLoadingSendMess) {
      return;
    }

    this.isLoadingSendMess = true;
    let activityFinal = this.dataSource?.Items ? this.dataSource.Items[this.dataSource.Items!.length - 1]: null

    if (TDSHelperObject.hasValue(activityFinal) && (activityFinal?.Type === ChatomniMessageType.FacebookComment || activityFinal?.Type === ChatomniMessageType.TShopComment)) {
        if (this.type === 'all') {
            //TODO: Trả lời tin nhắn bình luận bằng tin nhắn
            this.sendPrivateRepliesV2(activityFinal, message);
        }

        else if (this.type === 'comment') {
            //TODO: Phản hồi bình lần bằng bình luận
            this.replyComment(activityFinal, message);
        }

    } else {
        //TODO: trả lời tin nhắn thường
        this.sendMessageV2(message);
    }
  }

  sendIconLike() {
    const message = "(y)";
    let model = this.prepareModelV2(message);

    this.chatomniSendMessageService.sendMessage(this.team.Id, this.data.ConversationId, model)
      .pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {
            this.messageResponseV2(res, model);
        },
        error: error => {
          this.message.error(`${error.error.message}`? `${error.error.message}` : "Like thất bại");
        }
      });
  }

  replyComment(activityFinal: any, message: string) {
    const model = this.prepareModel(message);

    model.post_id = activityFinal?.ObjectId || null;
    model.parent_id = activityFinal?.Data?.id || null;
    model.to_id = activityFinal?.Data?.from?.id || activityFinal?.UserId || null;
    model.to_name = activityFinal?.Data?.from?.name || null;

    this.activityMatchingService.replyComment(this.team?.Id, model)
      .pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: ResponseAddMessCommentDto) => {

          // add vào dataSource tại đây
          res["status"] = ChatomniStatus.Done;
          res.type =  this.team.Type == CRMTeamType._Facebook ? 12 :(this.team.Type == CRMTeamType._TShop ? 91 : 0);
          res.name = this.team.Name;

          let data = this.omniCommentFacade.mappingExtrasChildsDto(res)

          if(this.dataSource.Extras!.Childs && this.dataSource.Extras!.Childs[activityFinal?.Data?.id] ){
              // TODO: Đã có tin nhắn con, add thêm phản hổi mới vào Childs đã có
              this.dataSource.Extras!.Childs[activityFinal?.Data?.id] = [...this.dataSource.Extras!.Childs[activityFinal?.Data?.id], data];
          }
          else if(activityFinal?.Data?.id) {
              // TODO: chưa có tin nhắn con, Tạo mới Childs {Key[]} để thêm phản hồi mới
              this.dataSource.Extras!.Childs = { ...(this.dataSource.Extras!.Childs || {}) } as any;
              this.dataSource.Extras!.Childs[activityFinal?.Data?.id] = [...[], data];
          }

          //TODO: Đẩy qua conversation-all-v2
          let itemLast = {...data};
          let modelLastMessage = this.omniMessageFacade.mappinglLastMessageEmiter(this.data.ConversationId ,itemLast, res.type);
          this.chatomniEventEmiter.last_Message_ConversationEmiter$.emit(modelLastMessage);

          this.currentImage = null;
          this.uploadedImages = [];
          delete this.messageModel;
          this.isLoadingSendMess = false;

          this.cdRef.detectChanges();
      },
      error: error => {
        this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : "Trả lời bình luận thất bại");
        this.isLoadingSendMess = false;
        this.cdRef.detectChanges();
      }
    });
  }

  onRetryMessage() {
    this.activityMatchingService.onCopyMessageHasAminRequired$.subscribe({
      next: (message: string) => {
        if(TDSHelperString.hasValueString(message)) {
            if (TDSHelperString.hasValueString(this.messageModel)) {
                this.messageModel = `${this.messageModel}${message}`;
            } else {
                this.messageModel = `${message}`;
            }
        }
    }})
  }

  prepareModelV2(message: string): any {
    const model = {} as ChatomniSendMessageModelDto;
    model.Message = message;

    let exist = TDSHelperArray.hasListValue(this.uploadedImages) && this.type != 'comment'
    if (exist) {
      model.Attachment = {} as TDSSafeAny;
      model.Attachment.Type = 0;
      model.Attachment.Data = {} as TDSSafeAny;
      model.Attachment.Data.Urls = [...this.uploadedImages]
    }

    return model;
  }

  sendMessageV2(message: string) {
    const model = this.prepareModelV2(message);
    if(!TDSHelperArray.hasListValue(this.uploadedImages)){
        model.MessageType = 0;
    }

    this.chatomniSendMessageService.sendMessage(this.team.Id, this.data.ConversationId, model).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: ResponseAddMessCommentDtoV2[]) => {
            this.messageResponseV2(res, model);
        },
        error: error => {
            this.isLoadingSendMess = false;
            this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Trả lời bình luận thất bại');
        }
      }
    );
  }

  messageResponseV2(res: any, model: ChatomniSendMessageModelDto) {
    // TODO: trả về res.length == 1 là tin nhắn, res.length > 1 là gửi nhiều hình ảnh hoặc hình và tin nhắn
    if (TDSHelperArray.hasListValue(res)) {

      res.map((x: ResponseAddMessCommentDtoV2, i: number) => {

          x["Status"] = ChatomniStatus.Pending;
          if (TDSHelperArray.hasListValue(model.Attachment) && !x.Message) {
              x["Attachments"] = this.omniMessageFacade.createDataAttachments(this.uploadedImages[i]);
          }

          //TODO: Kiểm tra Id conversation đã được push từ socket thì không push vào nữa
          let data = this.omniMessageFacade.mappingChatomniDataItemDtoV2(x);
          let index = (this.dataSource?.Items || []).findIndex(x=> x.Id == data.Id);

          //TODO: Lấy item cuối đẩy qua conversation-all-v2
          if(index < 0) {
              this.dataSource.Items = [...this.dataSource.Items, ...[data]];
          } else {
            //TODO: trường hợp socket trả về trước res, gán lại data để Status là Pending
              this.dataSource.Items[index] = {...data};
              this.dataSource.Items = [...this.dataSource.Items];
          }

          //TODO: Đẩy qua conversation-all-v2
          if(i == res.length - 1){
              let itemLast = {...data}
              if (TDSHelperArray.hasListValue(model.Attachment)) {
                  itemLast.Message = x.Message ||  `Đã gửi ${this.uploadedImages.length} ảnh.`;
              }

              let modelLastMessage = this.omniMessageFacade.mappinglLastMessageEmiter(this.data.ConversationId ,itemLast, x.MessageType);
              this.chatomniEventEmiter.last_Message_ConversationEmiter$.emit(modelLastMessage);
          }
      });

      this.cdRef.detectChanges();
    }

    this.currentImage = null;
    delete this.messageModel;
    this.uploadedImages = [];
    this.isLoadingSendMess = false;

    this.yiAutoScroll?.forceScrollDown();
    this.cdRef.detectChanges();
  }

  sendPrivateRepliesV2(activityFinal: any, message: string){
    const model = this.prepareModelV2(message);
    model.MessageType = 2;
    model.RecipientId = activityFinal?.Data?.id || null;

    if(TDSHelperArray.hasListValue(this.uploadedImages) && model.Attachment.Data){
        model.Attachment.Data.Url = this.uploadedImages[0];
    }

    this.chatomniSendMessageService.sendMessage(this.team.Id, this.data.ConversationId, model)
      .pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {

            if(this.uploadedImages.length > 0) {
                this.message.info('Trả lời tin nhắn bình luận chỉ gửi 1 hình ảnh')
            }

            this.messageResponseV2(res, model);
        },
        error: error => {
            this.isLoadingSendMess = false;
            this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Gửi tin nhắn thất bại');
            this.cdRef.detectChanges();
      }
    })
  }

  //TODO: Vẫn dùng cho phản hồi bình luận
  prepareModel(message: string): any {
    const model = {} as SendMessageModelDTO;
    model.from = {
      id: this.team.ChannelId,
      name: this.team.Name
    }
    model.to = {
      id: this.data.ConversationId,
      name: this.data.Name
    };
    model.to_id = this.data.ConversationId;
    model.to_name = this.data.Name;

    model.message = message;
    model.created_time = (new Date()).toISOString();
    model.attachments = {
      data: []
    }

    let exist = TDSHelperArray.hasListValue(this.uploadedImages) && this.type != 'comment'
    if (exist) {
      this.uploadedImages.map((x: string) => {
        (model.attachments?.data as any[]).push({
          image_data: {
            url: x
          }
        });
      });
    }
    return model;
  }

  assignUser(item: TDSSafeAny) {
    if(this.isLoadingSelectUser){
      return
    }
    this.isLoadingSelectUser = true;
    this.activityMatchingService.assignUserToConversation(this.data.ConversationId, item.Id, this.team.ChannelId)
      .pipe(takeUntil(this.destroy$)).subscribe({
          next: (res: TDSSafeAny) => {
              this.data.AssignedTo = res;

              //TODO: truyền về conversation-all
              setTimeout(() => {
                  this.chatomniEventEmiter.assignedToUser$.emit(this.data);
              }, 300);

              this.isLoadingSelectUser = false;
              this.message.success('Thao tác thành công');
              this.cdRef.detectChanges();
          },
          error: err => {
              this.isLoadingSelectUser = false;
              this.message.error(err.error? err.error.message: "Thao tác thất bại");
              this.cdRef.detectChanges();
          }});
  }

  searchUser() {
    let data = this.users;
    let key = this.keyFilterUser;
    if (TDSHelperString.hasValueString(key)) {
      key = TDSHelperString.stripSpecialChars(key.trim());
    }
    data = data.filter((x) =>
      (x.Name && TDSHelperString.stripSpecialChars(x.Name.toLowerCase()).indexOf(TDSHelperString.stripSpecialChars(key.toLowerCase())) !== -1))
    this.lstUser = data
  }

  onSelectTag(item: any) {
    let tags = [...this.data.Tags];

    if (tags.findIndex(x=> x.Id == item.Id) > 0) {
      let modelTag = this.omniMessageFacade.mappingModelTag(item);
      this.removeIndexDbTag(modelTag);
    } else {
      this.assignIndexDbTag(item);
    }
  }

  onRemoveTag(item: any) {
    this.removeIndexDbTag(item);
  }

  assignIndexDbTag(item: any) {
    this.activityMatchingService.assignTagToConversation(this.data.ConversationId, item.Id, this.team.ChannelId)
      .pipe(takeUntil(this.destroy$)).subscribe({
          next: ()=> {
              this.assignTagOnView(item);
              this.message.success('Thêm nhãn thành công');
              this.crmTagService.addTagLocalStorage(item.Id);
          },
          error: err => {
              this.message.error(err.error? err.error.message : 'Gắn nhãn thất bại');
          }
    });
  }

  removeIndexDbTag(item: any): void {
    this.activityMatchingService.removeTagFromConversation(this.data.ConversationId, item.Id, this.team.ChannelId)
      .pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
            this.removeTagOnView(item);
            this.message.success('Gỡ nhãn thành công');
        },
        error: err=>{
            this.message.error(err.error? err.error.message : 'Xóa nhãn thất bại');
        }
    });
  }

  assignTagOnView(tag: any) {
    this.data.Tags = this.data.Tags || [];
    let modelTag = this.omniMessageFacade.mappingModelTag(tag);
    this.data.Tags = [...this.data.Tags, modelTag];

    let model = this.omniMessageFacade.mappinglTagsEmiter(this.data);

    //TODO: đẩy qua conversation-all-v2
    this.chatomniEventEmiter.tag_ConversationEmiter$.emit(model);
    this.cdRef.detectChanges();
  }

  removeTagOnView(tag: any) {
    this.data.Tags = this.data.Tags || [];
    let data = this.data.Tags.filter((x: any) => x.Id !== tag.Id)
    this.data.Tags = [...data];

    let model = this.omniMessageFacade.mappinglTagsEmiter(this.data);

    //TODO: đẩy qua conversation-all-v2
    this.chatomniEventEmiter.tag_ConversationEmiter$.emit(model);
    this.cdRef.detectChanges();
  }

  searchTag() {
    let data = this.tags;
    let key = this.keyFilterTag;

    if (TDSHelperString.hasValueString(key)) {
      key = TDSHelperString.stripSpecialChars(key.trim());
    }

    data = data.filter((x) => (x.Name && TDSHelperString.stripSpecialChars(x.Name.toLowerCase()).indexOf(TDSHelperString.stripSpecialChars(key.toLowerCase())) !== -1));
    this.lstOfTag = [...data];
  }

  openPost(item: any, type: any) {
    if (type === 'post' && item.object_id) {
      this.router.navigateByUrl(`/conversation/post?teamId=${this.team.Id}&type=post&post_id=${item.object_id}`);
    }
  }

  refreshRead() {
    this.validateData();
    this.loadMessages(this.data);

    if(this.lstOfTag && this.lstOfTag.length == 0) {
      this.loadTags(this.data);
    }
  }

  handleChange(info: TDSUploadChangeParam): void {
    if (info.file.status !== 'uploading') {
      // console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      this.message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      this.message.error(`${info.file.name} file upload failed.`);
    }
  }

  handleUpload = (item: any) => {
    this.isLoadingImage = true;
    const formData = new FormData();
    formData.append('files', item.file as any, item.file.name);
    formData.append('id', '0000000000000051');

    return this.sharedService.saveImageV2(formData)
      .pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {
          if (Message.Upload.Success) {
            let x = res[0].urlImageProxy as string;
            this.currentImage = x;
            const dataItem = [...this.uploadedImages, x];
            this.uploadedImages = dataItem;
            this.displayDropZone = false;
            this.isLoadingImage = false;

            this.cdRef.markForCheck();
          }
        },
        error: error => {
          this.message.error(error.Message ? error.Message : 'Upload xảy ra lỗi');
          this.displayDropZone = false;
          this.isLoadingImage = false;
          this.cdRef.markForCheck();
        }
    });
  }

  onLoadImage(ev: TDSSafeAny) {
    let data: string[] = [];
    if (TDSHelperObject.hasValue(ev) && TDSHelperArray.hasListValue(ev.files)) {
      ev.files.forEach((e: TDSSafeAny) => {
        data.push(e.url)
      });
    }
    this.uploadedImages = [...data]
  }

  closeImages() {
    this.uploadedImages = [];
  }

  changeEnterSend(ev: any) {
    if (ev) {
      this.isEnterSend = ev.checked;
    }
  }

  onQuickReplySelected(event: QuickReplyDTO) {
    let text = event.BodyPlain || event.BodyHtml;
    text = ReplaceHelper.quickReply(text, this.partner);
    this.messageModel = text;
  }

  onPaste(e: any) {
    if(this.isLoadingImage){
      return;
    }

    const file = e.clipboardData?.files[0] as File;

    if(file && file.type && file.type.indexOf('image') === 0) {
      this.isLoadingImage = true;
      let fileName= file.name.replace('image', file.lastModified.toString());

      const formData = new FormData();
      formData.append('files', file, fileName);
      formData.append('id', '0000000000000051');

      this.sharedService.saveImageV2(formData).subscribe((res: any) => {
        if(res && res[0]) {
          this.uploadedImages = [...this.uploadedImages,...[res[0]?.urlImageProxy]];
          this.isLoadingImage = false;
          this.cdRef.detectChanges();
        } else {
          this.isLoadingImage = false;
          this.message.error('Lỗi tải ảnh');
          this.cdRef.detectChanges();
        }
      });

      e.preventDefault();
      e.stopImmediatePropagation();
    }
  }

  @HostListener('window:dragover', ['$event'])
  onDragOver(evt: TDSSafeAny) {
    this.displayDropZone = true;
    evt.preventDefault();
    evt.stopImmediatePropagation();
  }

  @HostListener("window:dragleave", ["$event"])
  onDragLeave(evt: any) {
    if (evt.fromElement) {
      this.displayDropZone = true;
    } else {
      this.displayDropZone = false;
    }
    evt.preventDefault();
    evt.stopImmediatePropagation();
  }

  @HostListener('window:drop', ['$event'])
  ondrop(evt: any) {
    this.displayDropZone = false;
    evt.preventDefault();
    evt.stopImmediatePropagation();
  }

  trackByIndex(_: number, data: any): number {
    return data.psid;
  }

  onStartChatbot() {
   if(this.data && this.data.State == 2) {
      let pageId = this.team.ChannelId;
      let psid = this.data.ConversationId;

      this.crmMatchingService.transferChatbot(pageId, psid).pipe(takeUntil(this.destroy$)).subscribe({
        next: (data) => {

          this.message.success('Bật chatbot thành công')
          this.isEnableChatbot = true;
          this.data.State = StateChatbot.Normal;

          // TODO: bật chatbot thành công 5s rồi tắt
          setTimeout(() =>{
              this.isEnableChatbot = false;

              //TODO: Truyền về conversation-all để tắt hiện thị chatbot
              this.chatomniEventEmiter.chatbotStateEmiter$.emit(this.data.ConversationId);
          }, 5 * 1000)

          this.cdRef.detectChanges();

        },
        error: error => {
            this.message.error(error?.error?.message || 'Đã xảy ra lỗi');
            this.cdRef.detectChanges();
        }
      });
    }
  }

  onAlertChatBot(){
    this.isAlertChatbot = true;
  }

  onCloseAlertChatbot(ev: boolean){
    this.isAlertChatbot = false;
  }

  ngAfterViewInit() {
  }

  @HostListener('click', ['$event']) onClickCodeBill(e: TDSSafeAny) {
    let className = JSON.stringify(e.target.className);
    if(className.includes('payload')){
      if (e.target.className.indexOf('payload') >= 0) {
        if(e.target.id && !e.target.innerText.includes('undefined')){
          this.visibleDrawerBillDetail = true;
          let model = {
            Id: e.target.id,
            Number: e.target.innerText
          }
          this.order = {...model};
        } else {
          this.message.error('Không tìm thấy thông tin đơn hàng');
        }
      }
    }
  }

  onVisibleDrawer(event: boolean){
    this.visibleDrawerBillDetail = event;
  }

  onOpenSearch(){
    this.isOpenSearch = true;

    setTimeout(() => {
      if(this.viewchildSearchMess)
        this.viewchildSearchMess.nativeElement.focus();
      }, 350);
  }

  onCloseSearch(){
    this.isOpenSearch = false;
    if(!TDSHelperString.hasValueString(this.searchText) && !TDSHelperString.hasValueString(this.filterObj?.Keywords)){
      return
    }
    this.searchText = '';
    this.filterObj = null;

    this.loadMessages(this.data)
  }

  onSearch(event: TDSSafeAny){
    if (this.data && this.team && TDSHelperString.hasValueString(this.type)) {
      this.pageId = this.team.ChannelId;

      let value = this.searchText.trim();
      this.filterObj = {
        Keywords: value
      }
      this.dataSource.Items = [];

      this.loadMessages(this.data);
  }
  }

  loadDataQuickRepply() {
    this.quickReplyService.setDataActive();
    this.quickReplyService.getDataActive().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        if (res) {
          let getArr = JSON.parse(localStorage.getItem('arrOBJQuickReply') || '{}');
          this.quickReplies = res?.sort((a: TDSSafeAny, b: TDSSafeAny) => {
              if (getArr != null) {
                return (getArr[b.Id] || { TotalView: 0 }).TotalView - (getArr[a.Id] || { TotalView: 0 }).TotalView;
              } else
              return
          });
        }
      },
      error: (error: any) => {
          this.message.error(error?.error.message || 'Load trả lời nhanh thất bại');
      }
    });
  }

  onChangeMessage(event: TDSSafeAny) {
    let text = event.value.trim();
    let exist = event && event.keyupEvent && event.keyupEvent.code == 'Slash' && text == '/';

    if(exist){
        setTimeout(() => {
          if(this.viewChildQuickRepply)
            this.viewChildQuickRepply.nativeElement.focus();
          }, 100);
    } else if(text.charAt(0) != '/'){
        setTimeout(() => {
          if(this.viewChildInputMessage)
            this.viewChildInputMessage.nativeElement.click();
            this.viewChildInputMessage.nativeElement.focus();
          }, 100);
    }

    event.keyupEvent.preventDefault();
    event.keyupEvent.stopImmediatePropagation();
  }

  setTextquickReply(item: QuickReplyDTO) {
    let getArr = JSON.parse(localStorage.getItem('arrOBJQuickReply') || '{}');
    if (getArr === null) {
      this.objQuickReply[item.Id] = {
        TotalView: 1,
        LastViewDate: new Date(),
      };
      localStorage.setItem('arrOBJQuickReply', JSON.stringify(this.objQuickReply));
    } else {
      let findIndex = getArr[item.Id];
      if (findIndex === undefined) {
        getArr[item.Id] = {
          TotalView: 1,
          LastViewDate: new Date()
        };
      } else {
        findIndex.TotalView = findIndex.TotalView + 1;
        findIndex.LastViewDate = new Date();
      }

      localStorage.setItem('arrOBJQuickReply', JSON.stringify(getArr));
    }

    this.onQuickReplySelected(item);
    setTimeout(() => {
      if(this.viewChildInputMessage)
        this.viewChildInputMessage.nativeElement.click();
        this.viewChildInputMessage.nativeElement.focus();
      }, 100);
  }

  onSelectionChange(event: any) {
    if(event && event.value) {
      setTimeout(() => {
        let text = ReplaceHelper.quickReply(event.value, this.partner);
        this.messageModel = text;

        this.messageSendingToServer();
        this.cdRef.detectChanges();
      }, 100);
    }
  }

  ngOnDestroy(): void {
    this.destroyTimer();
  }

}
