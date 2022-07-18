import { TDSMessageService } from 'tds-ui/message';
import { CommonService } from 'src/app/main-app/services/common.service';
import { Component, OnChanges, OnDestroy, OnInit, Optional, Host, SkipSelf, Input } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { ConversationPostFacade } from 'src/app/main-app/services/facades/conversation-post.facade';
import { CommentByPost } from 'src/app/main-app/dto/conversation/post/comment-post.dto';
import { ItemPostCommentComponent } from '../../conversation-post/item-post-comment.component';
import { TDSHelperArray, TDSHelperObject } from 'tds-ui/shared/utility';
import { PartnerStatusDTO } from 'src/app/main-app/dto/partner/partner.dto';

@Component({
  selector: 'post-comment-group',
  templateUrl: './post-comment-group.component.html',
})

export class PostCommentGroupComponent implements OnInit, OnDestroy {

  @Input() isShowFilterUser!: boolean;
  team!: CRMTeamDTO | null;
  data: any = { Items: []};
  childs: any = {};
  commentOrders: any = [];
  currentGroup: any;
  otherSelecteds: any = [];
  partners$!: Observable<any>;
  lstPartnerStatus!: Array<PartnerStatusDTO>;

  destroy$ = new Subject<void>();
  messageModel!: string;

  constructor(private conversationPostFacade: ConversationPostFacade,
    private commonService: CommonService,
    private message: TDSMessageService,
    @Host() @Optional() @SkipSelf() public itemPostCommentCmp: ItemPostCommentComponent) {
  }

  initialize() {
    if(TDSHelperObject.hasValue(this.itemPostCommentCmp?.data)) {
      this.data = {...this.itemPostCommentCmp.data};
      this.commentOrders = {...this.itemPostCommentCmp.commentOrders};
      this.team = {...this.itemPostCommentCmp.team} as CRMTeamDTO | null;
      this.childs = {...this.itemPostCommentCmp.childs};
      this.partners$ = this.itemPostCommentCmp.partners$;
    }
  }

  ngOnInit() {
    this.initialize();
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
