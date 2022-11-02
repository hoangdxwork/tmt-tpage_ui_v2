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
import { TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSModalRef, TDSModalService } from 'tds-ui/modal';
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
  productTmplItems!: ProductTemplateV2DTO;

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
    private productTemplateUOMLineService: ProductTemplateUOMLineService,
    private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef) {
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

  loadData(): void {
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
    this.lstOfData = [];
    this.pageIndex = 1;
    this.loadData();
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
        let indexDbStorage = [...res.cacheDbStorage];

        if(res.type === 'select' && res.productTmpl) {
          let model = res.productTmpl;
          let item = indexDbStorage?.filter((x: DataPouchDBDTO) => x.ProductTmplId == model.Id && x.UOMId == model.UOMId)[0] as DataPouchDBDTO;

          if(!item) return;
          this.addItem(item);
        }
      }
    })
  }

  onCancel(){
    this.modal.destroy(null);
  }

  trackByIndex(_: number, data: any): number {
    return data.index;
  }
}
