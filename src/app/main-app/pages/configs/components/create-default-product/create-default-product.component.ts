import { TDSModalRef } from 'tds-ui/modal';
import { Message } from './../../../../../lib/consts/message.const';
import { ODataProductDTOV2, ProductDTOV2 } from './../../../../dto/product/odata-product.dto';
import { takeUntil, finalize } from 'rxjs';
import { TDSDestroyService } from 'tds-ui/core/services';
import { ProductTemplateUOMLineService } from './../../../../services/product-template-uom-line.service';
import { TDSMessageService } from 'tds-ui/message';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-default-product',
  templateUrl: './create-default-product.component.html',
  providers: [TDSDestroyService]
})
export class CreateDefaultProductComponent implements OnInit {

  lstProduct: ProductDTOV2[] = [];
  defaultProduct!: ProductDTOV2;
  isLoading = false;

  constructor(private productTemplateUOMLineService: ProductTemplateUOMLineService,
    private modal: TDSModalRef,
    private destroy$: TDSDestroyService,
    private message: TDSMessageService
  ) { }

  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct(textSearch?: string) {
    this.isLoading = true;
    let top = 20;
    let skip = 0;

    this.productTemplateUOMLineService.getProductUOMLine(skip, top, textSearch).pipe(takeUntil(this.destroy$)).pipe(finalize(()=> this.isLoading = false ))
      .subscribe((res: ODataProductDTOV2) => {
           this.lstProduct = [...res.value];
      },err =>{
          this.message.error(err?.error?.message || Message.Product.CanNotLoadData);
    });
  }

  onChangeProduct(data: ProductDTOV2){
    this.defaultProduct = data;
  }

  onSearch(event:any){
    let text = event.keyupEvent.target.value;

    this.loadProduct(text);
  }

  onCancel(){
    this.modal.destroy(null);
  }

  onSave(){
    if(!this.defaultProduct){
      this.message.error('Vui lòng chọn sản phẩm');
      return
    }

    this.modal.destroy(this.defaultProduct);
  }
}
