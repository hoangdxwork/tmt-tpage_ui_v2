import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { SaleOnline_OrderService } from 'src/app/main-app/services/sale-online-order.service';
import { TDSSafeAny, TDSModalService } from 'tmt-tang-ui';
import { InfoPartnerComponent } from '../info-partner/info-partner.component';

@Component({
  selector: 'info-order-debt',
  templateUrl: './info-order-debt.component.html'
})
export class InfoOrderDebtComponent implements OnInit {

  @Input() dataOrder: any = {};

  data: TDSSafeAny;

  lstDetail: TDSSafeAny[] = [];

  constructor(
    private modal: TDSModalService,
    private viewContainerRef: ViewContainerRef,
    private saleOnline_OrderService: SaleOnline_OrderService
  ) { }

  ngOnInit(): void {
    this.loadDetail();
  }

  onInfo() {
    this.modal.create({
      title: 'Thông tin khách hàng',
      content: InfoPartnerComponent,
      size: 'xl',
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        dataOrder: this.dataOrder,
        partnerId: this.dataOrder.PartnerId
      }
    });
  }

  loadDetail() {
    this.saleOnline_OrderService.getLines(this.dataOrder.Id).subscribe((res: TDSSafeAny) => {
      this.lstDetail = res.value;
    });
  }

}
