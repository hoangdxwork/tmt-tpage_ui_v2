import { ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { TDSHelperArray, TDSHelperObject, TDSHelperString, TDSModalRef, TDSSafeAny, TDSMessageService, TDSTableComponent } from 'tmt-tang-ui';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ProductIndexDBService } from 'src/app/main-app/services/product-indexDB.service';
import { THelperCacheService } from 'src/app/lib';
import { DataPouchDBDTO, KeyCacheIndexDBDTO, ProductPouchDBDTO } from 'src/app/main-app/dto/product-pouchDB/product-pouchDB.dto';
import { ProductTemplateV2DTO } from 'src/app/main-app/dto/producttemplate/product-tempalte.dto';
import { debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { CommonService } from 'src/app/main-app/services/common.service';

@Component({
  selector: 'app-modal-list-product',
  templateUrl: './modal-list-product.component.html',
  styleUrls: ['./modal-list-product.component.scss']
})
export class ModalListProductComponent implements OnInit, OnDestroy {

  @Input() useListPrice: boolean = false;
  @Output() selectProduct = new EventEmitter<ProductTemplateV2DTO>();

  @ViewChild('basicTable', { static: false }) tableComponent?: TDSTableComponent<DataPouchDBDTO>;
  @ViewChild('innerText') innerText!: ElementRef;

  private destroy$ = new Subject();
  isLoading: boolean = false;

  keyFilter: string = '';

  lstOfData: any[] = [];
  lstPriceLists: any;

  indexDbVersion: number = 0;
  indexDbProductCount: number = -1;
  indexDbStorage!: DataPouchDBDTO[];
  productTmplItems!: ProductTemplateV2DTO;

  trackByIndex(_: number, data: any): number {
    return data.index;
  }

  constructor(
    private modal: TDSModalRef,
    private productIndexDBService: ProductIndexDBService,
    private cacheApi: THelperCacheService,
    private message: TDSMessageService,
    private commonService: CommonService
  ) { }

  ngOnInit(): void {
    this.loadData();
    this.loadPriceLists();
  }

  loadData(): void {
    let keyCache = JSON.stringify(this.productIndexDBService._keyCacheProductIndexDB);
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

  loadPriceLists() {
    this.commonService.dataPriceLists$
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if(res && res.currentId) {
          this.lstPriceLists = res[res.currentId];
        }
      });
  }

  loadProductIndexDB(productCount: number, version: number): any {
    this.isLoading = true;
    this.productIndexDBService.getLastVersionV2(productCount, version)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: ProductPouchDBDTO) => {

        if(TDSHelperArray.hasListValue(data.Datas)) {
          if(productCount == -1 && version == 0) {
              this.indexDbStorage = data.Datas;
              this.loadDataTable();
          } else {
            if(TDSHelperArray.hasListValue(data.Datas)) {
              data.Datas.forEach((x: DataPouchDBDTO) => {
                  this.indexDbStorage.push(x);
              });
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
        this.isLoading = false;

    }, error => {
        this.isLoading = false;
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

    let keyCache = JSON.stringify(this.productIndexDBService._keyCacheProductIndexDB);
    this.cacheApi.setItem(keyCache, JSON.stringify(objCached));
  }

  loadDataTable() {
    let data = this.indexDbStorage;

    if(TDSHelperString.hasValueString(this.innerText)) {
      this.keyFilter = TDSHelperString.stripSpecialChars(this.keyFilter.trim());

      data = data.filter((x: DataPouchDBDTO) =>
        (x.DefaultCode && TDSHelperString.stripSpecialChars(x.DefaultCode.toLowerCase()).indexOf(TDSHelperString.stripSpecialChars(this.keyFilter.toLowerCase())) !== -1) ||
        (x.Barcode && TDSHelperString.stripSpecialChars(x.Barcode.toLowerCase()).indexOf(TDSHelperString.stripSpecialChars(this.keyFilter.toLowerCase())) !== -1) ||
        (x.NameNoSign && TDSHelperString.stripSpecialChars(x.NameNoSign.toLowerCase()).indexOf(TDSHelperString.stripSpecialChars(this.keyFilter.toLowerCase())) !== -1) ||
        (x.NameGet && TDSHelperString.stripSpecialChars(x.NameGet.toLowerCase()).indexOf(TDSHelperString.stripSpecialChars(this.keyFilter.toLowerCase())) !== -1));
    }

    if(TDSHelperArray.hasListValue(this.lstPriceLists) && this.useListPrice) {
      data.forEach((x: DataPouchDBDTO) => {
        if(x.SaleOK && ! x.IsDiscount) {
            let price = this.lstPriceLists[`${x.ProductTmplId}_${x.UOMId}`];
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

  onSelectProduct(product: ProductTemplateV2DTO) {
    this.selectProduct.emit(product);
  }

  cancel(){
    this.modal.destroy(null);
  }

  ngAfterViewInit(): void {
    this.tableComponent?.cdkVirtualScrollViewport?.scrolledIndexChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: number) => {});

    fromEvent(this.innerText.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value
      })
      , debounceTime(750), distinctUntilChanged()).subscribe((text: string) => {
        this.keyFilter = text;
        this.loadDataTable();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
