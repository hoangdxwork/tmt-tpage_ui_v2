import { ReplaceHelper } from '../helper/replace.helper';
import { QuickReplyDTO } from '../../dto/quick-reply.dto.ts/quick-reply.dto';
import { PartnerService } from 'src/app/main-app/services/partner.service';
import { ConfigConversationTagsCreateDataModalComponent } from '../../pages/configs/components/config-conversation-tags-create-data-modal/config-conversation-tags-create-data-modal.component';
import { ModalListBillComponent } from '../../pages/conversations/components/modal-list-bill/modal-list-bill.component';
import { ModalListProductComponent } from '../../pages/conversations/components/modal-list-product/modal-list-product.component';
import { ModalImageStoreComponent } from '../../pages/conversations/components/modal-image-store/modal-image-store.component';
import { ConversationDataFacade } from 'src/app/main-app/services/facades/conversation-data.facade';
import {
  Component, Input, OnChanges, OnInit,
  SimpleChanges, TemplateRef, ViewContainerRef, OnDestroy, ChangeDetectorRef, HostListener, AfterViewInit, ViewChild, ElementRef, ChangeDetectionStrategy, AfterViewChecked, NgZone, HostBinding
} from '@angular/core';

import { Observable, Subject, throttleTime } from 'rxjs';
import { StateChatbot } from '../../dto/conversation-all/conversation-all.dto';
import { CRMTeamDTO } from '../../dto/team/team.dto';
import { ActivityDataFacade } from '../../services/facades/activity-data.facade';
import { finalize, takeUntil, tap } from 'rxjs/operators';
import { ExtrasPostItem, MakeActivityItemWebHook, MakeActivityMessagesDTO } from '../../dto/conversation/make-activity.dto';
import { ApplicationUserService } from '../../services/application-user.service';
import { ActivityMatchingService } from '../../services/conversation/activity-matching.service';
import { Router } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { CRMMatchingService } from '../../services/crm-matching.service';
import { ConversationEventFacade } from '../../services/facades/conversation-event.facade';
import { ActivityStatus } from 'src/app/lib/enum/message/coversation-message';
import { SignalRConnectionService } from '../../services/signalR/signalR-connection.service';
import { SendMessageModelDTO } from '../../dto/conversation/send-message.dto';
import { DraftMessageService } from '../../services/conversation/draft-message.service';
import { CRMTagService } from '../../services/crm-tag.service';
import { Message } from 'src/app/lib/consts/message.const';
import { DataPouchDBDTO } from '../../dto/product-pouchDB/product-pouchDB.dto';
import { YiAutoScrollDirective } from '../directives/yi-auto-scroll.directive';
import { eventFadeStateTrigger } from '../helper/event-animations.helper';
import { TDSHelperArray, TDSHelperObject, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSModalService } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { TDSUploadChangeParam } from 'tds-ui/upload';
import { ProductPagefbComponent } from '../../pages/conversations/components/product-pagefb/product-pagefb.component';
import { ModalPostComponent } from '../../pages/conversations/components/modal-post/modal-post.component';
import { ChatomniMessageService } from '../../services/chatomni-service/chatomni-message.service';
import { ChatomniMessageDTO } from '../../dto/conversation-all/chatomni/chatomni-message.dto';
import { CrmMatchingV2Detail } from '../../dto/conversation-all/crm-matching-v2/crm-matching-v2.dot';
import { ChatomniMessageFacade } from '../../services/chatomni-facade/chatomni-message.facade';
import { ChatomniConversationItemDto } from '../../dto/conversation-all/chatomni/chatomni-conversation';
import { Facebook_Graph_Post } from '../../dto/conversation-all/chatomni/chatomni-facebook-post.dto';
import { TDSDestroyService } from 'tds-ui/core/services';

@Component({
  selector: 'shared-tds-conversations-v2',
  templateUrl: './tds-conversations-v2.component.html',
  styleUrls: ['./tds-conversations.component.sass'],
  animations: [eventFadeStateTrigger],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ TDSDestroyService ]
})

export class TDSConversationsV2Component implements OnInit, OnChanges, AfterViewInit, OnDestroy {

  @ViewChild(YiAutoScrollDirective) yiAutoScroll!: YiAutoScrollDirective;
  @ViewChild('scrollToIndex') scrollToIndex!: ElementRef<any>;
  @HostBinding("@eventFadeState") eventAnimation = true;

