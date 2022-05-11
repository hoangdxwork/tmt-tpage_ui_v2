import { ModalConfirmPaymentComponent } from './../modal-confirm-payment/modal-confirm-payment.component';
import { ModalConfirmShippingAddressComponent } from './../modal-confirm-shipping-address/modal-confirm-shipping-address.component';
import { TDSModalRef, TDSModalService, TDSHelperObject } from 'tmt-tang-ui';
import { Component, OnInit, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-modal-detail-bill',
  templateUrl: './modal-detail-bill.component.html',
  styleUrls: ['./modal-detail-bill.component.scss']
})
export class ModalDetailBillComponent implements OnInit {

  constructor(
    private modal: TDSModalRef,
    private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef
  ) { }

  ngOnInit(): void {
  }

  cancel(){
    this.modal.destroy(null)
  }

  onSave(){

  }

  showModalConfirmShippingAddress(){
    const modal = this.modalService.create({
      title: 'Xác nhận địa chỉ giao hàng',
      content: ModalConfirmShippingAddressComponent,
      viewContainerRef: this.viewContainerRef,
      size: 'lg',
      componentParams: {

      }
    });
    modal.afterOpen.subscribe(() => {

    });
    // Return a result when closed
    modal.afterClose.subscribe(result => {
      if (TDSHelperObject.hasValue(result)) {
      }
    });
  }

  showModalConfirmPayment(){
    const modal = this.modalService.create({
      title: 'Xác nhận phương thức thanh toán',
      content: ModalConfirmPaymentComponent,
      viewContainerRef: this.viewContainerRef,
      size: 'lg',
      componentParams: {

      }
    });
    modal.afterOpen.subscribe(() => {

    });
    // Return a result when closed
    modal.afterClose.subscribe(result => {
      if (TDSHelperObject.hasValue(result)) {
      }
    });
  }
}
