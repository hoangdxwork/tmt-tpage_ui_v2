import { Input, OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/main-app/services/product.service';
import { ProductPageFbDTO } from 'src/app/main-app/dto/product-pagefb/product-pagefb.dto';
import { TDSModalRef } from 'tds-ui/modal';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'product-pagefb',
  templateUrl: './product-pagefb.component.html',
})

export class ProductPagefbComponent implements OnInit, OnDestroy {

  @Input() pageId: any;

  lstOfData!: ProductPageFbDTO[];
  destroy$ = new Subject<void>();

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
    this.productService.getProductsByPageFacebook(this.pageId, this.state)
      .pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
          this.lstOfData = [...res];
    })
  }

  onPushItem(item: any) {debugger
    let model = {
      Id: item.Id,
      Name: item.Name,
      Picture: item.ImageUrl,
      Price: item.Price,
    } as any;

    this.modal.destroy(model);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cancel() {
    this.modal.destroy(null);
  }

}
