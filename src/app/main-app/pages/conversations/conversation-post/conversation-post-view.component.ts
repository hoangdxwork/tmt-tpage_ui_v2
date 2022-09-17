import { ConversationPostEvent } from './../../../handler-v2/conversation-post/conversation-post.event';
import { LiveCampaignService } from './../../../services/live-campaign.service';
import { LiveCampaignModel } from '../../../dto/live-campaign/odata-live-campaign-model.dto';
import { ObjectFacebookPostEvent } from './../../../handler-v2/conversation-post/object-facebook-post.event';
import { TDSDestroyService } from 'tds-ui/core/services';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges, ViewContainerRef } from '@angular/core';
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
import { ChatomniObjectsItemDto, MDB_Facebook_Mapping_PostDto } from '@app/dto/conversation-all/chatomni/chatomni-objects.dto';
import { SaleOnline_OrderService } from '@app/services/sale-online-order.service';
import { CommentOrder, CommentOrderPost, OdataCommentOrderPostDTO } from '@app/dto/conversation/post/comment-order-post.dto';
import { QuickSaleOnlineOrderModel } from '@app/dto/saleonlineorder/quick-saleonline-order.dto';
import { LiveCampaignPostComponent } from './live-campaign-post/live-campaign-post.component';

@Component({
  selector: 'conversation-post-view',
  templateUrl: './conversation-post-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ TDSDestroyService ]
})

export class ConversationPostViewComponent implements OnInit, OnChanges {

  @Input() data!: ChatomniObjectsItemDto;
  @Input() team!: CRMTeamDTO;

  orderTotal = 0;
  indClickFilter = 0;
  isShowFilterUser = false;
  indeterminate: boolean = false;
  checked: boolean = false;

  sortOptions: any[] = [
    { value: "CreatedTime desc", text: "Mới nhất" },
    { value: "CreatedTime asc", text: "Cũ nhất" },
  ];
  currentSort: any = this.sortOptions[0];

  filterOptions: TDSSafeAny[] = [
    { value: "all", text: "Tất cả bình luận", icon: 'tdsi-livechat-line' },
    // { value: "group", text: "Người dùng", icon: 'tdsi-user-line' },
    // { value: "manage", text: "Quản lí bình luận", icon: 'tdsi-eye-line' },
    // { value: "filter", text: "Tìm kiếm bình luận", icon: 'tdsi-search-fill' },
    // { value: "report", text: "Thống kê chốt đơn", icon: 'tdsi-chart-pie-line' },
  ];
  currentFilter: any = this.filterOptions[0];

  filterExcel: any[] = [
    { value: "excel", text: "Tải file excel" },
    { value: "excel_phone", text: "Tải file excel có SĐT" },
    { value: "excel_phone_distinct", text: "Tải file excel lờc trùng SĐT" },
  ];

  filterOptionsComment: any[] = [
    { value: "All", text: "Từ khóa" },
    { value: "Number", text: "Tìm theo số" },
    { value: "Phone", text: "Tìm số điện thoại" }
  ];
  currentFilterComment = this.filterOptionsComment[0];

  innerText: string = '';
  textSearchFilterComment: string = '';

  isLoading: boolean = false;
  isProcessing: boolean = false;
  indClickTag: string = '';

  constructor(private facebookPostService: FacebookPostService,
    private excelExportService: ExcelExportService,
    private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef,
    private cdRef: ChangeDetectorRef,
    private saleOnline_OrderService: SaleOnline_OrderService,
    private facebookCommentService: FacebookCommentService,
    private postEvent: ConversationPostEvent,
    private objectFacebookPostEvent: ObjectFacebookPostEvent,
    private message: TDSMessageService,
    private destroy$: TDSDestroyService) {
  }

  ngOnInit() {
    this.eventEmitter();
  }

