import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Host, Input, OnChanges, OnDestroy, OnInit, Optional, SimpleChanges, SkipSelf, ViewContainerRef } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
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
import { TDSHelperArray, TDSHelperObject, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { ChatomniObjectsItemDto } from '@app/dto/conversation-all/chatomni/chatomni-objects.dto';
import { FacebookPostItem } from '@app/dto/facebook-post/facebook-post.dto';
import { ConversationPostFacade } from '@app/services/facades/conversation-post.facade';
import { SignalRConnectionService } from '@app/services/signalR/signalR-connection.service';
import { SaleOnline_OrderService } from '@app/services/sale-online-order.service';
import { CommentOrder, CommentOrderPost, OdataCommentOrderPostDTO } from '@app/dto/conversation/post/comment-order-post.dto';
import { RequestCommentByGroup } from '@app/dto/conversation/post/comment-group.dto';
import { RequestCommentByPost } from '@app/dto/conversation/post/comment-post.dto';

@Component({
  selector: 'conversation-post-view-v2',
  templateUrl: './conversation-post-view-v2.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ConversationPostViewV2Component implements OnInit, OnChanges, OnDestroy {

  @Input() data!: FacebookPostItem;
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

  objComment?: any = { Items: [] };

  partners$!: Observable<any>;
  facebookComment$!: Subscription;
  facebookScanData$!: Subscription;
  subSetCommentOrders$!: Subscription;

  childs: any = {};
  commentOrders: any = [];

  isLoading: boolean = false;
  isProcessing: boolean = false;

  constructor(private facebookPostService: FacebookPostService,
    private excelExportService: ExcelExportService,
    private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef,
    private cdRef: ChangeDetectorRef,
    private saleOnline_OrderService: SaleOnline_OrderService,
    private sgRConnectionService: SignalRConnectionService,
    private conversationPostFacade: ConversationPostFacade,
    private facebookCommentService: FacebookCommentService,
    private message: TDSMessageService){
  }

  ngOnInit() {
    this.initialize();
    this.onSetCommentOrders();

    this.loadData();
  }

  initialize() {
    this.partners$ = this.conversationPostFacade.getDicPartnerSimplest$();

    this.facebookComment$ = this.sgRConnectionService._onFacebookEvent$.pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      if(res?.data?.last_activity?.comment_obj &&  res?.data?.last_activity?.type == 2) {
        let comment_obj = res.data?.last_activity?.comment_obj;

        if (comment_obj?.object?.id == this.data?.fbid) {
          if(comment_obj?.parent?.id != this.data.fbid) {
            this.childs[comment_obj.parent.id].unshift(comment_obj);
          } else {
            this.objComment.Items.unshift(comment_obj);
          }
        }
      }
    });

    this.facebookScanData$ = this.sgRConnectionService._onFacebookScanData$.pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      if(res.data) {
          let data = Object.assign({}, res.data);

          if(res.type == "update_scan_feed") {
              if(data.comment?.object?.id == this.data?.fbid) {
                  this.objComment.Items = [...[data.comment], ...this.objComment.Items];
              }
          }
      }
    });
  }

  validateData(){
    this.objComment = { Items: [] };
    this.childs = {};
    this.commentOrders = [];
  }

  loadData() {
    this.isLoading = true;
    this.validateData();
    this.getCommentOrders(this.data.fbid);

    switch(this.currentFilter.value){
      case 'all':
        // TODO: Tất cả bình luận
        this.loadAllCommentsByPost();
        break;
      case 'group':
        // TODO: Lọc theo người dùng
        this.loadGroupCommentsByPost();
        break;
      case 'filter':
        // TODO: Lọc theo bình luận
        this.loadFilterCommentsByPost();
        break;
      case 'manage':
          // TODO:Quản lý bình luận
          this.loadManageCommentsByPost();
          break;
      case "report":
        this.reportCommentByPost();
        break;

      default:
        break;
    }
  }

  loadGroupCommentsByPost() {
    this.facebookCommentService.getGroupCommentsByPostId(this.data?.fbid)
      .pipe(takeUntil(this.destroy$)).subscribe((res: RequestCommentByGroup) => {

        if(TDSHelperArray.hasListValue(res.Items)) {
          res.Items.map((x: any) => {
            let first = x.activities[0];
            x.created_time = first.created_time;
          });
        }

        this.objComment = res;
        this.isLoading = false;

        this.cdRef.markForCheck();
    }, error => {
        this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Lọc theo người dùng đã xảy ra lỗi');
        this.isLoading = false;
        this.cdRef.markForCheck();
    });
  }

  loadFilterCommentsByPost(){
    this.facebookCommentService.getFilterCommentsByPostId(this.data?.fbid)
      .pipe(takeUntil(this.destroy$)).subscribe((res: RequestCommentByGroup) => {

          if(TDSHelperArray.hasListValue(res.Items)) {
              res.Items.map((x: any) => {
                  let first = x.activities[0];

                  x.message = first.message;
                  x.created_time = first.created_time;
              });
          }

          this.objComment = res;
          this.isLoading = false;
          this.cdRef.markForCheck();
    }, error => {
        this.message.error(`${error?.error?.message}` ? `${error?.error?.message}`: 'Lọc theo bình luận đã xảy ra lỗi');
        this.isLoading = false;
        this.cdRef.markForCheck();
    });
  }

  loadManageCommentsByPost(){
    this.facebookCommentService.getManageCommentsByLimit(this.data?.fbid)
      .pipe(takeUntil(this.destroy$)).subscribe((res: RequestCommentByPost) => {

          if(TDSHelperArray.hasListValue(res.Items)) {
              res.Items.forEach((x: any) => {
                  x["selected"] = false;
                  x["error_message"] = null;
              });
          }

          this.objComment = res;
          this.isLoading = false;
          this.cdRef.markForCheck();
      }, error => {
          this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Đã xảy ra lỗi');
          this.isLoading = false;
          this.cdRef.markForCheck();
      });
  }

  loadAllCommentsByPost() {
    this.facebookCommentService.getCommentsByPostId(this.data?.fbid)
      .pipe(takeUntil(this.destroy$)).subscribe((res: RequestCommentByPost) => {

        // Xử lý nếu bình luận đó là bình luận của 1 post child
        let childIds = Object.keys(res.Extras['childs']);

        if(TDSHelperObject.hasValue(childIds)) {
            childIds.map((x: any) => {
                let splitParentId = x.split("_");
                let splitPostId = this.data.fbid.split("_");

                if(splitParentId && splitParentId[0] == splitPostId[0]) {
                    res.Items = [...res.Items, ...(res.Extras['childs'] as any)[x]];
                }
            })
        }

        this.objComment = res;
        this.childs = res.Extras['childs'] || {};
        this.isLoading = false;

        this.cdRef.markForCheck();
    }, error => {
        this.message.error(`${error?.error?.message}` || 'Load comment bài viết đã xảy ra lỗi');
        this.isLoading = false;
        this.cdRef.markForCheck();
    });
  }

  getCommentOrders(posId: string) {
    this.facebookCommentService.getCommentsOrderByPost(posId)
      .pipe(takeUntil(this.destroy$)).subscribe((res: OdataCommentOrderPostDTO) => {

          res?.value.map((x: CommentOrderPost) => {
              this.commentOrders[x.asuid] = [];
              this.commentOrders[x.uid] = [];

              if (TDSHelperArray.hasListValue(x.orders)) {
                  x.orders.map((a: CommentOrder) => {
                      this.commentOrders[x.asuid].push(a);
                  });

                  if (x.uid && x.uid != x.asuid) {
                      x.orders.map((a: any) => {
                          this.commentOrders[x.uid].push(a);
                      });
                  }
              }
          });
          this.cdRef.markForCheck();
      }, error => {
          this.message.error(`${error?.error?.message}`);
          this.cdRef.markForCheck();
    });
  }

  onSetCommentOrders(){
    this.subSetCommentOrders$ = this.saleOnline_OrderService.onSetCommentOrders
      .pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
          let data = res?.data;

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
    });

    this.facebookPostService.onRemoveOrderComment.pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
        let keys = Object.keys(this.commentOrders);
        keys.forEach(key => {
          this.commentOrders[key] = this.commentOrders[key].filter((x: any) => x.id && !res.includes(x.id));
        })
    })

    this.sgRConnectionService._onSaleOnlineOrder$.pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
        if(res.data) {
          let data = res.data;
          let userId = data.facebook_ASUserId;

          if(data.facebook_PostId == this.data.fbid) {
            let dataAdd = {} as any;
            if(this.commentOrders[userId]) {
                this.commentOrders[userId] = this.commentOrders[userId].filter((x: any) => x.id && !data.id);
                dataAdd = {
                    code: data.code,
                    id: data.id,
                    index: data.index,
                    session: data.session
                };
            } else {
                this.commentOrders[userId] = [];
                dataAdd = {
                    code: data.code,
                    id: data.id,
                    index: data.index,
                    session: data.session
                };
            }
            this.commentOrders[userId].push(dataAdd);
          }
        }
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes["data"] && !changes["data"].firstChange) {
      this.currentSort = this.sortOptions[0];
      this.currentFilter = this.filterOptions[0];

      this.data = changes["data"].currentValue;
      this.loadData();
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
    this.facebookCommentService.setSort(event.value);
    this.loadData();
  }

  onChangeExcel(event: any) {
    switch(event.value) {
        case "excel":
          this.excelExportService.exportPost(`/facebook/exportcommentstoexcelv2?postid=${this.data.fbid}`, null,`comments-${this.data.fbid}`)
              .pipe(finalize(() => this.isProcessing = false), takeUntil(this.destroy$)).subscribe();
          break;

        case "excel_phone":
          this.excelExportService.exportPost(`/facebook/exportcommentstoexcelv2?postid=${this.data.fbid}&isPhone=true&isFilterPhone=true`, null, `comments-${this.data.fbid}-with-distinct-phone`)
            .pipe(finalize(() => this.isProcessing = false), takeUntil(this.destroy$)).subscribe();
          break;

        case "excel_phone_distinct":
          this.excelExportService.exportPost(
            `/facebook/exportcommentstoexcelv2?postid=${this.data.fbid}&isPhone=true`, null,`comments-${this.data.fbid}-with-phone`)
            .pipe(finalize(() => this.isProcessing = false), takeUntil(this.destroy$)).subscribe();
          break;

        default:
          break;
    }
  }

  onChangeFilter(event: any): any {
    if (this.isProcessing) { return }

    if(!TDSHelperString.hasValueString(this.data.fbid)) {
      return this.message.error('Không tìm thấy bài post');
    }

    this.currentFilter = event;
    this.loadData();
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

    this.facebookCommentService.fetchComments(this.team!.Id, this.data.fbid).subscribe((res: any) => {
        this.facebookCommentService.setSort(this.currentSort.value);
        this.loadData();
      }, error => {
          this.message.error('Thao tác thất bại');
      })
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
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        data:  this.data
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

    this.subSetCommentOrders$.unsubscribe();
    this.facebookComment$.unsubscribe();
    this.facebookScanData$.unsubscribe();
  }

}
