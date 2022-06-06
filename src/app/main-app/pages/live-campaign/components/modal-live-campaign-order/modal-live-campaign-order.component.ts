import { TDSModalService } from 'tmt-tang-ui';
import { TDSModalRef } from 'tmt-tang-ui';
import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { ViewReportSaleOnlineOrderLiveCampaignDTO } from 'src/app/main-app/dto/live-campaign/live-campaign.dto';
import { ModalInfoOrderComponent } from '../modal-info-order/modal-info-order.component';

@Component({
  selector: 'modal-live-campaign-order',
  templateUrl: './modal-live-campaign-order.component.html'
})
export class ModalLiveCampaignOrderComponent implements OnInit {

  @Input() data: ViewReportSaleOnlineOrderLiveCampaignDTO[] = [];

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
      content: ModalInfoOrderComponent,
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        orderId: id
      }
    });
  }

}
