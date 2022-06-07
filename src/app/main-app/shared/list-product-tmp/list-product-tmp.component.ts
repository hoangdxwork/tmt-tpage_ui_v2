import { mergeMap } from 'rxjs/operators';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { TCommonService, THelperCacheService } from 'src/app/lib';
import { TDSHelperArray, TDSHelperObject, TDSHelperString, TDSMessageService, TDSModalService, TDSSafeAny, TDSTableComponent } from 'tmt-tang-ui';
import { DataPouchDBDTO, KeyCacheIndexDBDTO } from '../../dto/product-pouchDB/product-pouchDB.dto';
import { ProductIndexDBService } from '../../services/product-indexDB.service';
import { CompanyCurrentDTO } from '../../dto/configs/company-current.dto';
import { CommonService } from '../../services/common.service';
import { debounceTime, finalize, map, takeUntil } from 'rxjs/operators';
import { fromEvent, Subject } from 'rxjs';
import { orderBy as _orderBy } from 'lodash';
import { ProductTemplateV2DTO } from '../../dto/producttemplate/product-tempalte.dto';
import { SharedService } from '../../services/shared.service';
import { TpageAddProductComponent } from '../tpage-add-product/tpage-add-product.component';
import { InitSaleDTO, SaleSettingsDTO } from '../../dto/setting/setting-sale-online.dto';

@Component({
  selector: 'list-product-tmp',
  templateUrl: './list-product-tmp.component.html',
})

export class ListProductTmpComponent  implements OnInit, AfterViewInit, OnDestroy, OnChanges {

  @ViewChild('basicTable', { static: false }) tableComponent?: TDSTableComponent<any>;
  @ViewChild('innerText') innerText!: ElementRef;

  @Input() priceListItems: any;
  @Output() onLoadProductToOrderLines: EventEmitter<any> = new EventEmitter<any>();
  @Input() isLoadingProduct: boolean = false;

  private destroy$ = new Subject();
  lstOfData!: DataPouchDBDTO[];

  indexDbVersion: number = 0;
  indexDbProductCount: number = -1;
  indexDbStorage!: DataPouchDBDTO[];
  productTmplItems!: ProductTemplateV2DTO;

  cacheObject: KeyCacheIndexDBDTO = {
    cacheCount: -1,
    cacheVersion: 0,
    cacheDbStorage: []
  }

  roleConfigs!: SaleSettingsDTO;
  inventories!: TDSSafeAny;
  isLoading: boolean = false;

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
      private commonService: CommonService,
      public apiService: TCommonService,
      private cdRef : ChangeDetectorRef,
      private viewContainerRef: ViewContainerRef) {
  }

  ngOnInit(): void {
    this.loadConfig();
    this.loadData();
  }

  loadData(): void {
    this.validateData();
    this.isLoading = true;
    this.productIndexDBService.loadProductIndexDBV2()
      .pipe(takeUntil(this.destroy$)).pipe(finalize(() => {this.isLoading = false }))
      .subscribe((res: KeyCacheIndexDBDTO) => {
        if(TDSHelperObject.hasValue(res)) {

            this.indexDbProductCount = res.cacheCount;
            this.indexDbVersion = res.cacheVersion;
            this.indexDbStorage = res.cacheDbStorage;
            this.loadDataTable();
            this.cdRef.detectChanges();
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
    return this.lstOfData = data;
  }

  selectType(item: any): void {
    this.currentType = item;
    this.loadDataTable();
  }

  selectOption(item: any): void {
      this.currentOption = item;
      this.loadDataTable();
  }

  loadConfig() {
    this.sharedService.getConfigs().subscribe((res: InitSaleDTO) => {
        this.roleConfigs = res.SaleSetting;
    }, error => {
        this.message.error('Load thông tin cấu hình mặc định đã xảy ra lỗi!');
    });

    this.sharedService.getCurrentCompany().pipe(takeUntil(this.destroy$))
      .pipe(map((x: CompanyCurrentDTO) => { return x.DefaultWarehouseId }),
        mergeMap((warehouseId: any) => {
           return this.commonService.getInventoryWarehouseId(warehouseId)
        }))
        .subscribe((obj: CompanyCurrentDTO) => {
          this.inventories = obj;
      });
  }

  showModalAddProduct() {
    const modal = this.modalService.create({
      title: 'Thêm sản phẩm',
      content: TpageAddProductComponent,
      size: "xl",
      viewContainerRef: this.viewContainerRef
    });

    modal.afterClose.pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        if(res) {
          let productTmplItems = res[0]
          let cacheObject = res[1];

          this.indexDbProductCount = cacheObject.cacheCount;
          this.indexDbVersion = cacheObject.cacheVersion;
          this.indexDbStorage = cacheObject.cacheDbStorage;

          // TODO: trường hợp thêm mới push sp vào orderLines
          if(productTmplItems?.Id) {
            let item = this.indexDbStorage.filter((x: DataPouchDBDTO) =>
            x.ProductTmplId == productTmplItems.Id && x.UOMId == productTmplItems.UOMId)[0] as DataPouchDBDTO;

            if(!TDSHelperObject.hasValue(item)) {
              this.message.error('Thêm mới sản phẩm danh sách xảy ra lỗi!');
              return;
            }
            this.addItem(item);
          }
        }
      })
  }

  reloadIndexDB() {
    this.currentType = { text: "Bán chạy", value: "PosSalesCount" };
    this.currentOption = { text: 'Tất cả', value: 'all'};
    this.innerText.nativeElement.value = '';
    this.keyFilter = '';

    this.indexDbProductCount = -1;
    this.indexDbVersion = 0;
    this.indexDbStorage = [];

    let keyCache = this.productIndexDBService._keyCacheProductIndexDB;
    this.cacheApi.removeItem(keyCache);

    this.loadData();
  }

  addItem(data: DataPouchDBDTO) {
    this.onLoadProductToOrderLines.emit(data);
  }

  ngAfterViewInit(): void {
    this.tableComponent?.cdkVirtualScrollViewport?.scrolledIndexChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: number) => {});

    fromEvent(this.innerText.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value
      }), debounceTime(750)).subscribe((text: string) => {
        this.isLoading = true;
        this.keyFilter = text;
        this.loadDataTable();
        this.isLoading = false;
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

