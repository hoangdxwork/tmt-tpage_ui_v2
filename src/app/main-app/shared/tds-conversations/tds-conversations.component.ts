import { ReplaceHelper } from './../helper/replace.helper';
import { QuickReplyDTO } from './../../dto/quick-reply.dto.ts/quick-reply.dto';
import { PartnerService } from 'src/app/main-app/services/partner.service';
import { ConfigConversationTagsCreateDataModalComponent } from './../../pages/configs/components/config-conversation-tags-create-data-modal/config-conversation-tags-create-data-modal.component';
import { ModalListBillComponent } from './../../pages/conversations/components/modal-list-bill/modal-list-bill.component';
import { ModalListProductComponent } from './../../pages/conversations/components/modal-list-product/modal-list-product.component';
import { ModalImageStoreComponent } from './../../pages/conversations/components/modal-image-store/modal-image-store.component';
import { ConversationDataFacade } from 'src/app/main-app/services/facades/conversation-data.facade';
import {
  Component, Input, OnChanges, OnInit,
  SimpleChanges, TemplateRef, ViewContainerRef, OnDestroy, ChangeDetectorRef, HostListener, AfterViewInit, ViewChild, ElementRef, ChangeDetectionStrategy, AfterViewChecked, NgZone, HostBinding
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ConversationMatchingItem } from '../../dto/conversation-all/conversation-all.dto';
import { CRMTeamDTO } from '../../dto/team/team.dto';
import { ActivityDataFacade } from '../../services/facades/activity-data.facade';
import { finalize, takeUntil, tap } from 'rxjs/operators';
import { MakeActivityItemWebHook, MakeActivityMessagesDTO } from '../../dto/conversation/make-activity.dto';
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
import { ConversationOrderFacade } from '../../services/facades/conversation-order.facade';
import { YiAutoScrollDirective } from '../directives/yi-auto-scroll.directive';
import { eventFadeStateTrigger } from '../helper/event-animations.helper';
import { TDSHelperArray, TDSHelperObject, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSModalService } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { TDSUploadChangeParam } from 'tds-ui/upload';
import { ProductPagefbComponent } from '../../pages/conversations/components/product-pagefb/product-pagefb.component';
import { ModalPostComponent } from '../../pages/conversations/components/modal-post/modal-post.component';

