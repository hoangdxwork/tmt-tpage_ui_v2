import { ProductDTO, ProductTemplateDTO } from './../../../../dto/product/product.dto';
import { ProductTemplateService } from './../../../../services/product-template.service';
import { THelperDataRequest } from 'src/app/lib/services/helper-data.service';
import { ODataStokeMoveDTO, ODataProductInventoryDTO } from './../../../../dto/configs/product/config-odata-product.dto';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { StockMoveService } from '../../../../services/stock-move.service';
import { FormBuilder } from '@angular/forms';
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

  lstStockMove:Array<ConfigStockMoveDTO> = [];
  lstProductInventory: Array<ConfigProductInventoryDTO> = [];
  private destroy$ = new Subject<void>();

  pageSize_stockMove = 10;
  pageIndex_stockMove = 1;
  isLoading_stockMove = false;
  count_stockMove: number = 1;

  pageSize_productInventory = 10;
  pageIndex_productInventory = 1;
  isLoading_productInventory = false;
  count_productInventory: number = 1;

  fallback = '../../../assets/imagesv2/config/no-image-default.svg'

  constructor(private fb:FormBuilder,
    private message: TDSMessageService,
    private productService: ProductTemplateService,
    private stokeMoveService: StockMoveService
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getStockMoveProduct(pageSize:number, pageIndex:number){
    this.isLoading_stockMove = true;

    let params = THelperDataRequest.convertDataRequestToString(pageSize, pageIndex);

    this.stokeMoveService.getStockMoveProduct(this.productTemplate.Id,params).pipe(takeUntil(this.destroy$)).subscribe(
      (res:ODataStokeMoveDTO)=>{
        this.count_stockMove = res['@odata.count'] as number;
        this.lstStockMove = res.value;
        this.isLoading_stockMove = false;
      }, error => {
        this.isLoading_stockMove = false;
        this.message.error('Tải dữ liệu thẻ kho thất bại!');
      }
    );
  }

  refreshStockMoveTable(){
    this.pageIndex_stockMove = 1;

    this.getStockMoveProduct(this.pageSize_stockMove,this.pageIndex_stockMove);
  }

  getProductInventory(pageSize:number, pageIndex:number){
    this.isLoading_productInventory = true;

    let params = THelperDataRequest.convertDataRequestToString(pageSize, pageIndex);

    this.productService.getInventoryProduct(this.productTemplate.Id,params).pipe(takeUntil(this.destroy$)).subscribe(
      (res:ODataProductInventoryDTO)=>{
        this.count_stockMove = res['@odata.count'] as number;
        this.lstProductInventory = res.value;
        this.isLoading_productInventory = false;
      }, error => {
        this.isLoading_productInventory = false;
        this.message.error('Tải dữ liệu tồn kho thất bại!');
      }
    );
  }

  refreshProductInventoryTable(){
    this.pageIndex_productInventory = 1;

    this.getProductInventory(this.pageSize_productInventory,this.pageIndex_productInventory);
  }
}
