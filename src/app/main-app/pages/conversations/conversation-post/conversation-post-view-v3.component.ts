import { LiveCampaignPostComponent } from './live-campaign-post/live-campaign-post.component';
import { FaceBookPostItemHandler } from './../../../handler-v2/conversation-post/facebook-post-item.handler';
import { PrepareFacebookPostHandler } from './../../../handler-v2/conversation-post/prepare-facebook-post.handler';
import { LiveCampaignService } from './../../../services/live-campaign.service';
import { LiveCampaignModel } from './../../../dto/live-campaign/odata-live-campaign.dto';
import { ObjectFacebookPostEvent } from './../../../handler-v2/conversation-post/object-facebook-post.event';
import { TDSDestroyService } from 'tds-ui/core/services';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewContainerRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
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
import { ChatomniCommentFacade } from '@app/services/chatomni-facade/chatomni-comment.facade';

@Component({
  selector: 'conversation-post-view-v3',
  templateUrl: './conversation-post-view-v3.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ TDSDestroyService ]
})

export class ConversationPostViewV3Component implements OnInit, OnChanges, OnDestroy {

  @Input() data!: ChatomniObjectsItemDto;
  @Input() team!: CRMTeamDTO;
  @Input() availableCampaigns!:Array<LiveCampaignModel>;

  currentLiveCampaign?:LiveCampaignModel;
  indClickFilter = 0;
  isShowFilterUser = false;
  indeterminate: boolean = false;
  checked: boolean = false;

  sortOptions: any[] = [
    { value: "DateCreated desc", text: "Mới nhất" },
    { value: "DateCreated asc", text: "Cũ nhất" },
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
    { value: "excel_phone_distinct", text: "Tải file excel lọc trùng SĐT" },
  ];

  filterOptionsComment: any[] = [
    { value: "All", text: "Từ khóa" },
    { value: "Number", text: "Tìm theo số" },
    { value: "Phone", text: "Tìm số điện thoại" }
  ];
  currentFilterComment = this.filterOptionsComment[0];

  innerText: string = '';
  textSearchFilterComment: string = '';

  partners$!: Observable<any>;
  facebookComment$!: Subscription;
  facebookScanData$!: Subscription;
  subSetCommentOrders$!: Subscription;
  commentOrders: any = [];

  isLoading: boolean = false;
  isProcessing: boolean = false;
  indClickTag: string = '';

  constructor(private facebookPostService: FacebookPostService,
    private liveCampaignService: LiveCampaignService,
    private excelExportService: ExcelExportService,
    private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef,
    private chatomniCommentFacade: ChatomniCommentFacade,
    private cdRef: ChangeDetectorRef,
    private objectEvent: ObjectFacebookPostEvent,
    private prepareHandler: PrepareFacebookPostHandler,
    private fbPostHandler: FaceBookPostItemHandler,
    private saleOnline_OrderService: SaleOnline_OrderService,
    private facebookCommentService: FacebookCommentService,
    private message: TDSMessageService,
    private cdr: ChangeDetectorRef,
    private destroy$: TDSDestroyService) {
  }

  ngOnInit() {
    if (this.team!.Type == 'Facebook') {
      this.onSetCommentOrders();
      this.currentLiveCampaign = this.availableCampaigns.find(f=> f.Id == this.data?.LiveCampaignId);
      this.data = this.fbPostHandler.updateLiveCampaignPost(this.data, this.currentLiveCampaign);
    }

    this.loadData();
    this.loadPartnerTimstamp();
    this.eventEmitter();
  }

  eventEmitter(){
    this.objectEvent.getObjectFBData$.pipe(takeUntil(this.destroy$)).subscribe({
      next: res => {
        this.data = {...res};
        let data = this.availableCampaigns.find(f=>f.Id == res?.LiveCampaignId);
        if(data){
          this.currentLiveCampaign = {...data};
        }

        this.cdRef.markForCheck();
      }
    })
  }

  loadPartnerTimstamp() {
    this.partners$ = this.chatomniCommentFacade.getParentTimeStamp(this.team.Id);
  }

