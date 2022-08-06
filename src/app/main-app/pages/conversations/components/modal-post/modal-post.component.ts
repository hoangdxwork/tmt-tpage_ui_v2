import { FacebookPostItem } from './../../../../dto/facebook-post/facebook-post.dto';
import { Facebook_Graph_Post } from './../../../../dto/conversation-all/chatomni/chatomni-facebook-post.dto';
import { FacebookCommentService } from 'src/app/main-app/services/facebook-comment.service';
import { TDSMessageService } from 'tds-ui/message';
import { Component, Input, OnInit } from '@angular/core';
import { TDSModalRef } from 'tds-ui/modal';
import { TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';

@Component({
  selector: 'app-modal-post',
  templateUrl: './modal-post.component.html',
})
export class ModalPostComponent implements OnInit {

  @Input() data!: Facebook_Graph_Post;
  @Input() objectId!: string;

  dataPost!: FacebookPostItem;
  isShowCheckbox: boolean = false;
  selectedIndex: number = 0;
  constructor(
    private modal: TDSModalRef,
    private message: TDSMessageService,
    private facebookCommentService: FacebookCommentService,
  ) { }

  sortOptions: any[] = [
    { value: "DateCreated desc", text: "Mới nhất" },
    { value: "DateCreated asc", text: "Cũ nhất" },
  ];
  currentSort: any = this.sortOptions[0];

  filterOptions: TDSSafeAny[] = [
    { value: "all", text: "Tất cả bình luận", icon: 'tdsi-livechat-line' },
    { value: "group", text: "Người dùng", icon: 'tdsi-user-line' },
    { value: "filter", text: "Tìm kiếm bình luận", icon: 'tdsi-search-fill' },
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
    this.dataPost = this.mappingFacebookPostItemDto();
  }

  mappingFacebookPostItemDto(){
    let model = {} as FacebookPostItem;

    model.DateCreated = this.data.created_time;
    model.LastUpdated = this.data.updated_time;
    model.account_id = this.data.from?.id;
    model.object_id = this.objectId;
    model.fbid = this.objectId;

    return model
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
