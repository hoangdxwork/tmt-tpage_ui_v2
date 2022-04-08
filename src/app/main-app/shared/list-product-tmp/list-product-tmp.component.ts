import { SaleConfigsDTO, SaleSettingDTO } from './../../dto/configs/sale-config.dto';

import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { THelperCacheService } from 'src/app/lib';
import { TDSHelperArray, TDSHelperObject, TDSHelperString, TDSMessageService, TDSModalService, TDSSafeAny, TDSTableComponent } from 'tmt-tang-ui';
import { DataPouchDBDTO, KeyCacheIndexDBDTO,  ProductPouchDBDTO } from '../../dto/product-pouchDB/product-pouchDB.dto';
import { GeneralConfigsFacade } from '../../services/facades/general-config.facade';
import { ProductIndexDBService } from '../../services/product-indexDB.service';
import { CompanyCurrentDTO } from '../../dto/configs/company-current.dto';
import { CommonService } from '../../services/common.service';
import { debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { fromEvent, Subject } from 'rxjs';
// import * as _ from "lodash";
import { ModalAddProductComponent } from '../../pages/bill/components/modal-add-product/modal-add-product.component';

@Component({
  selector: 'list-product-tmp',
  templateUrl: './list-product-tmp.component.html',
})

export class ListProductTmpComponent implements OnInit, AfterViewInit, OnDestroy  {

  @ViewChild('basicTable', { static: false }) tableComponent?: TDSTableComponent<DataPouchDBDTO>;
  @ViewChild('innerText') innerText!: ElementRef;
  private destroy$ = new Subject();

  lstOfData!: DataPouchDBDTO[];

  cacheVersion: number = 0;
  cacheCount: number = -1;
  cacheDbStorage!: DataPouchDBDTO[];

  roleConfigs!: SaleSettingDTO;
  inventories!: TDSSafeAny;

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
      private generalConfigsFacade: GeneralConfigsFacade,
      private cacheApi: THelperCacheService,
      private modalService: TDSModalService,
      private message: TDSMessageService,
      private commonService: CommonService,
      private viewContainerRef: ViewContainerRef) {
  }

  ngOnInit(): void {
    this.loadConfig();
    this.loadData();
  }

  loadData(): void {
    let keyCache = JSON.stringify(this.productIndexDBService._keyCacheProductIndexDB);
    this.cacheApi.getItem(keyCache).subscribe((obs: TDSSafeAny) => {

        if(TDSHelperString.hasValueString(obs)) {
            let cache = JSON.parse(obs['value']) as TDSSafeAny;
            let cacheDB = JSON.parse(cache['value']) as KeyCacheIndexDBDTO;

            this.cacheVersion = cacheDB.cacheVersion;
            this.cacheCount = cacheDB.cacheCount;
        }
        this.loadProductPouchDB(this.cacheVersion, this.cacheCount);
    })
  }

  loadProductPouchDB(productCount: number, version: number) {
    this.productIndexDBService.facadeLastVersionV2(productCount, version).subscribe((data: ProductPouchDBDTO) => {

        if(TDSHelperArray.hasListValue(data.Datas)) {
          this.cacheDbStorage = data.Datas;

          this.loadDataTable();
        }

        //TODO: check số version
        let versions = data.Datas.map((x: DataPouchDBDTO) => x.Version);
        let lastVersion = Math.max(...versions);

        let exist = (lastVersion != this.cacheVersion) && (data.Datas.length != this.cacheCount) && TDSHelperArray.hasListValue(data.Datas);
        if(exist) {
            this.cacheCount = data.Datas.length;
            this.cacheVersion = lastVersion;
            this.mappingCacheDB();
        }
    })
  }

  mappingCacheDB() {
    let objCached: KeyCacheIndexDBDTO = {
        cacheCount: this.cacheCount,
        cacheVersion: this.cacheVersion,
        cacheDbStorage: this.cacheDbStorage
    };

    let keyCache = JSON.stringify(this.productIndexDBService._keyCacheProductIndexDB);
    this.cacheApi.setItem(keyCache, JSON.stringify(objCached));
  }

  loadDataTable() {
    let data = this.cacheDbStorage;
    if(TDSHelperObject.hasValue(this.currentOption)) {
        if(TDSHelperString.hasValueString(this.innerText)) {
          this.keyFilter = TDSHelperString.stripSpecialChars(this.keyFilter);
        }

        switch(this.currentOption.value) {
          case "all":
            data = data.filter((x: DataPouchDBDTO) =>
                (x.DefaultCode && x.DefaultCode.toLowerCase().indexOf(this.keyFilter) !== -1) ||  (x.Barcode && x.Barcode.toLowerCase().indexOf(this.keyFilter) !== -1) ||
                (x.NameNoSign && x.NameNoSign.toLowerCase().indexOf(this.keyFilter) !== -1) || (x.NameGet && x.NameGet.toLowerCase().indexOf(this.keyFilter) !== -1));
            break;

          case "code":
            data =  data.filter((x: DataPouchDBDTO) =>
                (x.DefaultCode && x.DefaultCode.toLowerCase().indexOf(this.keyFilter) !== -1));
            break;

          case "barcode":
            data = data.filter((x: DataPouchDBDTO) =>
               (x.Barcode && x.Barcode.toLowerCase().indexOf(this.keyFilter) !== -1));
            break;

          case "name":
            data = data.filter((x: DataPouchDBDTO) =>
                (x.NameNoSign && x.NameNoSign.toLowerCase().indexOf(this.keyFilter) !== -1) || (x.NameGet && x.NameGet.toLowerCase().indexOf(this.keyFilter) !== -1));
            break;
        }
    }

    if(TDSHelperObject.hasValue(this.currentType)) {
        switch(this.currentType.value) {
          // case 'Id':
          //   data = _.orderBy(data, ["Id"], ["desc"]);
          // break;

          // case 'Name':
          //   data = _.orderBy(data, ["Name"], ["asc"]);
          // break;

          // case 'DefaultCode':
          //   data = _.orderBy(data, ["DefaultCode"], ["asc"]);
          // break;

          // case 'PosSalesCount':
          //   data = _.orderBy(data, ["PosSalesCount"], "desc");
          // break;
        }
    }

    this.lstOfData = data;
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
    this.generalConfigsFacade.getSaleConfigs().subscribe((res: SaleConfigsDTO) => {
        this.roleConfigs = res.SaleSetting;
    }, error => {
        this.message.error('Load thông tin cấu hình mặc định đã xảy ra lỗi!');
    });

    this.generalConfigsFacade.getCurrentCompany().subscribe((res: CompanyCurrentDTO) => {
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
      content: ModalAddProductComponent,
      size: "xl",
      viewContainerRef: this.viewContainerRef,
    });

    modal.afterClose.subscribe(result => {
      if (TDSHelperObject.hasValue(result)) {

      }
    });
  }

  reloadIndexDB() {
    this.currentType =  { text: "Bán chạy", value: "PosSalesCount" };
    this.currentOption= { text: 'Tất cả', value: 'all'};
    this.innerText.nativeElement.value = '';
    this.keyFilter = '';

    this.lstOfData = this.cacheDbStorage;
    this.loadDataTable();
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
        this.keyFilter = text.toLowerCase();
        this.loadDataTable();
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
