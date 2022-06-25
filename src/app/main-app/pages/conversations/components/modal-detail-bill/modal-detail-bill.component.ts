import { Subject } from 'rxjs';
import { FastSaleOrder_DefaultDTOV2 } from './../../../../dto/fastsaleorder/fastsaleorder-default.dto';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { ModalConfirmPaymentComponent } from './../modal-confirm-payment/modal-confirm-payment.component';
import { ModalConfirmShippingAddressComponent } from './../modal-confirm-shipping-address/modal-confirm-shipping-address.component';
import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { TDSModalRef, TDSModalService } from 'tds-ui/modal';
import { TDSHelperObject } from 'tds-ui/shared/utility';

@Component({
  selector: 'app-modal-detail-bill',
  templateUrl: './modal-detail-bill.component.html'
})
export class ModalDetailBillComponent implements OnInit {

  @Input() itemId : any;
  data!: FastSaleOrder_DefaultDTOV2;

  private destroy$ = new Subject<void>();
  constructor(
    private modal: TDSModalRef,
    private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef,
    private fastSaleOrderService: FastSaleOrderService
  ) { }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.fastSaleOrderService.getById(this.itemId).subscribe((res: FastSaleOrder_DefaultDTOV2) => {
      this.data = res;
    })
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
    
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
