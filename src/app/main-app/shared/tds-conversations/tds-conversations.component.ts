import { ReplaceHelper } from './../helper/replace.helper';
import { QuickReplyDTO } from './../../dto/quick-reply.dto.ts/quick-reply.dto';
import { PartnerService } from 'src/app/main-app/services/partner.service';
import { TDSSafeAny } from 'tmt-tang-ui';
import { ConfigConversationTagsCreateDataModalComponent } from './../../pages/configs/components/config-conversation-tags-create-data-modal/config-conversation-tags-create-data-modal.component';
import { ModalListBillComponent } from './../../pages/conversations/components/modal-list-bill/modal-list-bill.component';
import { ModalListProductComponent } from './../../pages/conversations/components/modal-list-product/modal-list-product.component';
import { ModalImageStoreComponent } from './../../pages/conversations/components/modal-image-store/modal-image-store.component';
import { ConversationDataFacade } from 'src/app/main-app/services/facades/conversation-data.facade';
import {
  Component, EventEmitter, Input, OnChanges, OnInit, Output,
  SimpleChanges, TemplateRef, ViewContainerRef, OnDestroy, ChangeDetectorRef, HostListener, AfterViewInit, ViewChild, ElementRef, ChangeDetectionStrategy, ViewRef, AfterViewChecked, NgZone
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { TDSHelperArray, TDSHelperObject, TDSHelperString, TDSMessageService, TDSModalService, TDSUploadChangeParam } from 'tmt-tang-ui';
import { ConversationMatchingItem } from '../../dto/conversation-all/conversation-all.dto';
import { CRMTeamDTO } from '../../dto/team/team.dto';
import { ActivityDataFacade } from '../../services/facades/activity-data.facade';
import { finalize, takeUntil } from 'rxjs/operators';
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
import { ActivityFacebookState } from '../../services/facebook-state/activity-facebook.state';

@Component({
  selector: 'shared-tds-conversations',
  templateUrl: './tds-conversations.component.html',
  styleUrls: ['./tds-conversations.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class TDSConversationsComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {

  @ViewChild(YiAutoScrollDirective) yiAutoScroll!: YiAutoScrollDirective;
  @ViewChild('scrollToIndex') scrollToIndex!: ElementRef<any>;

  @Input() tdsHeader?: string | TemplateRef<void>;
  @Input() data!: ConversationMatchingItem;
  @Input() type!: string;
  @Input() team!: CRMTeamDTO;
  @Output() onLoadMiniChat = new EventEmitter();

  destroy$ = new Subject();
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
  lockYOffset: number = 40;
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
    private cdRef : ChangeDetectorRef,
    private ngZone: NgZone,
    private activityFbState: ActivityFacebookState,
    private conversationOrderFacade: ConversationOrderFacade,
    private viewContainerRef: ViewContainerRef,
    private partnerService: PartnerService,) {
  }

  ngOnInit() {
    this.validateData();
    if (this.data && this.team && TDSHelperString.hasValueString(this.type)) {
      let data  = {...this.data};
      this.loadData(data);

      if(this.yiAutoScroll) {
        this.yiAutoScroll.forceScrollDown();
      }
    }
    this.activityDataFacade.hasNextData$.subscribe(data => {
      this.isNextData = data;
      this.cdRef.detectChanges();
    })
    this.partnerService.onLoadOrderFromTabPartner.pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.partner = res;
    });
  }

  ngAfterViewInit(){
    if(this.yiAutoScroll) {
      this.yiAutoScroll.forceScrollDown();
    }
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
    if(this.isLoadMessage || this.isNextData) {
      return;
    }

    this.isLoadMessage = true;
    this.dataSource$ = this.activityDataFacade.makeActivity(this.team?.Facebook_PageId, data.psid, this.type)
      .pipe(takeUntil(this.destroy$))
      .pipe(finalize(() => {
        setTimeout(() => {
          this.isLoadMessage = false;
          this.conversationDataFacade.changeCurrentCvs$.emit(false);
          this.cdRef.detectChanges();
        }, 350)
    }))
  }

  loadUser() {
    this.applicationUserService.dataActive$.pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
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
      .pipe(takeUntil(this.destroy$))
      .subscribe((x: any) => {
        switch (this.type) {
          case "message":
            this.sharedService.updateMinusConversationMessage(this.data.count_unread_messages);
            this.sharedService.updateMinusConversationAll(this.data.count_unread_messages);
            break;
          case "comment":
            this.sharedService.updateMinusConversationComment(this.data.count_unread_comments);
            this.sharedService.updateMinusConversationPost(this.data.count_unread_comments);
            this.sharedService.updateMinusConversationAll(this.data.count_unread_comments);
            break;
          default:
            this.sharedService.updateMinusConversationMessage(this.data.count_unread_messages);
            this.sharedService.updateMinusConversationComment(this.data.count_unread_comments);
            this.sharedService.updateMinusConversationPost(this.data.count_unread_comments);
            this.sharedService.updateMinusConversationAll(this.data.count_unread_activities);
            break;
        }

        // Cập nhật count_unread
        this.conversationEventFacade.updateMarkSeenBadge(this.data.page_id, this.type, this.data.psid);
      }, error => {
        this.message.error(`markseen: ${error?.error?.message}`);
      });
  }

  showImageStore(): void {
    this.modalService.create({
        title: 'Kho hình ảnh',
        content: ModalImageStoreComponent,
        centered: true,
        size: "xl",
        viewContainerRef: this.viewContainerRef
    });
  }

  showModalListProduct() {
    const modal = this.modalService.create({
      title: 'Danh sách sản phẩm',
      content: ModalListProductComponent,
      viewContainerRef: this.viewContainerRef,
      size: 'xl',
      componentParams: {
        useListPrice: true,
        isSelectProduct: true
      }
    });

    modal.componentInstance?.selectProduct.subscribe((res: DataPouchDBDTO) =>{
      if(TDSHelperObject.hasValue(res)) {
        this.conversationOrderFacade.onAddProductOrder.emit(res);
      }
    });
  }

  showModalListBill() {
    this.modalService.create({
      title: 'Phiếu bán hàng',
      content: ModalListBillComponent,
      viewContainerRef: this.viewContainerRef,
      size: 'xl',
      componentParams: {}
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
    this.messageModel = `${this.messageModel}${event?.emoji?.native}`;
  }

  validateData() {
    delete this.messageModel;
    this.tags = [];
    (this.dataSource$ as any) = null;
    this.isNextData = false;
  }

  loadPrevMessages(): any {
    if (this.isNextData || this.isLoadMessage) {
      return;
    }

    this.scrollToIndex?.nativeElement?.scrollTo(0, 1);

    let pageId = this.team?.Facebook_PageId;
    let psid = this.data.psid;
    let type = this.type ? this.type : 'all';

    this.activityDataFacade.nextData(pageId, psid, type);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["data"] && !changes["data"].firstChange) {
      (this.data as any) = {};
      this.validateData();

      this.data = {...changes["data"].currentValue};
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

  getExtrasChildren(data: any, item: any): any {
    return (data?.extras?.children[item?.id] as any) || [];
  }

  getExtrasPosts(data: any, item: MakeActivityItemWebHook): any {
    return (data?.extras?.posts[item?.object_id] as any) || [];
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
    if(this.isLoadingSendMess) {
      this.eventHandler.preventDefault();
      return;
    }

    if(this.isEnterSend){
      this.messageSendingToServer();
    } else {
      this.message.info('Thay đổi tuỳ chọn gửi tin nhắn để Enter');
      this.eventHandler.preventDefault();
    }
  }

  messageSendingToServer(): any {
    let message = this.messageModel as string;
    if (!TDSHelperArray.hasListValue(this.uploadedImages) && !TDSHelperString.hasValueString(message)) {
      this.eventHandler.preventDefault();
      return this.message.error('Hãy nhập nội dung cần gửi');
    }
    if(this.isLoadingSendMess){
      this.eventHandler.preventDefault();
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
        this.message.error("Like thất bại");
      });
  }

  sendMessage(message: string) {
    const model = this.prepareModel(message);
    this.crmMatchingService.addMessage(this.data.psid, model)
      .pipe(takeUntil(this.destroy$)).pipe(finalize( () => { this.isLoadingSendMess = false; }))
      .subscribe((res: any) => {
          this.messageResponse(res, model);
      }, error => {
          this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Trả lời bình luận thất bại' );
          this.eventHandler.preventDefault();
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

        this.message.success('Gửi tin thành công');
        let countImageAdd = 0;
        if (TDSHelperArray.hasListValue(res)) {
          res.forEach((x: any) => {
            x["status"] = ActivityStatus.sending;

            if (!x.message_formatted) {
              x["message"] = this.activityDataFacade.createDataAttachments(this.uploadedImages[countImageAdd]);
              countImageAdd += 1;
            }
            this.activityDataFacade.messageServer({ ...x });
          });
        }
        let items = res.pop();
        this.conversationDataFacade.messageServer(items);

        this.currentImage = null;
        this.uploadedImages = [];
        delete this.messageModel;

        this.eventHandler.preventDefault();
        this.cdRef.detectChanges();

      }, error => {
        this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Gửi tin nhắn thất bại');
        this.eventHandler.preventDefault();
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

        this.message.success("Trả lời bình luận thành công");
        this.activityDataFacade.messageReplyCommentServer({ ...res, ...model });
        this.conversationDataFacade.messageServer({ ...res });

        this.currentImage = null;
        this.uploadedImages = [];
        delete this.messageModel;

        this.cdRef.detectChanges();
        this.eventHandler.preventDefault();
      }, error => {
        this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : "Trả lời bình luận thất bại");
        this.cdRef.detectChanges();
        this.eventHandler.preventDefault();
      });
  }

  messageResponse(res: any, model: SendMessageModelDTO) {
    if (TDSHelperArray.hasListValue(res)) {
      res.map((x: any, i: number) => {

        x["status"] = ActivityStatus.sending;
        this.activityDataFacade.messageServer({ ...x });

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

    this.eventHandler.preventDefault();
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
      .subscribe(res => {
        this.data.assigned_to = res;
        this.message.success("Thao tác thành công");
        this.cdRef.detectChanges();
      },
      err=>{
        this.message.error("Thao tác thất bại");
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
    let tags = { ...this.data.keyTags };
    if (tags[item.Id]) {
      this.removeIndexDbTag(item);
    } else {
      this.assignIndexDbTag(item);
    }
  }

  onRemoteTag(item: any) {
    item.Id = item.id
    this.removeIndexDbTag(item);
  }

  assignIndexDbTag(item: any) {
    this.assignTagOnView(item);
    this.activityMatchingService.assignTagToConversation(this.data.id, item.Id, this.team.Facebook_PageId)
      .subscribe(() => {
        this.crmTagService.addTagLocalStorage(item.Id);
      }, error => {
        this.removeTagOnView(item);
      });
  }

  removeIndexDbTag(item: any): void {
    this.removeTagOnView(item);

    this.activityMatchingService.removeTagFromConversation(this.data.id, item.Id, this.team.Facebook_PageId)
      .subscribe(() => {
      }, error => {
        this.assignTagOnView(item);
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
    if (type === 'all' && item.object_id) {
      //TODO xử lý tiếp
    }
  }

  refreshRead() {
    delete this.messageModel;
    this.uploadedImages = [];
    this.loadMessages(this.data);
  }

  ngOnDestroy(): void {
    this.destroyTimer();
    this.destroy$.next();
    this.destroy$.complete();
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
      .pipe(finalize(()=>{
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
        let message = JSON.parse(error.Message);
        this.message.error(`${message.message}`);
        this.cdRef.markForCheck();
      });
  }

  onLoadImage(ev: TDSSafeAny) {
    let data:string[] = [];
    if (TDSHelperObject.hasValue(ev) && TDSHelperArray.hasListValue(ev.files)) {
      ev.files.forEach((e: TDSSafeAny) => {
        data.push(e.url)
      });
    }
    this.uploadedImages = [...data]
  }

  closeImages(){
    this.uploadedImages = [];
  }

  changeEnterSend(ev: any){
    if(ev){
      this.isEnterSend = ev.checked;
    }
  }

  onQuickReplySelected(event:QuickReplyDTO){
    let text = event.BodyPlain || event.BodyHtml;
    text = ReplaceHelper.quickReply(text, this.partner);
    this.messageModel = text;
  }

  @HostListener('window:dragover', ['$event']) onDragOver(evt: TDSSafeAny) {
    this.displayDropZone = true;
    evt.preventDefault();
  }

  @HostListener("window:dragleave", ["$event"])
  onDragLeave(evt: any) {
    if (evt.fromElement) {
      this.displayDropZone = true;
    } else {
      this.displayDropZone = false;
    }
    evt.preventDefault();
  }

  @HostListener('window:drop', ['$event'])
  ondrop(evt:any) {
    this.displayDropZone = false;
    evt.preventDefault();
  }

  trackByIndex(_: number, data: any): number {
    return data.psid;
  }

}
