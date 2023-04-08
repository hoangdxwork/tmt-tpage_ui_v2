import { TDSTableQueryParams } from 'tds-ui/table';
import { ProductTemplateDTO } from '../../../../dto/product/product.dto';
import { ProductTemplateService } from '../../../../services/product-template.service';
import { THelperDataRequest } from 'src/app/lib/services/helper-data.service';
import { ODataStokeMoveDTO, ODataProductInventoryDTO } from '../../../../dto/configs/product/config-odata-product.dto';
import { Subject, finalize } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { StockMoveService } from '../../../../services/stock-move.service';
import { ConfigProductInventoryDTO } from '../../../../dto/configs/product/config-inventory.dto';
import { ConfigStockMoveDTO } from '../../../../dto/configs/product/config-warehouse.dto';
import { Component, Input, OnInit, OnDestroy, ViewChild, ChangeDetectorRef, ViewContainerRef } from '@angular/core';
import { TDSMessageService } from 'tds-ui/message';
import { ProductVariantDto } from '@app/dto/configs/product/config-product-variant.dto';
import { ConfigAddProductComponent } from '../../create-product/create-product.component';
import { TDSHelperArray, TDSHelperObject, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductTemplateDto } from '@app/dto/configs/product/config-product-default.dto';
import { AddProductHandler } from '@app/handler-v2/product/prepare-create-product.handler';
import { Message } from 'src/app/lib/consts/message.const';
import { TDSModalService } from 'tds-ui/modal';
import { ModalEditVariantsComponent } from '../modal-edit-variants/modal-edit-variants.component';

@Component({
    selector: 'product-details',
    templateUrl: './product-details.component.html'
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
    @Input() productTemplate!: ProductTemplateDTO;

    lstVariants: Array<ProductVariantDto> = [];
    dataModel!: ProductTemplateDto;
    lstStockMove: Array<ConfigStockMoveDTO> = [];
    lstProductInventory: Array<ConfigProductInventoryDTO> = [];

    isLoading: boolean = false;
    pageSize_stockMove = 10;
    pageIndex_stockMove = 1;
    isLoading_stockMove = false;
    count_stockMove: number = 1;

    pageSize_inventory = 10;
    pageIndex_inventory = 1;
    isLoading_inventory = false;
    count_inventory: number = 1;
    tabIndex:number = 0;

    fallback = '../../../assets/imagesv2/config/no-image-default.svg';

    private destroy$ = new Subject<void>();

    constructor(
        private message: TDSMessageService,
        private productService: ProductTemplateService,
        private stokeMoveService: StockMoveService,
        private productTemplateService: ProductTemplateService,
        private modalService: TDSModalService,
        private viewContainerRef: ViewContainerRef,
        private cdRef: ChangeDetectorRef,
        private router: Router,
    ) { }

    ngOnInit(): void {
      this.loadDataDetail(this.productTemplate.Id);
    }

    onChangeTab(tabIndex:number){
        this.tabIndex = tabIndex;

        switch (tabIndex) {
            case 2:
                this.getStockMoveProduct(this.pageSize_stockMove, this.pageIndex_stockMove);
                break;
            case 3:
                this.getProductInventory(this.pageSize_inventory, this.pageIndex_inventory);
                break;
        }
    }

    loadDataDetail(id: TDSSafeAny) {
      this.isLoading = true;
      this.productTemplateService.getProductTemplateByIdV3(id).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: TDSSafeAny) => {

          delete res['@odata.context'];
          this.dataModel = { ...res };

          // TODO: lấy danh sách biến thể
          // if(TDSHelperArray.hasListValue(this.dataModel.ProductVariants)){
          //   this.lstVariants = this.dataModel.ProductVariants;
          // }
          this.isLoading = false;
        },
        error: (error) => {
          this.message.error(error?.message);
          this.isLoading = false;
        }
      })
    }

    onQueryParamsStockMove(params: TDSTableQueryParams) {
        if (this.tabIndex == 2) {
            this.getStockMoveProduct(params.pageSize, params.pageIndex);
        }
    }

    getStockMoveProduct(pageSize: number, pageIndex: number) {
        this.isLoading_stockMove = true;
        let params = THelperDataRequest.convertDataRequestToString(pageSize, pageIndex);

        this.stokeMoveService.getStockMoveProduct(this.productTemplate.Id, params)
            .pipe(takeUntil(this.destroy$), finalize(() => this.isLoading_stockMove = false))
            .subscribe(
                (res: ODataStokeMoveDTO) => {
                    if (res) {
                        this.count_stockMove = res['@odata.count'] as number;
                        this.lstStockMove = [...res.value];
                    }
                }, error => {
                    this.message.error(error?.error?.message || 'Tải dữ liệu thẻ kho thất bại!');
                }
            );
    }

    refreshStockMoveTable() {
        this.pageIndex_stockMove = 1;
        this.getStockMoveProduct(this.pageSize_stockMove, this.pageIndex_stockMove);
    }

    onQueryParamsInventory(params: TDSTableQueryParams) {
        if (this.tabIndex == 3) {
            this.getProductInventory(params.pageSize, params.pageIndex);
        }
    }

    getProductInventory(pageSize: number, pageIndex: number) {
        this.isLoading_inventory = true;
        let params = THelperDataRequest.convertDataRequestToString(pageSize, pageIndex);
        this.productService.getInventoryProduct(this.productTemplate.Id, params)
            .pipe(takeUntil(this.destroy$), finalize(() => this.isLoading_inventory = false))
            .subscribe(
                (res: ODataProductInventoryDTO) => {
                    if (res) {
                        this.count_inventory = res['@odata.count'] as number;
                        this.lstProductInventory = [...res.value];
                    }
                }, error => {
                    this.message.error(error?.error?.message || 'Tải dữ liệu tồn kho thất bại!');
                }
            );
    }

    refreshProductInventoryTable() {
        this.pageIndex_inventory = 1;
        this.getProductInventory(this.pageSize_inventory, this.pageIndex_inventory);
    }

    showEditVariantsModal(data: ProductVariantDto) {

      const modal = this.modalService.create({
        title: 'Sửa biến thể sản phẩm',
        content: ModalEditVariantsComponent,
        size: "lg",
        viewContainerRef: this.viewContainerRef,
        componentParams: {
          data: data,
          id: this.productTemplate.Id
        }
      });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
