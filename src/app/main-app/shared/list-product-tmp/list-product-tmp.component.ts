import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { THelperCacheService } from 'src/app/lib';
import { TDSHelperArray, TDSHelperObject, TDSHelperString, TDSMessageService, TDSModalService, TDSSafeAny, TDSTableComponent } from 'tmt-tang-ui';
import { DataPouchDBDTO, KeyCacheIndexDBDTO,  ProductPouchDBDTO } from '../../dto/product-pouchDB/product-pouchDB.dto';
import { ProductIndexDBService } from '../../services/product-indexDB.service';
import { CompanyCurrentDTO } from '../../dto/configs/company-current.dto';
import { CommonService } from '../../services/common.service';
import { debounceTime, distinctUntilChanged, finalize, map, takeUntil } from 'rxjs/operators';
import { fromEvent, Observable, Subject, Subscription } from 'rxjs';
import { orderBy as _orderBy } from 'lodash';
import { ProductTemplateV2DTO } from '../../dto/producttemplate/product-tempalte.dto';
import { SharedService } from '../../services/shared.service';
import { TpageAddProductComponent } from '../tpage-add-product/tpage-add-product.component';
import { InitSaleDTO, SaleSettingsDTO } from '../../dto/setting/setting-sale-online.dto';

@Component({
  selector: 'list-product-tmp',
  templateUrl: './list-product-tmp.component.html',
})

export class ListProductTmpComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {

  @ViewChild('basicTable', { static: false }) tableComponent?: TDSTableComponent<DataPouchDBDTO>;
  @ViewChild('innerText') innerText!: ElementRef;

  @Input() priceListItems: any;
  @Output() onLoadProductToOrderLines: EventEmitter<any> = new EventEmitter<any>();
  private destroy$ = new Subject();
  lstOfData!: DataPouchDBDTO[];

  indexDbVersion: number = 0;
  indexDbProductCount: number = -1;
  indexDbStorage!: DataPouchDBDTO[];
  productTmplItems!: ProductTemplateV2DTO;

  roleConfigs!: SaleSettingsDTO;
  inventories!: TDSSafeAny;
  isLoading: boolean = false;
  @Input() isLoadingProduct: boolean = false;

  options: Array<TDSSafeAny> = [
    { text: 'Tất cả', value: 'all'},
    { text: 'Mã', value: 'code'},
    { text: 'Tên', value: 'name'},
    { text: 'Barcode', value: 'barcode'}
  ];
  currentOption: any = { text: 'Tất cả', value: 'all'};

  types: Array<TDSSafeAny> = [
    { text: "Bán chạy", value: "PosSalesCount" },
    { text: "Theo tên", value: "NameGet" },
    { text: "Theo mã", value: "DefaultCode" },
    { text: "Mới nhất", value: "Id" }
  ];

  currentType: any =  { text: "Bán chạy", value: "PosSalesCount" };
  keyFilter: string = '';

  constructor(private productIndexDBService: ProductIndexDBService,
      private cacheApi: THelperCacheService,
      private modalService: TDSModalService,
      private sharedService: SharedService,
      private message: TDSMessageService,
      private commonService: CommonService,
      private viewContainerRef: ViewContainerRef) {
  }

  ngOnInit(): void {
    this.loadConfig();
    this.loadData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes["priceListItems"] && changes["priceListItems"].currentValue) {
      this.priceListItems = changes["priceListItems"].currentValue;
      this.loadData();
    }

