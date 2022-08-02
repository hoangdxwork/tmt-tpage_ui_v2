import { ChangeDetectionStrategy, Component, Host, Input, OnChanges, OnDestroy, OnInit, Optional, SimpleChanges, SkipSelf, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { FacebookCommentService } from 'src/app/main-app/services/facebook-comment.service';
import { FacebookPostService } from 'src/app/main-app/services/facebook-post.service';
import { ExcelExportService } from 'src/app/main-app/services/excel-export.service';
import { formatDate } from '@angular/common';
import { ModalReportOrderPostComponent } from '../components/post-filter/modal-report-order-post.component';
import { ConfigPostOutletComponent } from '../components/config-post/config-post-outlet.component';
import { TDSModalService } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { ChatomniObjectsItemDto } from '@app/dto/conversation-all/chatomni/chatomni-objects.dto';

@Component({
  selector: 'conversation-post-view-v2',
  templateUrl: './conversation-post-view-v2.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ConversationPostViewV2Component implements OnInit, OnChanges, OnDestroy {

  @Input() data!: ChatomniObjectsItemDto;
  @Input() team!: CRMTeamDTO;

  indClickFilter = 0;
  isShowFilterUser = false;

  indeterminate: boolean = false;
  checked: boolean = false;

  private destroy$ = new Subject<void>();
  sortOptions: any[] = [
    { value: "DateCreated desc", text: "Mới nhất" },
    { value: "DateCreated asc", text: "Cũ nhất" },
  ];
  currentSort: any = this.sortOptions[0];
  filterOptions: TDSSafeAny[] = [
    { value: "all", text: "Tất cả bình luận", icon: 'tdsi-livechat-line' },
    { value: "group", text: "Người dùng", icon: 'tdsi-user-line' },
    { value: "manage", text: "Quản lí bình luận", icon: 'tdsi-eye-line' },
    { value: "filter", text: "Tìm kiếm bình luận", icon: 'tdsi-search-fill' },
    { value: "report", text: "Thống kê chốt đơn", icon: 'tdsi-chart-pie-line' },
  ]

  filterExcel: any[] = [
    { value: "excel", text: "Tải file excel" },
    { value: "excel_phone", text: "Tải file excel có SĐT" },
    { value: "excel_phone_distinct", text: "Tải file excel lọc trùng SĐT" },
  ];

  currentFilter: any = this.filterOptions[0];

  filterOptionsComment: any[] = [
    { value: "All", text: "Từ khóa" },
    { value: "Number", text: "Tìm theo số" },
    { value: "Phone", text: "Tìm số điện thoại" }
  ];

  currentFilterComment = this.filterOptionsComment[0];
  innerText: string = '';
  textSearchFilterComment: string = '';

  isProcessing: boolean = false;

  constructor(private facebookPostService: FacebookPostService,
    private excelExportService: ExcelExportService,
    private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef,
    private facebookCommentService: FacebookCommentService,
    private message: TDSMessageService){
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes["data"] && !changes["data"].firstChange) {
        this.currentSort = this.sortOptions[0];
        this.currentFilter = this.filterOptions[0];
        this.data = {...changes["data"].currentValue};
    }
  }

  onSearchFilterComment(){
    this.textSearchFilterComment = this.innerText
  }

  onChangeFilterComment(event: TDSSafeAny){
    this.currentFilterComment = event;
  }

  onChangeSort(event: any) {
    this.currentSort = event;
    this.facebookCommentService.onFilterSortCommentPost$.emit({type: 'sort', data: event})
  }

  onChangeFilter(event: any): any {
    if (this.isProcessing) { return }

    if(!TDSHelperString.hasValueString(this.data.ObjectId)) {
      return this.message.error('Không tìm thấy bài post');
    }

    this.currentFilter = event;
    switch(event.value) {
      case "report":
        this.reportCommentByPost();
        break;
      case "excel":
        this.excelExportService.exportPost(`/facebook/exportcommentstoexcelv2?postid=${this.data.ObjectId}`, null,`comments-${this.data.ObjectId}`)
            .pipe(finalize(() => this.isProcessing = false), takeUntil(this.destroy$))
            .subscribe();
        break;
      case "excel_phone":
        this.excelExportService.exportPost(`/facebook/exportcommentstoexcelv2?postid=${this.data.ObjectId}&isPhone=true&isFilterPhone=true`, null, `comments-${this.data.ObjectId}-with-distinct-phone`)
          .pipe(finalize(() => this.isProcessing = false), takeUntil(this.destroy$))
          .subscribe();
        break;
      case "excel_phone_distinct":
        this.excelExportService.exportPost(
          `/facebook/exportcommentstoexcelv2?postid=${this.data.ObjectId}&isPhone=true`, null,`comments-${this.data.ObjectId}-with-phone`)
          .pipe(finalize(() => this.isProcessing = false), takeUntil(this.destroy$))
          .subscribe();
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
        postId: this.data.ObjectId
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
    // this.facebookPostService.refetch(this.data.ObjectId)
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((res: any) => {
    //     if (res.id === this.data.ObjectId) {
    //       this.data.count_comments = res.count_comments;
    //     }
    //   }, error => {
    //     this.message.error('Refetch bài viết đã xảy ra lỗi');
    //   });
  }

  openConfigPost() {
    let date = formatDate(this.data.ChannelCreatedTime, 'dd/MM/yyyy HH:mm', 'en-US')
    this.modalService.create({
      title: `Cấu hình bài viết - ${date}` ,
      content: ConfigPostOutletComponent,
      size: "xl",
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        // data: this.data
      }
    });
  }

  fillterAll(data: TDSSafeAny, index: number){
    this.indClickFilter = index;
    this.facebookCommentService.onFilterSortCommentPost$.emit({type: 'filter', data: data});
  }

  onShowFilterUser(){
    this.isShowFilterUser = !this.isShowFilterUser
  }

  onAllChecked(event: TDSSafeAny){
    this.checked = event.checked;
  }

  onCheckAll(event: TDSSafeAny){
    this.checked = event;
  }

  onIndeterminate(event: TDSSafeAny){
    this.indeterminate = event;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
