import { TDSMessageService } from 'tds-ui/message';
import { CommonService } from 'src/app/main-app/services/common.service';
import { Component, OnChanges, OnDestroy, OnInit, Optional, Host, SkipSelf, Input, SimpleChanges, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { ConversationPostFacade } from 'src/app/main-app/services/facades/conversation-post.facade';
import { CommentByPost } from 'src/app/main-app/dto/conversation/post/comment-post.dto';
import { ItemPostCommentComponent } from '../../conversation-post/item-post-comment.component';
import { TDSHelperArray, TDSHelperObject, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { PartnerStatusDTO } from 'src/app/main-app/dto/partner/partner.dto';
import { eventFadeStateTrigger } from 'src/app/main-app/shared/helper/event-animations.helper';
import { FacebookCommentService } from 'src/app/main-app/services/facebook-comment.service';

@Component({
  selector: 'post-comment-group',
  templateUrl: './post-comment-group.component.html',
  animations: [eventFadeStateTrigger],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class PostCommentGroupComponent implements  OnDestroy, OnChanges {

  @Input() postId!: string;
  @Input() data: any = { Items: []};
  @Input() team!: CRMTeamDTO | null;
  @Input() commentOrders!: any[];
  @Input() childs: any;
  @Input() isShowFilterUser!: boolean;
  @Input() checkedAll!: boolean;
  @Input() setOfCheckedId = new Set<string>();

  @Output() onCheckAll = new EventEmitter<boolean>();
  @Output() onIndeterminate = new EventEmitter<boolean>();
  @Output() onSetOfCheckedId = new EventEmitter<Set<string>>();

  indeterminate!: boolean;

  currentGroup: any;
  otherSelecteds: any = [];
  partners$!: Observable<any>;
  lstPartnerStatus!: Array<PartnerStatusDTO>;

  destroy$ = new Subject<void>();
  messageModel!: string;
  isLoading: boolean = false;

  constructor(private conversationPostFacade: ConversationPostFacade,
    private commonService: CommonService,
    private facebookCommentService: FacebookCommentService,
    private cdRef: ChangeDetectorRef,
    private message: TDSMessageService) {
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

  updateCheckedSet(id: string, checked: boolean): void {
    if (checked) {
        this.setOfCheckedId.add(id);
    } else {
        this.setOfCheckedId.delete(id);
    }
  }

  onItemChecked(id: string, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(value: TDSSafeAny): void {
    this.data.Items.forEach((item: TDSSafeAny) => this.updateCheckedSet(item.id, value));
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checkedAll =  this.data.Items.every((item: TDSSafeAny) => this.setOfCheckedId.has(item.id));
    this.indeterminate =  this.data.Items.some((item: TDSSafeAny) => this.setOfCheckedId.has(item.id)) && !this.checkedAll;
    this.onCheckAll.emit(this.checkedAll);
    this.onIndeterminate.emit(this.indeterminate);
    this.onSetOfCheckedId.emit(this.setOfCheckedId);
  }

  nextData(event: any) {
    if(this.isLoading) {
      return;
    }

    if(this.data && this.data.HasNextPage && TDSHelperString.hasValueString(this.data.NextPage)) {
      let postId = this.postId;
      this.isLoading = true;

      this.facebookCommentService.getCommentsByQuery(this.data.NextPage, postId)
        .pipe(takeUntil(this.destroy$)).subscribe((res: any)=> {

          if(res) {
              res.Items = [...this.data.Items, ...res.Items];
              this.data = res;

              this.isLoading = false;
              this.cdRef.detectChanges();
          }

      }, error => {
          this.isLoading = false;
          this.message.error(`${error.error?.message}`)
      });
    }
  }


  trackByIndex(i: any) {
    return i;
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes["checkedAll"] && !changes["checkedAll"].firstChange){
      this.onAllChecked(this.checkedAll);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
