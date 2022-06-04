import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FacebookPostItem } from 'src/app/main-app/dto/facebook-post/facebook-post.dto';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { FacebookCommentService } from 'src/app/main-app/services/facebook-comment.service';
import { FacebookPostService } from 'src/app/main-app/services/facebook-post.service';
import { TDSHelperString, TDSMessageService, TDSModalService } from 'tmt-tang-ui';
import { ExcelExportService } from 'src/app/main-app/services/excel-export.service';
import { ConversationPostFacade } from 'src/app/main-app/services/facades/conversation-post.facade';
import { formatDate } from '@angular/common';
import { ConfigPostOutletComponent } from '../../../components/config-post/config-post-outlet.component';
import { ModalReportOrderPostComponent } from '../../../components/post-filter/modal-report-order-post.component';

@Component({
  selector: 'conversation-post-view',
  templateUrl: './conversation-post-view.component.html'
})

export class ConversationPostViewComponent implements OnInit, OnChanges, OnDestroy {

  @Input() data!: FacebookPostItem;
  @Input() team!: CRMTeamDTO;

  showComment = true;
  private destroy$ = new Subject();
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
    { value: "excel", text: "Tải file excel" },
    { value: "excel_phone", text: "Tải file excel có SĐT" },
    { value: "excel_phone_distinct", text: "Tải file excel lọc trùng SĐT" },
  ];
  currentFilter: any = this.filterOptions[0];

  constructor(private facebookPostService: FacebookPostService,
    private excelExportService: ExcelExportService,
    private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef,
    private facebookCommentService: FacebookCommentService,
    private conversationPostFacade: ConversationPostFacade,
    private message: TDSMessageService){
  }

  ngOnInit() {
    if(this.data){
      this.data = {...this.data};
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes["data"] && !changes["data"].firstChange) {
      this.currentSort = this.sortOptions[0];
      this.currentFilter = this.filterOptions[0];
      this.data = {...changes["data"].currentValue};
    }
  }

  onChangeSort(event: any) {
    this.currentSort = event;
    this.facebookCommentService.onFilterSortCommentPost$.emit({type: 'sort', data: event})
  }

  onChangeFilter(event: any): any {
    if(!TDSHelperString.hasValueString(this.data.fbid)) {
      return this.message.error('Không tìm thấy bài post');
    }

    this.currentFilter = event;
    switch(event.value) {
      case "report":
        this.reportCommentByPost();
        break;
      case "excel":
        this.excelExportService.exportPost(`/facebook/exportcommentstoexcelv2?postid=${this.data.fbid}`,
            null,`comments-${this.data.fbid}`);
        break;
      case "excel_phone":
        this.excelExportService.exportPost(`/facebook/exportcommentstoexcelv2?postid=${this.data.fbid}&isPhone=true&isFilterPhone=true`,
            null, `comments-${this.data.fbid}-with-distinct-phone`);
        break;
      case "excel_phone_distinct":
        this.excelExportService.exportPost(
          `/facebook/exportcommentstoexcelv2?postid=${this.data.fbid}&isPhone=true`,
            null,`comments-${this.data.fbid}-with-phone`);
        break;
      default:
          this.facebookCommentService.onFilterSortCommentPost$.emit({type: 'filter', data: event});
        break;
    }
  }

  reportCommentByPost(){
    this.modalService.create({
      title: 'Thống kê đơn tạo bị lỗi',
      content: ModalReportOrderPostComponent,
      size: "xl",
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        postId: this.data.fbid
      }
    });
  }

  fetchComments() {
    this.currentSort = this.sortOptions[0];
    this.currentFilter = this.filterOptions[0];
    this.facebookCommentService.onFilterSortCommentPost$.emit({type: 'fetch', data: null});
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

  openConfigPost() {
    let date = formatDate(this.data.created_time, 'dd/MM/yyyy HH:mm', 'en-US')
    this.modalService.create({
      title: `Cấu hình bài viết - ${date}` ,
      content: ConfigPostOutletComponent,
      size: "xl",
      centered: true,
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        data:  this.data
      }
    });
  }

  openChat(){
    this.showComment = !this.showComment;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
