import { TDSMessageService } from 'tds-ui/message';
import { FilterObjDTO } from 'src/app/main-app/services/mock-odata/odata-product.service';
import { ProductTemplateOUMLineService } from './../../../../services/product-template-uom-line.service';
import { ConversationOrderFacade } from './../../../../services/facades/conversation-order.facade';
import { AfterViewInit, ChangeDetectorRef, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DataPouchDBDTO, KeyCacheIndexDBDTO } from 'src/app/main-app/dto/product-pouchDB/product-pouchDB.dto';
import { ProductTemplateV2DTO } from 'src/app/main-app/dto/producttemplate/product-tempalte.dto';
import { debounceTime, finalize, map, mergeMap, takeUntil } from 'rxjs/operators';
import { CommonService } from 'src/app/main-app/services/common.service';
import { ProductIndexDBService } from 'src/app/main-app/services/product-indexDB.service';
import { orderBy as _orderBy } from 'lodash';
import { SharedService } from 'src/app/main-app/services/shared.service';
import { CompanyCurrentDTO } from 'src/app/main-app/dto/configs/company-current.dto';
import { TDSTableComponent, TDSTableQueryParams } from 'tds-ui/table';
import { TDSHelperArray, TDSHelperObject, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSModalRef } from 'tds-ui/modal';

@Component({
  selector: 'app-modal-list-product',
  templateUrl: './modal-list-product.component.html',
})

export class ModalListProductComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();
  isLoading: boolean = false;
  keyFilter: string = '';

  lstOfData!: DataPouchDBDTO[];
  pageIndex: number = 1;
  pageSize: number = 20;
  count!: number;
  textSearchProduct: string = '';

  indexDbVersion: number = 0;
  indexDbProductCount: number = -1;
  indexDbStorage!: DataPouchDBDTO[];
  productTmplItems!: ProductTemplateV2DTO;

  cacheObject: KeyCacheIndexDBDTO = {
    cacheCount: -1,
    cacheVersion: 0,
    cacheDbStorage: []
  }

  inventories!: TDSSafeAny;
  priceListItems: any;
  currentOption: any = { text: 'Tất cả', value: 'all'};
  currentType: any =  { text: "Bán chạy", value: "PosSalesCount" };

  constructor(private modal: TDSModalRef,
    private sharedService: SharedService,
    private message: TDSMessageService,
    private commonService: CommonService,
    private conversationOrderFacade: ConversationOrderFacade,
    private productTemplateOUMLineService: ProductTemplateOUMLineService) {
  }

  ngOnInit(): void {
    this.loadConfig();
  }

  onQueryParamsChange(params: TDSTableQueryParams) {
    this.pageSize = params.pageSize;
    this.loadData();
  }

  loadConfig() {
    this.sharedService.getCurrentCompany().pipe(takeUntil(this.destroy$))
      .pipe(map((x: CompanyCurrentDTO) => { return x.DefaultWarehouseId }),
        mergeMap((warehouseId: any) => {
          return this.commonService.getInventoryWarehouseId(warehouseId)
        }))
        .subscribe((obj: CompanyCurrentDTO) => {
            this.inventories = obj;
      });
  }

  validateData(){
    this.indexDbStorage = [];
    this.indexDbVersion = 0;
    this.indexDbProductCount = -1;
  }

  loadData(): void {
    this.validateData();
    this.isLoading = true;

    this.productTemplateOUMLineService.getProductUOMLine(this.pageIndex - 1, this.pageSize, this.textSearchProduct)
    .pipe(takeUntil(this.destroy$)).pipe(finalize(() => {this.isLoading = false }))
    .subscribe(res=>{
      this.lstOfData = [...res.value];
      this.count = res['@odata.count'] as number;
    },err=>{
      this.message.error(err.error? err.error.message: 'Tải dữ liệu thất bại')
    })
  }

  onSearchProduct(event: TDSSafeAny) {
    this.isLoading = true;
    this.pageIndex = 1;
    this.loadData();
  }

  addItem(item: DataPouchDBDTO) {
    this.conversationOrderFacade.onAddProductOrder$.emit(item)
  }

  refreshData(){

  }

  cancel(){
    this.modal.destroy(null);
  }

  // loadDataTable() :any {
  //   let data = this.indexDbStorage;
  //   if(TDSHelperObject.hasValue(this.currentOption)) {
  //       if(TDSHelperString.hasValueString(this.innerText)) {
  //           this.keyFilter = TDSHelperString.stripSpecialChars(this.keyFilter.trim());
  //       }
  //       data = data.filter((x: DataPouchDBDTO) =>
  //         (x.DefaultCode && TDSHelperString.stripSpecialChars(x.DefaultCode.toLowerCase()).indexOf(TDSHelperString.stripSpecialChars(this.keyFilter.toLowerCase())) !== -1) ||
  //         (x.Barcode && TDSHelperString.stripSpecialChars(x.Barcode.toLowerCase()).indexOf(TDSHelperString.stripSpecialChars(this.keyFilter.toLowerCase())) !== -1) ||
  //         (x.NameNoSign && TDSHelperString.stripSpecialChars(x.NameNoSign.toLowerCase()).indexOf(TDSHelperString.stripSpecialChars(this.keyFilter.toLowerCase())) !== -1) ||
  //         (x.NameGet && TDSHelperString.stripSpecialChars(x.NameGet.toLowerCase()).indexOf(TDSHelperString.stripSpecialChars(this.keyFilter.toLowerCase())) !== -1));
  //   }

  //   if(TDSHelperObject.hasValue(this.currentType)) {
  //      data = _orderBy(data, ["PosSalesCount"], "desc");
  //   }

  //   if(this.commonService.priceListItems$){
  //     this.commonService.priceListItems$.subscribe((res: any) => {
  //       this.priceListItems = res;
  //       if(TDSHelperArray.hasListValue(this.priceListItems)) {
  //         data.forEach((x: DataPouchDBDTO) => {
  //           if(x.SaleOK && ! x.IsDiscount) {
  //               let price = this.priceListItems[`${x.ProductTmplId}_${x.UOMId}`];
  //               if (price) {
  //                 if (!x.OldPrice) {
  //                     x.OldPrice = x.Price;
  //                 }
  //                 x.Price = price;
  //               } else {
  //                 if (x.OldPrice >= 0) {
  //                     x.Price = x.OldPrice;
  //                 }
  //               }
  //           }
  //         })
  //       }
  //       return this.lstOfData = data;
  //     })
  //   } else {
  //     return this.lstOfData = data;
  //   }
  // }

  onCancel(){
    this.modal.destroy(null);
  }

  trackByIndex(_: number, data: any): number {
    return data.index;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
