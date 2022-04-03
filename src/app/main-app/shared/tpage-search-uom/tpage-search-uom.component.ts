import { ProductUOMDTO } from './../../dto/product/product-uom.dto';
import { TDSSafeAny, TDSModalService } from 'tmt-tang-ui';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ProductUOMService } from '../../services/product-uom.service';
import { TpageAddUOMComponent } from '../tpage-add-uom/tpage-add-uom.component';

@Component({
  selector: 'tpage-search-uom',
  templateUrl: './tpage-search-uom.component.html',
  styleUrls: ['./tpage-search-uom.component.scss']
})
export class TpageSearchUOMComponent implements OnInit {

  lstProductUOM!: Array<ProductUOMDTO>;

  constructor(
    private modal: TDSModalService,
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
    this.modal.create({
      title: 'Thêm đơn vị tính',
      content: TpageAddUOMComponent,
      size: 'md',
      viewContainerRef: this.viewContainerRef,
      componentParams: {
      }
    });
  }

  onSearch(event: TDSSafeAny) {

  }

}
