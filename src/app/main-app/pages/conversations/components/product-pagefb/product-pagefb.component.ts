import { Input, OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { orderBy as _orderBy } from 'lodash';
import { ProductService } from 'src/app/main-app/services/product.service';
import { ProductPageFbDTO } from 'src/app/main-app/dto/product-pagefb/product-pagefb.dto';
import { TDSModalRef } from 'tds-ui/modal';

@Component({
  selector: 'product-pagefb',
  templateUrl: './product-pagefb.component.html',
})

export class ProductPagefbComponent implements OnInit, OnDestroy {

  @Input() pageId: any;

  lstOfData!: ProductPageFbDTO[];

  state: any = {
    Skip: 0,
    Limmit: 10,
    KeyWord: "",
  };

  constructor(private productService: ProductService,
    private modal: TDSModalRef) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.productService.getProductsByPageFacebook(this.pageId, this.state).subscribe((res: any) => {
      this.lstOfData = [...res];
    })
  }

  ngOnDestroy(): void {

  }

  cancel() {
    this.modal.destroy(null);
  }

}
