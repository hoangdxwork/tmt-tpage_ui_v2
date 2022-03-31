import { TDSModalService, TDSHelperObject, TDSStatusType } from 'tmt-tang-ui';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ModalPaymentComponent } from '../../partner/components/modal-payment/modal-payment.component';

@Component({
  selector: 'app-detail-bill',
  templateUrl: './detail-bill.component.html',
  styleUrls: ['./detail-bill.component.scss']
})
export class DetailBillComponent implements OnInit {

  statusStringBill: string = 'Nháp';
  isCancelPayment: boolean = false;
  isPaymentDone: boolean = false;
  isStatusStep: TDSStatusType = 'process';
  isButtonComfirm: boolean = false;
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
    alert('click Button text ');
  }
  comfirmAndPrint() {
    this.isButtonComfirm = true
    this.statusStringBill = 'Đã xác nhận'
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
      this.isPaymentDone = true
      this.isButtonComfirm = false
      this.statusStringBill = 'Đã thanh toán'
      }
    });
  }
  cancelBill() {
    this.modalService.error({
      title: 'Xác nhận hủy',
      content: 'Bạn có muốn hủy hóa đơn, thông tin về đơn hàng này sẽ được xóa',
      onOk: () => {
        this.isButtonComfirm = false,
        this.isCancelPayment = true
        this.isStatusStep = 'error'
        this.statusStringBill = 'Đã hủy'
      },
      onCancel: () => { console.log('cancel') },
      okText: "Hủy hóa đơn",
      cancelText: "Đóng"
    });
  }
  sendBill(){

  }
  editBill(){
    this.statusStringBill = 'Nháp';
    this.isCancelPayment = false;
    this.isPaymentDone = false;
    this.isStatusStep = 'process';
    this.isButtonComfirm = false;
  }
}
