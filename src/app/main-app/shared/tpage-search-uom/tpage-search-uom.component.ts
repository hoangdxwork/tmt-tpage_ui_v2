import { ProductUOMDTO } from './../../dto/product/product-uom.dto';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ProductUOMService } from '../../services/product-uom.service';
import { TpageAddUOMComponent } from '../tpage-add-uom/tpage-add-uom.component';
import { TDSModalRef, TDSModalService } from 'tds-ui/modal';
import { TDSHelperObject, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';

@Component({
  selector: 'tpage-search-uom',
  templateUrl: './tpage-search-uom.component.html',
  styleUrls: ['./tpage-search-uom.component.scss']
})
export class TpageSearchUOMComponent implements OnInit {

  lstProductUOM!: Array<ProductUOMDTO>;
  lstSearch!: Array<ProductUOMDTO> | null;

  constructor(
    private modal: TDSModalService,
    private modalRef: TDSModalRef,
    private viewContainerRef: ViewContainerRef,
    private productUOMService: ProductUOMService
  ) { }

  ngOnInit(): void {
    this.loadProductUOM();
  }

  loadProductUOM() {
    this.productUOMService.get().subscribe(res => {
      this.lstProductUOM = res.value;
    });
  }

  onAddUOM() {
    const modal = this.modal.create({
      title: 'Thêm đơn vị tính',
      content: TpageAddUOMComponent,
      size: 'md',
      viewContainerRef: this.viewContainerRef,
      componentParams: {
      }
    });

    modal.afterClose.subscribe(result => {
      if(TDSHelperObject.hasValue(result)) {
        this.loadProductUOM();
      }
    });
  }

  onSearch(event: TDSSafeAny) {
    let text = event.target?.value.toLowerCase();

    if(!TDSHelperString.hasValueString(text)) {
      this.lstSearch = null;
      return;
    }

    this.lstSearch = this.lstProductUOM.filter(x => (x.Name).toLowerCase().indexOf(text) !== -1 || (x.ShowUOMType).toLowerCase().indexOf(text) !== -1);
  }

  onCancel(result: TDSSafeAny) {
    this.modalRef.destroy(result);
  }

}
