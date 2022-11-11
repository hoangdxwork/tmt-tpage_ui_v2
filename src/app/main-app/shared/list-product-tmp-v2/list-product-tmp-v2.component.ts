import { ProductCategoryService } from './../../services/product-category.service';
import { ConfigCateg } from './../../dto/configs/product/config-product-default.dto';
import { ProductTemplateService } from './../../services/product-template.service';
import { ProductDTOV2 } from './../../dto/product/odata-product.dto';
import { Message } from 'src/app/lib/consts/message.const';
import { TDSDestroyService } from 'tds-ui/core/services';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { TCommonService, THelperCacheService } from 'src/app/lib';
import { DataPouchDBDTO, KeyCacheIndexDBDTO, SyncCreateProductTemplateDto } from '../../dto/product-pouchDB/product-pouchDB.dto';
import { ProductIndexDBService } from '../../services/product-indexdb.service';
import { CompanyCurrentDTO } from '../../dto/configs/company-current.dto';
import { takeUntil } from 'rxjs/operators';
import { orderBy as _orderBy } from 'lodash';
import { ProductTemplateV2DTO } from '../../dto/product-template/product-tempalte.dto';
import { SharedService } from '../../services/shared.service';
import { ModalProductTemplateComponent } from '../tpage-add-product/modal-product-template.component';
import { TDSHelperArray, TDSHelperObject, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSModalService } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { TDSTableComponent } from 'tds-ui/table';
import { ProductService } from '@app/services/product.service';

@Component({
  selector: 'list-product-tmp-v2',
  templateUrl: './list-product-tmp-v2.component.html',
  providers: [TDSDestroyService]
})

export class ListProductTmpV2Component implements OnInit {

  @ViewChild('basicTable', { static: false }) tableComponent?: TDSTableComponent<any>;

  @Input() priceListItems: any;
  @Input() isLoadingProduct: boolean = false;
  @Input() type!: string;

  @Output() onLoadProductToLiveCampaign: EventEmitter<any> = new EventEmitter<DataPouchDBDTO[]>();

  lstOfData!: DataPouchDBDTO[];
  lstVariants: DataPouchDBDTO[] = [];

  indexDbStorage!: DataPouchDBDTO[];
  productTmplItems!: ProductTemplateV2DTO;
  search: boolean = false;
  retryClick: number = 0;
  disabledReload: boolean = false;

  innerText!: string;

  cacheObject: KeyCacheIndexDBDTO = {
    cacheCount: -1,
    cacheVersion: 0,
    cacheDbStorage: []
  }

  inventories!: TDSSafeAny;
  companyCurrents!: CompanyCurrentDTO;
  isLoading: boolean = false;
  indClick: number =  -1;
  isLoadingSelect: boolean = false;

  options: Array<TDSSafeAny> = [
    { text: 'Tất cả', value: 'all' },
    { text: 'Mã', value: 'code' },
    { text: 'Tên', value: 'name' },
    { text: 'Barcode', value: 'barcode'}
  ];
  currentOption: any = { text: 'Tất cả', value: 'all' };

  types: Array<TDSSafeAny> = [
    { text: "Bán chạy", value: "PosSalesCount" },
    { text: "Theo tên", value: "NameGet" },
    { text: "Theo mã", value: "DefaultCode" },
    { text: "Mới nhất", value: "Id" },
    { text: "Theo nhóm", value: "CategId" }
  ];

  currentType: any =  { text: "Bán chạy", value: "PosSalesCount" };
  keyFilter: string = '';

  isShowFilterCategId: boolean = false;
  categoryList: ConfigCateg[] = [];
  categIdFilter!: ConfigCateg | TDSSafeAny;

  constructor(private productIndexDBService: ProductIndexDBService,
      public cacheApi: THelperCacheService,
      private modalService: TDSModalService,
      private sharedService: SharedService,
      private message: TDSMessageService,
      private productService: ProductService,
      public apiService: TCommonService,
      private cdRef : ChangeDetectorRef,
      private destroy$: TDSDestroyService,
      private viewContainerRef: ViewContainerRef,
      private productTemplateService: ProductTemplateService,
      private productCategoryService: ProductCategoryService) {
  }

  ngOnInit(): void {
    this.loadCurrentCompany();
    this.loadProductCategory();
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.indexDbStorage = [];

    this.productIndexDBService.setCacheDBRequest();
    this.productIndexDBService.getCacheDBRequest().pipe(takeUntil(this.destroy$)).subscribe({
      next:(res: KeyCacheIndexDBDTO) => {
          if(TDSHelperObject.hasValue(res)) {
            this.indexDbStorage = res?.cacheDbStorage;

            this.loadDataTable();
            this.isLoading = false;
          }
          this.disabledReload = false;
        },
        error:(err) => {
          this.isLoading = false;
          this.disabledReload = false;
          this.message.error(err?.error?.message || Message.Product.CanNotLoadData);
        }
    })
  }