  loadData() {
    let postId = this.data.ObjectId;
    this.getCommentOrders(postId);
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

  onSetCommentOrders() {
    this.subSetCommentOrders$ = this.saleOnline_OrderService.onSetCommentOrders$.subscribe({
      next : (res: any) => {
        let data = res?.data as QuickSaleOnlineOrderModel;

        if (!this.commentOrders[res.fbid]) {
            this.commentOrders[res.fbid] = [];
        }

        if (this.commentOrders[res.fbid].filter((x: any) => x.id === data.Id).length === 0) {
            this.commentOrders[res.fbid].push({
                session: data.Session,
                index: data.SessionIndex,
                code: data.SessionIndex > 0 ? `#${data.SessionIndex}. ${data.Code}` : data.Code,
                id: data.Id
            });
        }
      }
    });

    this.facebookPostService.onRemoveOrderComment$.subscribe({
      next: (res: any) => {
        let keys = Object.keys(this.commentOrders);

        keys.forEach(key => {
            this.commentOrders[key] = this.commentOrders[key].filter((x: any) => x.id && !res.includes(x.id));
        })
      }
    })

    // this.sgRConnectionService._onSaleOnlineOrder$.subscribe((res: any) => {
    //   if (res.data) {
    //     let data = res.data;
    //     let userId = data.facebook_ASUserId;

    //     if (data.facebook_PostId == this.data.ObjectId) {
    //       let dataAdd = {} as any;

    //       if (this.commentOrders[userId]) {
    //         this.commentOrders[userId] = this.commentOrders[userId].filter((x: any) => x.id && !data.id);

    //         dataAdd = {
    //           code: data.code,
    //           id: data.id,
    //           index: data.index,
    //           session: data.session
    //         };
    //       } else {
    //         this.commentOrders[userId] = [];

    //         dataAdd = {
    //           code: data.code,
    //           id: data.id,
    //           index: data.index,
    //           session: data.session
    //         };
    //       }

    //       this.commentOrders[userId].push(dataAdd);
    //     }
    //   }
    // })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["data"] && !changes["data"].firstChange) {
        this.data = changes["data"].currentValue;
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
          .pipe(finalize(() => this.isProcessing = false)).subscribe();
        break;

      case "excel_phone":
        this.excelExportService.exportPost(`/facebook/exportcommentstoexcelv2?postid=${this.data.ObjectId}&isPhone=true&isFilterPhone=true`, null, `comments-${this.data.ObjectId}-with-distinct-phone`)
          .pipe(finalize(() => this.isProcessing = false)).subscribe();
        break;

      case "excel_phone_distinct":
        this.excelExportService.exportPost(
          `/facebook/exportcommentstoexcelv2?postid=${this.data.ObjectId}&isPhone=true`, null, `comments-${this.data.ObjectId}-with-phone`)
          .pipe(finalize(() => this.isProcessing = false)).subscribe();
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
    const modal = this.modalService.create({
      title: 'Chiến dịch',
      content: LiveCampaignPostComponent,
      size: "lg",
      viewContainerRef: this.viewContainerRef,
      componentParams:{
        post: data,
        currentLiveCampaign: this.currentLiveCampaign,
        lstOfData: this.availableCampaigns
      }
    });

    modal.componentInstance?.getCurrentLiveCampaign$.subscribe(res => {
      if(this.data?.Data){
        this.data = this.fbPostHandler.updateLiveCampaignPost(this.data, res);
      }

      this.objectEvent.getObjectFBData$.emit(this.data);

      this.cdr.detectChanges();
    })
  }

  openTag(id: string) {
    this.indClickTag = id;
  }

  closeTag(): void {
    this.indClickTag = '';
  }

  addNewCampaign() {
    if(this.currentLiveCampaign){
      let data =  this.prepareHandler.prepareModel((<MDB_Facebook_Mapping_PostDto> this.data?.Data), this.currentLiveCampaign);
      let liveCampaignId = this.currentLiveCampaign?.Id || this.data?.LiveCampaignId;

      this.liveCampaignService.updateLiveCampaignPost(liveCampaignId, data).pipe(takeUntil(this.destroy$)).subscribe({
        next : res => {
          if(res.value){
            this.data = this.fbPostHandler.updateLiveCampaignPost(this.data, this.currentLiveCampaign);
            this.objectEvent.getObjectFBData$.emit(this.data);
            this.message.success('Cập nhật chiến dịch thành công');

            this.cdr.markForCheck();
          }
      },
      error: err=>{
        this.message.error(err?.error?.message || 'Cập nhật chiến dịch thất bại');
      }
      })

      this.indClickTag = '';
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
    this.facebookPostService.refetch(this.data.ObjectId)
      .subscribe((res: any) => {
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
          data: this.data
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

  ngOnDestroy(): void {
    this.subSetCommentOrders$?.unsubscribe();
    this.facebookComment$?.unsubscribe();
    this.facebookScanData$?.unsubscribe();
  }
}
