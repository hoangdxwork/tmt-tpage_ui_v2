import { Detail_QuickSaleOnlineOrder } from '@app/dto/saleonlineorder/quick-saleonline-order.dto';
import { TDSSafeAny } from 'tds-ui/shared/utility';
import { mergeMap, takeUntil, Observable, observable, of, map } from 'rxjs';
import { Message } from './../../../../lib/consts/message.const';
import { ProductService } from './../../../services/product.service';
import { SharedService } from './../../../services/shared.service';
import { ProductTemplateUOMLineService } from './../../../services/product-template-uom-line.service';
import { TDSHelperObject } from 'tds-ui/shared/utility';
import { TDSModalService } from 'tds-ui/modal';
import { CreateDefaultProductComponent } from './../components/create-default-product/create-default-product.component';
import { TDSMessageService } from 'tds-ui/message';
import { ProductDTOV2 } from './../../../dto/product/odata-product.dto';
import { TDSDestroyService } from 'tds-ui/core/services';
import { Component, OnInit, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-default-order',
  templateUrl: './default-order.component.html',
  providers: [TDSDestroyService]
})

export class DefaultOrderComponent implements OnInit {

  defaultProduct?: Detail_QuickSaleOnlineOrder;

  constructor(private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef,
    private destroy$: TDSDestroyService,
    private sharedService: SharedService,
    private productService: ProductService,
    private productTemplateUOMLineService: ProductTemplateUOMLineService,
    private message: TDSMessageService) { }

  ngOnInit(): void {
    this.loadDefaultProduct();
  }

  loadDefaultProduct(){
    let exist = this.productTemplateUOMLineService.getDefaultProduct();

    if(exist && exist.ProductId){
        this.defaultProduct = exist;
    } else {
        this.sharedService.setSaleConfig();
        this.sharedService.getSaleConfig().pipe(takeUntil(this.destroy$)).pipe(mergeMap(config => {

          return new Observable((observable: any): any => {
              if(config.SaleSetting?.ProductId){
                  return this.productService.getById(config.SaleSetting.ProductId)
                    .pipe(map((x: any): any => {
                        if(x) {
                            observable.next(x);
                            observable.complete();
                        } else {
                            observable.next();
                            observable.complete();
                        }
                    }))
              } else{
                  return of({});
              }
          })
        }))
        .subscribe({
          next:(product :any) => {
            if(product && product.Id) {
                //TODO: Trường hợp có sản phẩm
                this.defaultProduct = this.prepareModel(product);
                this.productTemplateUOMLineService.setDefaultProduct(this.defaultProduct);
            }
          },
          error:(err) => {
              this.message.error(err?.error?.message || Message.Product.CanNotLoadData);
          }
        })
    }
  }

  createDefaultProduct(){
    const modal = this.modalService.create({
      title: 'Chọn sản phẩm',
      content: CreateDefaultProductComponent,
      size: "lg",
      viewContainerRef: this.viewContainerRef
    });

    modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe((result: ProductDTOV2) => {
      if(TDSHelperObject.hasValue(result)){
        this.defaultProduct = this.prepareModel(result);

        this.productTemplateUOMLineService.setDefaultProduct(this.defaultProduct);
      }
    })
  }

  prepareModel(data: TDSSafeAny){
    return {
      Id: null,
      Quantity: 1,
      Price: data?.ListPrice || data?.Price,
      ProductId: data?.Id,
      ProductName: data?.Name,
      ProductNameGet: data?.NameGet,
      ProductCode: data?.DefaultCode,
      UOMId: data?.UOMId,
      UOMName: data?.UOMName || data?.UOM?.Name,
      Factor: data?.Factor,
      ImageUrl: data?.ImageUrl
    } as Detail_QuickSaleOnlineOrder;
  }

  removeDefaultProduct(){
    delete this.defaultProduct;
    this.productTemplateUOMLineService.removeCache();
  }
}
