import { GenerateTagAttributesFacade } from '@app/services/facades/generate-tag-attributes.facade';
import { InventoryChangeType } from './../../../../dto/product-pouchDB/product-pouchDB.dto';
import { ModalLiveCampaignBillComponent } from './../../../live-campaign/components/modal-live-campaign-bill/modal-live-campaign-bill.component';
import { ModalLiveCampaignOrderComponent } from './../../../live-campaign/components/modal-live-campaign-order/modal-live-campaign-order.component';
import { NgxVirtualScrollerDto } from '@app/dto/conversation-all/ngx-scroll/ngx-virtual-scroll.dto';
import { THelperDataRequest } from '../../../../../lib/services/helper-data.service';
import { ProductIndexDBService } from '../../../../services/product-indexdb.service';
import { ProductTemplateV2DTO } from '../../../../dto/product-template/product-tempalte.dto';
import { SyncCreateProductTemplateDto } from '../../../../dto/product-pouchDB/product-pouchDB.dto';
import { ModalListPostComponent } from '../../components/modal-list-post/modal-list-post.component';
import { GetAllFacebookPostDTO } from '../../../../dto/live-campaign/getall-facebook-post.dto';
import { DetailExistsDTO, OverviewReportDTO, ReportLiveCampaignDetailDTO } from '../../../../dto/live-campaign/report-livecampain-overview.dto';
import { DrawerAddProductComponent } from './drawer-add-product.component';
import { ViewContainerRef, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation, ViewChild, ElementRef, OnDestroy } from "@angular/core";
import { LiveCampaignService } from "@app/services/live-campaign.service";
import { TDSDestroyService } from "tds-ui/core/services";
import { takeUntil} from "rxjs";
import { TDSMessageService } from "tds-ui/message";
import { DataPouchDBDTO, KeyCacheIndexDBDTO } from "@app/dto/product-pouchDB/product-pouchDB.dto";
import { LiveCampaignSimpleDetail, LiveCampaignSimpleDto } from "@app/dto/live-campaign/livecampaign-simple.dto";
import { TDSModalService } from "tds-ui/modal";
import { TDSHelperArray, TDSHelperString, TDSSafeAny } from "tds-ui/shared/utility";
import { GetInventoryDTO } from "@app/dto/product/product.dto";
import { SharedService } from "@app/services/shared.service";
import { CompanyCurrentDTO } from "@app/dto/configs/company-current.dto";
import { ProductService } from "@app/services/product.service";
import { TDSNotificationService } from "tds-ui/notification";
import { SocketEventSubjectDto, SocketOnEventService } from '@app/services/socket-io/socket-onevent.service';
import { ChatmoniSocketEventName } from '@app/services/socket-io/soketio-event';
import { LiveCampaigntAvailableToBuyDto, LiveCampaigntPendingCheckoutDto } from '@app/dto/socket-io/livecampaign-checkout.dto';
import { ProductTemplateFacade } from '@app/services/facades/product-template.facade';
import { VirtualScrollerComponent } from 'ngx-virtual-scroller';
import { ModalSendCommentComponent } from '../../components/modal-send-comment/modal-send-comment.component';

