import { Router } from '@angular/router';
import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { TDSModalRef, TDSModalService } from 'tds-ui/modal';
import { ModalInfoBillComponent } from '../modal-info-bill/modal-info-bill.component';

@Component({
  selector: 'modal-live-campaign-bill',
  templateUrl: './modal-live-campaign-bill.component.html'
})
export class ModalLiveCampaignBillComponent implements OnInit {

  @Input() data: any[] = [];

  constructor(
    private modalRef: TDSModalRef,
    private modal: TDSModalService,
    private viewContainerRef: ViewContainerRef,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  showModelInfoOrder(id: number) {
    let returnUrl = `bill/detail/${id}`
    this.router.navigate([returnUrl]);

    // this.modal.create({
    //   title: 'Thông tin hóa đơn',
    //   size:'xl',
    //   content: ModalInfoBillComponent,
    //   viewContainerRef: this.viewContainerRef,
    //   componentParams: {
    //     billId: id
    //   }
    // });
  }

  onCancel() {
    this.modalRef.destroy();
  }

}
