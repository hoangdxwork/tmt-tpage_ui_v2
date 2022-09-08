import { ProductService } from 'src/app/main-app/services/product.service';
import { TAuthService } from 'src/app/lib';
import { TDSModalRef } from 'tds-ui/modal';
import { Message } from './../../../../../lib/consts/message.const';
import { ODataProductDTOV2, ProductDTOV2 } from './../../../../dto/product/odata-product.dto';
import { takeUntil, finalize, mergeMap, Observable } from 'rxjs';
import { TDSDestroyService } from 'tds-ui/core/services';
import { ProductTemplateUOMLineService } from './../../../../services/product-template-uom-line.service';
import { TDSMessageService } from 'tds-ui/message';
import { Component, OnInit } from '@angular/core';
import { GetInventoryDTO } from '@app/dto/product/product.dto';
import { CompanyCurrentDTO } from '@app/dto/configs/company-current.dto';
import { SharedService } from '@app/services/shared.service';

@Component({
  selector: 'app-create-default-product',
  templateUrl: './create-default-product.component.html',
  providers: [TDSDestroyService]
})
export class CreateDefaultProductComponent implements OnInit {

  lstProduct: ProductDTOV2[] = [];
  lstInventory!: GetInventoryDTO;
  defaultProduct?: ProductDTOV2;
  companyCurrents!: CompanyCurrentDTO;
  isLoading = false;
  pageSize = 20;
  pageIndex = 1;
  count: number = 1;

  constructor(private productTemplateUOMLineService: ProductTemplateUOMLineService,
    private auth: TAuthService,
    private sharedService: SharedService,
    private productService: ProductService,
    private modal: TDSModalRef,
    private destroy$: TDSDestroyService,
    private message: TDSMessageService) { }

  ngOnInit(): void {
    this.loadProduct();
    // this.loadCurrentCompany();
  }

  loadProduct(textSearch?: string) {
    this.isLoading = true;
    let top = 20;
    let skip = 0;

    this.productTemplateUOMLineService.getProductUOMLine(skip, top, textSearch).pipe(takeUntil(this.destroy$)).pipe(finalize(()=> this.isLoading = false ))
      .subscribe({
        next:(res: ODataProductDTOV2) => {
          this.lstProduct = [...res.value];
          console.log(this.lstProduct);

        },
        error:(err) => {
          this.message.error(err?.error?.message || Message.Product.CanNotLoadData);
        }
      });
  }

  // loadCurrentCompany() {
  //   this.sharedService.setCurrentCompany();
  //   this.sharedService.getCurrentCompany().pipe(takeUntil(this.destroy$)).subscribe({
  //     next: (res: CompanyCurrentDTO) => {
  //       this.companyCurrents = res;

  //       if(this.companyCurrents.DefaultWarehouseId) {
  //           this.loadInventoryWarehouseId(this.companyCurrents.DefaultWarehouseId);
  //       }
  //     },
  //     error: (error: any) => {
  //       this.message.error(error?.error?.message || 'Load thông tin công ty mặc định đã xảy ra lỗi!');
  //     }
  //   });
  // }

  // loadInventoryWarehouseId(warehouseId: number) {
  //   this.productService.setInventoryWarehouseId(warehouseId);
  //   this.productService.getInventoryWarehouseId().pipe(takeUntil(this.destroy$)).subscribe({
  //     next: (res: any) => {
  //         this.lstInventory = res;
  //     }
  //   });
  // }



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

  onClearAll(event: MouseEvent) {
    // event.stopPropagation();
    // this.refreshData();
  }

  onSave(){
    if(!this.defaultProduct){
      this.message.error('Vui lòng chọn sản phẩm');
      return
    }

    this.modal.destroy(this.defaultProduct);
  }

  // refreshData() {
  //   this.pageIndex = 1;
  //   this.filterObj.searchText = '';
  //   this.filterText.nativeElement.value = '';
  //   this.loadData(this.pageSize, this.pageIndex);
  // }
}