    if(changes['isLoadingProduct'] && (changes['isLoadingProduct'].currentValue == true || changes['isLoadingProduct'].currentValue == false)) {
      this.isLoading = changes['isLoadingProduct'].currentValue;
    }
  }

  loadData(): void {
    let keyCache = this.productIndexDBService._keyCacheProductIndexDB;
    this.cacheApi.getItem(keyCache).subscribe((obs: TDSSafeAny) => {

      if(TDSHelperString.hasValueString(obs)) {
          let cache = JSON.parse(obs['value']) as TDSSafeAny;
          let cacheDB = JSON.parse(cache['value']) as KeyCacheIndexDBDTO;

          this.indexDbVersion = cacheDB.cacheVersion;
          this.indexDbProductCount = cacheDB.cacheCount;
          this.indexDbStorage = cacheDB.cacheDbStorage;
      }

      if(this.indexDbProductCount == -1 && this.indexDbVersion == 0) {
          this.loadProductIndexDB(this.indexDbProductCount, this.indexDbVersion);
      } else {
          this.loadDataTable();
      }
    })
  }

  loadProductIndexDB(productCount: number, version: number): any {
    this.isLoading = true;
    this.productIndexDBService.getLastVersionV2(productCount, version)
      .pipe(takeUntil(this.destroy$))
      .pipe(finalize(() => {this.isLoading = false }))
      .subscribe((data: ProductPouchDBDTO) => {

        if(data.IsDelete === true) {
          (this.indexDbStorage as any) = [];
        }

        if(TDSHelperArray.hasListValue(data.Datas)) {
          if(productCount == -1 && version == 0) {
              this.indexDbStorage = data.Datas;
              this.loadDataTable();
          } else {
            if(TDSHelperArray.hasListValue(data.Datas)) {
              data.Datas.forEach((x: DataPouchDBDTO) => {
                  this.indexDbStorage.push(x);
              });

              // TODO: trường hợp thêm mới push sp vào orderLines
              if(TDSHelperObject.hasValue(this.productTmplItems) && this.productTmplItems.Id) {
                  var item = this.indexDbStorage.filter((x: DataPouchDBDTO) =>
                      x.ProductTmplId == this.productTmplItems.Id && x.UOMId == this.productTmplItems.UOMId && x.Price == this.productTmplItems.ListPrice)[0] as DataPouchDBDTO;
                  if(!TDSHelperObject.hasValue(item)) {
                      this.message.error('Thêm mới sản phẩm vào indexDB đã xảy ra lỗi!');
                      return;
                  }
                  this.addItem(item);
              }
            }
          }
        }
        //TODO: check số version
        let versions = this.indexDbStorage.map((x: DataPouchDBDTO) => x.Version);
        let lastVersion = Math.max(...versions);

        //TODO: check số lượng
        let count = this.indexDbStorage.length;

        if(lastVersion != this.indexDbVersion || count != this.indexDbProductCount) {
            this.indexDbVersion = lastVersion;
            this.indexDbProductCount = count;
        }

        this.mappingCacheDB();
    }, error => {
        this.message.error('Load danh sách sản phẩm đã xảy ra lỗi!');
    })
  }

  mappingCacheDB() {
    //TODO: lưu cache cho ds sản phẩm
    let objCached: KeyCacheIndexDBDTO = {
        cacheCount: this.indexDbProductCount,
        cacheVersion: this.indexDbVersion,
        cacheDbStorage: this.indexDbStorage
    };

    let keyCache = this.productIndexDBService._keyCacheProductIndexDB;
    this.cacheApi.setItem(keyCache, JSON.stringify(objCached));
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
      .subscribe((res: CompanyCurrentDTO) => {
        if(res.DefaultWarehouseId) {
            let warehouseId = res.DefaultWarehouseId;
            this.commonService.getInventoryWarehouseId(warehouseId).subscribe((obj: any) => {
                this.inventories = obj;
            }, error =>{
                this.message.error('Load thông tin tồn kho đã xảy ra lỗi!');
            });
        }
    }, error => {
        this.message.error('Load thông tin công ty đã xảy ra lỗi!');
    })
  }

  showModalAddProduct() {
    const modal = this.modalService.create({
        title: 'Thêm sản phẩm',
        content: TpageAddProductComponent,
        size: "xl",
        viewContainerRef: this.viewContainerRef
    });

    modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe((res: ProductTemplateV2DTO) => {
        if(res) {
            this.pusToIndexDb();
            this.productTmplItems = res;
        }
    });
  }

  pusToIndexDb(): any {
    this.indexDbProductCount = this.indexDbProductCount;
    this.loadProductIndexDB(this.indexDbProductCount, this.indexDbVersion);
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
        setTimeout(()=>{
          this.loadDataTable();
          this.isLoading = false;
        },750);
    });
  }

  trackByIndex(_: number, data: DataPouchDBDTO): number {
    return data.Id;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

