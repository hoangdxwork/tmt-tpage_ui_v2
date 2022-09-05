import { Message } from 'src/app/lib/consts/message.const';
import { TDSDestroyService } from 'tds-ui/core/services';
import { mergeMap } from 'rxjs/operators';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { TCommonService, THelperCacheService } from 'src/app/lib';
import { DataPouchDBDTO, KeyCacheIndexDBDTO } from '../../dto/product-pouchDB/product-pouchDB.dto';
import { ProductIndexDBService } from '../../services/product-indexDB.service';
import { CompanyCurrentDTO } from '../../dto/configs/company-current.dto';
import { CommonService } from '../../services/common.service';
import { finalize, map, takeUntil } from 'rxjs/operators';
import { orderBy as _orderBy } from 'lodash';
import { ProductTemplateV2DTO } from '../../dto/product-template/product-tempalte.dto';
import { SharedService } from '../../services/shared.service';
import { ModalProductTemplateComponent } from '../tpage-add-product/modal-product-template.component';
import { InitSaleDTO, SaleSettingsDTO } from '../../dto/setting/setting-sale-online.dto';
import { TDSHelperArray, TDSHelperObject, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSModalService } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { TDSTableComponent } from 'tds-ui/table';
import { ProductService } from '@app/services/product.service';

@Component({
  selector: 'list-product-tmp',
  templateUrl: './list-product-tmp.component.html',
  providers: [TDSDestroyService]
})

export class ListProductTmpComponent  implements OnInit, AfterViewInit, OnChanges {

  @ViewChild('basicTable', { static: false }) tableComponent?: TDSTableComponent<any>;
  @ViewChild('innerText') innerText!: ElementRef;

  @Input() priceListItems: any;
  @Input() isLoadingProduct: boolean = false;
  @Input() inLiveCampaign: boolean = false;

  @Output() onLoadProductToOrderLines: EventEmitter<any> = new EventEmitter<any>();
  @Output() onLoadProductToLiveCampaign: EventEmitter<any> = new EventEmitter<any>();

  lstOfData!: DataPouchDBDTO[];
  lstVariants: DataPouchDBDTO[] = [];

  indexDbVersion: number = 0;
  indexDbProductCount: number = -1;
  indexDbStorage!: DataPouchDBDTO[];
  productTmplItems!: ProductTemplateV2DTO;
  search: boolean = false;

  cacheObject: KeyCacheIndexDBDTO = {
    cacheCount: -1,
    cacheVersion: 0,
    cacheDbStorage: []
  }