  @Input() tdsHeader?: string | TemplateRef<void>;
  @Input() data!: ChatomniConversationItemDto;
  @Input() type!: string;
  @Input() team!: CRMTeamDTO;
  @Input() miniChat!: boolean;
  @Input() state!: number | undefined;

  isLoading: boolean = false;
  isProcessing: boolean = false;

  dataSource$!: Observable<ChatomniMessageDTO>;
  dataSource!: ChatomniMessageDTO;

  partner: TDSSafeAny;

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
  eventHandler!: Event;
  userLoggedId!: string;

  isEnableChatbot: boolean = false;
  pageId!: string;

  constructor(private modalService: TDSModalService,
    private chatomniMessageService: ChatomniMessageService,
    private omniMessageFacade: ChatomniMessageFacade,
    private message: TDSMessageService,
    private activityMatchingService: ActivityMatchingService,
    private applicationUserService: ApplicationUserService,
    private activityDataFacade: ActivityDataFacade,
    private conversationDataFacade: ConversationDataFacade,
    private sharedService: SharedService,
    private draftMessageService: DraftMessageService,
    private crmMatchingService: CRMMatchingService,
    private crmTagService: CRMTagService,
    private conversationEventFacade: ConversationEventFacade,
    private sgRConnectionService: SignalRConnectionService,
    private router: Router,
    private ngZone: NgZone,
    private cdRef: ChangeDetectorRef,
    private viewContainerRef: ViewContainerRef,
    private partnerService: PartnerService,
    private destroy$: TDSDestroyService) {
      this.userLoggedId = this.sharedService.userLogged?.Id;
  }

