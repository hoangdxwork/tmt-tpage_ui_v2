import { ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ModalAddQuickReplyComponent } from './../../pages/conversations/components/modal-add-quick-reply/modal-add-quick-reply.component';
import { ConfigConversationTagsCreateDataModalComponent } from './../../pages/configs/components/config-conversation-tags-create-data-modal/config-conversation-tags-create-data-modal.component';
import { ModalListBillComponent } from './../../pages/conversations/components/modal-list-bill/modal-list-bill.component';
import { ModalListProductComponent } from './../../pages/conversations/components/modal-list-product/modal-list-product.component';
import { ModalImageStoreComponent } from './../../pages/conversations/components/modal-image-store/modal-image-store.component';
import { ConversationDataFacade } from 'src/app/main-app/services/facades/conversation-data.facade';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Optional, Output, Self,
  SimpleChanges, TemplateRef, ViewContainerRef, Host, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { TDSHelperArray, TDSHelperObject, TDSHelperString, TDSMessageService, TDSModalService, TDSResizeObserver } from 'tmt-tang-ui';
import { ActiveMatchingItem } from '../../dto/conversation-all/conversation-all.dto';
import { CRMTeamDTO } from '../../dto/team/team.dto';
import { CRMTeamService } from '../../services/crm-team.service';
import { ActivityDataFacade } from '../../services/facades/activity-data.facade';
import { finalize, takeUntil } from 'rxjs/operators';
import { MakeActivityItem, MakeActivityItemWebHook, MakeActivityMessagesDTO } from '../../dto/conversation/make-activity.dto';
import { ApplicationUserService } from '../../services/application-user.service';
import { ActivityMatchingService } from '../../services/conversation/activity-matching.service';
import { Router } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { CRMMatchingService } from '../../services/crm-matching.service';
import { ConversationEventFacade } from '../../services/facades/conversation-event.facade';
import { ActivityStatus } from 'src/app/lib/enum/message/coversation-message';
import { SignalRConnectionService } from '../../services/signalR/signalR-connection.service';
import { SendMessageModelDTO } from '../../dto/conversation/send-message.dto';

