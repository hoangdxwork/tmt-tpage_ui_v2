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
  indClickFilter = 0;
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

  isLoading: boolean = false;
  isProcessing: boolean = false;
  indClickTag: string = '';
  keyWords: string | TDSSafeAny = '' ;

  drawerEditLiveCampaign: boolean = false;
  visibleDrawerEditLive: boolean = false;

  constructor(private facebookPostService: FacebookPostService,
    private excelExportService: ExcelExportService,
    private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef,
    private cdRef: ChangeDetectorRef,
    private liveCampaignService: LiveCampaignService,
    private facebookCommentService: FacebookCommentService,
    private postEvent: ConversationPostEvent,
    private objectFacebookPostEvent: ObjectFacebookPostEvent,
    private message: TDSMessageService,
    private destroy$: TDSDestroyService,
    private sharedService: SharedService) {
  }

  ngOnInit() {
    this.loadDefaultProduct();
    this.eventEmitter();

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
      this.cdRef.detectChanges();
    }
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

    //TODO: Tổng bình luận bài viết
    this.postEvent.lengthLstObject$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (length: any) => {
          if(length && this.team.Type == CRMTeamType._Facebook && this.data.Data) {
            (this.data.Data as MDB_Facebook_Mapping_PostDto).count_comments = length;

            this.cdRef.detectChanges();
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
    this.sharedService.checkPrermission().pipe(takeUntil(this.destroy$)).subscribe(
      {
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
    this.innerText.nativeElement.value = '';
    delete this.keyWords;

    if(teamId && this.data.ObjectId) {
      this.facebookCommentService.fetchComments(teamId, this.data.ObjectId).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {
            // TODO: gán lại data để đẩy vào ngOnChanges CommentFilterAllComponent
            this.data = {...this.data};
            this.cdRef.detectChanges();
        },
        error: error => {
            this.message.error(`${error?.error?.message}`);
        }
      })
    }

  }

  showModalLiveCampaign(data: ChatomniObjectsItemDto, liveCampaignId?: string) {
    if(liveCampaignId) {
      const modal = this.modalService.create({
        title: 'Tổng quan chiến dịch live',
        content: OverviewLiveCampaignComponent,
        size: "xl",
        bodyStyle: {
          padding: '0px'
        },
        viewContainerRef: this.viewContainerRef,
        componentParams: {
            liveCampaignId: liveCampaignId,
            data: data
        }
      });
    } else {
      const modal = this.modalService.create({
        title: 'Chiến dịch',
        content: FacebookLiveCampaignPostComponent,
        size: "lg",
        viewContainerRef: this.viewContainerRef,
        componentParams: {
            data: data
        }
      })
    }
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
      let date = formatDate((this.data.Data as MDB_Facebook_Mapping_PostDto).created_time, 'dd/MM/yyyy HH:mm:ss', 'en-US');

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
        size: "xl",
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

}
