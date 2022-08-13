import { FacebookCommentService } from './../../../../../services/facebook-comment.service';
import { Component, OnDestroy, OnInit, ViewChild, ChangeDetectorRef, Input, HostBinding, ChangeDetectionStrategy, ViewContainerRef, NgZone, OnChanges, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivityStatus } from 'src/app/lib/enum/message/coversation-message';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { ActivityMatchingService } from 'src/app/main-app/services/conversation/activity-matching.service';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { ConversationPostFacade } from 'src/app/main-app/services/facades/conversation-post.facade';
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
import { ChatomniObjectsItemDto, MDB_Facebook_Mapping_PostDto } from '@app/dto/conversation-all/chatomni/chatomni-objects.dto';
import { ChatomniDataDto, ChatomniDataItemDto, ChatomniFacebookDataDto } from '@app/dto/conversation-all/chatomni/chatomni-data.dto';
import { TDSDestroyService } from 'tds-ui/core/services';
import { ChangeTabConversationEnum } from '@app/dto/conversation-all/chatomni/change-tab.dto';

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

  dataSource$!: Observable<ChatomniDataDto>;
  dataSource!: ChatomniDataDto;

  childs: any = {} // dictionary return ChatomniDataItemDto[]

  enumActivityStatus = ActivityStatus;
  partners$!: Observable<any>;
  messageModel!: string;
  isLoading: boolean = false;
  isHiddenComment: any = {};

  constructor(private message: TDSMessageService,
    private cdRef: ChangeDetectorRef,
    private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef,
    private crmMatchingService: CRMMatchingService,
    private activityMatchingService: ActivityMatchingService,
    private conversationPostFacade: ConversationPostFacade,
    private chatomniCommentService: ChatomniCommentService,
    public crmService: CRMTeamService,
    private ngZone: NgZone,
    private destroy$: TDSDestroyService,
    private conversationOrderFacade: ConversationOrderFacade) {
  }

  ngOnInit() {
    if(this.data) {
      this.loadData();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["data"] && !changes["data"].firstChange) {
      (this.dataSource$ as any) = null;
      (this.dataSource as any) = null;

      this.data = {...changes["data"].currentValue};
      this.loadData();
    }
  }

  loadData() {
    this.isLoading = true;
      this.dataSource$ = this.chatomniCommentService.makeDataSource(this.team.Id, this.data.ObjectId);

      if(this.dataSource$) {
        this.dataSource$.pipe(takeUntil(this.destroy$)).subscribe((res: ChatomniDataDto) => {
            this.dataSource = {...res};

            this.isLoading = false;
            this.cdRef.markForCheck();
        }, error => {
            this.isLoading = false;
            this.message.error(`${error?.error?.message}` || 'Đã xảy ra lỗi');
            this.cdRef.markForCheck();
        })
      }
  }

  editOrder(id: any, item: any){
    this.conversationPostFacade.onCommentSelected$.emit(item);
  }

  isPrivateReply(item: ChatomniDataItemDto){
    item.Data.is_private_reply = !item.Data.is_private_reply;
  }

  isReply(item: ChatomniDataItemDto) {
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

  onQuickReplySelected(event: any) {
    let text = event.BodyPlain || event.BodyHtml || event.text;
    if(this.partners$){
      this.partners$.pipe(takeUntil(this.destroy$)).subscribe((partner: any) => {

          text = ReplaceHelper.quickReply(text, partner);
          this.message = text;

        }, (error)=>{
          this.message.error(`${error.error.message}` || 'Đã xảy ra lỗi');
        })
    } else{
        this.message.error('Không lấy được thông tin khách hàng');
    }
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
    if(TDSHelperString.hasValueString(msg)) {
        const model = this.prepareModel(item, msg);

        // TODO: gửi về tin nhắn
        if(item.Data.is_private_reply){

            model.comment_id = item.Id;
            this.crmMatchingService.addQuickReplyComment(model).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {

                  this.message.success('Gửi tin thành công');
                  if(TDSHelperArray.hasListValue(res)){
                      res.forEach((x: any) => {
                          x["status"] = ActivityStatus.sending;
                      });
                  }
              }, error => {
                this.message.error(`${error.error?.message}` || 'Gửi tin nhắn thất bại');
            })

      } else {
          // TODO: Trả lời bình luận
          model.parent_id = item.Id;
          model.fbid = item.UserId;

          this.activityMatchingService.replyComment(this.team!.Id, model)
            .pipe(takeUntil(this.destroy$)).subscribe((res: any) => {

              this.message.success("Trả lời bình luận thành công.");
              this.addReplyComment(item, model);

          }, error => {
            this.message.error(`${error.error?.message}` || "Trả lời bình luận thất bại.");
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
    model.post_id = item.Data.object?.id;
    model.message = message;
    model.created_time = (new Date()).toISOString();

    return model;
  }

  addReplyComment(item: ChatomniDataItemDto, model: SendMessageModelDTO) {
  }

  loadPartnerTab(item: ChatomniDataItemDto) {
    let psid = item.UserId || item.Data?.from?.id;
    if (!psid) {
        this.message.error("Không truy vấn được thông tin người dùng!");
        return;
    }

    // TODO: Đẩy dữ liệu sang conversation-partner để hiển thị thông tin khách hàng
    this.conversationOrderFacade.loadPartnerByPostComment$.emit(item);
    this.conversationOrderFacade.onChangeTab$.emit(ChangeTabConversationEnum.partner);
  }

  onCreateOrder(item: ChatomniDataItemDto) {
    let psid = item.UserId || item.Data?.from?.id;
    if (!psid) {
        this.message.error("Không truy vấn được thông tin người dùng!");
        return;
    }

    // TODO: Dùng ngZone đợi cập nhật dữ liệu từ conversation-partner sang conversation-order
    this.ngZone.run(() => {
        // TODO: Đẩy dữ liệu sang conversation-partner để hiển thị thông tin khách hàng
        this.conversationOrderFacade.loadPartnerByPostComment$.emit(item);

        this.conversationOrderFacade.loadCreateOrderByPostComment$.emit(item);
        this.conversationOrderFacade.onChangeTab$.emit(ChangeTabConversationEnum.order);
    })
  }

  nextData(event: any) {
    if(event) {
      this.isLoading = true;
      let id = `${this.team.Id}_${this.data.ObjectId}`;

      this.dataSource$ = this.chatomniCommentService.nextDataSource(id);
      this.dataSource$?.pipe(takeUntil(this.destroy$)).subscribe((res: ChatomniDataDto) => {

          if(TDSHelperArray.hasListValue(res?.Items)) {
              this.dataSource.Items = [...res.Items];
          }

          this.yiAutoScroll.scrollToElement('scrollCommentAll', 750);
          this.isLoading = false;
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
