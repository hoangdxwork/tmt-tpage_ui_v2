import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { TDSModalRef, TDSModalService } from 'tds-ui/modal';
import { ModalInfoOrderComponent } from '../modal-info-order/modal-info-order.component';

@Component({
  selector: 'modal-live-campaign-order',
  templateUrl: './modal-live-campaign-order.component.html'
})
export class ModalLiveCampaignOrderComponent implements OnInit {

  @Input() data: any[] = [];

  pageSize = 10;
  pageIndex = 1;

  constructor(
    private modalRef: TDSModalRef,
    private modal: TDSModalService,
    private viewContainerRef: ViewContainerRef
  ) { }

  ngOnInit(): void {
    console.log(this.data);
  }

  onCancel() {
    this.modalRef.destroy();
  }

  showModelInfoOrder(id: string | undefined) {
    this.modal.create({
      title: 'Thông tin đơn hàng',
      size:'xl',
      bodyStyle: {
        padding: '0px'
      },
      content: ModalInfoOrderComponent,
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        orderId: id
      }
    });
  }

}
