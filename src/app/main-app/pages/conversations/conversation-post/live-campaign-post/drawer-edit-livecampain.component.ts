import { NgxVirtualScrollerDto } from '@app/dto/conversation-all/ngx-scroll/ngx-virtual-scroll.dto';
import { THelperDataRequest } from './../../../../../lib/services/helper-data.service';
import { ProductIndexDBService } from './../../../../services/product-indexdb.service';
import { ProductTemplateV2DTO } from './../../../../dto/product-template/product-tempalte.dto';
import { SyncCreateProductTemplateDto } from './../../../../dto/product-pouchDB/product-pouchDB.dto';
import { ModalListPostComponent } from './../../components/modal-list-post/modal-list-post.component';
import { GetAllFacebookPostDTO } from './../../../../dto/live-campaign/getall-facebook-post.dto';
import { OverviewReportDTO, ReportLiveCampaignDetailDTO } from './../../../../dto/live-campaign/report-livecampain-overview.dto';
import { AddDrawerProductComponent } from './add-drawer-product.component';
import { ViewContainerRef, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { LiveCampaignService } from "@app/services/live-campaign.service";
import { TDSDestroyService } from "tds-ui/core/services";
import { takeUntil} from "rxjs";
import { TDSMessageService } from "tds-ui/message";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { DataPouchDBDTO, KeyCacheIndexDBDTO } from "@app/dto/product-pouchDB/product-pouchDB.dto";
import { LiveCampaignSimpleDetail, LiveCampaignSimpleDto } from "@app/dto/live-campaign/livecampaign-simple.dto";
import { TDSModalService } from "tds-ui/modal";
import { TDSHelperArray, TDSHelperString, TDSSafeAny } from "tds-ui/shared/utility";
import { GetInventoryDTO } from "@app/dto/product/product.dto";
import { SharedService } from "@app/services/shared.service";
import { CompanyCurrentDTO } from "@app/dto/configs/company-current.dto";
import { ProductService } from "@app/services/product.service";
import { TDSNotificationService } from "tds-ui/notification";
import { StringHelperV2 } from "@app/shared/helper/string.helper";
import { SocketEventSubjectDto, SocketOnEventService } from '@app/services/socket-io/socket-onevent.service';
import { ChatmoniSocketEventName } from '@app/services/socket-io/soketio-event';
import { LiveCampaignCheckoutDataDto } from '@app/dto/socket-io/livecampaign-checkout.dto';

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

export class DrawerEditLiveCampaignComponent implements OnInit {

  @Input() liveCampaignId: any;

  isLoading: boolean = false;
  indexDbStorage!: DataPouchDBDTO[];
  isLoadingProduct: boolean = false;
  count: number = 0;

  lstDetail: ReportLiveCampaignDetailDTO[] = [];
  isEditDetails: { [id: string] : boolean } = {};
  innerTextValue: string = '';
  searchValue: string = '';
  innerText: string = '';
  innerTextDebounce!: string;
  indClick: number = -1;

  lstVariants: DataPouchDBDTO[] = [];
  lstInventory!: GetInventoryDTO;
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
  countItemDeleted = 0;

  numberWithCommas =(value: TDSSafeAny) =>{
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
    private fb: FormBuilder,
    private destroy$: TDSDestroyService) {
  }

  ngOnInit() {
    if(this.liveCampaignId) {
      this.loadOverviewDetails(this.pageSize, this.pageIndex); //TODO: load dữ liệu danh sách sản phẩm
      this.loadOverviewReport(); //TODO: load dữ liệu thống kê tổng quan
      this.loadFacebookPost(); //TODO: load dữ liệu bài viết fb
    }

    this.loadCurrentCompany(); //TODO: load dữ liệu tồn kho
    this.productLastV2(); //TODO: load danh sách sản phẩm từ cache

    this.onEventSocket();
  }

  onEventSocket() {
    this.socketOnEventService.onEventSocket().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: SocketEventSubjectDto) => {

          if(!this.liveCampaignId) return;

          switch(res && res.EventName) {
              // Số lượng sản phẩm chiến dịch chờ chốt
              case ChatmoniSocketEventName.livecampaign_Quantity_Order_Pending_Checkout:

                  let pCheckout = res.Data.Data as LiveCampaignCheckoutDataDto;
                  if(pCheckout && pCheckout.LiveCampaignId != this.liveCampaignId) break;

                  const iCheckout = this.lstDetail.findIndex(x => x.ProductId == pCheckout.ProductId && x.UOMId == pCheckout.ProductUOMId);
                  if(Number(iCheckout) < 0) break;

                  this.lstDetail[iCheckout].QueueQuantity = pCheckout.Quantity;
                  this.lstDetail[iCheckout] = {...this.lstDetail[iCheckout]};

                  this.lstDetail = [...this.lstDetail];
                  this.cdRef.detectChanges();
              break;

              // Số lượng sản phẩm chiến dịch có thểm mua
              case ChatmoniSocketEventName.livecampaign_Quantity_AvailableToBuy:

                  let toBuy = res.Data?.Data as LiveCampaignCheckoutDataDto;
                  if(toBuy && toBuy.LiveCampaignId != this.liveCampaignId) break;

                  const iToBuy = this.lstDetail.findIndex(x => x.ProductId == toBuy.ProductId && x.UOMId == toBuy.ProductUOMId);
                  if(Number(iToBuy) < 0) break;

                  this.lstDetail[iToBuy].UsedQuantity = toBuy.Quantity;
                  this.lstDetail[iToBuy] = {...this.lstDetail[iToBuy]};

                  this.lstDetail = [...this.lstDetail];
                  this.cdRef.detectChanges();
              break;
          }
      }
    })
  }

  loadOverviewDetails(pageSize: number, pageIndex: number, text?: string){
    this.isLoading = true;
    let params = THelperDataRequest.convertDataRequestToStringShipTake(pageSize, pageIndex, text);

    this.liveCampaignService.overviewDetailsReport(this.liveCampaignId, params).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {

        this.lstDetail = [...(this.lstDetail || []), ...(res.Details || [])];
        this.count = res.TotalCount || 0;

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
        next:(res) => {
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
      next: res => {
        if(res) {
            this.facebookPosts = [...res];
        }
        this.isLoading = false;
      },
      error: error => {
       this.isLoading = false
        this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Đã xảy ra lỗi');
      }
    })
  }


  initDetail(x?: ReportLiveCampaignDetailDTO | null) {
    let item = this.fb.group({
        Id: [null],
        Index: [null],
        Quantity: [0],
        QueueQuantity: [0],
        RemainQuantity: [0],
        RemainRealQuantity: [0],
        QuantityCanceled: [0],
        ScanQuantity: [0],
        UsedQuantity: [0],
        Price: [null],
        Note: [null],
        ProductId: [null],
        LiveCampaign_Id: [null],
        ProductName: [null],
        ProductNameGet: [null],
        UOMId: [null],
        UOMName: [null],
        Tags: [null],
        LimitedQuantity: [0],
        ProductCode: [null],
        ImageUrl: [null],
        IsActive: [false],
        ProductTmlpId: [null]
    });

    if(x) {
        x.LiveCampaign_Id = this.liveCampaignId;
        item.patchValue(x);
    }

    return item;
  }

  removeDetail(item: ReportLiveCampaignDetailDTO) {
    if(this.checkIsEdit() == 0) return;

    let id = this.liveCampaignId as string;
    this.isLoading = true;
    this.liveCampaignService.deleteDetails(id, [item.Id]).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {

            this.lstDetail = this.lstDetail.filter(x => x.Id != item.Id);
            this.lstDetail = [...this.lstDetail];

            this.count = this.count - 1;
            delete this.isEditDetails[item.Id];

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
    let formDetails = this.lstDetail as any[];
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
              ProductCode: x.Barcode || x.DefaultCode,
              ImageUrl: x.ImageUrl,
              IsActive: true,
          } as ReportLiveCampaignDetailDTO;

          let name = item.ProductNameGet || item.ProductName;
          if(x._attributes_length == undefined) x._attributes_length = 1;

          let tags = this.generateTagDetail(name, item.ProductCode, item.Tags, x._attributes_length);
          item.Tags = tags?.join(',');

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
        next: (res: any[]) => {
          this.isLoading = false;
          if(!res) return;

          res.map((x: ReportLiveCampaignDetailDTO, idx: number) => {

              x.ProductName = items[idx].ProductName;
              x.ProductNameGet = items[idx].ProductNameGet;
              x.ImageUrl = items[idx].ImageUrl;

              let formDetails = this.lstDetail as any[];
              let index = formDetails.findIndex(f => f.Id == x.Id && f.ProductId == x.ProductId);

              if(Number(index) >= 0) {
                  index = Number(index);

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
              }

              this.count = this.count + 1;
              delete this.isEditDetails[x.Id];
          })

          this.lstDetail = [...this.lstDetail];
          this.cdRef.detectChanges();
        },
        error: (err: any) => {
            this.isLoading = false;
            this.message.error(err?.error?.message || 'Đã xảy ra lỗi');
            this.cdRef.detectChanges();
        }
    })
  }

  generateTagDetail(productName: string, code: string, tags: string,  _attributes_length?: number) {
    let result: string[] = [];

    if(!TDSHelperString.hasValueString(productName)) {
      return result;
    }

    productName = productName.replace(`[${code}]`, "");
    productName = productName.trim();

    let word = StringHelperV2.removeSpecialCharacters(productName);
    let wordNoSignCharacters = StringHelperV2.nameNoSignCharacters(word);
    let wordNameNoSpace = StringHelperV2.nameCharactersSpace(wordNoSignCharacters);

    result.push(word);

    if(!result.includes(wordNoSignCharacters)) {
      result.push(wordNoSignCharacters);
    }

    if(!result.includes(wordNameNoSpace)) {
      result.push(wordNameNoSpace);
    }

    if(TDSHelperString.hasValueString(code) && code && Number(_attributes_length) <= 1) {
      result.push(code);
    }

    if(TDSHelperString.hasValueString(tags)){
        let tagArr = tags.split(',');
        tagArr.map(x => {
          if(x && !result.find(y => y == x))
              result.push(x);
        })
    }

    return [...result];
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
    this.searchValue = TDSHelperString.stripSpecialChars(this.innerTextValue?.toLocaleLowerCase()).trim();
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

    items.map((x: DataPouchDBDTO) => {
      const qty = (this.lstInventory && this.lstInventory[x.Id] && Number(this.lstInventory[x.Id]?.QtyAvailable) > 0)
        ? Number(this.lstInventory[x.Id]?.QtyAvailable) : 1;

      x.QtyAvailable = qty;
      x._attributes_length = 0;
    });

    this.lstVariants = [...items];
    if(this.lstVariants && this.lstVariants.length == 1) {
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
    this.isEditDetails = {};

    this.isLoading = true;
    this.pageIndex = 1;
    this.loadOverviewDetails(this.pageSize, this.pageIndex);
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
    let idx = lstDetails.findIndex((x: any) => x.Index == item.Index) as number;

    if(Number(idx) >= 0) {
      let details = lstDetails[idx];
      details.Tags = strs?.join(',');

      this.lstDetail[idx] = {...details};
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
            if(!res) return;
            this.indexDbStorage = [...res?.cacheDbStorage];
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
        this.isEditDetails[item.Id] = true;
    }
  }

  onSaveDetails(item: ReportLiveCampaignDetailDTO) {
    if(item && item.Id) {
        this.addProductLiveCampaignDetails([item]);
    }
  }

  loadCurrentCompany() {
    this.sharedService.setCurrentCompany();
    this.sharedService.getCurrentCompany().pipe(takeUntil(this.destroy$)).subscribe({
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
  }

  onPopoverVisibleChange(ev: boolean) {
    if(!ev) {
      this.indClick = -1;
    }
  }

  showCreateProductModal() {
    if(this.checkIsEdit() == 0) return;

    const modal = this.modal.create({
      title: 'Thêm mới sản phẩm',
      content: AddDrawerProductComponent,
      size: "lg",
      viewContainerRef: this.viewContainerRef,
    });

    modal.afterClose.subscribe((response: any) => {
      if(!response) return;
      this.mappingProductToLive(response);
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
          return;
        }

        let lstItems = [] as ReportLiveCampaignDetailDTO[];

        items.map((x: DataPouchDBDTO) => {
          let qty = product.InitInventory > 0 ? product.InitInventory : 1;
          x._attributes_length = product._attributes_length;

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
              Tags: product.OrderTag,
              LimitedQuantity: 0,
              ProductCode: x.Barcode || x.DefaultCode,
              ImageUrl: x.ImageUrl,
              IsActive: true,
          } as ReportLiveCampaignDetailDTO;

          let name = item.ProductNameGet || item.ProductName;
          if(x._attributes_length == undefined) x._attributes_length = 1;

          let tags = this.generateTagDetail(name, item.ProductCode, item.Tags, x._attributes_length);
          item.Tags = tags.join(',');

          lstItems = [...lstItems,...[item]];
        });

        this.addProductLiveCampaignDetails(lstItems);
    }
  }

  showModalLstPost () {
    if(this.facebookPosts.length > 0){
      const modal = this.modal.create({
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
    this.loadOverviewDetails(this.pageSize, this.pageIndex, this.innerText);
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
    if(matchRex) {
        this.message.warning('Ký tự không hợp lệ');
        datas = datas.filter(x => x!= pop);
    }

    return datas;
  }
}