  ngOnInit() {
    this.validateData();

    if (this.data && this.team && TDSHelperString.hasValueString(this.type)) {
        this.pageId = this.team.ChannelId;
        this.loadData(this.data);
    }

    this.partnerService.onLoadOrderFromTabPartner$.pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
        this.partner = res;
    });

    // TODO: has_admin_required nhận từ tds-conversation-item để gửi lại tn
    this.onRetryMessage();
  }

  loadData(data: ChatomniConversationItemDto) {
    this.loadTags(data);
    this.loadUser();

    // TODO: Nội dung tin nhắn
    this.loadMessages(data);
    this.initiateTimer();
  }

  //TODO: data.id = data.psid
  loadMessages(data: ChatomniConversationItemDto): any {
    this.isLoading = true;

    this.ngZone.run(() => {
        this.dataSource$ = this.chatomniMessageService.makeDataSource(this.team.Id, data.ConversationId, this.type);
    })

    this.dataSource$.pipe(takeUntil(this.destroy$)).subscribe((res: ChatomniMessageDTO) => {
        if(res) {
            this.dataSource = res;
        }

        this.isLoading = false;
        this.cdRef.detectChanges();

    }, error => {
        this.isLoading = false;
        this.message.error(`${error?.error?.message}` || 'Đã xảy ra lỗi')
    })

    this.yiAutoScroll?.forceScrollDown();
  }

  loadUser() {
    this.applicationUserService.dataActive$.pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
        this.users = res;
        this.lstUser = res;
    }, error => {
        this.message.error('Load user đã xảy ra lỗi');
    })
  }

  initiateTimer() {
    this.destroyTimer();
    this.markSeenTimer = setTimeout(() => {
      this.markSeen();
    }, 3 * 1000); // Ở lại ít nhất 3s mới gọi markSeen
  }

  destroyTimer() {
    if (this.markSeenTimer) {
      clearTimeout(this.markSeenTimer);
    }
  }

  private markSeen() {
    let assign_user_id = this.userLoggedId;

    if(assign_user_id) {
      this.crmMatchingService.markSeen(this.pageId, this.data!.ConversationId, this.type, assign_user_id)
        .pipe(takeUntil(this.destroy$)).subscribe((x: any) => {
            // Cập nhật count_unread
            this.conversationEventFacade.updateMarkSeenBadge(this.pageId, this.type, this.data.ConversationId);
            this.cdRef.markForCheck();
        }, error => {
            this.message.error(`markseen: ${error?.error?.message}`);
      })
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

    modal.afterClose.subscribe((result : string[]) => {
        if(TDSHelperArray.hasListValue(result)){
          let data = this.uploadedImages;

          result.forEach((x: string)=>{
              data.push(x);
          })

          this.uploadedImages = [...data];
          this.cdRef.markForCheck();
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
        pageId: this.team.Facebook_PageId,
      }
    });

    modal.componentInstance?.onSendProduct.subscribe(res=>{
      if(res){
        this.onProductSelected(res);
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

    this.activityMatchingService.addTemplateMessage(this.data.ConversationId, model)
      .pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
        that.activityDataFacade.messageServer(res);
        that.conversationDataFacade.messageServer(res);

        that.message.success('Gửi thành công sản phẩm');
       }, error=> {
          this.message.error('Gửi sản phẩm thất bại');
          this.cdRef.markForCheck();
      })
  }

  onProductLastV2() {
    const modal = this.modalService.create({
      title: 'Danh sách sản phẩm',
      content: ModalListProductComponent,
      viewContainerRef: this.viewContainerRef,
      size: 'xl'
    });

    modal.afterClose.subscribe((res: DataPouchDBDTO) => {
      if (TDSHelperObject.hasValue(res)) {
        // this.conversationOrderFacade.onAddProductOrder.emit(res);
      }
    });
  }

  showModalListBill(data: ChatomniConversationItemDto) {
    this.modalService.create({
      title: 'Phiếu bán hàng',
      content: ModalListBillComponent,
      viewContainerRef: this.viewContainerRef,
      size: 'xl',
      componentParams: {
        page_id: this.pageId,
        psid: data.ConversationId,
      }
    });
  }

  showModalAddTag() {
    this.isVisbleTag = false
    let modal = this.modalService.create({
      title: 'Thêm thẻ hội thoại',
      content: ConfigConversationTagsCreateDataModalComponent,
      viewContainerRef: this.viewContainerRef,
    });
    modal.afterClose.subscribe(result=>{
      if(result){
        this.lstOfTag = [...this.lstOfTag, result];
        this.tags = [...this.tags, result];
      }
    })
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
    delete this.messageModel;

    this.isLoading = false;
    this.isProcessing = false;
    this.uploadedImages = [];
    this.tags = [];
  }

  nextData() {
    if (this.isLoading || this.isProcessing) {
      return;
    }

    this.scrollToIndex?.nativeElement?.scrollTo(0, 1);

    this.isProcessing = true;
    let id = `${this.team.Id}_${this.data.ConversationId}`;

    this.ngZone.run(() => {
        this.dataSource$ = this.chatomniMessageService.nextDataSource(id);
    })

    this.dataSource$.pipe(takeUntil(this.destroy$)).subscribe((res: ChatomniMessageDTO) => {
        if(res) {
            this.dataSource.Extras = res.Extras;

            this.dataSource.Items = [...res.Items];
            this.dataSource.Paging = {...res.Paging};
        }

        this.isProcessing = false;
        this.cdRef.detectChanges();

    }, error => {
        this.isProcessing = false;
        this.message.error(`${error?.error?.message}` || 'Đã xảy ra lỗi')
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["data"] && !changes["data"].firstChange) {
      (this.data as any) = {};

      this.data = changes["data"].currentValue;
      let object = {
          psid: this.data.ConversationId,
          messages: this.messageModel,
          images: this.uploadedImages
      }

      this.draftMessageService.onUpdateDraftMessage$.emit(object);
      let draftMessage = this.draftMessageService.getMessageByASIds(this.data.ConversationId);
      this.messageModel = draftMessage?.message;

      if ((draftMessage.images as any[]).length > 0) {
          this.uploadedImages = draftMessage.images;
          this.currentImage = draftMessage.images[draftMessage.images.length - 1];
      } else {
          delete this.currentImage;
          this.uploadedImages = [];
      }

      // TODO: Refetch data
      if (!this.data.Name && this.data.ConversationId && this.data.ConversationId != "null") {
          this.refetch(changes["data"].currentValue.ConversationId);
      }

      this.loadData(this.data);
    }

    if(changes["state"] && !changes["state"].firstChange) {
        this.state = changes["state"].currentValue;
        this.data.State = this.state;
    }
  }

  loadTags(data: ChatomniConversationItemDto) {
    if (data && data.Tags) {
      if (!TDSHelperArray.hasListValue(this.tags)) {
        this.crmTagService.dataActive$.subscribe((res: any) => {
          this.tags = res;
          this.lstOfTag = this.tags;

          this.sortTagsByParent();
          this.searchTag();
        })
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

  refetch(psid: string) {
    this.crmMatchingService.refetch(psid, this.pageId)
      .pipe(takeUntil(this.destroy$)).subscribe((res: any) => {

        if (res?.conversation?.psid == this.data.Id) {
            if (res.conversation?.name) {
                this.data.Name = res.conversation.name;
            }
            if (res.conversation?.from) {
              // this.data.from = res.conversation.from;
            }
        }

      }, error => {
          this.message.error(`${error?.Error?.Message}` ? `${error?.Error?.Message}` : 'Refetch đã xảy ra lỗi');
      });
  }

  onClickSender(event: TDSSafeAny) {
    this.eventHandler = event;
    this.messageSendingToServer();
  }

  onEnter(event: any) {
    this.eventHandler = event;
    if (this.isLoadingSendMess) {
      this.eventHandler.preventDefault();
      this.eventHandler.stopImmediatePropagation();
      return;
    }
    if (this.isEnterSend) {
      this.messageSendingToServer();
    } else {
      return
    }
  }

  messageSendingToServer(): any {
    let message = this.messageModel as string;

    if (!TDSHelperArray.hasListValue(this.uploadedImages) && !TDSHelperString.hasValueString(message)) {
      this.eventHandler.preventDefault();
      this.eventHandler.stopImmediatePropagation();
      return this.message.error('Hãy nhập nội dung cần gửi');
    }

    if (this.isLoadingSendMess) {
      this.eventHandler.preventDefault();
      this.eventHandler.stopImmediatePropagation();
      return;
    }

    this.isLoadingSendMess = true;
    let activityFinal = this.activityDataFacade.getMessageNearest(this.pageId, this.data.ConversationId, this.type ? this.type : 'all') as any;

    if (TDSHelperObject.hasValue(activityFinal) && activityFinal.type === 12) {
      if (this.type === 'all') {
            this.sendPrivateReplies(activityFinal, message);
        } else if (this.type === 'comment') {
            this.replyComment(activityFinal, message);
        }
    } else {
      this.sendMessage(message);
    }
  }

  sendIconLike() {
    const message = "(y)";
    let model = this.prepareModel(message);
    model.attachment = {
      data: []
    }

    this.crmMatchingService.addMessage(this.data.ConversationId, model)
      .pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
            this.messageResponse(res, model);
      }, error => {
          this.message.error(`${error.error.message}`? `${error.error.message}` : "Like thất bại");
      });
  }

  sendMessage(message: string) {
    const model = this.prepareModel(message);
    this.crmMatchingService.addMessage(this.data.ConversationId, model).pipe(takeUntil(this.destroy$), finalize(() => { this.isLoadingSendMess = false }))
      .subscribe((res: any) => {
          this.messageResponse(res, model);
      }, error => {
          this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Trả lời bình luận thất bại');
      });
  }

  sendPrivateReplies(activityFinal: any, message: string) {
    const model = this.prepareModel(message);
    model.to = {
      id: activityFinal?.from_id || activityFinal?.comment?.from?.id || null,
      name: activityFinal?.comment?.from?.name || null
    };

    model.comment_id = activityFinal?.comment?.id || activityFinal?.id || null;

    this.crmMatchingService.addQuickReplyComment(model)
      .pipe(takeUntil(this.destroy$), finalize(() => { this.isLoadingSendMess = false })).subscribe((res: any) => {

        let countImageAdd = 0;
        if (TDSHelperArray.hasListValue(res)) {
          res.forEach((x: any) => {
            x["status"] = ActivityStatus.sending;

            if (!x.message_formatted) {
              x["message"] = this.activityDataFacade.createDataAttachments(this.uploadedImages[countImageAdd]);
              countImageAdd += 1;
            }
            this.activityDataFacade.messageServer(x);
          });
        }
        let items = res.pop();
        this.conversationDataFacade.messageServer(items);

        this.currentImage = null;
        this.uploadedImages = [];
        delete this.messageModel;

        this.eventHandler.preventDefault();
        this.eventHandler.stopImmediatePropagation();
        this.cdRef.detectChanges();

      }, error => {
        this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Gửi tin nhắn thất bại');
        this.eventHandler.preventDefault();
        this.eventHandler.stopImmediatePropagation();
        this.cdRef.detectChanges();
      })
  }

  replyComment(activityFinal: any, message: string) {
    const model = this.prepareModel(message);

    model.post_id = activityFinal?.comment?.object?.id || null;
    model.parent_id = activityFinal?.comment?.id || null;
    model.to_id = activityFinal.from_id || activityFinal?.comment?.from?.id || null;
    model.to_name = activityFinal?.comment?.from?.name || null;

    this.activityMatchingService.replyComment(this.team?.Id, model)
      .pipe(takeUntil(this.destroy$), finalize(() => { this.isLoadingSendMess = false; })).subscribe((res: any) => {

        this.activityDataFacade.messageReplyCommentServer({ ...res, ...model });
        this.conversationDataFacade.messageServer(res);

        this.currentImage = null;
        this.uploadedImages = [];
        delete this.messageModel;

        if(this.eventHandler){
          this.eventHandler.preventDefault();
          this.eventHandler.stopImmediatePropagation();
        }
        this.cdRef.detectChanges();

      }, error => {
        this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : "Trả lời bình luận thất bại");
        if(this.eventHandler){
          this.eventHandler.preventDefault();
          this.eventHandler.stopImmediatePropagation();
        }
        this.cdRef.detectChanges();
      });
  }

  messageResponse(res: any, model: SendMessageModelDTO) {
    if (TDSHelperArray.hasListValue(res)) {
      res.map((x: any, i: number) => {
        x["status"] = ActivityStatus.sending;

        this.activityDataFacade.messageServer(x);

        if (TDSHelperArray.hasListValue(this.uploadedImages)) {
          x["message"] = this.activityDataFacade.createDataAttachments(this.uploadedImages[i]);
        }
      });
    }

    let items = res.pop();
    this.conversationDataFacade.messageServer(items);

    if (TDSHelperArray.hasListValue(this.uploadedImages) && TDSHelperArray.hasListValue(model?.attachments?.data)) {
      items["message_formatted"] = items["message_formatted"] || `Đã gửi ${model?.attachments?.data.length} ảnh.`;
    }

    // TODO: Gửi tín hiệu phản hồi
    this.onSendSucceed(res);

    this.currentImage = null;
    delete this.messageModel;
    this.uploadedImages = [];

    if(this.eventHandler){
      this.eventHandler.preventDefault();
      this.eventHandler.stopImmediatePropagation();
    }

    this.yiAutoScroll?.forceScrollDown();
    this.cdRef.detectChanges();
  }

  onRetryMessage() {
    this.activityMatchingService.onCopyMessageHasAminRequired$.subscribe((message: string) => {
      if(TDSHelperString.hasValueString(message)) {
        if (TDSHelperString.hasValueString(this.messageModel)) {
            this.messageModel = `${this.messageModel}${message}`;
        } else {
            this.messageModel = `${message}`;
        }
      }
    })
  }

  prepareModel(message: string): any {
    const model = {} as SendMessageModelDTO;
    model.from = {
      id: this.team.ChannelId,
      name: this.team.Facebook_PageName
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
    this.activityMatchingService.assignUserToConversation(this.data.Id, item.Id, this.team.Facebook_PageId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.data.AssignedTo = res;
        this.message.success('Thao tác thành công');
        this.isLoadingSelectUser = false;

        this.cdRef.detectChanges();
      },
      err => {
        this.message.error(err.error? err.error.message: "Thao tác thất bại");
        this.isLoadingSelectUser = false;

        this.cdRef.detectChanges();
      });
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
    let tags = { ...this.data.Tags };
    if (tags[item.Id]) {
      this.removeIndexDbTag(item);
    } else {
      this.assignIndexDbTag(item);
    }
  }

  onRemoveTag(item: any) {
    this.removeIndexDbTag(item);
  }

  assignIndexDbTag(item: any) {
    this.assignTagOnView(item);
    this.activityMatchingService.assignTagToConversation(this.data.ConversationId, item.Id, this.team.ChannelId)
      .pipe(takeUntil(this.destroy$)).subscribe(() => {
          this.crmTagService.addTagLocalStorage(item.Id);
      }, error => {
        this.removeTagOnView(item);
      });
  }

  removeIndexDbTag(item: any): void {
    this.activityMatchingService.removeTagFromConversation(this.data.ConversationId, item.Id, this.team.ChannelId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.removeTagOnView(item);
      },err=>{
        this.message.error(err.error? err.error.message : 'Đã có lỗi xảy ra');
      });
  }

  assignTagOnView(tag: any) {
    this.data.Tags = this.data.Tags || [];
    (this.data.Tags as any[]).push({
      id: tag.Id,
      name: tag.Name,
      color_class: tag.ColorClassName
    });
  }

  removeTagOnView(tag: any) {
    this.data.Tags = this.data.Tags || [];
    this.data.Tags = this.data.Tags.filter(x => x.Id != tag.Id);
    delete this.data.Tags[tag.Id];
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

  onSendSucceed(data: any) {
    let dataToBroadcast = {
      user: this.sharedService.userLogged,
      conversation: this.data
    };
    this.sgRConnectionService.sendMessage('onSentConversation', dataToBroadcast);
  }

  openPost(item: any, type: any) {
    if (type === 'post' && item.object_id) {
      this.router.navigateByUrl(`/conversation/post?teamId=${this.team.Id}&type=post&post_id=${item.object_id}`);
    }
  }


  refreshRead() {
    this.validateData();
    this.loadMessages(this.data);
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
      .pipe(takeUntil(this.destroy$))
      .pipe(finalize(() => {
        this.displayDropZone = false;
        this.isLoadingImage = false;
      }))
      .subscribe((res: any) => {
        if (Message.Upload.Success) {
          let x = res[0].urlImageProxy as string;
          this.currentImage = x;
          const dataItem = [...this.uploadedImages, x];
          this.uploadedImages = dataItem;

          this.cdRef.markForCheck();
        }
      }, error => {
        this.message.error(error.Message ? error.Message : 'Upload xảy ra lỗi');
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

  @HostListener('window:dragover', ['$event']) onDragOver(evt: TDSSafeAny) {
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
      let pageId = this.team.Facebook_PageId;
      let psid = this.data.ConversationId;

      this.crmMatchingService.transferChatbot(pageId, psid).pipe(takeUntil(this.destroy$)).subscribe((data) => {

          this.message.success('Bật chatbot thành công')
          this.isEnableChatbot = true;
          this.data.State = StateChatbot.Normal;

          // TODO: bật chatbot thành công 5s rồi tắt
          setTimeout(() =>{
              this.isEnableChatbot = false;
          }, 5 * 1000)

          this.cdRef.detectChanges();

        }, error => {
            this.message.error(error?.error?.message || 'Đã xảy ra lỗi');
            this.cdRef.detectChanges();
        })
    }
  }

  // adminTransferChatbot() {
  //   let data: OnChatBotSignalRModel = {
  //     action: 'transfer',
  //     companyId: 1,
  //     data: {
  //       name: this.data.partner_name,
  //       pageId: this.data.page_id,
  //       psid: this.data.psid
  //     },
  //     enableAlert: true,
  //     enablePopup: false,
  //     error: false,
  //     message: `Admin chuyển hội thoại cho Chatbot`,
  //     type: TypeOnChatBot.AdminTransferChatBot
  //   }

  //   this.sgRConnectionService._onChatbotEvent$.emit(data);
  // }

  // chatbotTransferAdmin() {
  //   let data: OnChatBotSignalRModel = {
  //     action: 'transfer',
  //     companyId: 1,
  //     data: {
  //       name: this.data.partner_name,
  //       pageId: this.data.page_id,
  //       psid: this.data.psid
  //     },
  //     enableAlert: true,
  //     enablePopup: false,
  //     error: false,
  //     message: `Chatbot chuyển hội thoại cho ${this.data.partner_name}`,
  //     type: TypeOnChatBot.ChatbotTranserAdmin
  //   }

  //   this.sgRConnectionService._onChatbotEvent$.emit(data);
  // }

  // newMessage(){
  //     let data = {
  //       data:{
  //         page_id: this.data.page_id,
  //         psid: this.data.psid,
  //         message:  'tin nhắn mới',
  //         last_activity: {
  //           type: 'all'
  //         },
  //         from: {
  //           id : this.data.psid
  //         }
  //       }
  //     }
  //     this.sgRConnectionService._onFacebookEvent$.emit(data);
  // }

  ngAfterViewInit() {
    this.yiAutoScroll?.forceScrollDown();
  }

  ngOnDestroy(): void {
    this.destroyTimer();
  }

}