@Component({
  selector: 'tds-conversations',
  templateUrl: './tds-conversations.component.html',
  styleUrls: ['./tds-conversations.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class TDSConversationsComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {

  @ViewChild('MainChat') mainChat!:ElementRef;
  @Input() tdsHeader?: string | TemplateRef<void>;
  @Input() data!: ActiveMatchingItem;
  @Input() type!: string;
  @Input() team!: CRMTeamDTO;
  @Output() onLoadMiniChat = new EventEmitter();

  destroy$ = new Subject();
  isLoadMessage: boolean = false;
  inputValue?: string;
  dataSource$!: Observable<MakeActivityMessagesDTO>;
  partner: any;
  lstUser!: any[];
  isVisibleReply: boolean = false;
  uploadedImages: any[] = [];
  currentImage: any;
  mainChatHeight:number = 0;
  headerHeight:number = 88;
  replyHeight:number = 196;
  commentForReply: any;
  markSeenTimer: any;
  messages: any[] = [];
  messageModel: any = null;

  constructor(private modalService: TDSModalService,
    private crmTeamService: CRMTeamService,
    private message: TDSMessageService,
    private activityMatchingService: ActivityMatchingService,
    private applicationUserService: ApplicationUserService,
    private activityDataFacade: ActivityDataFacade,
    private conversationDataFacade: ConversationDataFacade,
    private sharedService: SharedService,
    private crmMatchingService: CRMMatchingService,
    private conversationEventFacade: ConversationEventFacade,
    private sgRConnectionService: SignalRConnectionService,
    private router: Router,
    private resizeObserver: TDSResizeObserver,
    private viewContainerRef: ViewContainerRef) {
  }

  ngOnInit() {
    if(this.data?.id && this.team && TDSHelperString.hasValueString(this.type)){
        this.loadMessages(this.data);
    }
    this.loadUser();
    this.initiateTimer();
  }

  ngAfterViewInit(): void {
    this.resizeObserver.observe(this.mainChat).subscribe(() => {
        let parent = this.mainChat.nativeElement.closest('.main-conversation');
        this.mainChatHeight = parent.clientHeight - this.headerHeight - this.replyHeight;
    });
  }

  //TODO: data.id = data.psid
  loadMessages(data: ActiveMatchingItem): any {
    this.isLoadMessage = true;
    this.dataSource$ = this.activityDataFacade.makeActivity(this.team?.Facebook_PageId, data.psid, this.type)
      .pipe(takeUntil(this.destroy$))
      .pipe(finalize(() => {this.isLoadMessage = false }));

    // this.activityDataFacade.refreshData(this.team.Facebook_PageId, data.psid, this.type)
    //   .pipe(takeUntil(this.destroy$)).pipe(finalize(() => {this.isLoadMessage = false }))
    //   .subscribe(() => {
    //       this.dataSource$ = this.activityDataFacade.makeActivity(this.team.Facebook_PageId, data.psid, this.type);
    //   }, error => {
    //     this.message.error('Load message đã xảy ra lỗi!');
    //   })
  }

  loadUser() {
    this.applicationUserService.dataActive$.pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
          this.lstUser = res;
      }, error => {
        this.message.error('Load user đã xảy ra lỗi');
      });
  }

  initiateTimer(){
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
         console.log(error);
      });
  }

  showImageStore(): void {
    const modal = this.modalService.create({
      title: 'Kho hình ảnh',
      content: ModalImageStoreComponent,
      centered: true,
      size: "xl",
      viewContainerRef: this.viewContainerRef,
    });
    modal.afterClose.subscribe(result => {
      if (TDSHelperObject.hasValue(result)) {
      }
    });
  }

  showModalAddQuickReply(){
    const modal = this.modalService.create({
      title: 'Thêm mới trả lời nhanh',
      content: ModalAddQuickReplyComponent,
      viewContainerRef: this.viewContainerRef,
      size: 'md',
      componentParams: {

      }
    });
    modal.afterOpen.subscribe(() => {

    });
    // Return a result when closed
    modal.afterClose.subscribe(result => {
      if (TDSHelperObject.hasValue(result)) {
      }
    });
  }

  showModalListProduct(){
    const modal = this.modalService.create({
      title: 'Danh sách sản phẩm',
      content: ModalListProductComponent,
      viewContainerRef: this.viewContainerRef,
      size: 'xl',
      componentParams: {

      }
    });
    modal.afterOpen.subscribe(() => {

    });
    // Return a result when closed
    modal.afterClose.subscribe(result => {
      if (TDSHelperObject.hasValue(result)) {
      }
    });
  }

  showModalListBill(){
    const modal = this.modalService.create({
      title: 'Phiếu bán hàng',
      content: ModalListBillComponent,
      viewContainerRef: this.viewContainerRef,
      size: 'xl',
      componentParams: {

      }
    });
    modal.afterOpen.subscribe(() => {

    });
    // Return a result when closed
    modal.afterClose.subscribe(result => {
      if (TDSHelperObject.hasValue(result)) {
      }
    });
  }

  showModalAddTag(){
    const modal = this.modalService.create({
      title: 'Thêm thẻ hội thoại',
      content: ConfigConversationTagsCreateDataModalComponent,
      viewContainerRef: this.viewContainerRef,
    });

    modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe(result => {
      if(TDSHelperObject.hasValue(result)){

      }
    });
  }

  loadEmojiMart(event: any) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes["data"] && !changes["data"].firstChange) {
        this.data = changes["data"].currentValue;
        this.loadMessages(this.data);
    }
  }

  getExtrasChildren(data: any, item: any): any {
      return (data?.extras?.children[item?.id] as any) || [];
  }

  getExtrasPosts(data: any, item: MakeActivityItemWebHook): any  {
      return (data?.extras?.posts[item?.object_id] as any) || [];
  }

  onClickSender(){
    this.messageSendingToServer();
  }

  messageSendingToServer(){
    let message = this.messageModel;
    if(TDSHelperString.hasValueString(message)) {
      let activityFinal = this.activityDataFacade.getMessageNearest(this.team.Facebook_PageId, this.data.psid, this.type ? this.type : 'all') as any;

      if(TDSHelperObject.hasValue(activityFinal) && activityFinal.type === 2) {
        if(this.type === 'all'){
            this.sendPrivateReplies(activityFinal, message);
        } else if(this.type === 'comment') {
            this.replyComment(activityFinal, message);
        }
      } else {
          this.sendMessage(message);
      }
    } else {
      this.message.error('Hãy nhập nội dung cần gửi');
    }
  }

  onEnter(event: any) {
    this.messageSendingToServer();
    event.preventDefault();
  }

  sendMessage(message: string) {
    const model = this.prepareModel(message);
    this.crmMatchingService.addMessage(this.data.psid, model)
      .pipe(takeUntil(this.destroy$))
      .pipe(finalize(() => {  }))
      .subscribe((res: any) => {

        if(TDSHelperArray.hasListValue(res)) {
            res.map((x: any, i: number) => {
                x["status"] = ActivityStatus.sending;
                this.activityDataFacade.messageServer({...x});

                if(TDSHelperArray.hasListValue(this.uploadedImages)){
                    x["message"] = this.activityDataFacade.createDataAttachments(this.uploadedImages[i]);
                }
            });
        }

        let items = res.pop();
        this.conversationDataFacade.messageServer(items);

        if(TDSHelperArray.hasListValue(this.uploadedImages) && TDSHelperArray.hasListValue(model?.attachments?.data)){
          items["message_formatted"] = items["message_formatted"] || `Đã gửi ${model.attachments.data.length} ảnh.`;
        }

        // TODO: Gửi tín hiệu phản hồi
        this.onSendSucceed(res);

        this.currentImage = null;
        this.messageModel = null;
        this.uploadedImages = [];

      }, error => {
        this.message.error("Trả lời bình luận thất bại.");
        console.log(error);
    });
  }

  sendPrivateReplies(activityFinal: any, message: string) {
    const model = this.prepareModel(message);
    model.to = {
      id: activityFinal?.from_id || activityFinal?.comment?.from?.id ||  null,
      name: activityFinal?.comment?.from?.name || null,
    };
    model.comment_id = activityFinal?.comment?.id || activityFinal?.id || null;

    this.crmMatchingService.addQuickReplyComment(model)
      .pipe(takeUntil(this.destroy$))
      .pipe(finalize(() => {  }))
      .subscribe((res: any) => {

        this.message.success('Gửi tin thành công');
        let countImageAdd = 0;
        if(TDSHelperArray.hasListValue(res)){
          res.forEach((x: any) => {
              x["status"] = ActivityStatus.sending;

              if(!x.message_formatted) {
                x["message"] = this.activityDataFacade.createDataAttachments(this.uploadedImages[countImageAdd]);
                countImageAdd += 1;
              }
              this.activityDataFacade.messageServer({...x});
          });
        }
        let items = res.pop();
        this.conversationDataFacade.messageServer(items);

        this.currentImage = null;
        this.uploadedImages = [];
        this.messageModel = null;
    }, error => {
      this.message.error('Gửi tin nhắn thất bại');
      console.log(error);
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
      .pipe(finalize(() => {  }))
      .subscribe((res: any) => {

        this.message.success("Trả lời bình luận thành công.");
        this.activityDataFacade.messageReplyCommentServer({ ...res, ...model });
        this.conversationDataFacade.messageServer({...res});

        this.currentImage = null;
        this.uploadedImages = [];
        this.messageModel = null;
    }, error => {
      this.message.error(`${error?.error?.message}` || "Trả lời bình luận thất bại.");
      console.log(error);
    });
  }

  prepareModel(message: string): any {
    const model = {} as SendMessageModelDTO;
    model.from = {
      id: this.team.Facebook_PageId,
      name: this.team.Facebook_PageName
    }
    model.to_id = this.data.psid;
    model.to_name = this.data.name;
    model.message = message;
    model.created_time = new Date();

    if(TDSHelperArray.hasListValue(this.uploadedImages) && this.type != 'comment'){
      this.uploadedImages.map((x) => {
        (model.attachments?.data as any).push({
            image_data: {
              url: x
            }
        });
      });
    }
    return model;
  }

  assignUser(){
  }

  onSendSucceed(data: any) {
    let dataToBroadcast = {
      user: this.sharedService.userLogged,
      conversation: this.data
    };
    this.sgRConnectionService.sendMessage('onSentConversation', dataToBroadcast);
  }

  openPost(item: any, type :any) {
    if(type === 'post' && item.object_i){
      this.router.navigateByUrl(`/conversation/post?teamId=${this.team.Id}&type=post&post_id=${item.object_id}`);
    }
    if(type === 'all' && item.object_id) {
       //TODO xử lý tiếp
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
