import { takeUntil } from 'rxjs';
import { TDSMessageService } from 'tds-ui/message';
import { TDSDestroyService } from 'tds-ui/core/services';
import { ProductUOMDTO } from './../../dto/product/product-uom.dto';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ProductUOMService } from '../../services/product-uom.service';
import { TpageAddUOMComponent } from '../tpage-add-uom/tpage-add-uom.component';
import { TDSModalRef, TDSModalService } from 'tds-ui/modal';
import { TDSHelperObject, TDSHelperString, TDSSafeAny, TDSHelperArray } from 'tds-ui/shared/utility';

@Component({
  selector: 'tpage-search-uom',
  templateUrl: './tpage-search-uom.component.html',
  providers: [TDSDestroyService]
})
export class TpageSearchUOMComponent implements OnInit {

  lstProductUOM!: Array<ProductUOMDTO>;
  lstSearch!: Array<ProductUOMDTO> | null;
  searchText: string = '';
  isLoading: boolean = false;

  constructor(private modal: TDSModalService,
    private modalRef: TDSModalRef,
    private message: TDSMessageService,
    private destroy$: TDSDestroyService,
    private viewContainerRef: ViewContainerRef,
    private productUOMService: ProductUOMService) { 

    }

  ngOnInit(): void {
    this.loadProductUOM();
  }

  loadProductUOM() {
    this.isLoading = true;

    this.productUOMService.get().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        if(res && TDSHelperArray.hasListValue(res.value)) {
          this.lstProductUOM = [...res.value];
        }
        
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.message.error(err?.error?.message || 'Đã xảy ra lỗi');
      }
    });
  }

  showCreateUOMModal() {
    this.resetSearch();

    const modal = this.modal.create({
      title: 'Thêm đơn vị tính',
      content: TpageAddUOMComponent,
      size: 'md',
      viewContainerRef: this.viewContainerRef
    });

    modal.afterClose.subscribe(result => {
      if(result) {
        this.lstProductUOM = [...[result],...this.lstProductUOM];
        this.lstSearch = [...this.lstProductUOM];
      }
    });
  }

  onSearch(event: TDSSafeAny) {
    let text = event.toLowerCase();

    if(!TDSHelperString.hasValueString(text)) {
      this.lstSearch = null;
      return;
    }
    
    this.lstSearch = this.lstProductUOM.filter(x => (x.Name).toLowerCase().indexOf(text) !== -1 || (x.ShowUOMType).toLowerCase().indexOf(text) !== -1);
  }

  onCancel(result: TDSSafeAny) {
    this.modalRef.destroy(result);
  }

  createUOM(data: ProductUOMDTO){
    this.onCancel(data);
  }

  resetSearch() {
    this.searchText = '';
    this.lstSearch = null;
  }
}
