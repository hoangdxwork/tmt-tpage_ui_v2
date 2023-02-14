import { Component, Input, OnInit } from '@angular/core';
import { ProductShopCartDto } from '@app/dto/configs/product/config-product-shopcart.dto';
import { ProductShopCartServiceV2 } from '@app/services/shopcart/product-shopcart-v2.service';
import { takeUntil } from 'rxjs';
import { TDSDestroyService } from 'tds-ui/core/services';
import { TDSMessageService } from 'tds-ui/message';

@Component({
  selector: 'product-shopcart-detail',
  templateUrl: './product-shopcart-detail.component.html',
  providers: [TDSDestroyService],
})
export class ProductShopcartDetailComponent implements OnInit {
  dataExpand: any;
  isLoading: boolean = false;
  indClickQuantity: number = -1;
  currentQuantity: number = 0;
  @Input() id!: number;

  constructor(private productShopCartService_v2: ProductShopCartServiceV2,
    private destroy$: TDSDestroyService,
    private message: TDSMessageService,) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    if(this.id > 0) {
      this.isLoading = true;
      this.productShopCartService_v2.getVariantByProductTemplateId(this.id).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res) => {
          this.dataExpand = res;
          this.isLoading = false;
        }, error: (err) => {
          this.isLoading = false;
        }
      })
    }
  }

  onDelete(data: ProductShopCartDto) {
    let model = {
      Ids: [data.Id]
    }

    this.isLoading = true;
    this.productShopCartService_v2.deleteProductOnShopCart(model).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          this.message.success("Xóa sản phẩm trong giỏ hàng thành công");
          this.loadData();
          this.isLoading = false;
      },
      error: (err: any) => {
          this.message.error(err?.error?.message);
          this.isLoading = false;
      }
    })
  }


  openQuantityPopover(data: ProductShopCartDto) {
    this.indClickQuantity = data.Id;
    this.currentQuantity = data.ShopQuantity || 0;
  }

  closeQuantityPopover(): void {
    this.indClickQuantity = -1;
  }

  changeQuantity(value: number) {
    this.currentQuantity = value;
}

  saveChangeQuantity(data: ProductShopCartDto) {
    this.isLoading = true;

    let model = {
      ProductId: data.Id,
      Quantity: this.currentQuantity,
    }

    this.productShopCartService_v2.updateQuantityProductOnShopCart(model).pipe(takeUntil(this.destroy$)).subscribe({
      next:(res: any) => {
          this.isLoading = false;

          let index = this.dataExpand.findIndex((x: any) => x.Id == data.Id);
          if(index > -1) {
            this.dataExpand[index].ShopQuantity = this.currentQuantity;
          }

          this.message.success('Cập nhật thành công');
          this.indClickQuantity = -1;
      },
      error:(err) => {
          this.isLoading = false;
          this.message.error(err.error?.message);
          this.indClickQuantity = -1;
      }
    })
  }


}