  eventEmitter() {
    // TODO: Cập nhật chiến lịch live từ object-facebook-post
    this.objectFacebookPostEvent.changeDeleteLiveCampaignFromObject$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          delete this.data.LiveCampaignId;
          delete this.data.LiveCampaign;

          this.data = {...this.data};
          this.cdRef.detectChanges();
      }
    })

    this.objectFacebookPostEvent.changeUpdateLiveCampaignFromObject$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          if(res) {
            this.data.LiveCampaignId = res.LiveCampaignId;
            this.data.LiveCampaign =  res.LiveCampaign;

            this.data = {...this.data};
            this.cdRef.detectChanges();
          }
      }
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["data"] && !changes["data"].firstChange) {
        this.data = {...changes["data"].currentValue};
    }
  }

  onSearchFilterComment() {
    this.textSearchFilterComment = this.innerText
  }

  onChangeFilterComment(event: TDSSafeAny) {
    this.currentFilterComment = event;
  }

  onChangeSort(event: any) {
    this.currentSort = event;
  }

  onChangeExcel(event: any) {
    switch (event.value) {
      case "excel":
        this.excelExportService.exportPost(`/facebook/exportcommentstoexcelv2?postid=${this.data.ObjectId}`, null, `comments-${this.data.ObjectId}`)
          .pipe(finalize(() => this.isProcessing = false)).pipe(takeUntil(this.destroy$)).subscribe();
        break;

      case "excel_phone":
        this.excelExportService.exportPost(`/facebook/exportcommentstoexcelv2?postid=${this.data.ObjectId}&isPhone=true&isFilterPhone=true`, null, `comments-${this.data.ObjectId}-with-distinct-phone`)
          .pipe(finalize(() => this.isProcessing = false)).pipe(takeUntil(this.destroy$)).subscribe();
        break;

      case "excel_phone_distinct":
        this.excelExportService.exportPost(
          `/facebook/exportcommentstoexcelv2?postid=${this.data.ObjectId}&isPhone=true`, null, `comments-${this.data.ObjectId}-with-phone`)
          .pipe(finalize(() => this.isProcessing = false)).pipe(takeUntil(this.destroy$)).subscribe();
        break;

      default:
        break;
    }
  }

  onChangeFilter(event: any): any {
    if (this.isProcessing) {
      return
    }

    if (!TDSHelperString.hasValueString(this.data.ObjectId)) {
      return this.message.error('Không tìm thấy bài post');
    }

    this.currentFilter = event;
  }

  reportCommentByPost() {
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
    let teamId = this.team.Id;

    if(teamId && this.data.ObjectId) {
      this.facebookCommentService.fetchComments(teamId, this.data.ObjectId).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {
            // TODO: gán lại data để đẩy vào ngOnChanges CommentFilterAllComponent
            this.data = {...this.data};
        },
        error: error => {
            this.message.error(`${error?.error?.message}`);
        }
      })
    }
  }

  showModalLiveCampaign(data: ChatomniObjectsItemDto) {
    const modal = this.modalService.create({
      title: 'Chiến dịch',
      content: LiveCampaignPostComponent,
      size: "lg",
      viewContainerRef: this.viewContainerRef,
      componentParams: {
          data: data
      }
    });
  }

  openTag(item: ChatomniObjectsItemDto) {
    this.indClickTag = item.Id;
    this.showModalLiveCampaign(item);
  }

  closeTag(): void {
    this.indClickTag = '';
  }

  translateType(type: string, status: string) {
    if (type == "photo")
      return "Hình ảnh";
    else if (type == "video_inline" && status == "added_video")
      return "Video";
    else if (type == "video_inline" && status == "mobile_status_update")
      return "Chia sẻ";
    else if (type == "share" || type == "native_templates")
      return "Post";
    else if (type == "cover_photo" && status == "added_photos")
      return "Cập nhật ảnh";
    else if (type == "knowledge_note")
      return "Ghi chú";
    else if (type == "profile_media" && status == "added_photos")
      return "Cập nhật ảnh";
    else
      return type;
  }

  openConfigPost() {
    if (this.team!.Type == 'Facebook') {
      let date = formatDate((this.data.Data as MDB_Facebook_Mapping_PostDto).created_time, 'dd/MM/yyyy HH:mm', 'en-US');

      this.modalService.create({
        title: `Cấu hình bài viết - ${date}`,
        content: ConfigPostOutletComponent,
        size: "xl",
        viewContainerRef: this.viewContainerRef,
        componentParams: {
          data: this.data,
        }
      });
    }
  }

  fillterAll(data: TDSSafeAny, index: number) {
    this.indClickFilter = index;
    this.facebookCommentService.onFilterSortCommentPost$.emit({ type: 'filter', data: data });
  }

  onShowFilterUser() {
    this.isShowFilterUser = !this.isShowFilterUser
  }

  onAllChecked(event: TDSSafeAny) {
    this.checked = event.checked;
  }

  onCheckAll(event: TDSSafeAny) {
    this.checked = event;
  }

  onIndeterminate(event: TDSSafeAny) {
    this.indeterminate = event;
  }

}
