import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { ViewReportFastSaleOrderLiveCampaignDTO } from 'src/app/main-app/dto/live-campaign/live-campaign.dto';
import { TDSModalRef, TDSModalService } from 'tds-ui/modal';
import { ModalInfoBillComponent } from '../modal-info-bill/modal-info-bill.component';

@Component({
  selector: 'modal-live-campaign-bill',
  templateUrl: './modal-live-campaign-bill.component.html'
})
export class ModalLiveCampaignBillComponent implements OnInit {

  @Input() data: ViewReportFastSaleOrderLiveCampaignDTO[] = [];

  constructor(
    private modalRef: TDSModalRef,
    private modal: TDSModalService,
    private viewContainerRef: ViewContainerRef
  ) { }

  ngOnInit(): void {
  }

  showModelInfoOrder(id: number) {
    this.modal.create({
      title: 'Thông tin hóa đơn',
      size:'xl',
      content: ModalInfoBillComponent,
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        billId: id
      }
    });
  }

  onCancel() {
    this.modalRef.destroy();
  }

}
