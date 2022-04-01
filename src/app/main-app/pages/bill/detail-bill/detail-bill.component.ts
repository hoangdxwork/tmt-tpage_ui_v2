import { TDSModalService, TDSHelperObject, TDSStatusType } from 'tmt-tang-ui';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ModalPaymentComponent } from '../../partner/components/modal-payment/modal-payment.component';
export declare type stagePaymentType = 'draft' | 'confirmed' | 'paymentDone' | 'cancelPayment';

@Component({
  selector: 'app-detail-bill',
  templateUrl: './detail-bill.component.html',
  styleUrls: ['./detail-bill.component.scss']
})
export class DetailBillComponent implements OnInit {

  isStatusStep: TDSStatusType = 'process';
  stagePayment : stagePaymentType = 'draft';
  listOfDataProduct = [
    { id: 1, nameProduct: '[SP09621] Bánh mì cao su', unit: 'Cái', quantity: 1, unitPrice: 2500000, discount: 250000, totalPrice: 2500000 },
    { id: 2, nameProduct: '[SP09621] Bánh mì cao su', unit: 'Cái', quantity: 1, unitPrice: 2500000, discount: 250000, totalPrice: 2500000 },
    { id: 3, nameProduct: '[SP09621] Bánh mì cao su', unit: 'Cái', quantity: 1, unitPrice: 2500000, discount: 250000, totalPrice: 2500000 },
  ]
  constructor(
    private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef
  ) { }

  ngOnInit(): void {
  }

  onClickButton(e: MouseEvent) {

  }

  comfirmAndPrint() {
    this.stagePayment = 'confirmed';
  }
  showModalRegisterPayment() {
    const modal = this.modalService.create({
      title: 'Đăng ký thanh toán',
      content: ModalPaymentComponent,
      size: "lg",
      viewContainerRef: this.viewContainerRef,
    });
    modal.afterOpen.subscribe(() => console.log('[afterOpen] emitted!'));
    modal.afterClose.subscribe(result => {
      console.log('[afterClose] The result is:', result);
      if (TDSHelperObject.hasValue(result)) {
      }
      // test layout
      this.stagePayment = 'paymentDone';
    });
  }
  cancelBill() {
    this.modalService.error({
      title: 'Xác nhận hủy',
      content: 'Bạn có muốn hủy hóa đơn, thông tin về đơn hàng này sẽ được xóa',
      onOk: () => {
        this.isStatusStep = 'error'
        this.stagePayment = 'cancelPayment';
      },
      onCancel: () => { console.log('cancel') },
      okText: "Hủy hóa đơn",
      cancelText: "Đóng"
    });
  }
  sendBill(){

  }
  editBill(){
    this.stagePayment = 'draft';
    this.isStatusStep = 'process';
  }
}
