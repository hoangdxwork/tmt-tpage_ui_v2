import { TDSDestroyService } from 'tds-ui/core/services';
import { TDSMessageService } from 'tds-ui/message';
import { FilterObjDTO } from 'src/app/main-app/services/mock-odata/odata-product.service';
import { ProductTemplateUOMLineService } from './../../../../services/product-template-uom-line.service';
import { ConversationOrderFacade } from './../../../../services/facades/conversation-order.facade';
import { AfterViewInit, ChangeDetectorRef, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DataPouchDBDTO, KeyCacheIndexDBDTO } from 'src/app/main-app/dto/product-pouchDB/product-pouchDB.dto';
import { ProductTemplateV2DTO } from '@app/dto/product-template/product-tempalte.dto';
import { debounceTime, finalize, map, mergeMap, takeUntil } from 'rxjs/operators';
import { CommonService } from 'src/app/main-app/services/common.service';
import { orderBy as _orderBy } from 'lodash';
import { SharedService } from 'src/app/main-app/services/shared.service';
import { CompanyCurrentDTO } from 'src/app/main-app/dto/configs/company-current.dto';
import { TDSTableComponent, TDSTableQueryParams } from 'tds-ui/table';
import { TDSHelperArray, TDSHelperObject, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSModalRef } from 'tds-ui/modal';
import { ProductService } from '@app/services/product.service';

@Component({
  selector: 'app-modal-list-product',
  templateUrl: './modal-list-product.component.html',
  providers: [TDSDestroyService]
})

export class ModalListProductComponent implements OnInit {
  @Input() isPostConfig!: boolean;
  @Input() defaultOrder!: boolean;

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
  companyCurrents!: CompanyCurrentDTO;
  priceListItems: any;
  currentOption: any = { text: 'Tất cả', value: 'all'};
  currentType: any =  { text: "Bán chạy", value: "PosSalesCount" };

  constructor(private modal: TDSModalRef,
    private sharedService: SharedService,
    private message: TDSMessageService,
    private cdRef: ChangeDetectorRef,
    private destroy$: TDSDestroyService,
    private productService: ProductService,
    private conversationOrderFacade: ConversationOrderFacade,
    private productTemplateUOMLineService: ProductTemplateUOMLineService) {
  }

  ngOnInit(): void {
    if(!this.defaultOrder) {
      this.loadCurrentCompany();
    }
  }

  onQueryParamsChange(params: TDSTableQueryParams) {
    this.pageSize = params.pageSize;
    this.loadData();
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

  validateData(){
    this.indexDbStorage = [];
    this.indexDbVersion = 0;
    this.indexDbProductCount = -1;
  }

  loadData(): void {
    this.validateData();
    this.isLoading = true;

    this.productTemplateUOMLineService.getProductUOMLine(this.pageIndex - 1, this.pageSize, this.textSearchProduct)
      .pipe(takeUntil(this.destroy$)).subscribe({
        next: (res :any) => {
            this.lstOfData = [...res.value];
            this.count = res['@odata.count'] as number;

            this.isLoading = false;
            this.cdRef.detectChanges();
        },
        error: (error: any) => {
          this.isLoading = false;
          this.message.error(error.error || 'Tải dữ liệu thất bại')
        }
    })
  }

  onSearchProduct(event: TDSSafeAny) {
    this.isLoading = true;
    this.pageIndex = 1;
    this.loadData();
  }

  addItem(item: any) {
    if(this.isPostConfig || this.defaultOrder){
      this.modal.destroy(item);
    } else {
      this.conversationOrderFacade.onAddProductOrder$.emit(item);
    }
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
}
