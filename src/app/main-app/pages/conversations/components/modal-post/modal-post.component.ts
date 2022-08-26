import { TDSDestroyService } from 'tds-ui/core/services';
import { takeUntil } from 'rxjs';
import { CommentOrder, CommentOrderPost, OdataCommentOrderPostDTO } from './../../../../dto/conversation/post/comment-order-post.dto';
import { ChatomniObjectsItemDto } from './../../../../dto/conversation-all/chatomni/chatomni-objects.dto';
import { CRMTeamDTO } from './../../../../dto/team/team.dto';
import { FacebookCommentService } from 'src/app/main-app/services/facebook-comment.service';
import { TDSMessageService } from 'tds-ui/message';
import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { TDSModalRef } from 'tds-ui/modal';
import { TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';

@Component({
  selector: 'app-modal-post',
  templateUrl: './modal-post.component.html',
  providers: [ TDSDestroyService ]
})
export class ModalPostComponent implements OnInit {

  @Input() data!: ChatomniObjectsItemDto; // ChatomniObjectsItemDto
  @Input() objectId!: string;
  @Input() currentTeam!: CRMTeamDTO;

  isShowCheckbox: boolean = false;
  selectedIndex: number = 0;
  commentOrders: any = [];
  constructor(
    private modal: TDSModalRef,
    private message: TDSMessageService,
    private facebookCommentService: FacebookCommentService,
    private destroy$: TDSDestroyService,
    private cdRef: ChangeDetectorRef
  ) { }

  sortOptions: any[] = [
    { value: "DateCreated desc", text: "Mới nhất" },
    // { value: "DateCreated asc", text: "Cũ nhất" },
  ];
  currentSort: any = this.sortOptions[0];

  filterOptions: TDSSafeAny[] = [
    { value: "all", text: "Tất cả bình luận", icon: 'tdsi-livechat-line' },
    // { value: "group", text: "Người dùng", icon: 'tdsi-user-line' },
    // { value: "filter", text: "Tìm kiếm bình luận", icon: 'tdsi-search-fill' },
  ]
  currentFilter: any = this.filterOptions[0];

  filterOptionsComment: any[] = [
    { value: "All", text: "Từ khóa" },
    { value: "Number", text: "Tìm theo số" },
    { value: "Phone", text: "Tìm số điện thoại" }
  ];
  currentFilterComment = this.filterOptionsComment[0];
  innerText: string = '';
  textSearchFilterComment: string = '';

  ngOnInit(): void {
    this.getCommentOrders(this.objectId);
  }

  getCommentOrders(posId: string) {
    this.facebookCommentService.getCommentsOrderByPost(posId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: OdataCommentOrderPostDTO) => {
        if(res && res.value) {
            let comments = [...res.value];

            comments.map((x: CommentOrderPost) => {
                this.commentOrders[x.asuid] = [];
                this.commentOrders[x.uid] = [];

                x.orders?.map((a: CommentOrder) => {
                    this.commentOrders[x.asuid].push(a);
                });

                if (x.uid && x.uid != x.asuid) {
                  x.orders?.map((a: any) => {
                      this.commentOrders[x.uid].push(a);
                  });
                }
            });
        }

        this.cdRef.markForCheck();
      }, error: (error: any) => {
        this.message.error(`${error?.error?.message}`);
        this.cdRef.markForCheck();
        }
    });

  }

  onChangeFilter(event: any): any {
    if(!TDSHelperString.hasValueString(this.objectId)) {
      return this.message.error('Không tìm thấy bài post');
    }

    this.currentFilter = event;
    this.currentSort = this.sortOptions[0]
    this.facebookCommentService.onFilterSortCommentPost$.emit({type: 'filter', data: event});
  }

  onChangeSort(event: any): any {
    if(!TDSHelperString.hasValueString(this.objectId)) {
      return this.message.error('Không tìm thấy bài post');
    }

    this.currentSort = event;
    this.facebookCommentService.onFilterSortCommentPost$.emit({type: 'sort', data: event})
  }

  onChangeFilterComment(event: TDSSafeAny){
    this.currentFilterComment = event;
  }

  onSearchFilterComment(){
    this.textSearchFilterComment = this.innerText
  }

  cancel(){
    this.modal.destroy(null);
  }
}
