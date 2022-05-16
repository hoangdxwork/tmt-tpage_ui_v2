import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FacebookPostItem } from 'src/app/main-app/dto/facebook-post/facebook-post.dto';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { FacebookCommentService } from 'src/app/main-app/services/facebook-comment.service';
import { FacebookPostService } from 'src/app/main-app/services/facebook-post.service';
import { TDSMessageService } from 'tmt-tang-ui';

@Component({
  selector: 'conversation-post-view',
  templateUrl: './conversation-post-view.component.html',
  styleUrls: ['./conversation-post.component.scss']
})

export class ConversationPostViewComponent implements OnInit, OnChanges, OnDestroy {

  @Input() data!: FacebookPostItem;
  @Input() team!: CRMTeamDTO;

  destroy$ = new Subject();
  sortOptions: any[] = [
    { value: "DateCreated desc", text: "Mới nhất" },
    { value: "DateCreated asc", text: "Cũ nhất" },
  ];
  currentSort: any = this.sortOptions[0];

  filterOptions: any[] = [
    { value: "all", text: "Tất cả bình luận" },
    { value: "group", text: "Người dùng" },
    { value: "filter", text: "Lọc bình luận" },
    { value: "manage", text: "Quản lí bình luận" },
    { value: "report", text: "Thống kê chốt đơn" },
  ];
  currentFilter: any = this.filterOptions[0];

  constructor(private facebookPostService: FacebookPostService,
    private facebookCommentService: FacebookCommentService,
    private message: TDSMessageService){
  }

  ngOnInit() {
    if(this.data){
      this.data = {...this.data};
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes["data"] && !changes["data"].firstChange) {
      this.data = {...changes["data"].currentValue};
    }
  }

  onChangeSort(event: any) {
    this.currentSort = event;
  }

  onChangeFilter(event: any) {
    this.currentFilter = event;
  }

  fetchComments() {
    this.currentSort = this.sortOptions[0];
    this.currentFilter = this.filterOptions[0];
  }

  translateType(type: string, status: string) {
    if(type == "photo")
      return "Hình ảnh";
    else if(type == "video_inline" && status == "added_video")
      return "Video";
    else if(type == "video_inline" && status == "mobile_status_update")
      return "Chia sẻ";
    else if(type == "share" || type == "native_templates")
      return "Post";
    else if(type == "cover_photo" && status == "added_photos")
      return "Cập nhật ảnh";
    else if(type == "knowledge_note")
      return "Ghi chú";
    else if(type == "profile_media" && status == "added_photos")
      return "Cập nhật ảnh";
    else
      return type;
  }

  refetch() {
    this.facebookPostService.refetch(this.data.fbid)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        if (res.id === this.data.fbid) {
          this.data.count_comments = res.count_comments;
        }
      }, error => {
        this.message.error('Refetch bài viết đã xảy ra lỗi');
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
