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
import { TDSHelperObject, TDSHelperString, TDSMessageService, TDSModalService, TDSResizeObserver } from 'tmt-tang-ui';
import { ActiveMatchingItem } from '../../dto/conversation-all/conversation-all.dto';
import { CRMTeamDTO } from '../../dto/team/team.dto';
import { CRMTeamService } from '../../services/crm-team.service';
import { ActivityDataFacade } from '../../services/facades/activity-data.facade';
import { finalize, takeUntil } from 'rxjs/operators';
import { MakeActivityItem, MakeActivityItemWebHook, MakeActivityMessagesDTO } from '../../dto/conversation/make-activity.dto';
import { ApplicationUserService } from '../../services/application-user.service';
import { ActivityMatchingService } from '../../services/conversation/activity-matching.service';
import { Router } from '@angular/router';

@Component({
  selector: 'tds-conversations',
  templateUrl: './tds-conversations.component.html',
  styleUrls: ['./tds-conversations.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class TDSConversationsComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {

  @ViewChild('MainChat') mainChat!:ElementRef;
  @ViewChild('chatHeader') headerChat!:ElementRef;
  @ViewChild('chatFooter') footerChat!:ElementRef;
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
  messageModel: any = {};
  uploadedImages: any[] = [];
  isSending: boolean = false;
  currentImage: any;
  mainChatHeight:number = 0;

  constructor(private modalService: TDSModalService,
    private crmTeamService: CRMTeamService,
    private message: TDSMessageService,
    private activityMatchingService: ActivityMatchingService,
    private applicationUserService: ApplicationUserService,
    private activityDataFacade: ActivityDataFacade,
    private conversationDataFacade: ConversationDataFacade,
    private router: Router,
    private resizeObserver: TDSResizeObserver,
    private viewContainerRef: ViewContainerRef) {
  }

  ngOnInit() {
    if(this.data?.id && this.team && TDSHelperString.hasValueString(this.type)){
        this.loadMessages(this.data);
    }
    this.loadUser();
  }

  ngAfterViewInit(): void {
    this.resizeObserver.observe(this.mainChat).subscribe(() => {
        let parentHeight = this.mainChat.nativeElement.closest('.main-conversation').clientHeight;
        let headerHeight = this.headerChat.nativeElement.clientHeight;
        let footerHeight = this.footerChat.nativeElement.clientHeight;
        //set height động cho #MainChat
        this.mainChatHeight = parentHeight - headerHeight - footerHeight;
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

  onClickDropdown(e: MouseEvent) {
    e.stopPropagation();
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

  onEnter(event: any): void {
    if(TDSHelperString.hasValueString(this.messageModel)) {
      let activityFinal = this.activityDataFacade.getMessageNearest(this.team.Facebook_PageId, this.data.psid, this.type ? this.type : 'all') as any;
      // Nếu hoạt động cuối là loại bình luận
      if (activityFinal && activityFinal.type == 2 && this.type == "comment") {
        this.replyComment(activityFinal);
      } else
      if (activityFinal && activityFinal.type == 2 && this.type == "all") {
        // this.sendPrivateReplies(activityFinal);
      } else {
        if (this.uploadedImages.length == 0) {
          // this.sendMessage();
        }
        else if (this.uploadedImages.length > 0) {
          // this.sendImages();
        }
      }
      event.preventDefault();
    }
  }

  assignUser(){

  }

  replyComment(data: any) {
    this.isSending = true;
    let modelComment = {
      from: {
        id: this.team.Facebook_PageId,
        name: this.team.Name,
      },
      post_id: data.comment ? (data.comment.object ? data.comment.object.id : null) : null,
      parent_id: data.comment ? data.comment.id : null,
      message: this.messageModel,
      to_id: data.from_id || data.comment ? (data.comment.from ? data.comment.from.id : "") : "",
      to_name: data.comment ? (data.comment.from ? data.comment.from.name : "") : "",
    }

    this.activityMatchingService.replyComment(this.team.Id, modelComment)
      .pipe(takeUntil(this.destroy$))
      .pipe(finalize(() => {this.isSending = false }))
      .subscribe((res: any) => {
        this.message.success('Trả lời bình luận thành công.');
        this.activityDataFacade.messageReplyCommentServer({ ...res, ...modelComment });
        this.conversationDataFacade.messageServer(res);
        this.isSending = false;
        // this.doneLoadMessage.emit(res);
        this.messageModel= null;
        this.currentImage = null;
        this.uploadedImages = [];
    }, error => {
      this.message.error("Trả lời bình luận thất bại.");
    });
  }

  onPaste(event: any) {

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
