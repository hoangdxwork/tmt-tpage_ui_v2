import { ProductIndexDBService } from './../../../../services/product-indexDB.service';
import { ModalProductTemplateComponent } from '@app/shared/tpage-add-product/modal-product-template.component';
import { TDSDestroyService } from 'tds-ui/core/services';
import { TDSMessageService } from 'tds-ui/message';
import { ProductTemplateUOMLineService } from './../../../../services/product-template-uom-line.service';
import { ConversationOrderFacade } from './../../../../services/facades/conversation-order.facade';
import { ChangeDetectorRef, Input, ViewContainerRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { DataPouchDBDTO, KeyCacheIndexDBDTO, SyncCreateProductTemplateDto } from 'src/app/main-app/dto/product-pouchDB/product-pouchDB.dto';
import { ProductTemplateV2DTO } from '@app/dto/product-template/product-tempalte.dto';
import { takeUntil } from 'rxjs/operators';
import { orderBy as _orderBy } from 'lodash';
import { SharedService } from 'src/app/main-app/services/shared.service';
import { CompanyCurrentDTO } from 'src/app/main-app/dto/configs/company-current.dto';
import { TDSTableQueryParams } from 'tds-ui/table';
import { TDSSafeAny, TDSHelperString } from 'tds-ui/shared/utility';
import { TDSModalRef, TDSModalService } from 'tds-ui/modal';
import { ProductService } from '@app/services/product.service';
import { Message } from '@core/consts/message.const';

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

  textSearchProduct: string = '';

  indexDbVersion: number = 0;
  indexDbProductCount: number = -1;
  productTmplItems!: ProductTemplateV2DTO;

  inventories!: TDSSafeAny;
  companyCurrents!: CompanyCurrentDTO;
  priceListItems: any;
  currentOption: any = { text: 'Tất cả', value: 'all'};
  currentType: any =  { text: "Bán chạy", value: "PosSalesCount" };

  indexDbStorage!: DataPouchDBDTO[];
  innerTextDebounce!: string;

  constructor(private modal: TDSModalRef,
    private sharedService: SharedService,
    private message: TDSMessageService,
    private cdRef: ChangeDetectorRef,
    private destroy$: TDSDestroyService,
    private productService: ProductService,
    private conversationOrderFacade: ConversationOrderFacade,
    private productTemplateUOMLineService: ProductTemplateUOMLineService,
    private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef,
    private productIndexDBService: ProductIndexDBService) {
  }

  ngOnInit(): void {
    if(!this.defaultOrder) {
      this.loadCurrentCompany();
    }
    this.productIndexDB();
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

  onSearchProduct(event: TDSSafeAny) {
    if(!this.textSearchProduct) {
      this.innerTextDebounce = '';
      return;
    }

    this.innerTextDebounce = TDSHelperString.stripSpecialChars(this.textSearchProduct.toLocaleLowerCase().trim());
  }

  addItem(item: any) {
    if(this.isPostConfig || this.defaultOrder){
      this.modal.destroy(item);
    } else {
      this.conversationOrderFacade.onAddProductOrder$.emit(item);
    }
  }

  cancel(){
    this.modal.destroy(null);
  }

  showModalAddProduct() {
    const modal = this.modalService.create({
        title: 'Thêm sản phẩm',
        content: ModalProductTemplateComponent,
        size: 'xl',
        viewContainerRef: this.viewContainerRef
    });

    modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe({
      next:(res: any) => {
        if(!res) return;

        res = {...res} as SyncCreateProductTemplateDto;
        this.indexDbStorage = [...res.cacheDbStorage];

        if(res.type === 'select' && res.productTmpl) {
          let model = res.productTmpl;
          let item = this.indexDbStorage?.filter((x: DataPouchDBDTO) => x.ProductTmplId == model.Id && x.UOMId == model.UOMId && x.Active)[0] as DataPouchDBDTO;

          if(!item) return;
          this.addItem(item);
        }
      }
    })
  }

  onCancel(){
    this.modal.destroy(null);
  }

  productIndexDB() {
    this.isLoading = true;
    this.indexDbStorage = [];
    this.productIndexDBService.setCacheDBRequest();
    this.productIndexDBService.getCacheDBRequest().pipe(takeUntil(this.destroy$)).subscribe({
        next:(res: KeyCacheIndexDBDTO) => {
            if(!res) return;
            this.indexDbStorage = [...res?.cacheDbStorage];
            this.isLoading = false;
            this.cdRef.detectChanges();
        },
        error:(err) => {
            this.isLoading = false;
            this.message.error(err?.error?.message || Message.Product.CanNotLoadData);
            this.cdRef.detectChanges();
        }
    })
  }

  trackByIndex(_: number, data: DataPouchDBDTO): number {
    return data.Id;
  }
}
