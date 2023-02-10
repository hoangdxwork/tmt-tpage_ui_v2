import { Component, Input, OnInit } from '@angular/core';
import { ProductShopCartServiceV2 } from '@app/services/shopcart/product-shopcart-v2.service';
import { takeUntil } from 'rxjs';
import { TDSDestroyService } from 'tds-ui/core/services';

@Component({
  selector: 'product-shopcart-detail',
  templateUrl: './product-shopcart-detail.component.html',
  providers: [TDSDestroyService],
})
export class ProductShopcartDetailComponent implements OnInit {
  dataExpand: any;
  isLoading: boolean = false;
  @Input() id!: number;

  constructor(private productShopCartService_v2: ProductShopCartServiceV2,
    private destroy$: TDSDestroyService,) { }

  ngOnInit(): void {
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

}