@Component({
  selector: 'shared-tds-conversations',
  templateUrl: './tds-conversations.component.html',
  styleUrls: ['./tds-conversations.component.sass'],
  animations: [eventFadeStateTrigger],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TDSConversationsComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {

  @ViewChild(YiAutoScrollDirective) yiAutoScroll!: YiAutoScrollDirective;
  @ViewChild('scrollToIndex') scrollToIndex!: ElementRef<any>;
  @HostBinding("@eventFadeState") eventAnimation = true;

  @Input() tdsHeader?: string | TemplateRef<void>;
  @Input() data!: ConversationMatchingItem;
  @Input() type!: string;
  @Input() team!: CRMTeamDTO;

  destroy$ = new Subject<void>();
  isLoadMessage: boolean = false;
  dataSource$!: Observable<MakeActivityMessagesDTO>;
  partner: TDSSafeAny;

  isEnterSend: boolean = true;
  uploadedImages: string[] = [];
  currentImage: TDSSafeAny;
  isLoadingImage: boolean = false
  displayDropZone: boolean = false;
  markSeenTimer: TDSSafeAny;
  messageModel: string | undefined;
  postPictureError: any[] = [];
  isLoadingSendMess: boolean = false;

  lstUser!: TDSSafeAny[];
  users: TDSSafeAny[] = [];
  keyFilterUser: string = '';

  lstOfTag: TDSSafeAny[] = [];
  tags: TDSSafeAny[] = [];
  keyFilterTag: string = '';
  isVisbleTag: boolean = false;
  isNextData: boolean = false;
  eventHandler!: Event;

  constructor(private modalService: TDSModalService,
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
    private partnerService: PartnerService) {
  }

  ngOnInit() {
    this.validateData();
    if (this.data && this.team && TDSHelperString.hasValueString(this.type)) {
      this.loadData(this.data);
    }

    this.partnerService.onLoadOrderFromTabPartner$.pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.partner = res;
    });

    this.spinLoading();
  }

  spinLoading() {
    this.activityDataFacade.hasNextData$.pipe(takeUntil(this.destroy$)).subscribe((obs: any) => {
      if(obs == false) {
        this.isNextData = obs;
      }
    })
  }

  loadData(data: ConversationMatchingItem) {
    this.loadTags(data);
    this.initiateTimer();
    this.loadUser();

    // TODO: Nội dung tin nhắn
    this.loadMessages(data);
  }

  //TODO: data.id = data.psid
  loadMessages(data: ConversationMatchingItem): any {
    this.isLoadMessage = true;

    // Sử dụng ngZone chạy bất đồng bộ
    this.ngZone.run(() => {
      this.dataSource$ = this.activityDataFacade.makeActivity(this.team?.Facebook_PageId, data.psid, this.type);

      this.dataSource$.pipe(takeUntil(this.destroy$), finalize(() => {
          setTimeout(() => {
            this.isLoadMessage = false;
          }, 300);

          this.conversationDataFacade.onLoadTdsConversation$.emit(false);
          this.cdRef.markForCheck();
        })).subscribe(() => {}, error => {
          this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Đã xảy ra lỗi');
      });
    })

    this.yiAutoScroll?.forceScrollDown();
  }

  loadUser() {
    this.applicationUserService.dataActive$.pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.users = res;
      this.lstUser = res;
    }, error => {
      this.message.error('Load user đã xảy ra lỗi');
    });
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
    let userLoggedId = this.sharedService.userLogged?.Id || null;
    this.crmMatchingService.markSeen(this.team.Facebook_PageId, this.data.psid, this.type, userLoggedId)
      .pipe(takeUntil(this.destroy$)).subscribe((x: any) => {
          // Cập nhật count_unread
          this.conversationEventFacade.updateMarkSeenBadge(this.data.page_id, this.type, this.data.psid);
          this.cdRef.markForCheck();
      }, error => {
          this.message.error(`markseen: ${error?.error?.message}`);
      });
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
      let data = this.uploadedImages;
      result.forEach((x: string)=>{
        data.push(x);
      })
      this.uploadedImages = [...data];
      this.cdRef.markForCheck();
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

    modal.afterClose.subscribe((res: any) => {
      this.onProductSelected(res);
    })
  }

  onProductSelected(event: any) {
    let that= this;
    let model = {
      page_id: this.team.Facebook_PageId,
      to_id: this.data.psid,

      product: {
        Id: event.Id,
        Name: event.Name,
        Picture: event.Picture,
        Price: event.Price,
      }
    };

    this.activityMatchingService.addTemplateMessage(this.data.psid, model)
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

  showModalListBill(data:ConversationMatchingItem) {
    this.modalService.create({
      title: 'Phiếu bán hàng',
      content: ModalListBillComponent,
      viewContainerRef: this.viewContainerRef,
      size: 'xl',
      componentParams: {
        page_id: data.page_id,
        psid: data.psid,
      }
    });
  }

  showModalAddTag() {
    this.isVisbleTag = false
    this.modalService.create({
      title: 'Thêm thẻ hội thoại',
      content: ConfigConversationTagsCreateDataModalComponent,
      viewContainerRef: this.viewContainerRef,
    });
  }

  callbackTag(ev: boolean) {
    this.isVisbleTag = ev
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
    (this.dataSource$ as any) = null;
    this.isNextData = false;
    this.isLoadMessage = false;
    this.uploadedImages = [];
    this.tags = [];
  }

  loadPrevMessages(): any {
    if (this.isNextData || this.isLoadMessage) {
      return;
    }

    this.scrollToIndex?.nativeElement?.scrollTo(0, 1);
    this.isNextData = true;

    let pageId = this.team?.Facebook_PageId;
    let psid = this.data.psid;
    let type = this.type ? this.type : 'all';

    this.activityDataFacade.nextData(pageId, psid, type);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["data"] && !changes["data"].firstChange) {
      (this.data as any) = {};
      this.validateData();

      this.data = changes["data"].currentValue;
      let object = {
        psid: this.data.psid,
        messages: this.messageModel,
        images: this.uploadedImages
      }

      this.draftMessageService.onUpdateDraftMessage$.emit(object);
      let draftMessage = this.draftMessageService.getMessageByASIds(this.data.psid);
      this.messageModel = draftMessage?.message;

      if ((draftMessage.images as any[]).length > 0) {
        this.uploadedImages = draftMessage.images;
        this.currentImage = draftMessage.images[draftMessage.images.length - 1];
      } else {
        delete this.currentImage;
        this.uploadedImages = [];
      }
      // TODO: Refetch data
      if (!this.data.name && this.data.psid && this.data.psid != "null") {
        this.refetch(changes["data"].currentValue.psid);
      }
      this.loadData(this.data);
    }
  }

  loadTags(data: ConversationMatchingItem) {
    if (data && data.keyTags) {
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
        if (this.data && this.data.keyTags) {
          if ((this.data.keyTags as any)[a.Id] && !(this.data.keyTags as any)[b.Id]) {
            return -1;
          }
        }
        if ((local[a.Id].point > local[b.Id].point) && !(this.data.keyTags as any)[b.Id]) {
          return -1;
        }
        return 0;
      });
    }
  }

  refetch(psid: string) {
    this.crmMatchingService.refetch(psid, this.team.Facebook_PageId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        if (res?.conversation?.psid == this.data.id) {
          if (res.conversation?.name) {
            this.data.name = res.conversation.name;
          }
          if (res.conversation?.from) {
            this.data.from = res.conversation.from;
          }
        }
      }, error => {
        this.message.error(`${error?.Error?.Message}` ? `${error?.Error?.Message}` : 'Refetch đã xảy ra lỗi');
      });
  }

  errorPostPicture(item: MakeActivityItemWebHook) {
    this.postPictureError.push(item?.object_id);
  }

  checkPostPictureError(item: MakeActivityItemWebHook) {
    return this.postPictureError.find(f => f == item?.object_id);
  }

  onClickSender() {
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
    let activityFinal = this.activityDataFacade.getMessageNearest(this.team.Facebook_PageId, this.data.psid, this.type ? this.type : 'all') as any;

    if (TDSHelperObject.hasValue(activityFinal) && activityFinal.type === 2) {
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

    this.crmMatchingService.addMessage(this.data.psid, model)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.messageResponse(res, model);
      }, error => {
        this.message.error(`${error.error.message}`? `${error.error.message}` : "Like thất bại");
      });
  }

  sendMessage(message: string) {
    const model = this.prepareModel(message);
    this.crmMatchingService.addMessage(this.data.psid, model)
      .pipe(takeUntil(this.destroy$))
      .pipe(finalize(() => { this.isLoadingSendMess = false }))
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
      .pipe(takeUntil(this.destroy$))
      .pipe(finalize(() => { this.isLoadingSendMess = false }))
      .subscribe((res: any) => {

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
      .pipe(takeUntil(this.destroy$))
      .pipe(finalize(() => { this.isLoadingSendMess = false; }))
      .subscribe((res: any) => {

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

  prepareModel(message: string): any {
    const model = {} as SendMessageModelDTO;
    model.from = {
      id: this.team.Facebook_PageId,
      name: this.team.Facebook_PageName
    }
    model.to = {
      id: this.data.psid,
      name: this.data.name
    };
    model.to_id = this.data.psid;
    model.to_name = this.data.name;

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
    this.activityMatchingService.assignUserToConversation(this.data.id, item.Id, this.team.Facebook_PageId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.data.assigned_to = res;
      },
        err => {
          this.message.error("Thao tác thất bại");
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
    let tags = { ...this.data.keyTags };
    if (tags[item.Id]) {
      this.removeIndexDbTag(item);
    } else {
      this.assignIndexDbTag(item);
    }
  }

  onRemoveTag(item: any) {
    item.Id = item.id
    this.removeIndexDbTag(item);
  }

  assignIndexDbTag(item: any) {
    this.assignTagOnView(item);
    this.activityMatchingService.assignTagToConversation(this.data.id, item.Id, this.team.Facebook_PageId)
      .pipe(takeUntil(this.destroy$)).subscribe(() => {
          this.crmTagService.addTagLocalStorage(item.Id);
      }, error => {
        this.removeTagOnView(item);
      });
  }

  removeIndexDbTag(item: any): void {
    this.activityMatchingService.removeTagFromConversation(this.data.id, item.Id, this.team.Facebook_PageId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.removeTagOnView(item);
      });
  }

  assignTagOnView(tag: any) {
    this.data.tags = this.data.tags || [];
    (this.data.tags as any[]).push({
      id: tag.Id,
      name: tag.Name,
      color_class: tag.ColorClassName
    });
    this.data.keyTags[tag.Id] = true;
  }

  removeTagOnView(tag: any) {
    this.data.tags = this.data.tags || [];
    this.data.tags = this.data.tags.filter(x => x.id != tag.Id);
    delete this.data.keyTags[tag.Id];
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

  openModalPost() {
    this.modalService.create({
      title: 'Bài viết tổng quan',
      content: ModalPostComponent,
      size: "xl",
      viewContainerRef: this.viewContainerRef,
    });
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

  ngAfterViewInit() {
    this.yiAutoScroll?.forceScrollDown();
  }

  ngOnDestroy(): void {
    this.destroyTimer();
    this.destroy$.next();
    this.destroy$.complete();
  }

}