  loadDataTable() {
    let data = this.indexDbStorage || [];

    if(TDSHelperObject.hasValue(this.currentOption)) {

        if(TDSHelperString.hasValueString(this.keyFilter)) {
            this.keyFilter = TDSHelperString.stripSpecialChars(this.keyFilter.trim());
        }

        switch(this.currentOption.value) {

          case "all":
            data = data.filter((x: DataPouchDBDTO) =>
              (x.DefaultCode && TDSHelperString.stripSpecialChars(x.DefaultCode.toLowerCase()).indexOf(TDSHelperString.stripSpecialChars(this.keyFilter.toLowerCase())) !== -1) ||
              (x.Barcode && TDSHelperString.stripSpecialChars(x.Barcode.toLowerCase()).indexOf(TDSHelperString.stripSpecialChars(this.keyFilter.toLowerCase())) !== -1) ||
              (x.NameNoSign && TDSHelperString.stripSpecialChars(x.NameNoSign.toLowerCase()).indexOf(TDSHelperString.stripSpecialChars(this.keyFilter.toLowerCase())) !== -1) ||
              (x.NameGet && TDSHelperString.stripSpecialChars(x.NameGet.toLowerCase()).indexOf(TDSHelperString.stripSpecialChars(this.keyFilter.toLowerCase())) !== -1));
            break;

          case "code":
            data = data.filter((x: DataPouchDBDTO) =>
              (x.DefaultCode && TDSHelperString.stripSpecialChars(x.DefaultCode.toLowerCase()).indexOf(TDSHelperString.stripSpecialChars(this.keyFilter.toLowerCase())) !== -1));
            break;

          case "barcode":
            data = data.filter((x: DataPouchDBDTO) =>
              (x.Barcode && TDSHelperString.stripSpecialChars(x.Barcode.toLowerCase()).indexOf(TDSHelperString.stripSpecialChars(this.keyFilter.toLowerCase())) !== -1));
            break;

          case "name":
            data = data.filter((x: DataPouchDBDTO) =>
              (x.NameNoSign && TDSHelperString.stripSpecialChars(x.NameNoSign.toLowerCase()).indexOf(TDSHelperString.stripSpecialChars(this.keyFilter.toLowerCase())) !== -1) ||
              (x.NameGet && TDSHelperString.stripSpecialChars(x.NameGet.toLowerCase()).indexOf(TDSHelperString.stripSpecialChars(this.keyFilter.toLowerCase())) !== -1));
            break;

          default: break;
        }
    }

    if(TDSHelperObject.hasValue(this.currentType)) {

        switch(this.currentType.value) {
          case 'Id':
            data = _orderBy(data, ["Id"], ["desc"]);
          break;

          case 'Name':
            data = _orderBy(data, ["Name"], ["desc"]);
          break;

          case 'DefaultCode':
            data = _orderBy(data, ["DefaultCode"], ["desc"]);
          break;

          case 'PosSalesCount':
            data = _orderBy(data, ["PosSalesCount"], "desc");
          break;

          case 'CategId':
            this.isShowFilterCategId = true;
            return;
          break;

          default: break;
        }
    }

    if(TDSHelperArray.hasListValue(this.priceListItems)) {
        data.forEach((x: DataPouchDBDTO) => {
          if(x.SaleOK && ! x.IsDiscount) {
              let price = this.priceListItems[`${x.ProductTmplId}_${x.UOMId}`];
              if (price) {
                if (!x.OldPrice) {
                    x.OldPrice = x.Price;
                }
                x.Price = price;
              } else {
                if (x.OldPrice >= 0) {
                    x.Price = x.OldPrice;
                }
              }
          }
        })
    }

    this.cdRef.detectChanges();
    return this.lstOfData = [...data];
  }

  selectType(item: any): void {
    this.currentType = item;
    this.isShowFilterCategId = false;
    if(this.currentType.value != 'CategId') {
      delete this.categIdFilter;
    }

    this.loadDataTable();
  }

  selectOption(item: any): void {
      this.currentOption = item;
      this.loadDataTable();
  }

