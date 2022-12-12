import { TDSHelperObject, TDSSafeAny, TDSHelperString } from 'tds-ui/shared/utility';
import { TDSDestroyService } from 'tds-ui/core/services';
import { takeUntil } from 'rxjs';
import { ProductDTOV2 } from 'src/app/main-app/dto/product/odata-product.dto';
import { ModalListProductComponent } from './../modal-list-product/modal-list-product.component';
import { TDSModalService, TDSModalRef } from 'tds-ui/modal';
import { FacebookPostService } from 'src/app/main-app/services/facebook-post.service';
import { Detail_QuickSaleOnlineOrder } from '@app/dto/saleonlineorder/quick-saleonline-order.dto';
import { Component, OnInit, Input, ViewContainerRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-modal-product-default',
  templateUrl: './modal-product-default.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ TDSDestroyService ]
})

export class ModalProductDefaultComponent implements OnInit {
  @Input() defaultProduct?: Detail_QuickSaleOnlineOrder;

  isVisible!: boolean;
  Price: number = 0;

  numberWithCommas =(value:TDSSafeAny) =>{
    if(value != null)
    {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    return value;
  } ;

  parserComas = (value: TDSSafeAny) =>{
    if(value != null)
    {
      return TDSHelperString.replaceAll(value,'.','');
    }
    return value;
  };

  constructor(
    private facebookPostService: FacebookPostService,
    private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef,
    private destroy$: TDSDestroyService,
    private cdRef: ChangeDetectorRef,
    private modalRef: TDSModalRef
  ) { }

  ngOnInit(): void {
  }

  createDefaultProduct(){
    const modal = this.modalService.create({
      title: 'Chọn sản phẩm',
      content: ModalListProductComponent,
      size: "lg",
      bodyStyle: {
        padding: '0px'
      },
      viewContainerRef: this.viewContainerRef,
      componentParams:{
        defaultOrder: true
      }
    });

    modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe((result: ProductDTOV2) => {
      if(TDSHelperObject.hasValue(result)){
        this.defaultProduct = this.prepareModel(result);

        this.facebookPostService.setDefaultProductPost(this.defaultProduct);

        this.cdRef.detectChanges();
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
    this.facebookPostService.removeCache();
  }

  onCancel(){
    this.modalRef.destroy(null);
  }

  onOpenPopover(){
    this.isVisible = true;
    this.Price = this.defaultProduct?.Price || 0;
  }

  closePriceDetail(){
    this.isVisible = false;
  }

  approvePrice(){
    this.isVisible = false;
    if(this.defaultProduct) {
      this.defaultProduct.Price = this.Price;
      this.facebookPostService.setDefaultProductPost(this.defaultProduct);
    }
  }

  minus(){
    if(this.defaultProduct) {
      this.defaultProduct.Quantity -=1;
      this.facebookPostService.setDefaultProductPost(this.defaultProduct);
    }
  }

  plus(){
    if(this.defaultProduct) {
      this.defaultProduct.Quantity +=1;
      this.facebookPostService.setDefaultProductPost(this.defaultProduct);
    }
  }
}
