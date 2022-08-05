import { TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSMessageService } from 'tds-ui/message';
import { CommonService } from './../../../../services/common.service';
import { Component, OnChanges, OnDestroy, OnInit, Optional, Host, SkipSelf, ViewChild, ElementRef, Input, SimpleChanges, ChangeDetectorRef, HostBinding } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { ConversationPostFacade } from 'src/app/main-app/services/facades/conversation-post.facade';
import { CommentByPost } from 'src/app/main-app/dto/conversation/post/comment-post.dto';
import { FacebookCommentService } from 'src/app/main-app/services/facebook-comment.service';
import { ItemPostCommentComponent } from '../../conversation-post/item-post-comment.component';
import { TDSHelperArray, TDSHelperObject } from 'tds-ui/shared/utility';
import { PartnerStatusDTO } from 'src/app/main-app/dto/partner/partner.dto';
import { eventFadeStateTrigger } from 'src/app/main-app/shared/helper/event-animations.helper';
import { YiAutoScrollDirective } from 'src/app/main-app/shared/directives/yi-auto-scroll.directive';
import { ChildChatOmniChannelDto } from 'src/app/main-app/dto/team/chatomni-channel.dto';

@Component({
  selector: 'post-comment-filter',
  templateUrl: './post-comment-filter.component.html',
  animations: [eventFadeStateTrigger]
})

export class PostCommentFilterComponent implements OnInit, OnDestroy, OnChanges {

  @Input() currentFilterComment: TDSSafeAny;
  @Input() textSearchFilterComment: string = '';

  @HostBinding("@eventFadeState") eventAnimation = true;
  @ViewChild(YiAutoScrollDirective) yiAutoScroll!: YiAutoScrollDirective;

  team!: CRMTeamDTO | null;
  data: any = { Items: []};
  childs: any = {};
  commentOrders: any = [];
  currentGroup: any;
  otherSelecteds: any = [];
  partners$!: Observable<any>;

  destroy$ = new Subject<void>();
  messageModel!: string;
  lstPartnerStatus!: Array<PartnerStatusDTO>;

  filterOptions: any[] = [
    { value: "All", text: "Từ khóa" },
    { value: "Number", text: "Tìm theo số" },
    { value: "Phone", text: "Tìm số điện thoại" }
  ];

  isLoading: boolean = false;

  constructor(private facebookCommentService: FacebookCommentService,
    private conversationPostFacade: ConversationPostFacade,
    private commonService: CommonService,
    private message: TDSMessageService,
    private cdRef : ChangeDetectorRef,
    @Host() @Optional() @SkipSelf() public itemPostCommentCmp: ItemPostCommentComponent) {
  }

  initialize(){
    if(TDSHelperObject.hasValue(this.itemPostCommentCmp?.data)) {
      this.data = {...this.itemPostCommentCmp.data};
      this.commentOrders = {...this.itemPostCommentCmp.commentOrders};
      this.team = {...this.itemPostCommentCmp.team} as CRMTeamDTO | null;;
      this.childs = {...this.itemPostCommentCmp.childs};
      this.partners$ = this.itemPostCommentCmp.partners$;
    }
  }

  ngOnInit() {
    this.initialize();
  }

  editOrder(id: any, item: CommentByPost){
    this.conversationPostFacade.onCommentSelected$.emit(item);
  }

  onGroupComment(item: any){
    this.otherSelecteds = [];
    if ( this.currentGroup?.id === item.id) {
        this.currentGroup = null;
    } else {
        this.currentGroup = item;
    }
  }

  addGroupMessage(child: any) {
    child.isSelected = !child.isSelected;
    if(child.isSelected){
      this.otherSelecteds.push(child);
    } else {
      if(TDSHelperArray.hasListValue(this.otherSelecteds)){
        let index = this.otherSelecteds.findIndex((x: any) => x.id == child.id);
        if (index >= 0) {
            this.otherSelecteds.splice(index, 1);
        }
      }
    }
    // TODO: xử lý ghi chú đơn hàng
    if (child.from_id) {
      // if (this.orderForm) {
      //     let order = this.orderForm.value;

      //     if (order.Facebook_ASUserId == item.from_id) {
      //         order.Note = ""
      //         this.otherSelecteds.map(x => {
      //             if (order.Note) {
      //                 order.Note = order.Note + "\r\n" + x.message;
      //             } else {
      //                 order.Note = x.message;
      //             }
      //         });
      //     }
      //     this.orderForm.get("Note").setValue(order.Note);
      // }
    }
  }

  onChangeFilter(item: any){
    this.itemPostCommentCmp.isLoading = true;
    this.data = null;

    this.currentFilterComment = item;
    this.facebookCommentService.queryObj3.q = this.textSearchFilterComment;
    this.facebookCommentService.queryObj3.Type = this.currentFilterComment.value;

    let fbid = this.itemPostCommentCmp?.post?.fbid;
    this.facebookCommentService.getFilterCommentsByPostId(fbid)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        if(TDSHelperArray.hasListValue(res.Items)) {
          res.Items.map((x: any) => {
            let first = x.activities[0];
            x.message = first.message;
            x.created_time = first.created_time;
          });
        }
        this.data = {...res};

        this.itemPostCommentCmp.isLoading = false;
        this.cdRef.detectChanges();
      })
  }
  loadPartnerStatus() {
    this.commonService.getPartnerStatus().subscribe(res => {
      this.lstPartnerStatus = [...res];
    },err=>{
      this.message.error(err.error? err.error.message: 'Tải trạng thái khách hàng lỗi');
    });
  }

  getStatusColor(statusText: string | undefined) {
    if(TDSHelperArray.hasListValue(this.lstPartnerStatus)) {
      let value = this.lstPartnerStatus.find(x => x.text == statusText);
      if(value) return value.value;
      else return '';
    }
    else return '';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes["currentFilterComment"] && !changes["currentFilterComment"].firstChange){
      this.onChangeFilter(this.currentFilterComment);
    }
    if(changes["textSearchFilterComment"] && !changes["textSearchFilterComment"].firstChange){
      this.onChangeFilter(this.currentFilterComment);
    }
  }

  nextData(event: any) {
    if(this.isLoading) {
      return;
    }

    if(this.data && this.data.HasNextPage && TDSHelperString.hasValueString(this.data.NextPage)) {
      let postId = this.itemPostCommentCmp.post.fbid;
      this.isLoading = true;

      this.facebookCommentService.getCommentsByQuery(this.data.NextPage, postId)
        .pipe(takeUntil(this.destroy$)).subscribe((res: any)=> {

          res.Items = [...this.data.Items, ...res.Items];
          this.data = res;

          this.isLoading = false;
          this.cdRef.detectChanges();
      }, error => {
          this.isLoading = false;
          this.message.error(`${error.error?.message}`)
      });
    }
  }

  trackByIndex(i: any) {
    return i;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
