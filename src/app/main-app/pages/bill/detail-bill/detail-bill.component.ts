import { TDSModalService, TDSHelperObject, TDSStatusType, TDSMessageService, TDSSafeAny } from 'tmt-tang-ui';
import { Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { ModalPaymentComponent } from '../../partner/components/modal-payment/modal-payment.component';
import { ActivatedRoute } from '@angular/router';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { PrinterService } from 'src/app/main-app/services/printer.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-detail-bill',
  templateUrl: './detail-bill.component.html',
  styleUrls: ['./detail-bill.component.scss']
})
export class DetailBillComponent implements OnInit, OnDestroy{

  id: any;
  dataModel: any = {};
  isLoading: boolean = false;
  payments: any = [];

  productUOMQtyTotal: number = 0;
  productPriceTotal: number = 0;

  indexStep: number = 1;
  popoverVisible: boolean = false;
  isProcessing: boolean = false;

  private _destroy = new Subject<void>();

  statusStringBill: string = 'Nháp';
  isCancelPayment: boolean = false;
  isPaymentDone: boolean = false;
  isStatusStep: TDSStatusType = 'process';
  isButtonComfirm: boolean = false;

  constructor(private route: ActivatedRoute,
      private fastSaleOrderService: FastSaleOrderService,
      private modalService: TDSModalService,
      private printerService: PrinterService,
      private message: TDSMessageService,
      private viewContainerRef: ViewContainerRef) {
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get("id");
    this.loadData();
    this.loadPaymentInfoJson();
  }

  loadData() {
    this.isLoading = true;
    this.fastSaleOrderService.getById(this.id).subscribe((res: any) => {
        if (res.DateCreated) {
          res.DateCreated = new Date(res.DateCreated);
        }
        if (res.DateInvoice) {
          res.DateInvoice = new Date(res.DateInvoice);
        }
        if (res.DateOrderRed) {
          res.DateOrderRed = new Date(res.DateOrderRed);
        }
        if (res.ReceiverDate) {
          res.ReceiverDate = new Date(res.ReceiverDate);
        }
        this.dataModel = res;
        this.isLoading = false;

        for (var item of this.dataModel.OrderLines) {
            this.productUOMQtyTotal = this.productUOMQtyTotal + item.ProductUOMQty;
            this.productPriceTotal = this.productPriceTotal + item.PriceTotal;
        }

        switch(res.State) {
          case 'draft':
              this.indexStep = 1;
              break;
          case 'open':
             this.indexStep = 2;
             break;
          case 'cancel':
             this.indexStep = 2;
            break;
          case 'paid':
               this.indexStep = 3;
              break;
        }
    }, error => {
      this.isLoading = false;
      this.message.error('Load dữ liệu PBH đã xảy ra lỗi!')
    })
  }

  loadPaymentInfoJson() {
    this.fastSaleOrderService.getPaymentInfoJson(this.id).subscribe((res: any) => {
      this.payments = res.value;
    }, error => {
      this.message.error('Load thông tin thanh toán đã lỗi!');
    })
  }

  getShowState(type: string): any {
    switch (type) {
      case 'draf':
        return 'Nháp';
      case 'cancel':
        return 'Hủy bỏ';
      case 'open':
        return 'Xác nhận';
      case 'paid':
        return 'Đã thanh toán';
    }
  }

  print(type: string) {
    let that = this;
    if (this.isProcessing) {
      return
    }

    let obs: TDSSafeAny;
    switch (type) {
      case "bill80":
        obs = this.printerService.printUrl(`/fastsaleorder/print?ids=${this.dataModel.Id}&Template=bill80`);
        break;
      case "bill58":
        obs = this.printerService.printUrl(`/fastsaleorder/print?ids=${this.dataModel.Id}&Template=bill58`);
        break;
      case "A5":
        obs = this.printerService.printUrl(`/fastsaleorder/print?ids=${this.dataModel.Id}&Template=A5`);
        break;
      case "A4":
        obs = this.printerService.printUrl(`/fastsaleorder/print?ids=${this.dataModel.Id}&Template=A4`);
        break;
      case "delivery":
        obs = this.printerService.printUrl(`/fastsaleorder/PrintDelivery?ids=${this.dataModel.Id}`);
        break;
      case "ship":
        obs = this.printerService.printUrl(`/fastsaleorder/PrintShipThuan?ids=${this.dataModel.Id}${this.dataModel.CarrierId}`);
        break;
      default:
        break;
    }
    if (TDSHelperObject.hasValue(obs)) {
      this.isProcessing = true;
      obs.pipe(takeUntil(this._destroy)).subscribe((res: TDSSafeAny) => {
        that.printerService.printHtml(res);
        that.isProcessing = false;
      })
    }
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

  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }
}
