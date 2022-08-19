import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivityStatus } from 'src/app/lib/enum/message/coversation-message';
import { FacebookPostItem } from 'src/app/main-app/dto/facebook-post/facebook-post.dto';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { ConversationPostFacade } from 'src/app/main-app/services/facades/conversation-post.facade';
import { FacebookCommentService } from 'src/app/main-app/services/facebook-comment.service';
import { FacebookPostService } from 'src/app/main-app/services/facebook-post.service';
import { SaleOnline_OrderService } from 'src/app/main-app/services/sale-online-order.service';
import { SignalRConnectionService } from 'src/app/main-app/services/signalR/signalR-connection.service';
import { RequestCommentByPost } from 'src/app/main-app/dto/conversation/post/comment-post.dto';
import { CommentOrder, CommentOrderPost, OdataCommentOrderPostDTO } from 'src/app/main-app/dto/conversation/post/comment-order-post.dto';
import { RequestCommentByGroup } from 'src/app/main-app/dto/conversation/post/comment-group.dto';
import { TDSMessageService } from 'tds-ui/message';
import { TDSHelperArray, TDSHelperObject, TDSSafeAny } from 'tds-ui/shared/utility';

@Component({
  selector: 'item-post-comment',
  templateUrl: './item-post-comment.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ItemPostCommentComponent implements OnInit, OnChanges, OnDestroy {

  @Input() post!: FacebookPostItem;
  @Input() sort: any;
  @Input() filter: any;

  @Input() isShowCheckboxComent: boolean = true;
  @Input() currentFilterComment: TDSSafeAny;
  @Input() textSearchFilterComment!: string;
  @Input() isShowFilterUser!: boolean;
  @Input() checkedAll!: boolean;

  @Output() onOuputCheckAll = new EventEmitter<boolean>();
  @Output() onOuputIndeterminate = new EventEmitter<boolean>();
  setOfCheckedId = new Set<string>();

  team!: CRMTeamDTO | null;
  data: any = { Items: []};
  enumActivityStatus = ActivityStatus;
  partners$!: Observable<any>;
  facebookComment$!: Subscription;
  facebookScanData$!: Subscription;
  childs: any = {};
  commentOrders: any = [];
  subSetCommentOrders$!: Subscription;

  destroy$ = new Subject<void>();
  messageModel!: string;
  isLoading: boolean = false;

  currentSort = { value: "DateCreated desc", text: "Mới nhất" };
  currentFilter = { value: "all", text: "Tất cả bình luận" };

  constructor(private message: TDSMessageService,
    private saleOnline_OrderService: SaleOnline_OrderService,
    private sgRConnectionService: SignalRConnectionService,
    private conversationPostFacade: ConversationPostFacade,
    private facebookCommentService: FacebookCommentService,
    private facebookPostService: FacebookPostService,
    private cdRef : ChangeDetectorRef,
    public crmService: CRMTeamService) {
  }

  ngOnInit() {
    this.initialize();
    //TODO xử lý lấy thông tin order tại đây
    if(this.post) {
      this.onSetCommentOrders();
      this.loadData();
    }
    // TODO: filter & sort bài viết
    this.onFilterSortPost();
  }

  onFilterSortPost(){
    this.facebookCommentService.onFilterSortCommentPost$.pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      switch(res?.type){
        case 'sort':
            this.currentSort = {...res.data};
            this.facebookCommentService.setSort(res.data.value);
            this.loadData();
          break;
        case 'filter':
            this.currentFilter = {...res.data};
            this.loadData();
          break;
        default:
          this.facebookCommentService.fetchComments(this.team!.Id, this.post.fbid)
            .subscribe((res: any) => {
              this.message.success('Tải lại dữ liệu thành công!');
              this.currentSort = { value: "DateCreated desc", text: "Mới nhất" };
              this.currentFilter = { value: "all", text: "Tất cả bình luận" };

              this.facebookCommentService.setSort(this.currentSort.value);
              this.loadData();
          }, error => {
            this.message.error('Thao tác thất bại');
          })
          break;
      }
    })
  }

  initialize(){
    // this.team = this.crmService.getCurrentTeam() as any;
    // this.conversationPostFacade.setPartnerSimplest(this.team);

    this.crmService.onChangeTeam().pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.team = res;
    })

    this.facebookComment$ = this.sgRConnectionService._onFacebookEvent$.pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      if(res?.data?.last_activity?.comment_obj &&  res?.data?.last_activity?.type == 2) {
        let comment_obj = res.data?.last_activity?.comment_obj;

        if (comment_obj?.object?.id == this.post?.fbid) {
          if(comment_obj?.parent?.id != this.post.fbid) {
            this.childs[comment_obj.parent.id].unshift(comment_obj);
          } else {
            this.data.Items.unshift(comment_obj);
          }
        }
      }
    });

    this.facebookScanData$ = this.sgRConnectionService._onFacebookScanData$.pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      if(res.data) {
          let data = Object.assign({}, res.data);
          if(res.type == "update_scan_feed") {
            if(data.comment?.object?.id == this.post?.fbid) {
                this.data.Items = [...[data.comment], ...this.data.Items];
            }
          }
      }
    });
  }

  onSetCommentOrders(){
    this.subSetCommentOrders$ = this.saleOnline_OrderService.onSetCommentOrders$.pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
        if(res) {
          let data = res.data;

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

    this.facebookPostService.onRemoveOrderComment$
      .pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
        let keys = Object.keys(this.commentOrders);
        keys.forEach(key => {
          this.commentOrders[key] = this.commentOrders[key].filter((x: any) => x.id && !res.includes(x.id));
        })
    })

    this.sgRConnectionService._onSaleOnlineOrder$.pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
        if(res.data) {
          let data = res.data;
          let userId = data.facebook_ASUserId;

          if(data.facebook_PostId == this.post.fbid) {
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

  validateData(){
    (this.data as any) = null;
    this.childs = null;
    this.commentOrders = [];
  }

  validateCheck(){
    this.setOfCheckedId = new Set<string>();
    this.onOuputCheckAll.emit(false);
    this.onOuputIndeterminate.emit(false);
  }

  loadData() {
    this.isLoading = true;
    this.validateData();
    this.getCommentOrders(this.post.fbid);

    switch(this.currentFilter.value){
      case 'group':
        // TODO: Lọc theo người dùng
        this.validateCheck();
        this.loadGroupCommentsByPost();
        break;
      case 'filter':
        // TODO: Lọc theo bình luận
        this.loadFilterCommentsByPost();
        break;
      case 'manage':
          // TODO:Quản lý bình luận
          this.validateCheck();
          this.loadManageCommentsByPost();
          break;
      default:
        // TODO: Tất cả bình luận
        this.loadAllCommentsByPost();
        break;
    }
  }

  loadGroupCommentsByPost() {
    this.facebookCommentService.getGroupCommentsByPostId(this.post?.fbid)
      .pipe(takeUntil(this.destroy$)).subscribe((res: RequestCommentByGroup) => {

        if(TDSHelperArray.hasListValue(res.Items)) {
          res.Items.map((x: any) => {
            let first = x.activities[0];
            x.created_time = first.created_time;
          });
        }
        this.data = res;
        this.isLoading = false;

        this.cdRef.detectChanges();
    }, error => {
      this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Lọc theo người dùng đã xảy ra lỗi');
      this.isLoading = false;

      this.cdRef.detectChanges();
    });
  }

  loadFilterCommentsByPost(){
    this.facebookCommentService.getFilterCommentsByPostId(this.post?.fbid)
      .pipe(takeUntil(this.destroy$)).subscribe((res: RequestCommentByGroup) => {

        if(TDSHelperArray.hasListValue(res.Items)) {
          res.Items.map((x: any) => {
            let first = x.activities[0];
            x.message = first.message;
            x.created_time = first.created_time;
          });
        }
        this.data = res;
        this.isLoading = false;

        this.cdRef.detectChanges();
    }, error => {
      this.message.error(`${error?.error?.message}` ? `${error?.error?.message}`: 'Lọc theo bình luận đã xảy ra lỗi');
      this.isLoading = false;

      this.cdRef.detectChanges();
    });
  }

  loadManageCommentsByPost(){
    this.facebookCommentService.getManageCommentsByLimit(this.post?.fbid)
      .pipe(takeUntil(this.destroy$)).subscribe((res: RequestCommentByPost) => {

        if(TDSHelperArray.hasListValue(res.Items)) {
          res.Items.forEach((x: any) => {
            x["selected"] = false;
            x["error_message"] = null;
          });
        }
        this.data = res;
        this.isLoading = false;

        this.cdRef.detectChanges();
      }, error => {
        this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Đã xảy ra lỗi');
        this.isLoading = false;

        this.cdRef.detectChanges();
      });
  }

  loadAllCommentsByPost() {
    this.facebookCommentService.getCommentsByPostId(this.post?.fbid)
      .pipe(takeUntil(this.destroy$)).subscribe((res: RequestCommentByPost) => {

        // Xử lý nếu bình luận đó là bình luận của 1 post child
        const childIds = Object.keys(res.Extras['childs']);
        if(TDSHelperObject.hasValue(childIds)) {
            childIds.map((x: any) => {
            let splitParentId = x.split("_");
            let splitPostId = this.post.fbid.split("_");

            if(splitParentId && splitParentId[0] == splitPostId[0]) {
              res.Items = [...res.Items, ...(res.Extras['childs'] as any)[x]];
            }
          })
        }

        this.data = res;
        this.childs = res.Extras['childs'] || {};
        this.isLoading = false;

        this.cdRef.detectChanges();
    }, error => {
      this.message.error(`${error?.error?.message}` || 'Load comment bài viết đã xảy ra lỗi');
      this.isLoading = false;

      this.cdRef.detectChanges();
    });
  }

  getCommentOrders(posId: string) {
    this.facebookCommentService.getCommentsOrderByPost(posId)
      .pipe(takeUntil(this.destroy$)).subscribe((res: OdataCommentOrderPostDTO) => {

        if(TDSHelperArray.hasListValue(res.value)) {
          res.value.map((x: CommentOrderPost) => {

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
        }

        this.cdRef.detectChanges();
    });
  }

  onCheckAll(event: boolean){
    this.onOuputCheckAll.emit(event);
  }

  onIndeterminate(event: boolean){
    this.onOuputIndeterminate.emit(event);
  }

  onSetOfCheckedId(event: Set<string>){
    this.setOfCheckedId = event;
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes["post"] && !changes["post"].firstChange) {
      this.post = {...changes["post"].currentValue};

      this.currentSort = { value: "DateCreated desc", text: "Mới nhất" };
      this.currentFilter = { value: "all", text: "Tất cả bình luận" };

      this.facebookCommentService.setSort(this.currentSort.value);
      this.loadData();
    }
  }

  ngOnDestroy(): void {
    this.subSetCommentOrders$.unsubscribe();
    this.facebookComment$.unsubscribe();
    this.facebookScanData$.unsubscribe();

    this.destroy$.next();
    this.destroy$.complete();
  }

}