  inventories!: TDSSafeAny;
  companyCurrents!: CompanyCurrentDTO;
  isLoading: boolean = false;
  indClick:number =  -1;

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
    { text: "Mới nhất", value: "Id" }
  ];

  currentType: any =  { text: "Bán chạy", value: "PosSalesCount" };
  keyFilter: string = '';

  constructor(private productIndexDBService: ProductIndexDBService,
    public cacheApi: THelperCacheService,
      private modalService: TDSModalService,
      private sharedService: SharedService,
      private message: TDSMessageService,
      private productService: ProductService,
      public apiService: TCommonService,
      private cdRef : ChangeDetectorRef,
      private destroy$: TDSDestroyService,
      private viewContainerRef: ViewContainerRef) {
  }

  ngOnInit(): void {
    this.loadCurrentCompany();
    this.loadData();
  }

  loadData(reload?:boolean): void {
    this.isLoading = true;

    this.validateData();

    this.productIndexDBService.loadProductIndexDBV2(reload).pipe(takeUntil(this.destroy$)).pipe(finalize(() => {this.isLoading = false }))
      .subscribe({
        next:(res: KeyCacheIndexDBDTO) => {
          if(TDSHelperObject.hasValue(res)) {
              this.indexDbProductCount = res.cacheCount;
              this.indexDbVersion = res.cacheVersion;
              this.indexDbStorage = res.cacheDbStorage;

              this.loadDataTable();
            }
          },
          error:(err) => {
            this.message.error(err?.error?.message || Message.Product.CanNotLoadData);
          }
      })
  }

  loadDataTable() {
    let data = this.indexDbStorage;

    if(TDSHelperObject.hasValue(this.currentOption)) {

        if(TDSHelperString.hasValueString(this.innerText)) {
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
        this.companyCurrents = res;

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
    const modal = this.modalService.create({
      title: 'Thêm sản phẩm',
      content: ModalProductTemplateComponent,
      size: "xl",
      bodyStyle: {
        padding : '0px'
      },
      centered: true,
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        typeComponent: 'lst-product-tmp',
      }
    });

    modal.afterClose.pipe(takeUntil(this.destroy$))
      .subscribe({
        next:(res: any) => {
          if(res) {
            let productTmplItems = res[0];

            if(res[1]) {
              let cacheObject = res[1];

              this.indexDbProductCount = cacheObject.cacheCount;
              this.indexDbVersion = cacheObject.cacheVersion;
              this.indexDbStorage = cacheObject.cacheDbStorage;
            }

            // TODO: trường hợp thêm mới push sp vào orderLines
            if(productTmplItems?.Id) {

              let item = this.indexDbStorage.filter((x: DataPouchDBDTO) =>
              x.ProductTmplId == productTmplItems.Id && x.UOMId == productTmplItems.UOMId)[0] as DataPouchDBDTO;

              if(!TDSHelperObject.hasValue(item)) {
                this.message.error('Thêm mới sản phẩm danh sách xảy ra lỗi!');
                return;
              }

              this.filterLstVariants(item, productTmplItems);
              this.getAllVariants();
            }
          }
          //TODO: reload sản phẩm
          this.reloadIndexDB();
        }
      })
  }

  reloadIndexDB() {
    this.currentType = { text: "Bán chạy", value: "PosSalesCount" };
    this.currentOption = { text: 'Tất cả', value: 'all'};

    if(this.innerText?.nativeElement?.value) {
      this.innerText.nativeElement.value = '';
    }

    this.keyFilter = '';

    this.indexDbProductCount = -1;
    this.indexDbVersion = 0;
    this.indexDbStorage = [];

    let keyCache = this.productIndexDBService._keyCacheProductIndexDB;
    this.cacheApi.removeItem(keyCache);

    this.loadData(true);
  }

  addItem(data: DataPouchDBDTO, index?: number) {
    this.indClick = index as number;

    // TODO: trường hợp thêm sản phẩm vào đơn hàng
    if (!this.inLiveCampaign) {
      this.onLoadProductToOrderLines.emit(data);
    } else {
      this.filterLstVariants(data);
    }
  }

  filterLstVariants(data: DataPouchDBDTO, productTmplItems?: any){
    let model = this.indexDbStorage.filter(f => f.ProductTmplId == data.ProductTmplId && f.UOMId == data.UOMId);

    model.map((x: DataPouchDBDTO)=>{
      x.Tags = productTmplItems?.Tags || null;
      return x
    })

    this.lstVariants = [...model];
  }

  ngAfterViewInit(): void {
    this.tableComponent?.cdkVirtualScrollViewport?.scrolledIndexChange.pipe(takeUntil(this.destroy$))
      .subscribe({
        next:(data: number) => {}
      });

    this.cdRef.detectChanges();
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  trackByIndex(_: number, data: DataPouchDBDTO): number {
    return data.Id;
  }

  validateData(){
    this.indexDbStorage = [];
    this.indexDbVersion = 0;
    this.indexDbProductCount = -1;
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

  onInputKeyup(ev:TDSSafeAny){
    this.isLoading = true;
    this.keyFilter = ev.value;

    this.loadDataTable();

    this.isLoading = false;
  }

  getAllVariants(){
    // TODO: trường hợp thêm list các biến thể của sản phẩm
    if (!this.inLiveCampaign) {
      this.onLoadProductToOrderLines.emit(this.lstVariants);
    } else {
      this.onLoadProductToLiveCampaign.emit(this.lstVariants);
    }
  
    this.indClick = -1;
  }

  getCurrentVariant(data: DataPouchDBDTO){
    // TODO: trường hợp thêm sản phẩm
    this.onLoadProductToLiveCampaign.emit(data);

    this.indClick = -1;
  }

  onSearch() {
    this.search = !this.search;
  }
}

