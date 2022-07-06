import { TDSTableQueryParams } from 'tds-ui/table';
import { ProductTemplateDTO } from './../../../../dto/product/product.dto';
import { ProductTemplateService } from './../../../../services/product-template.service';
import { THelperDataRequest } from 'src/app/lib/services/helper-data.service';
import { ODataStokeMoveDTO, ODataProductInventoryDTO } from './../../../../dto/configs/product/config-odata-product.dto';
import { Subject, finalize } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { StockMoveService } from '../../../../services/stock-move.service';
import { ConfigProductInventoryDTO } from '../../../../dto/configs/product/config-inventory.dto';
import { ConfigStockMoveDTO } from './../../../../dto/configs/product/config-warehouse.dto';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { TDSMessageService } from 'tds-ui/message';

@Component({
  selector: 'config-product-details',
  templateUrl: './config-product-details.component.html'
})
export class ConfigProductDetailsComponent implements OnInit, OnDestroy {
  @Input() productTemplate!: ProductTemplateDTO;

  lstStockMove: Array<ConfigStockMoveDTO> = [];
  lstProductInventory: Array<ConfigProductInventoryDTO> = [];

  pageSize_stockMove = 10;
  pageIndex_stockMove = 1;
  isLoading_stockMove = false;
  count_stockMove: number = 1;

  pageSize_inventory = 10;
  pageIndex_inventory = 1;
  isLoading_inventory = false;
  count_inventory: number = 1;

  tabSelected = 'info';
  fallback = '../../../assets/imagesv2/config/no-image-default.svg';

  private destroy$ = new Subject<void>();

  constructor(
    private message: TDSMessageService,
    private productService: ProductTemplateService,
    private stokeMoveService: StockMoveService
  ) { }

  ngOnInit(): void { }

  onSelectTab(tabName: string) {
    this.tabSelected = tabName;
    switch (tabName) {
      case 'stockMove':
        this.getStockMoveProduct(this.pageSize_stockMove, this.pageIndex_stockMove);
        break;
      case 'inventory':
        this.getProductInventory(this.pageSize_inventory, this.pageIndex_inventory);
        break;
    }
  }

  onQueryParamsStockMove(params: TDSTableQueryParams) {
    if (this.tabSelected == 'stockMove') {
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
    if (this.tabSelected == 'inventory') {
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
