import { Component, OnDestroy, OnInit, Optional, Host, SkipSelf, Input, EventEmitter, Output, SimpleChanges } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { ConversationPostFacade } from 'src/app/main-app/services/facades/conversation-post.facade';
import { CommentByPost } from 'src/app/main-app/dto/conversation/post/comment-post.dto';
import { ItemPostCommentComponent } from '../../conversation-post/item-post-comment.component';
import { TDSHelperArray, TDSHelperObject, TDSSafeAny } from 'tds-ui/shared/utility';

@Component({
  selector: 'manage-post-comment',
  templateUrl: './manage-post-comment.component.html',
})

export class ManagePostCommentComponent implements OnInit, OnDestroy {

  @Input() checkedAll!: boolean;

  @Output() onCheckAll = new EventEmitter<boolean>();
  @Output() onIndeterminate = new EventEmitter<boolean>();
  @Output() onSetOfCheckedId = new EventEmitter<Set<string>>();

  setOfCheckedId = new Set<string>();
  indeterminate!: boolean;

  team!: CRMTeamDTO | null;
  data: any = { Items: []};
  childs: any = {};
  commentOrders: any = [];
  currentGroup: any;
  otherSelecteds: any = [];
  partners$!: Observable<any>;

  destroy$ = new Subject<void>();
  messageModel!: string;

  constructor(private conversationPostFacade: ConversationPostFacade,
    @Host() @Optional() @SkipSelf() public itemPostCommentCmp: ItemPostCommentComponent) {
  }

  initialize() {
    if(TDSHelperObject.hasValue(this.itemPostCommentCmp?.data)) {
      this.data = {...this.itemPostCommentCmp.data};
      this.team = {...this.itemPostCommentCmp.team} as CRMTeamDTO | null;
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
