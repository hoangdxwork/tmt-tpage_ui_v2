import { GetSharedDto } from './../../../dto/conversation/post/get-shared.dto';
import { ModalGetSharedComponent } from './../components/modal-get-shared/modal-get-shared.component';
import { ChatomniDataTShopPostDto } from './../../../dto/conversation-all/chatomni/chatomni-tshop-post.dto';
import { OverviewLiveCampaignComponent } from '../../../shared/overview-live-campaign/overview-live-campaign.component';
import { SharedService } from '../../../services/shared.service';
import { ModalProductDefaultComponent } from '../components/modal-product-default/modal-product-default.component';
import { ProductDTOV2 } from 'src/app/main-app/dto/product/odata-product.dto';
import { ModalListProductComponent } from '../components/modal-list-product/modal-list-product.component';
import { ConversationPostEvent } from '../../../handler-v2/conversation-post/conversation-post.event';
import { ObjectFacebookPostEvent } from '../../../handler-v2/conversation-post/object-facebook-post.event';
import { TDSDestroyService } from 'tds-ui/core/services';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, ViewContainerRef, EventEmitter } from '@angular/core';
import { takeUntil, finalize, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { FacebookCommentService } from 'src/app/main-app/services/facebook-comment.service';
import { FacebookPostService } from 'src/app/main-app/services/facebook-post.service';
import { ExcelExportService } from 'src/app/main-app/services/excel-export.service';
import { formatDate } from '@angular/common';
import { ModalReportOrderPostComponent } from '../components/post-filter/modal-report-order-post.component';
import { ConfigPostOutletComponent } from '../components/config-post/config-post-outlet.component';
import { TDSModalService } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { TDSHelperString, TDSSafeAny, TDSHelperObject } from 'tds-ui/shared/utility';
import { ChatomniObjectsItemDto, MDB_Facebook_Mapping_PostDto } from '@app/dto/conversation-all/chatomni/chatomni-objects.dto';
import { Detail_QuickSaleOnlineOrder } from '@app/dto/saleonlineorder/quick-saleonline-order.dto';
import { FacebookLiveCampaignPostComponent } from './facebook-livecampaign-post/facebook-livecampaign-post.component';
import { CRMTeamType } from '@app/dto/team/chatomni-channel.dto';
import { fromEvent } from 'rxjs';
import { LiveCampaignService } from '@app/services/live-campaign.service';
import { SocketEventSubjectDto, SocketOnEventService } from '@app/services/socket-io/socket-onevent.service';
import { ChatmoniSocketEventName } from '@app/services/socket-io/soketio-event';
import { GroupCommentsService } from '@app/services/group-comment.service';
import { FacebookPostDTO } from '@app/dto/facebook-post/facebook-post.dto';
import { SharesDetailModalComponent } from '@app/shared/tds-conversations/shares-detail-modal/shares-detail-modal.component';

@Component({
  selector: 'conversation-post-overview',
  templateUrl: './conversation-post-overview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ TDSDestroyService ]
})

export class ConversationPostOverViewComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() data!: ChatomniObjectsItemDto;
  @Input() team!: CRMTeamDTO;
  @Input() widthConversation!: number;

  @ViewChild('innerText') innerText!: ElementRef;

  orderTotal = 0;
  indClickFilter!: number;
  isShowFilterUser = false;
  indeterminate: boolean = false;
  checked: boolean = false;

  defaultProductPost?: Detail_QuickSaleOnlineOrder;

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
    { value: "excel_phone_distinct", text: "Tải file excel có lọc trùng SĐT" },
  ];

  filterOptionsComment: any[] = [
    { value: "All", text: "Từ khóa" },
    { value: "Number", text: "Tìm theo số" },
    { value: "Phone", text: "Tìm số điện thoại" }
  ];
  currentFilterComment = this.filterOptionsComment[0];

  fallbackImg = "../../../assets/imagesv2/errorPic.svg";

  isLoading: boolean = false;
  isProcessing: boolean = false;
  indClickTag: string = '';
  keyWords: string | TDSSafeAny = '' ;

  drawerEditLiveCampaign: boolean = false;
  visibleDrawerEditLive: boolean = false;
  linkFacebook = 'https://www.facebook.com/';

  isChanged: boolean = false;
  isRescanAutoOrder: boolean = false;
  rescanAutoOrderTimer: TDSSafeAny;

  // pageSize = 10000;
  // pageIndex = 1;
  // dataComment!: FacebookPostDTO | any;

  constructor(private facebookPostService: FacebookPostService,
    private excelExportService: ExcelExportService,
    private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef,
    private cdRef: ChangeDetectorRef,
    private socketOnEventService: SocketOnEventService,
    private liveCampaignService: LiveCampaignService,
    private facebookCommentService: FacebookCommentService,
    private postEvent: ConversationPostEvent,
    private objectFacebookPostEvent: ObjectFacebookPostEvent,
    private message: TDSMessageService,
    private destroy$: TDSDestroyService,
    private sharedService: SharedService,
    private groupCommentsService: GroupCommentsService) {
  }

  ngOnInit() {
    this.loadDefaultProduct();

    if(this.data) {
      let objectId = this.data.ObjectId;
      let liveCampaignId = this.data.LiveCampaignId as string;
      let isOpenDrawer = this.drawerEditLiveCampaign;
      let data = this.liveCampaignService.getLocalStorageDrawer() as any;

      let exist = data && TDSHelperString.hasValueString(liveCampaignId) && data.objectId;
      if(exist) {
        this.drawerEditLiveCampaign = data.isOpenDrawer;
        if(data.isOpenDrawer) {
            this.openDrawerEditLiveCampaign();
        }
      } else {
        this.liveCampaignService.setLocalStorageDrawer(objectId, liveCampaignId, isOpenDrawer);
      }

      // this.loadDataGroupComments();
      this.cdRef.detectChanges();
    }

    this.eventEmitter();
    this.onEventSocket();
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
          if(!res) return;
          this.data.LiveCampaignId = res.LiveCampaignId;
          this.data.LiveCampaign =  res.LiveCampaign;

          this.data = {...this.data};
          this.cdRef.detectChanges();
      }
    })

    // TODO: Tổng bình luận bài viết
    this.postEvent.pushCountRealtimeToView$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: ChatomniObjectsItemDto) => {
        let exist = res && this.data && res.ObjectId == this.data.ObjectId;
        if(!exist) return;

        this.data.CountComment = res.CountComment;
        this.cdRef.detectChanges();
      }
    });

    this.objectFacebookPostEvent.onChangeRescanAutoOrder$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: boolean) => {
          let exist = res && this.isRescanAutoOrder && this.rescanAutoOrderTimer;
          if(!exist) return;

          this.destroyTimer();
          this.isRescanAutoOrder = false;
          this.message.success('Đã kích hoạt áp dụng ngay cho những bình luận đã có');

          this.cdRef.detectChanges();
      }
    })
  }

  onEventSocket() {
    this.socketOnEventService.onEventSocket().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: SocketEventSubjectDto) => {
          if(!res) return;

          switch(res?.EventName) {
            case ChatmoniSocketEventName.facebookShareds:
              let fbShared = res.Data?.Data;
              let exist = fbShared && this.data && fbShared.ObjectId == this.data.ObjectId && fbShared.ChannelId == fbShared.ChannelId && this.team?.Type ==  CRMTeamType._Facebook;
              if(exist) {
                  this.data.CountReaction = fbShared.TotalShareds || 0;
                  this.loadSimpleShareds();
              }
              break;
            default: break;
          }
        }
      })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["data"] && !changes["data"].firstChange) {
      this.data = {...changes["data"].currentValue};
      this.innerText.nativeElement.value = '';

      delete this.keyWords;
      this.cdRef.detectChanges();
    }
  }

  onChangeFilterComment(event: TDSSafeAny) {
    this.currentFilterComment = event;
  }

  onChangeSort(event: any) {
    this.currentSort = event;
  }

  onChangeExcel(event: any) {
    this.sharedService.checkPrermission().pipe(takeUntil(this.destroy$)).subscribe({
        next: res =>{
          switch (event.value) {
            case "excel":
              this.excelExportService.exportPost(`/facebook/exportcommentstoexcelv2?postid=${this.data.ObjectId}`, null, `comments-${this.data.ObjectId}`)
                .pipe(finalize(() => this.isProcessing = false)).pipe(takeUntil(this.destroy$)).subscribe();
              break;

            case "excel_phone":
              this.excelExportService.exportPost(
                `/facebook/exportcommentstoexcelv2?postid=${this.data.ObjectId}&isPhone=true`, null, `comments-${this.data.ObjectId}-with-phone`)
                .pipe(finalize(() => this.isProcessing = false)).pipe(takeUntil(this.destroy$)).subscribe();
              break;

            case "excel_phone_distinct":
              this.excelExportService.exportPost(`/facebook/exportcommentstoexcelv2?postid=${this.data.ObjectId}&isPhone=true&isFilterPhone=true`, null, `comments-${this.data.ObjectId}-with-distinct-phone`)
                .pipe(finalize(() => this.isProcessing = false)).pipe(takeUntil(this.destroy$)).subscribe();
              break;

            default:
              break;
          }
        }, error: error => {
          this.message.error(error?.error?.message || 'Đã xảy ra lỗi');
        }
      }
    );


  }

  onChangeFilter(event: any): any {
    if (this.isProcessing) return;

    if (!TDSHelperString.hasValueString(this.data.ObjectId)) {
      this.message.error('Không tìm thấy bài post');
      return;
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
    this.innerText.nativeElement.value = '';
    delete this.keyWords;

    if(teamId && this.data.ObjectId) {
      this.facebookCommentService.fetchComments(teamId, this.data.ObjectId).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {
            this.data = {...this.data};
            this.cdRef.detectChanges();
        },
        error: error => {
            this.message.error(`${error?.error?.message}`);
            this.cdRef.detectChanges();
        }
      })
    }
  }

  showModalLiveCampaign(data: ChatomniObjectsItemDto, type: string, liveCampaignId?: string) {
    if(liveCampaignId) {
      this.modalService.create({
        title: 'Tổng quan chiến dịch live',
        content: OverviewLiveCampaignComponent,
        size: "xl",
        bodyStyle: {
          padding: '0px'
        },
        viewContainerRef: this.viewContainerRef,
        componentParams: {
            liveCampaignId: liveCampaignId,
            data: data,
            type: type
        }
      });
    } else {
      this.modalService.create({
        title: 'Chiến dịch',
        content: FacebookLiveCampaignPostComponent,
        size: "lg",
        viewContainerRef: this.viewContainerRef,
        componentParams: {
            data: data,
            type: type
        }
      })
    }
  }

  openTag(item: ChatomniObjectsItemDto, type: string) {
    this.indClickTag = item.Id;
    this.showModalLiveCampaign(item, type);
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
    let date = ''
    switch (this.team!.Type) {
      case CRMTeamType._Facebook:
        date = formatDate((this.data.Data as MDB_Facebook_Mapping_PostDto).created_time, 'dd/MM/yyyy HH:mm:ss', 'en-US');
        break;

      case CRMTeamType._TShop:
        date = formatDate((this.data.Data as ChatomniDataTShopPostDto).CreationTime, 'dd/MM/yyyy HH:mm:ss', 'en-US');
        break;

      case CRMTeamType._UnofficialTikTok:
        date = formatDate(this.data.CreatedTime, 'dd/MM/yyyy HH:mm:ss', 'en-US');
        break;

      default:
        break;
    }

    let modal = this.modalService.create({
      content: ConfigPostOutletComponent,
      title: `Cấu hình bài viết ${date}`,
      size: "xl",
      onCancel: () =>{
        modal.componentInstance?.onCancel();
        return false;
      },
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        data: this.data
      }
    });
  }

  fillterAll(data: TDSSafeAny, index: number) {
    this.indClickFilter = index;
    this.facebookCommentService.onFilterSortCommentPost$.emit({ type: 'filter', data: data });

    this.currentFilter = data;
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

  loadDefaultProduct(){
    let exist = this.facebookPostService.getDefaultProductPost();

    if(exist && exist.ProductId){
        this.defaultProductPost = exist;
    }
  }

  showModalSelectProduct(data: TDSSafeAny){
    if(data){
      const modal = this.modalService.create({
        title: 'Sản phẩm mặc định',
        content: ModalProductDefaultComponent,
        size: "xl",
        viewContainerRef: this.viewContainerRef,
        componentParams:{
          defaultProduct: data
        }
      });

      modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe((result: boolean) => {
        let exist = this.facebookPostService.getDefaultProductPost();
        this.defaultProductPost = exist as TDSSafeAny;

        this.cdRef.detectChanges();
      })
    } else {
      const modal = this.modalService.create({
        title: 'Chọn sản phẩm',
        content: ModalListProductComponent,
        size: "lg",
        bodyStyle: {
          padding: '0px'
        },
        viewContainerRef: this.viewContainerRef,
        componentParams:{
          defaultOrder: true
        }
      });

      modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe((result: ProductDTOV2) => {
        if(TDSHelperObject.hasValue(result)){
          this.defaultProductPost = this.prepareModel(result);
          this.facebookPostService.setDefaultProductPost(this.defaultProductPost);
          this.cdRef.detectChanges();
        }
      })
    }
  }

  prepareModel(data: TDSSafeAny){
    return {
      Id: null,
      Quantity: 1,
      Price: data?.ListPrice || data?.Price,
      ProductId: data?.Id,
      ProductName: data?.Name,
      ProductNameGet: data?.NameGet,
      ProductCode: data?.DefaultCode,
      UOMId: data?.UOMId,
      UOMName: data?.UOMName || data?.UOM?.Name,
      Factor: data?.Factor,
      ImageUrl: data?.ImageUrl
    } as Detail_QuickSaleOnlineOrder;
  }

  ngAfterViewInit() {
    if(this.innerText?.nativeElement) {
      fromEvent(this.innerText?.nativeElement, 'keyup').pipe(
        map((event: any) => {
            return event.target.value;
        }) , debounceTime(750)

      ).subscribe({
        next: (text: string) => {
            this.keyWords = text.trim();
            this.cdRef.markForCheck();
        }
      })
    }
  }

  onChangeDrawerEditLive(event: any) {
    this.visibleDrawerEditLive = event;
    let liveCampaignId = this.data.LiveCampaignId as string;
    if(event) {
        this.liveCampaignService.setLocalStorageDrawer(this.data.ObjectId, liveCampaignId, event);
    } else {
        this.liveCampaignService.removeLocalStorageDrawer();
    }
  }

  openDrawerEditLiveCampaign() {
    this.visibleDrawerEditLive = true;
  }

  closeDrawerEditLiveCampaign(): void {
    this.visibleDrawerEditLive = false;
    this.drawerEditLiveCampaign = false;

    let liveCampaignId = this.data.LiveCampaignId as string;
    this.liveCampaignService.setLocalStorageDrawer(this.data.ObjectId, liveCampaignId, false);
  }

  onRescanAutoOrder() {
    this.destroyTimer();
    this.isRescanAutoOrder = true;

    this.facebookPostService.rescanAutoOrder(this.data?.ObjectId, this.team?.Id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          this.rescanAutoOrderTimer = setTimeout(() => {
              this.isRescanAutoOrder = false;
              this.message.success('Đã kích hoạt áp dụng ngay cho những bình luận đã có');
              this.cdRef.detectChanges();
          }, 2 * 10 * 1000);
      },
      error: error => {
          this.isRescanAutoOrder = false;
          this.message.error(error?.error?.message);
          this.cdRef.detectChanges();
      }
    })
  }

  destroyTimer() {
    if (this.rescanAutoOrderTimer) {
      clearTimeout(this.rescanAutoOrderTimer);
    }
  }

  ngOnDestroy(): void {
    this.destroyTimer();
  }

  loadSimpleShareds() {
    let objectId = this.data.ObjectId;
    this.sharedService.getSimpleShareds(objectId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        if(res && res.length > 0) {
          const modal = this.modalService.create({
            title: `Danh sách lượt chia sẻ (${res.length})`,
            content: ModalGetSharedComponent,
            size: "lg",
            bodyStyle: {
              padding: '0px'
            },
            viewContainerRef: this.viewContainerRef,
            componentParams:{
              lstShares: res
            }
          });
        }
      },
      error: (err: any) => {
        this.message.error(err?.error?.message);
      }
    })
  }

  fbGetShareds() {
    if(this.team && this.team.Type ==  CRMTeamType._Facebook) {
      let objectId = this.data.ObjectId;
      if(!objectId) {
        this.message.error('Không tìm thấy ObjectId');
        return;
      }

      let teamId = this.team.Id;
      if(!teamId) {
        this.message.error('Không tìm thấy TeamId');
        return;
      }

      let uid = this.team.ChannelId || this.team.Facebook_ASUserId;
      if(!uid) {
        this.message.error('Không tìm thấy uid');
        return;
      }

      this.sharedService.fbGetShareds(uid, objectId, teamId).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: GetSharedDto[]) => {
          if(res && res.length > 0) {
            this.data.CountReaction = res.length || 0;

            this.modalService.create({
              title: 'Số lượt share',
              content: SharesDetailModalComponent,
              size: "xl",
              bodyStyle: { padding : '0px'},
              viewContainerRef: this.viewContainerRef,
              componentParams:{
                lstShared: res,
                objectId: objectId,
                team: this.team
              }
            });
          } else {
            this.message.info('Không có lượt chia sẻ nào');
          }
        },
        error: (error: any) => {
          this.message.error(error?.error?.message);
        }
      })
    }
  }


  // loadDataGroupComments() {
  //   this.isLoading = true;
  //   let params = `page=${this.pageIndex}&limit=${this.pageSize}`;

  //   this.groupCommentsService.getGroupComments(this.data.ObjectId, params).pipe(takeUntil(this.destroy$)).subscribe({
  //     next: (res: FacebookPostDTO) => {
  //       this.dataComment = res;
  //       console.log(this.dataComment);

  //       this.isLoading = false;
  //     }, error: (err: any) => {
  //       this.message.error(`${err?.error?.message}` ? `${err?.error?.message}` : "Load dữ liệu thất bại!");
  //       this.isLoading = false;
  //     }
  //   })
  // }
}