@Component({
  selector: 'drawer-edit-livecampaign',
  templateUrl: './drawer-edit-livecampain.component.html',
  styleUrls: ['./drawer-edit-livecampain.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ TDSDestroyService ],
  host: {
    class: 'h-full w-full flex'
  }
})

export class DrawerEditLiveCampaignComponent implements OnInit, OnDestroy {

  @Input() liveCampaignId: any;
  @Input() visibleDrawerEditLive!: boolean;
  @Input() objectId!: string;
  @ViewChild('innerText') viewChildInnerText!: ElementRef;
  @ViewChild(VirtualScrollerComponent) virtualScroller!: VirtualScrollerComponent;

  isLoading: boolean = false;
  indexDbStorage!: DataPouchDBDTO[];
  isLoadingProduct: boolean = false;
  count: number = 0;

  lstDetail: ReportLiveCampaignDetailDTO[] = [];
  isEditDetails: { [id: string] : ReportLiveCampaignDetailDTO } = {};
  innerTextValue: string = '';
  searchValue: string = '';
  innerText: string = '';
  innerTextDebounce!: string;
  indClick: number = -1;

  lstVariants: DataPouchDBDTO[] = [];
  lstInventory: GetInventoryDTO | any;
  companyCurrents!: CompanyCurrentDTO;

  visible: boolean = false;
  indClickTag: number = -1;
  modelTags: Array<string> = [];
  isLoadingSelect: boolean = false;
  isLoadingTable: boolean = false;

  dataOverviewReport!: OverviewReportDTO;
  facebookPosts: GetAllFacebookPostDTO[] = [];
  pageSize: number = 10;
  pageIndex: number = 1;
  resfeshScroll: boolean = false;
  animateSocket: any = {};
  changedItems: { [key: string] : ReportLiveCampaignDetailDTO } = {};
  lstWaitingItems: any[] = [];
  changeDetailTimer: any;
  startIndex: number = 0;

  lstOrderTags!: string[];
  lstSimpleDetail: LiveCampaignSimpleDetail[] = [];

  isShowEditLimitedQuantity!: boolean;
  limitedQuantityAll: number = 0;

  numberWithCommas =(value: TDSSafeAny) => {
    if(value != null) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    return value;
  }

  parserComas = (value: TDSSafeAny) => {
    if(value != null) {
      return TDSHelperString.replaceAll(value,'.','');
    }
    return value;
  }

  response: any;
  productIds: { [key: string]: DetailExistsDTO } = {};
  orderTags: { [key: string] : string[] } = {};

  isShowIsActiveProduct: boolean = false;
  isIsActiveProduct: boolean = false;

  unactiveProduct: boolean = false;
  activeProduct: boolean = false;

  constructor(private liveCampaignService: LiveCampaignService,
    private message: TDSMessageService,
    private modal: TDSModalService,
    private cdRef: ChangeDetectorRef,
    private productIndexDBService: ProductIndexDBService,
    private sharedService: SharedService,
    private productService: ProductService,
    private notificationService: TDSNotificationService,
    private viewContainerRef: ViewContainerRef,
    private socketOnEventService: SocketOnEventService,
    private productTemplateFacade: ProductTemplateFacade,
    private generateTagAttributesFacade: GenerateTagAttributesFacade,
    private destroy$: TDSDestroyService) {
  }

  ngOnInit() {
    if(!this.visibleDrawerEditLive) return;

    if(this.liveCampaignId) {
      this.loadOverviewDetails(this.pageSize, this.pageIndex); //TODO: load dữ liệu danh sách sản phẩm
      this.loadOverviewReport(); //TODO: load dữ liệu thống kê tổng quan
      this.loadFacebookPost(); //TODO: load dữ liệu bài viết fb
      this.loadDataDetail(); //TODO: load hết danh sách detail
    }

    this.loadCurrentCompany(); //TODO: load dữ liệu tồn kho
    this.productLastV2(); //TODO: load danh sách sản phẩm từ cache

    this.onEventSocket();
    this.eventEmitter();
  }

  onEventSocket() {
    this.socketOnEventService.onEventSocket().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: SocketEventSubjectDto) => {
          if(!this.liveCampaignId) return;
          if(this.isLoading) return;

          switch(res?.EventName) {
              // Số lượng sản phẩm chiến dịch chờ chốt
              case ChatmoniSocketEventName.livecampaign_Quantity_Order_Pending_Checkout:

                  let pCheckout = res.Data.Data as LiveCampaigntPendingCheckoutDto;
                  if(pCheckout && pCheckout.LiveCampaignId != this.liveCampaignId) break;

                  if(this.startIndex == 0) {
                    //sắp xếp lên đầu danh sách
                    this.arrangeChangedItem(pCheckout);
                  } else {
                    this.lstWaitingItems.push(pCheckout);
                  }

                  const iCheckout = this.lstDetail.findIndex(x => x.ProductId == pCheckout.ProductId && x.UOMId == pCheckout.ProductUOMId);
                  if(Number(iCheckout) < 0) break;
                  this.animateSocket[`${this.lstDetail[iCheckout].ProductId}_${this.lstDetail[iCheckout].UOMId}_queueQty`] = true;

                  this.lstDetail[iCheckout].QueueQuantity = pCheckout.Quantity;
                  this.lstDetail[iCheckout] = {...this.lstDetail[iCheckout]};
                  this.lstDetail = [...this.lstDetail];

                  this.destroyTimer();
                  this.changeDetailTimer = setTimeout(() => {
                    this.animateSocket = {};
                    this.cdRef.markForCheck();
                  }, 2000);

                  this.cdRef.markForCheck();
              break;

              // Số lượng sản phẩm chiến dịch có thểm mua
              case ChatmoniSocketEventName.livecampaign_Quantity_AvailableToBuy:

                  let toBuy = res.Data?.Data as LiveCampaigntAvailableToBuyDto;
                  if(toBuy && toBuy.LiveCampaignId != this.liveCampaignId) break;

                  if(this.startIndex == 0) {
                    //sắp xếp lên đầu danh sách
                    this.arrangeChangedItem(toBuy);
                  } else {
                    this.lstWaitingItems.push(toBuy);
                  }

                  const iToBuy = this.lstDetail.findIndex(x => x.ProductId == toBuy.ProductId && x.UOMId == toBuy.ProductUOMId);
                  if(Number(iToBuy) < 0) break;
                  this.animateSocket[`${this.lstDetail[iToBuy].ProductId}_${this.lstDetail[iToBuy].UOMId}_usedQty`] = true;

                  this.lstDetail[iToBuy].UsedQuantity = (this.lstDetail[iToBuy].Quantity - toBuy.QuantityAvailableToBuy);
                  this.lstDetail[iToBuy] = {...this.lstDetail[iToBuy]};
                  this.lstDetail = [...this.lstDetail];

                  this.destroyTimer();
                  this.changeDetailTimer = setTimeout(() => {
                    this.animateSocket = {};
                    this.cdRef.markForCheck();
                  }, 2000);

                  this.cdRef.markForCheck();
              break;
          }
      }
    })
  }

  eventEmitter() {
    this.productTemplateFacade.onStockChangeProductQty$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (obs: any) => {
        if(obs !== InventoryChangeType._DRAWER_ADD_PRODUCT) return;

        let warehouseId = this.companyCurrents?.DefaultWarehouseId;
        if(warehouseId > 0) {
          this.productService.lstInventory = null;
          this.productService.apiInventoryWarehouseId(warehouseId).pipe(takeUntil(this.destroy$)).subscribe({
            next: (res: any) => {

              if(res && Object.keys(res) && Object.keys(res).length > 0) {
                this.lstInventory = {...res};
                this.cdRef.detectChanges();
              }

              if(this.response) {
                this.mappingProductToLive(this.response);
              }
            },
            error: (err: any) => {
              if(this.response) {
                  this.mappingProductToLive(this.response);
              }
              this.message.error(err?.error?.message);
            }
          });
        }
      }
    })
  }

  loadOverviewDetails(pageSize: number, pageIndex: number, text?: string){
    this.isLoading = true;
    let params = THelperDataRequest.convertDataRequestToStringShipTake(pageSize, pageIndex, text);

    this.liveCampaignService.overviewDetailsReport(this.liveCampaignId, params).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        if(res?.Details && res?.Details?.length > 0) {
          this.lstDetail?.map(x => {
            res.Details = res.Details.filter(a => !(a.UOMId == x.UOMId && a.ProductId == x.ProductId));
          });
        }

        this.lstDetail = [...(this.lstDetail || []), ...(res.Details || [])];
        this.count = res.TotalCount || 0;

        this.lstDetail?.map(x => {
          if(x.TagWithAttributes && x.AttributeValues && x.AttributeValues.length > 0) {
            this.orderTags[`${x.ProductId}_${x.UOMId}`] = this.generateTagAttributesFacade.mappingTagAttributes(x.TagWithAttributes, x.AttributeValues);
          }

          // TODO: xóa item = changedItem đầu mảng sau khi tìm thấy trong danh sách lstDetail
          let key = `${x.ProductId}_${x.UOMId}`;

          if(this.lstWaitingItems.length == 0 && this.changedItems[key] && x.ProductId == this.changedItems[key].ProductId && x.UOMId == this.changedItems[key].UOMId) {
            let items = this.lstDetail.filter(x => x.ProductId == this.changedItems[key].ProductId && x.UOMId == this.changedItems[key].UOMId);

            if(items.length > 1) {
              let index = this.lstDetail.findIndex(x => x.ProductId == this.changedItems[key].ProductId && x.UOMId == this.changedItems[key].UOMId);
              this.lstDetail.splice(index, 1);
              delete this.changedItems[key];
            }
          }
        })

        this.getLstOrderTags(this.lstDetail);
        this.isLoading = false;
        this.cdRef.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.message.error(err?.error?.message || 'Đã xảy ra lỗi');
        this.cdRef.detectChanges();
      }
    })
  }

  loadOverviewReport () {
    this.isLoading = true;
    this.liveCampaignService.overviewReport(this.liveCampaignId).pipe(takeUntil(this.destroy$)).subscribe({
        next:(res: any) => {
          this.dataOverviewReport = {...res};

          this.isLoading = false;
          this.cdRef.detectChanges();
        },
        error:(err) => {
          this.isLoading = false;
          this.message.error(err?.error?.message || 'Tải dữ liệu thất bại');
          this.cdRef.detectChanges();
        }
      });
  }

  loadFacebookPost() {
    this.isLoading = true;
    this.liveCampaignService.getAllFacebookPost(this.liveCampaignId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        this.facebookPosts = [...(res || [])];
        this.isLoading = false;
      },
      error: error => {
       this.isLoading = false
        this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Đã xảy ra lỗi');
      }
    })
  }

  loadDataDetail() {
    this.isLoading = true;
    this.liveCampaignService.getById(this.liveCampaignId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          this.isLoading = false;
          this.lstSimpleDetail = [...(res.Details || [])];
          this.cdRef.detectChanges();
      },
      error:(err) => {
          this.isLoading = false;
          this.message.error(err?.error?.message || 'Đã xảy ra lỗi');
          this.cdRef.detectChanges();
      }
    });
  }

  removeDetail(item: ReportLiveCampaignDetailDTO) {
    if(this.checkIsEdit() == 0) return;

    let id = this.liveCampaignId as string;
    this.isLoading = true;
    this.liveCampaignService.deleteDetails(id, [item.Id]).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {
            this.refreshData();
            this.isLoading = false;
            this.message.success('Thao tác thành công');
            this.cdRef.detectChanges();
        },
        error: (err: any) => {
            this.isLoading = false;
            this.message.error(err?.error?.message || 'Đã xảy ra lỗi');
            this.cdRef.detectChanges();
        }
    })
  }

  removeAllDetail() {
    let formDetails = this.lstDetail as ReportLiveCampaignDetailDTO[];
    let ids = formDetails?.map(x => x.Id) as any[];

    this.modal.warning({
        title: 'Xóa tất cả sản phẩm',
        content: 'Xác nhận xóa tất cả sản phẩm trong chiến dịch',
        onOk: () => {
            this.isLoading = true;
            let id = this.liveCampaignId as string;

            this.liveCampaignService.deleteDetails(id, ids).pipe(takeUntil(this.destroy$)).subscribe({
              next: (res: any) => {

                  this.isEditDetails = {};
                  this.lstDetail = [];
                  this.count = 0;

                  this.isLoading = false;
                  this.message.success('Thao tác thành công');
              },
              error: (err: any) => {
                  this.isLoading = false;
                  this.message.error(err?.error?.message || 'Đã xảy ra lỗi');
              }
            })
        },
        onCancel:() => {},
        okText:"Xác nhận",
        cancelText:"Hủy bỏ"
    });
  }

  onFilterIndexDB(event: any) {
    if(!this.innerText) {
      this.innerTextDebounce = '';
      return;
    };

    if(this.innerText) {
      this.innerTextDebounce = TDSHelperString.stripSpecialChars(this.innerText.toLocaleLowerCase().trim());
    }
  }

  closeFilterIndexDB(){
    this.innerText = '';
    this.innerTextDebounce = '';
    this.indClick = -1;
    this.lstVariants = [];
    this.pageIndex = 1;
  }

  addItemProduct(listData: DataPouchDBDTO[]) {
    let formDetails = this.lstSimpleDetail as any[];
    let simpleDetail: ReportLiveCampaignDetailDTO[] = [];

    listData.forEach((x: DataPouchDBDTO) => {
      let exist = formDetails.filter((f: ReportLiveCampaignDetailDTO) => f.ProductId == x.Id && f.UOMId == x.UOMId)[0];
      if(!exist) {

          let qty = (this.lstInventory && this.lstInventory[x.Id] && Number(this.lstInventory[x.Id]?.QtyAvailable) > 0)
            ? Number(this.lstInventory[x.Id]?.QtyAvailable) : 1;

          let item = {
              Quantity: qty,
              RemainQuantity: 0,
              ScanQuantity: 0,
              QuantityCanceled: 0,
              UsedQuantity: 0,
              Price: x.Price || 0,
              Note: null,
              ProductId: x.Id,
              LiveCampaign_Id: this.liveCampaignId,
              ProductName: x.Name,
              ProductNameGet: x.NameGet,
              UOMId: x.UOMId,
              UOMName: x.UOMName,
              Tags: x.Tags,
              LimitedQuantity: 0,
              ProductCode: x.DefaultCode,
              ImageUrl: x.ImageUrl,
              IsActive: true,
          } as ReportLiveCampaignDetailDTO;

          simpleDetail = [...simpleDetail, ...[item]];

      } else {
          exist.Quantity += 1;
          simpleDetail = [...simpleDetail, ...[exist]];
      }
    })

    if(simpleDetail && simpleDetail.length > 0){
        this.addProductLiveCampaignDetails(simpleDetail);
    }
  }

  addProductLiveCampaignDetails(items: ReportLiveCampaignDetailDTO[]) {
    let id = this.liveCampaignId as string;
    items.map(x => {
      if(x && x.Tags) {
          x.Tags = x.Tags.toString();
      }
    });

    this.isLoading = true;
    this.liveCampaignService.updateDetails(id, items).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {

          if(!res) {
            this.isLoading = false;
            return;
          };

          res.map((x: ReportLiveCampaignDetailDTO, idx: number) => {
              let exist = this.lstSimpleDetail.filter(y => x.ProductId == y.ProductId && x.UOMId == y.UOMId)[0];
              let formDetails = this.lstDetail as any[];

              x.ProductName = items[idx].ProductName;
              x.ProductNameGet = items[idx].ProductNameGet;
              x.ImageUrl = items[idx].ImageUrl;

              if(exist) {
                  let index = formDetails.findIndex(f => f.UOMId == x.UOMId && f.ProductId == x.ProductId);

                  if(Number(index) >= 0) {
                    this.lstDetail[index] = {...x};
                  }

                  this.notificationService.info(`Cập nhật sản phẩm`,
                  `<div class="flex flex-col ">
                      <span class="mb-1">Sản phẩm: <span class="font-semibold"> ${x.ProductName}</span></span>
                      <span> Số lượng: <span class="font-semibold text-secondary-1">${x.Quantity}</span></span>
                  </div>`);
              } else {
                  this.lstDetail = [...[x], ...formDetails];

                  this.notificationService.info(`Thêm mới sản phẩm`,
                  `<div class="flex flex-col">
                      <span class="mb-1">Sản phẩm: <span class="font-semibold">[${x.ProductCode}] ${x.ProductName}</span></span>
                      <span>Số lượng: <span class="font-semibold text-secondary-1">${x.Quantity}</span></span>
                  </div>`);
                this.count = this.count + 1;
              }

              delete this.isEditDetails[x.Id];
          })

          this.lstDetail = [...this.lstDetail];
          this.getLstOrderTags(this.lstDetail);

          this.loadDataDetail();
          this.loadOverviewDetails(this.pageSize, this.pageIndex);
          this.cdRef.detectChanges();
        },
        error: (err: any) => {
            this.isLoading = false;
            this.message.error(err?.error?.message || 'Đã xảy ra lỗi');
            this.cdRef.detectChanges();
        }
    })
  }

  trackByIndex(_: number, data: DataPouchDBDTO): number {
    return data.Id;
  }

  onReset(): void {
    this.searchValue = '';
    this.innerTextValue = '';
    this.visible = false;
    this.indClickTag = -1;
  }

  onSearch(event: TDSSafeAny): void {
    this.indClickTag = -1;
    let text = TDSHelperString.stripSpecialChars(event.value?.toLocaleLowerCase()).trim();
    this.lstDetail = [];
    this.pageIndex = 1;
    this.resfeshScroll = false;
    this.loadOverviewDetails(this.pageSize, this.pageIndex, text);
  }

  getVariant(data?: DataPouchDBDTO) {
    if(data && data.Id) {//chọn hiện tại
        let simpleDetail = [data];
        this.addItemProduct(simpleDetail);
        this.closeFilterIndexDB();
    } else {
        let simpleDetail = [...this.lstVariants];
        this.addItemProduct(simpleDetail)
        this.closeFilterIndexDB();
    }

    this.lstVariants = [];
    this.indClick = -1;
  }

  selectProduct(model: DataPouchDBDTO, index: number){
    if(this.isLoadingSelect) return;
    if(this.checkIsEdit() == 0) return;

    this.indClick = index;
    let items = this.indexDbStorage?.filter((x: DataPouchDBDTO) => x.ProductTmplId == model.ProductTmplId && x.UOMId == model.UOMId && x.Active) as DataPouchDBDTO[];

    if(items && items.length == 0) {
      this.message.error('Sản phẩm đã bị xóa hoặc hết hiệu lực');
      return;
    }

    this.lstVariants = [...items];
    this.apiOrderTagbyIds(this.lstVariants);
  }

  apiOrderTagbyIds(model: DataPouchDBDTO[]) {
    let listData = [...(model || [])];
    let ids = listData.map(x => x.Id);

    this.liveCampaignService.getOrderTagbyIds(ids).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          this.validateOrderTagbyIds(listData, res);
      },
      error: (error: any) => {
          this.message.error(error?.error?.message);
      }
    })
  }

  validateOrderTagbyIds(listData: DataPouchDBDTO[], tags: any) {
    listData.map((x: DataPouchDBDTO) => {
        // TODO: kiểm tra số lượng
        const qty = (this.lstInventory && this.lstInventory[x.Id] && Number(this.lstInventory[x.Id].QtyAvailable) > 0)
          ? Number(this.lstInventory[x.Id].QtyAvailable) : 1;
        x.QtyAvailable = qty;

        // TODO: kiểm tra mã sp từ api
        const vTag = tags && tags[x.Id] ? tags[x.Id] : ''; // mã chốt đơn của biến thể

        // TODO: lọc sp trùng mã code để tạo tags
        const exist = this.indexDbStorage.filter((f: DataPouchDBDTO) => x.DefaultCode == f.DefaultCode) as any[];
        let uomName = '';
        if(exist && exist.length > 1) {
            uomName = TDSHelperString.stripSpecialChars(x.UOMName.trim().toLocaleLowerCase());
        }

        const orderTag = '';
        let gTags = this.generateTagDetail(x.DefaultCode, vTag, orderTag, uomName);
        x.Tags = gTags.join(',');
    });

    this.lstVariants = [...listData];
    if(listData && this.lstVariants.length == 1) {
        let simpleDetail = [...this.lstVariants];
        this.addItemProduct(simpleDetail)
        this.closeFilterIndexDB();
    }
  }

  refreshData() {
    this.visible = false;
    this.searchValue = '';
    this.innerTextValue = '';

    this.lstDetail = [];
    this.lstWaitingItems = [];
    this.isEditDetails = {};

    this.isLoading = true;
    this.pageIndex = 1;
    if(this.virtualScroller) {
      this.virtualScroller.scrollToPosition(0);
    }

    this.loadOverviewDetails(this.pageSize, this.pageIndex);
    this.loadDataDetail();
  }

  openTag(item: ReportLiveCampaignDetailDTO) {
    let formDetails = this.lstDetail as any[];
    let index = formDetails.findIndex(x => x.ProductId === item.ProductId && x.UOMId == item.UOMId);

    this.indClickTag = index;
    let data = formDetails[index];

    if(data && TDSHelperArray.isArray(data.Tags)){
        this.modelTags = data.Tags;
    } else {
        this.modelTags = data.Tags ? data.Tags.split(",") : [];
    }
  }

  onCloseTag() {
    this.modelTags = [];
    this.indClickTag = -1;
  }

  onSaveTag(item: any) {
    let formDetails = this.lstDetail as any[];
    let index = formDetails.findIndex(x => x.ProductId === item.ProductId && x.UOMId == item.UOMId);

    //TODO: dữ liệu từ formArray
    let details = formDetails[index];
    details.Tags = this.modelTags;

    //TODO: cập nhật vào formArray
    this.lstDetail[index] = {...details};


    this.modelTags = [];
    this.indClickTag = -1;
  }

  onChangeModelTag(event: string[], item: TDSSafeAny) {
    let lstDetails = this.lstDetail as any[];
    let strs = [...this.checkInputMatch(event)];
    let index = lstDetails.findIndex(x => x.ProductId === item.ProductId && x.UOMId == item.UOMId);

    if(Number(index) >= 0) {
      let details = lstDetails[index];
      details.Tags = strs?.join(',');

      this.lstDetail[index] = {...details};
      this.modelTags = [...strs];
    }
    this.cdRef.detectChanges();
  }

  productLastV2() {
    this.isLoadingProduct = true;
    this.indexDbStorage = [];

    this.productIndexDBService.setCacheDBRequest();
    this.productIndexDBService.getCacheDBRequest().pipe(takeUntil(this.destroy$)).subscribe({
        next:(res: KeyCacheIndexDBDTO) => {
            this.indexDbStorage = [...res?.cacheDbStorage || []];
            this.isLoadingProduct = false;
        },
        error:(err) => {
            this.isLoadingProduct = false;
            this.message.error(err?.error?.message );
        }
    })
  }

  onEditDetails(item: ReportLiveCampaignDetailDTO) {
    if(this.checkIsEdit() == 0) return;

    if(item && item.Id) {
        this.isEditDetails[item.Id] = {...item};
    }
  }

  onSaveDetails(item: ReportLiveCampaignDetailDTO) {
    if(item && item.Id) {
      this.addProductLiveCampaignDetails([item]);
    }
  }

  onChecked(event: any, item: ReportLiveCampaignDetailDTO) {
    if(!event) return;
    if(this.checkIsEdit() == 0) return;

    this.isLoading = true;
    let id = this.liveCampaignId as string;
    item.IsActive = event.checked;

    this.liveCampaignService.updateDetails(id, [item]).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          this.isLoading = false;

          if(item.IsActive == true) {
              this.message.success("Cập nhật trạng thái sản phẩm thành công");
          } else {
              this.message.success(`Sản phẩm đã được tắt`);
          };

          this.cdRef.detectChanges();
      }, error: (err) => {
          this.isLoading = false;
          this.message.success(err?.error?.message);
          this.cdRef.detectChanges();
      }
    })
  }

  loadCurrentCompany() {
    this.sharedService.apiCurrentCompany().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: CompanyCurrentDTO) => {
          this.companyCurrents = res;
          if(this.companyCurrents.DefaultWarehouseId) {
              this.loadInventoryWarehouseId(this.companyCurrents.DefaultWarehouseId);
          }
      },
      error: (error: any) => {
        this.message.error(error?.error?.message || 'Load thông tin công ty mặc định đã xảy ra lỗi!');
      }
    });
  }

  loadInventoryWarehouseId(warehouseId: number) {
    this.productService.setInventoryWarehouseId(warehouseId);
    this.productService.getInventoryWarehouseId().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          this.lstInventory = res;
      },
      error:(err) => {
          this.message.error(err?.error?.message || 'Không thể tải thông tin kho hàng');
      }
    });
  }

  onOpenSearchvalue(){
    this.visible = true;

    setTimeout(() => {
      if(this.viewChildInnerText)
        this.viewChildInnerText.nativeElement.focus();
    }, 300);
  }

  onPopoverVisibleChange(ev: boolean) {
    if(!ev) {
      this.indClick = -1;
    }
  }

  showCreateProductModal() {
    if(this.checkIsEdit() == 0) return;
    this.isLoading = true;

    const modal = this.modal.create({
      title: 'Thêm mới sản phẩm',
      content: DrawerAddProductComponent,
      size: "xl",
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        lstOrderTags: this.lstOrderTags
      }
    });

    modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe((response: any) => {
      if(response) {
        this.response = response;
      } else {
        this.isLoading = false;
      }
    });
  }

  mappingProductToLive(response: any) {
    response = {...response} as SyncCreateProductTemplateDto;
    this.indexDbStorage = [...response.cacheDbStorage];

    if(response.type === 'select' && response.productTmpl) {

        const product = response.productTmpl as ProductTemplateV2DTO;
        let items = this.indexDbStorage.filter(y => y.ProductTmplId == product.Id && y.UOMId == product.UOMId && y.Active) as any[];

        if(items && items.length == 0) {
          this.message.error('Sản phẩm đã bị xóa hoặc hết hiệu lực');
          this.isLoading = false;
          return;
        }

        this.visible = false;
        this.searchValue = '';
        this.innerTextValue = '';
        this.pageIndex = 1;

        let lstItems = [] as ReportLiveCampaignDetailDTO[];

        items.map((x: DataPouchDBDTO) => {
          let existQty = this.lstInventory && this.lstInventory[x.Id] && this.lstInventory[x.Id].QtyAvailable > 0;
          x.QtyAvailable = existQty ? this.lstInventory[x.Id].QtyAvailable : 1;

          let item = {
              Quantity: x.QtyAvailable,
              RemainQuantity: 0,
              ScanQuantity: 0,
              QuantityCanceled: 0,
              UsedQuantity: 0,
              Price: x.Price || 0,
              Note: null,
              ProductId: x.Id,
              LiveCampaign_Id: this.liveCampaignId,
              ProductName: x.Name,
              ProductNameGet: x.NameGet,
              UOMId: x.UOMId,
              UOMName: x.UOMName,
              Tags: x.DefaultCode,
              LimitedQuantity: 0,
              ProductCode: x.DefaultCode,
              ImageUrl: x.ImageUrl,
              IsActive: true,
          } as ReportLiveCampaignDetailDTO;

          lstItems = [...lstItems,...[item]];
        });

        this.addProductLiveCampaignDetails(lstItems);
    } else {
      this.isLoading = false;
    }
  }

  showModalLstPost () {
    if(this.facebookPosts.length > 0){
      this.modal.create({
        title: `Danh sách bài viết (${this.facebookPosts.length})`,
        content: ModalListPostComponent,
        size: "xl",
        viewContainerRef: this.viewContainerRef,
        componentParams:{
          facebookPosts: this.facebookPosts
        }
      })
    }
  }

  showModalLiveCampaignOrder(data: ReportLiveCampaignDetailDTO) {
    if(data.QueueQuantity > 0){
        this.modal.create({
            title: 'Đơn hàng chờ chốt',
            size: 'xl',
            content: ModalLiveCampaignOrderComponent,
            viewContainerRef: this.viewContainerRef,
            componentParams: {
                livecampaignDetailId: data.Id
            }
        });
    }
  }

  showModalLiveCampaignBill(data: ReportLiveCampaignDetailDTO) {
    if(data.UsedQuantity > 0){
        this.modal.create({
            title: 'Hóa đơn đã chốt',
            size: 'xl',
            content: ModalLiveCampaignBillComponent,
            viewContainerRef: this.viewContainerRef,
            componentParams: {
                livecampaignDetailId: data.Id
            }
        });
    }
  }

  checkIsEdit() {
    let exist = Object.keys(this.isEditDetails);
    if(exist && exist.length > 0) {

      let key = exist[0];
      let formDetails = this.lstDetail as any[];
      let product = formDetails.filter(f => f.Id == key)[0];

      this.message.info(`Sản phẩm ${product.ProductName} chưa được lưu`, { duration: 3000 });
      return 0;
    }

    return 1;
  }

  nextData() {
    this.pageIndex += 1;
    this.loadOverviewDetails(this.pageSize, this.pageIndex, this.innerTextValue);
  }

  vsStart(event: NgxVirtualScrollerDto) {
    this.startIndex = event?.startIndex || 0;
    let exist = event?.startIndex == 0 && this.lstWaitingItems.length > 0;

    if(exist) {
      this.lstWaitingItems.map(x => {
        this.arrangeChangedItem(x);
      });

      this.lstWaitingItems = [];
    }
  }

  vsEnd(event: NgxVirtualScrollerDto) {
    if(this.isLoading) {
      return;
    }

    let exisData = this.lstDetail && this.lstDetail.length > 0 && event && event.scrollStartPosition > 0;

    if(exisData) {
      const vsEnd = Number(this.lstDetail.length - 1) == Number(event.endIndex) && this.pageIndex >= 1 &&  Number(this.lstDetail.length) < this.count;
      if(vsEnd) {
          this.nextData();
      }
    }
  }

  checkInputMatch(strs: string[]) {
    let datas = strs as any[];
    let pop!: string;

    if(strs && strs.length == 0) {
      pop = datas[0];
    } else {
      pop = datas[strs.length - 1];
    }

    let match = pop?.match(/[~!@$%^&*(\\\/\-['`;=+\]),.?":{}|<>_]/g);//có thể thêm #
    let matchRex = match && match.length > 0;

    // TODO: check kí tự đặc biệt
    if(matchRex || (TDSHelperString.isString(pop) && !TDSHelperString.hasValueString(pop.toLocaleLowerCase().trim()))) {
        this.message.warning('Ký tự không hợp lệ');
        datas = datas.filter(x => x!= pop);
    }

    return datas;
  }

  generateTagDetail(defaultCode: string, vTag: string, orderTag: string, uomName: string) {
    let result: string[] = [];

    if(TDSHelperString.hasValueString(defaultCode)) {
        defaultCode = defaultCode.toLocaleLowerCase();

        if(TDSHelperString.hasValueString(uomName)) {
            let x = `${defaultCode} ${uomName}`
            result.push(x);
        } else {
            result.push(defaultCode);
        }
    }

    if(vTag) {
        let tagArr1 = vTag.split(',');
        tagArr1?.map((x: any) => {
          if(!result.find(y => y == x)) {
            if(TDSHelperString.hasValueString(uomName)) {
                let a = `${x} ${uomName}`;
                result.push(a);
            } else {
                result.push(x);
            }
          }
        })
    }

    if(orderTag) {
        let tagArr2 = orderTag.split(',');
        tagArr2?.map((x: any) => {
          if(!result.find(y => y == x))
            if(TDSHelperString.hasValueString(uomName)) {
                let a = `${x} ${uomName}`;
                result.push(a);
            } else {
                result.push(x);
            }
        })
    }

    return [...result];
  }

  loadDetailExistByProductIds() {
    let id = this.liveCampaignId;
    if(!id) return;

    this.liveCampaignService.getDetailExistByProductIds(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        this.productIds = res;
      },
      error: (err: any) => {
        this.message.error(err?.error?.message);
      }
    })
  }

  getLstOrderTags(data: ReportLiveCampaignDetailDTO[]) {
    if(data) {
        data = data.filter(x => x.Tags);
        let getTags = data.map(x => x.Tags.toLocaleLowerCase().trim());
        let tags = getTags.join(',');

        if(TDSHelperString.hasValueString(tags)) {
            this.lstOrderTags = tags.split(',');
        }
      }
    }

  onCloseDetail(item: ReportLiveCampaignDetailDTO) {
    let index = this.lstDetail.findIndex(x => x.ProductId == item.ProductId && x.UOMId == item.UOMId)

    if(Number(index) >= 0) {
      this.lstDetail[index] = this.isEditDetails[item.Id];
      this.lstDetail = [...this.lstDetail];

      delete this.isEditDetails[item.Id];
    }
  }

  arrangeChangedItem(item: any) {
    if(this.innerTextValue && TDSHelperString.hasValueString(this.innerTextValue)) return;
    let idx = this.lstDetail.findIndex((x: ReportLiveCampaignDetailDTO) => x.ProductId == item?.ProductId && x.UOMId == item?.ProductUOMId);

    if(Number(idx) >= 0) {
      // TODO: pop up lên đầu danh sách
      let exist = this.lstDetail.splice(idx, 1);
      this.lstDetail = [...exist,...this.lstDetail];

    } else {
      // TODO: pop up lên đầu danh sách, chờ danh sách lstDetail có item = changedItem thì xóa phần tử này
      let exist = this.lstSimpleDetail.find((x: LiveCampaignSimpleDetail) => x.ProductId == item?.ProductId && x.UOMId == item?.ProductUOMId);
      if(exist) {
        let key = `${exist.ProductId}_${exist.UOMId}`;
        this.changedItems[key] = {...this.prepareDetailModel(exist)};
        this.lstDetail = [...[this.changedItems[key]],...this.lstDetail];
      }
    }
  }

  showEditLimitedQuantity() {
    if(this.lstDetail && this.lstDetail.length > 0) {
        this.isShowEditLimitedQuantity = true;
    }
    else {
        this.message.error('Chưa có sản phẩm nào trong danh sách');
        this.isShowEditLimitedQuantity = false;
    }
  }

  onPopoverApplyLimitQuantityChange(event: boolean) {
    if(!event) {
        this.limitedQuantityAll = 0;
    }
  }

  onSavePopover() {
    this.isLoading = true;
    this.liveCampaignService.applyLimitQuantity(this.liveCampaignId, { quantity: this.limitedQuantityAll}).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        this.refreshData();
        this.message.success('Áp dụng thành công');
        this.onClosePopover();
      },
      error: (err) => {
        this.isLoading = false;
        this.message.error(err.error?.message);
      }
    });
  }

  onClosePopover() {
    this.isShowEditLimitedQuantity = false;
  }

  prepareDetailModel(data: LiveCampaignSimpleDetail) {
    let model = {} as ReportLiveCampaignDetailDTO;

    model.Id = data.Id;
    model.Index = data.Index;
    model.Quantity = data.Quantity;
    model.RemainQuantity = data.RemainQuantity;
    model.ScanQuantity = data.ScanQuantity;
    model.QuantityCanceled = data.QuantityCanceled;
    model.UsedQuantity = data.UsedQuantity;
    model.Price = data.Price;
    model.Note = data.Note;
    model.ProductId = data.ProductId;
    model.LiveCampaign_Id = data.LiveCampaign_Id;
    model.ProductName = data.ProductName;
    model.ProductNameGet = data.ProductNameGet;
    model.UOMId = data.UOMId;
    model.UOMName = data.UOMName;
    model.Tags = data.Tags;
    model.LimitedQuantity = data.LimitedQuantity;
    model.ProductCode = data.ProductCode;
    model.ImageUrl = data.ImageUrl;
    model.IsActive = data.IsActive;
    model.ProductTmlpId = data.ProductTmlpId;
    model.TagWithAttributes = data.TagWithAttributes;
    model.AttributeValues = data.AttributeValues;

    return model;
  }

  destroyTimer() {
    if (this.changeDetailTimer) {
      clearTimeout(this.changeDetailTimer);
    }
  }

  ngOnDestroy(): void {
    this.destroyTimer();
  }

  showIsActiveProduct() {
    this.isShowIsActiveProduct = true;
  }

  onClosePopoverIsActiveProduct() {
    this.isShowIsActiveProduct = false;
  }

  onChangeIsActiveProduct(event: any, type: string) {
    this.isLoading = true;
    let value: any = null;

    if(type == 'active') {
      this.activeProduct = true;
      this.unactiveProduct = false;
      value = true;
    } else {
      this.activeProduct = false;
      this.unactiveProduct = true;
      value = false;
    }

    this.liveCampaignService.applyActiveallDetails(this.liveCampaignId, value).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        if(value == true) {
          this.message.success('Đã bật hoạt động tất cả sản phẩm');
        } else {
          this.message.success('Đã tắt hoạt động tất cả sản phẩm');
        }

        this.onClosePopoverIsActiveProduct();
        this.refreshData();
        this.cdRef.detectChanges();
      },
      error: (err: any) => {
          this.isLoading = false;
          this.message.error(err?.error?.message);
          this.cdRef.detectChanges();
      }
    })
  }

  onShowModalComment(item: ReportLiveCampaignDetailDTO) {
      this.modal.create({
        title: 'Thao tác bình luận Facebook',
        content: ModalSendCommentComponent,
        size: "lg",
        viewContainerRef: this.viewContainerRef,
        componentParams: {
          data: item,
          orderTags: this.orderTags,
          objectId: this.objectId
        }
      });
  }
}
