import { Detail_QuickSaleOnlineOrder } from '@app/dto/saleonlineorder/quick-saleonline-order.dto';
import { TDSSafeAny } from 'tds-ui/shared/utility';
import { mergeMap, takeUntil, Observable, observable, of, map } from 'rxjs';
import { Message } from './../../../../lib/consts/message.const';
import { ProductService } from './../../../services/product.service';
import { SharedService } from './../../../services/shared.service';
import { ProductTemplateUOMLineService } from './../../../services/product-template-uom-line.service';
import { TDSHelperObject } from 'tds-ui/shared/utility';
import { TDSModalService } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { ProductDTOV2 } from './../../../dto/product/odata-product.dto';
import { TDSDestroyService } from 'tds-ui/core/services';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ModalListProductComponent } from '@app/pages/conversations/components/modal-list-product/modal-list-product.component';
import { SaleSettingConfigDto_V2 } from '@app/dto/setting/sale-setting-config.dto';

@Component({
  selector: 'app-default-order',
  templateUrl: './default-order.component.html',
  providers: [TDSDestroyService],
  host: {
    class: 'w-full h-full flex'
  }
})

export class DefaultOrderComponent implements OnInit {

  defaultProduct?: Detail_QuickSaleOnlineOrder;
  saleSetting!: SaleSettingConfigDto_V2;
  isChange: boolean = false;
  isLoading: boolean = false;

  constructor(private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef,
    private destroy$: TDSDestroyService,
    private sharedService: SharedService,
    private productService: ProductService,
    private productTemplateUOMLineService: ProductTemplateUOMLineService,
    private message: TDSMessageService) { }

  ngOnInit(): void {
    this.loadSaleConfig();
  }

  loadSaleConfig() {
    this.isLoading = true;

    this.sharedService.setSaleConfig();
    this.sharedService.getSaleConfig().pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {
            if(res) {
              this.saleSetting = {...res};
              let product = this.productTemplateUOMLineService.getDefaultProduct();

              let exist = this.saleSetting &&  this.saleSetting.SaleSetting &&
                  product && product.Id != (this.saleSetting.SaleSetting.ProductId || this.saleSetting.SaleSetting.Product?.Id);

              if(!exist) {
                  this.productTemplateUOMLineService.removeCache();
              }

              // TODO: sp da ton tai
              if(product) {
                  this.defaultProduct = this.prepareModel(product);
                  this.isLoading = false;
                  return;
              }
              if(this.saleSetting.SaleSetting.ProductId && this.saleSetting.SaleSetting.Product) {
                let productId = (this.saleSetting.SaleSetting.ProductId || this.saleSetting.SaleSetting.Product?.Id);
                this.productService.getById(productId).pipe(takeUntil(this.destroy$)).subscribe({
                    next: (product: any) => {
                      if(product && product.Id) {

                          delete product['@odata.context'];
                          this.defaultProduct = this.prepareModel(product);

                          if(this.defaultProduct) {
                              this.productTemplateUOMLineService.setDefaultProduct(this.defaultProduct);
                          }
                      }

                      this.isLoading = false;
                    },
                    error: (error) => {
                      this.isLoading = false;
                      this.message.error(error?.error?.message || 'Đã xảy ra lỗi');
                    }
                })
              }else{
                this.isLoading = false;
              }
            }
        }
    })
  }

  createDefaultProduct(){
    const modal = this.modalService.create({
      title: 'Chọn sản phẩm',
      content: ModalListProductComponent,
      size: "lg",
      bodyStyle: {
        padding: '0px'
      },
      centered: true,
      viewContainerRef: this.viewContainerRef,
      componentParams:{
        defaultOrder: true
      }
    });

    modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe((result: ProductDTOV2) => {
      if(TDSHelperObject.hasValue(result)){
        this.defaultProduct = this.prepareModel(result);
        this.isChange = true;
      }
    })
  }

  onSave() {
    let model = this.saleSetting.SaleSetting as any;
    if(!this.defaultProduct) {
      this.message.error('Chưa chọn sản phẩm');
    }

    model.Product = {
      Id: this.defaultProduct?.ProductId,
      NameGet: this.defaultProduct?.ProductNameGet
    }
    model.ProductId = this.defaultProduct?.ProductId;

    this.isLoading = true;
    this.sharedService.postSaleSetting(model).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          if(res) {
            delete res["@odata.context"];
            this.saleSetting.SaleSetting = {...res};

            if(this.defaultProduct) {
                this.productTemplateUOMLineService.setDefaultProduct(this.defaultProduct);
            }

            this.sharedService.excuteSaleSetting(this.saleSetting.SaleSetting.Id).subscribe();
            this.message.success('Lưu thành công');
            this.isChange = false;
          }
          this.isLoading = false;
      },
      error: (error: any) => {
        this.isLoading = false;
        this.message.error(error?.error?.message || 'Đã xảy ra lỗi');
      }
    })
  }

  prepareModel(data: TDSSafeAny){
    return {
      Id: null,
      Quantity: 1,
      Price: data?.ListPrice || data?.Price,
      ProductId: data?.Id,
      ProductName: data?.Name || data?.ProductName,
      ProductNameGet: data?.NameGet || data?.ProductNameGet,
      ProductCode: data?.DefaultCode,
      UOMId: data?.UOMId,
      UOMName: data?.UOMName || data?.UOM?.Name,
      Factor: data?.Factor,
      ImageUrl: data?.ImageUrl
    } as Detail_QuickSaleOnlineOrder;
  }

  removeDefaultProduct(){
    let model = this.saleSetting.SaleSetting;
    delete model.Product;
    delete model.ProductId;
    this.isLoading = false;

    this.sharedService.postSaleSetting(model).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          if(res) {
            this.saleSetting.SaleSetting = res;

            delete this.defaultProduct;
            this.productTemplateUOMLineService.removeCache();
            this.sharedService.excuteSaleSetting(this.saleSetting.SaleSetting.Id).subscribe();
          }
          this.isLoading = false;
      },
      error: (error: any) => {
        this.isLoading = false;
        this.message.error(error?.error?.message || 'Đã xảy ra lỗi');
      }
    })
  }
}
