import { TDSSafeAny } from 'tds-ui/shared/utility';
import { takeUntil } from 'rxjs';
import { Message } from './../../../../lib/consts/message.const';
import { ProductService } from './../../../services/product.service';
import { TDSHelperString } from 'tds-ui/shared/utility';
import { SharedService } from './../../../services/shared.service';
import { ProductTemplateUOMLineService } from './../../../services/product-template-uom-line.service';
import { THelperCacheService } from 'src/app/lib';
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

  defaultProduct?: TDSSafeAny;
  key!:string;

  constructor(private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef,
    private destroy$: TDSDestroyService,
    private cacheApi: THelperCacheService,
    private shareService: SharedService,
    private productService: ProductService,
    private productTemplateUOMLineService: ProductTemplateUOMLineService,
    private message: TDSMessageService) { }

  ngOnInit(): void {
    this.key = this.productTemplateUOMLineService._keyCacheDefaultProduct;
    
    this.cacheApi.getItem(this.key).subscribe(res =>{

      if(res){
        let stringData = JSON.parse(res.value).value;
        //TODO: lấy sản phẩm mặc định từ cache
        if(TDSHelperString.isString(stringData)){
          this.defaultProduct = this.prepareModel(JSON.parse(stringData));console.log(JSON.parse(stringData))
        }

      }else{
        //TODO: lấy sản phẩm mặc định từ sale configs
        this.shareService.getConfigs().pipe(takeUntil(this.destroy$)).subscribe(item => {

          if(TDSHelperObject.hasValue(item.SaleSetting.Product)){
            let productId = item.SaleSetting.ProductId;

            this.productService.getById(productId).pipe(takeUntil(this.destroy$)).subscribe(res =>{

              this.defaultProduct = this.prepareModel(res);
              this.cacheApi.setItem(this.key, JSON.stringify(this.defaultProduct));

            }, err => {
              this.message.error(err?.error?.message || Message.Product.CanNotLoadData);
            })
          }
        },
        err => {
          this.message.error(err?.error?.message || Message.Product.CanNotLoadData);
        })
      }
    })
  }

  createDefaultProduct(){
    const modal = this.modalService.create({
      title: 'Chọn sản phẩm',
      content: CreateDefaultProductComponent,
      size: "md",
      viewContainerRef: this.viewContainerRef
    });

    modal.afterClose.subscribe((result: ProductDTOV2) => {
      if(TDSHelperObject.hasValue(result)){
        this.defaultProduct = this.prepareModel(result);

        this.cacheApi.setItem(this.key, JSON.stringify(this.defaultProduct));
      }
    })
  }

  prepareModel(data:TDSSafeAny){
    return {
      Id: data.Id,
      Name: data.Name,
      NameGet: data.NameGet,
      ImageUrl: data.ImageUrl,
      ListPrice: data.ListPrice || data.Price,
      UOMId: data.UOMId,
      UOMName: data.UOMName || data.UOM?.Name
    };
  }

  removeDefaultProduct(){
    delete this.defaultProduct;
    this.cacheApi.removeItem(this.key);
  }
}