  loadCurrentCompany() {
    this.sharedService.setCurrentCompany();
    this.sharedService.getCurrentCompany().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: CompanyCurrentDTO) => {
        this.companyCurrents = res || {};

        if(this.companyCurrents?.DefaultWarehouseId) {
          this.loadInventoryWarehouseId(this.companyCurrents?.DefaultWarehouseId);
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
          this.inventories = res;
      },
      error: (err: any) => {
          this.message.error(err?.error?.message || 'Không thể tải thông tin kho hàng');
      }
    });
  }

  showModalAddProduct() {
    this.indClick = -1;
    const modal = this.modalService.create({
      title: 'Thêm sản phẩm',
      content: ModalProductTemplateComponent,
      size: "xl",
      bodyStyle: {
        padding : '0px'
      },
      viewContainerRef: this.viewContainerRef,
      componentParams: {
          type: this.type
      }
    });

    modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe({
      next: (response: any) => {
        if(!response) return;
        this.mappingProductToLive(response);

        let warehouseId = this.companyCurrents?.DefaultWarehouseId;
        this.productService.apiInventoryWarehouseId(warehouseId).pipe(takeUntil(this.destroy$)).subscribe({
          next: (inventories: any) => {
              this.inventories = inventories;
          },
          error: (err: any) => {
              this.message.error(err?.error?.message);
          }
        });
      }
    })
  }

  mappingProductToLive(response: any) {
    response = {...response} as SyncCreateProductTemplateDto;
    this.indexDbStorage = [...response.cacheDbStorage];

    if(response.type === 'select' && response.productTmpl) {
        const model = response.productTmpl as ProductTemplateV2DTO;
        let items = this.indexDbStorage?.filter((x: DataPouchDBDTO) => x.ProductTmplId == model.Id && x.UOMId == model.UOMId && x.Active) as DataPouchDBDTO[];

        if(items && items.length == 0) {
            this.message.error('Sản phẩm đã bị xóa hoặc hết hiệu lực');
            return;
        }

        items.map((x: DataPouchDBDTO) => {
            x.Tags = model?.OrderTag || null;

            let qty = model.InitInventory > 0 ? model.InitInventory : 1;
            x.QtyAvailable = qty;

            x._attributes_length = model._attributes_length || 0;
        });

        this.onLoadProductToLiveCampaign.emit([...items]);
    }
  }

  reloadIndexDB() {
    this.retryClick = this.retryClick + 1;
    this.currentType = { text: "Bán chạy", value: "PosSalesCount" };
    this.currentOption = { text: 'Tất cả', value: 'all'};
    this.innerText = '';
    delete this.categIdFilter;
    this.isShowFilterCategId = false;

    this.keyFilter = '';
    this.indClick = -1;

    // TODO: nếu nhấn liên tục 3 lần thì load lại api
    if(this.retryClick == 3) {
        this.disabledReload = true;
        this.productIndexDBService.removeCacheDBRequest();
        this.retryClick = 0;
        this.message.info('Đang tải lại danh sách sản phẩm, vui lòng đợi');
    }

    this.loadData();
  }

  trackByIndex(_: number, data: DataPouchDBDTO): number {
    return data.Id;
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes["priceListItems"] && !changes["priceListItems"].firstChange) {
        this.priceListItems = changes["priceListItems"].currentValue;
        this.loadDataTable();
    }

    if(changes['isLoadingProduct'] && (changes['isLoadingProduct'].currentValue == true || changes['isLoadingProduct'].currentValue == false)) {
        this.isLoading = changes['isLoadingProduct'].currentValue;
    }
  }

  onInputKeyup(){
    this.isLoading = true;
    this.keyFilter = this.innerText || '';

    this.loadDataTable();
    this.isLoading = false;
  }

  selectProduct(model: DataPouchDBDTO, index: number){
    if(this.isLoadingSelect) return;

    this.indClick = index;
    let items = this.indexDbStorage?.filter((x: DataPouchDBDTO) => x.ProductTmplId == model.ProductTmplId && x.UOMId == model.UOMId && x.Active) as DataPouchDBDTO[];

    if(items && items.length == 0) {
      this.message.error('Sản phẩm đã bị xóa hoặc hết hiệu lực');
      return;
    }

    items.map((x: DataPouchDBDTO) => {
        const qty = (this.inventories && this.inventories[x.Id] && Number(this.inventories[x.Id].QtyAvailable) > 0)
        ? Number(this.inventories[x.Id].QtyAvailable) : 1;

        x.QtyAvailable = qty;
        x._attributes_length = 0;
    });

    this.lstVariants = [...items];

    if(this.lstVariants && this.lstVariants.length == 1) {
        this.onLoadProductToLiveCampaign.emit([...this.lstVariants]);
        this.indClick = -1;
    }
  }

  getVariant(data?: DataPouchDBDTO) {
    if(data && data.Id) {//chọn hiện tại
        this.onLoadProductToLiveCampaign.emit([data]);
    } else {
        this.onLoadProductToLiveCampaign.emit([...this.lstVariants]);
    }

    this.lstVariants = [];
    this.indClick = -1;
  }

  onSearch() {
    this.search = !this.search;
  }

  onPopoverVisibleChange(ev: boolean){
    if(!ev){
      this.indClick = -1
    }
  }


  loadProductCategory() {
    this.productCategoryService.get().pipe(takeUntil(this.destroy$)).subscribe(
      {
        next: (res: TDSSafeAny) => {
          this.categoryList = [...res.value];
        },
        error: error => {
          this.message.error(error?.error?.message || Message.CanNotLoadData);
        }
      }
    );
  }

  onCloseFilter() {
    this.isShowFilterCategId = false;
    delete this.categIdFilter;

    let data = this.indexDbStorage || [];
    this.lstOfData = [...data];
  }

  onFilterCategId() {
    if(this.categIdFilter){
        let data = this.indexDbStorage || [];

        data = data.filter((x: DataPouchDBDTO)=>(x.CategId == this.categIdFilter.Id))

        this.lstOfData = [...data];
        this.cdRef.detectChanges();
    } else {
        this.message.error('không tìm thấy Id cần tìm');
    }
  }

  onChangePopover(event: boolean) {
    if(!event) {
      this.isShowFilterCategId = false;
    }
  }

  onChangeCategId(event: string) {
    if(!event) {
      let data = this.indexDbStorage || [];
      this.lstOfData = [...data];
    }
  }
}
