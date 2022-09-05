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
import { PrepareUpdateFacebookByLiveCampaign } from '@app/handler-v2/conversation-post/prepare-facebook-post.handler';

@Component({
  selector: 'conversation-post-view',
  templateUrl: './conversation-post-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ TDSDestroyService ]
})

export class ConversationPostViewComponent implements OnInit, OnChanges {

  @Input() data!: ChatomniObjectsItemDto;
  @Input() team!: CRMTeamDTO;

  currentLiveCampaign!: LiveCampaignModel;
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
  commentOrders?: any = {};

  isLoading: boolean = false;
  isProcessing: boolean = false;
  indClickTag: string = '';

  constructor(private facebookPostService: FacebookPostService,
    private excelExportService: ExcelExportService,
    private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef,
    private cdRef: ChangeDetectorRef,
    private prepareUpdateFacebookByLiveCampaign: PrepareUpdateFacebookByLiveCampaign,
    private liveCampaignService: LiveCampaignService,
    private saleOnline_OrderService: SaleOnline_OrderService,
    private facebookCommentService: FacebookCommentService,
    private conversationPostEvent: ConversationPostEvent,
    private objectFacebookPostEvent: ObjectFacebookPostEvent,
    private message: TDSMessageService,
    private destroy$: TDSDestroyService) {
  }

  ngOnInit() {
    if (this.team!.Type == 'Facebook') {
      this.onSetCommentOrders();
    }

    this.loadData();
    this.eventEmitter();
    this.loadOrderTotal();
  }

  eventEmitter() {
    // TODO: Cập nhật chiến lịch live từ object-facebook-post
    this.objectFacebookPostEvent.changeUpdateLiveCampaignFromObject$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
      }
    });

    this.objectFacebookPostEvent.changeDeleteLiveCampaignFromObject$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          if(res && res.LiveCampaignId &&  res.Id == this.data?.Id) {
              this.data.LiveCampaignId = null as any;
              this.data.LiveCampaign = null as any;

              this.data = {...this.data};
              this.currentLiveCampaign = null as any;
          }

          this.cdRef.markForCheck();
      }
    })
  }

  loadOrderTotal(){
    this.conversationPostEvent.getOrderTotal$.pipe(takeUntil(this.destroy$)).subscribe({
      next:(res) => {
        this.orderTotal = res;
        this.cdRef.detectChanges();
      }
    })
  }

  loadData() {
    let postId = this.data.ObjectId;
    this.getCommentOrders(postId);
  }

  getCommentOrders(posId: string) {
    this.isLoading = true;
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
        this.isLoading = false;
        this.cdRef.detectChanges();
      },
      error: (error: any) => {
        this.isLoading = false;
        this.cdRef.detectChanges();
      }
    });
  }

  onSetCommentOrders() {
    this.saleOnline_OrderService.onSetCommentOrders$.pipe(takeUntil(this.destroy$)).subscribe({
      next : (res: any) => {
        let data = res?.data as QuickSaleOnlineOrderModel;

        if (!this.commentOrders[res.fbid]) {
            this.commentOrders[res.fbid] = [];
        }

        if (this.commentOrders[res.fbid]?.filter((x: any) => x.id === data.Id).length === 0) {
            this.commentOrders[res.fbid]?.push({
                session: data.Session,
                index: data.SessionIndex,
                code: data.SessionIndex > 0 ? `#${data.SessionIndex}. ${data.Code}` : data.Code,
                id: data.Id
            });
        }

        this.cdRef.detectChanges();
      }
    });

    this.facebookPostService.onRemoveOrderComment$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        let keys = Object.keys(this.commentOrders);

        keys.forEach(key => {
            this.commentOrders[key] = this.commentOrders[key].filter((x: any) => x.id && !res.includes(x.id));
        })

        this.cdRef.detectChanges();
      }
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["data"] && !changes["data"].firstChange) {
        this.data = {...changes["data"].currentValue};
        this.loadData();
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
    this.facebookCommentService.setSort(event.value);
    this.loadData();
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
    this.loadData();
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

    this.facebookCommentService.fetchComments(this.team!.Id, this.data.ObjectId).pipe(takeUntil(this.destroy$)).subscribe({
      next :(res: any) => {
          this.facebookCommentService.setSort(this.currentSort.value);
          this.loadData();
      },
      error: error => {
          this.message.error('Thao tác thất bại');
      }
    })
  }

  showModalLiveCampaign(data: ChatomniObjectsItemDto) {
    // this.currentLiveCampaign = this.lstOfLiveCampaign.find(f=>f.Id == data.LiveCampaignId) as any;

    const modal = this.modalService.create({
      title: 'Chiến dịch',
      content: LiveCampaignPostComponent,
      size: "lg",
      viewContainerRef: this.viewContainerRef,
      componentParams:{
        data: data,
      }
    });
  }

  openTag(id: string) {
    this.indClickTag = id;
  }

  closeTag(): void {
    this.indClickTag = '';
  }

  updateFacebookByLiveCampaign() {
    if(this.currentLiveCampaign) {

      let id = this.currentLiveCampaign.Id;
      let model = {...this.prepareUpdateFacebookByLiveCampaign.prepareUpdateFbLiveCampaign(this.data, this.currentLiveCampaign, 'update')};

      this.liveCampaignService.updateFacebookByLiveCampaign(id, model).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {
            if(res && res.value) {

                // TODO: gán lại cho item object hiện tại
                this.data.LiveCampaignId = this.currentLiveCampaign.Id;
                this.data.LiveCampaign = {
                    Id: this.currentLiveCampaign.Id,
                    Name:this.currentLiveCampaign.Name,
                    Note: this.currentLiveCampaign.Note
                }

                // TODO: đẩy qua conversation-post-v2, object-facebook-post
                this.objectFacebookPostEvent.changeUpdateLiveCampaignFromObject$.emit(this.data);
                this.indClickTag = '';
                this.message.success('Cập nhật chiến dịch thành công');
            }

            this.cdRef.markForCheck();
        },
        error: (err: any) => {
            this.indClickTag = '';
            this.message.error(err?.error?.message || 'Cập nhật chiến dịch thất bại');
        }
      })
  }
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

  //tính năng đang chưa được dùng
  refetch() {
    this.facebookPostService.refetch(this.data.ObjectId).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
        if (res.id === this.data.ObjectId) {
          // this.data.Data.count_comments = res.count_comments;
        }
      }, error => {
        this.message.error('Refetch bài viết đã xảy ra lỗi');
      });
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
