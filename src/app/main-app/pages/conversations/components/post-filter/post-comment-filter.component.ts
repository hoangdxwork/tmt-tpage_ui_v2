import { Component, OnChanges, OnDestroy, OnInit, Optional, Host, SkipSelf, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { fromEvent, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map, takeUntil } from 'rxjs/operators';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { ConversationPostFacade } from 'src/app/main-app/services/facades/conversation-post.facade';
import { TDSHelperArray, TDSHelperObject } from 'tmt-tang-ui';
import { CommentByPost } from 'src/app/main-app/dto/conversation/post/comment-post.dto';
import { FacebookCommentService } from 'src/app/main-app/services/facebook-comment.service';
import { ItemPostCommentComponent } from '../../conversation-post/components/item-post-comment/item-post-comment.component';

@Component({
  selector: 'post-comment-filter',
  templateUrl: './post-comment-filter.component.html',
})

export class PostCommentFilterComponent implements OnInit, OnDestroy, AfterViewInit {

  team!: CRMTeamDTO | null;
  data: any = { Items: []};
  childs: any = {};
  commentOrders: any = [];
  currentGroup: any;
  otherSelecteds: any = [];
  partners$!: Observable<any>;

  destroy$ = new Subject();
  messageModel!: string;

  filterOptions: any[] = [
    { value: "All", text: "Từ khóa" },
    { value: "Number", text: "Tìm theo số" },
    { value: "Phone", text: "Tìm số điện thoại" }
  ];
  currentFilter = this.filterOptions[0];

  @ViewChild("innerText") innerText!: ElementRef;

  constructor(private facebookCommentService: FacebookCommentService,
    private conversationPostFacade: ConversationPostFacade,
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

    this.currentFilter = item;
    this.facebookCommentService.queryObj3.q = this.innerText?.nativeElement?.value;
    this.facebookCommentService.queryObj3.Type = this.currentFilter.value;

    let fbid = this.itemPostCommentCmp?.post?.fbid;
    this.facebookCommentService.getFilterCommentsByPostId(fbid)
      .pipe(takeUntil(this.destroy$))
      .pipe(finalize(() => { this.itemPostCommentCmp.isLoading = false }))
      .subscribe((res: any) => {
        if(TDSHelperArray.hasListValue(res.Items)) {
          res.Items.map((x: any) => {
            let first = x.activities[0];
            x.message = first.message;
            x.created_time = first.created_time;
          });
        }
        this.data = res;
      })
  }

  ngAfterViewInit() {
    if (this.innerText) {
      fromEvent(this.innerText.nativeElement, "keyup")
        .pipe(map((event: any) => {
          return event.target.value;
        }),debounceTime(500),
          distinctUntilChanged()
        ).subscribe((text: string) => {
          //TODO xử lý
          this.onChangeFilter(this.currentFilter);
        }, () => { });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
