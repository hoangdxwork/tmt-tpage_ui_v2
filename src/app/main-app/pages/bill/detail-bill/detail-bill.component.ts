import { ModalPaymentComponent } from './../../partner/components/modal-payment/modal-payment.component';
import { TDSModalService, TDSHelperObject, TDSStatusType, TDSMessageService, TDSSafeAny } from 'tmt-tang-ui';
import { Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { PrinterService } from 'src/app/main-app/services/printer.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CommonService } from 'src/app/main-app/services/common.service';
import { BillDetailDTO } from 'src/app/main-app/dto/bill/bill-detail.dto';
import { PaymentJsonDTO } from 'src/app/main-app/dto/bill/payment-json.dto';

@Component({
  selector: 'app-detail-bill',
  templateUrl: './detail-bill.component.html'
})
export class DetailBillComponent implements OnInit, OnDestroy{

  id: any;
  dataModel!: BillDetailDTO;
  isLoading: boolean = false;
  payments: Array<PaymentJsonDTO> = [];

  productUOMQtyTotal: number = 0;
  productPriceTotal: number = 0;

  indexStep: number = 1;
  popoverVisible: boolean = false;
  isProcessing: boolean = false;

  private destroy$ = new Subject<void>();

  statusStringBill: string = 'Nháp';
  isCancelPayment: boolean = false;
  isPaymentDone: boolean = false;
  isStatusStep: TDSStatusType = 'process';
  isButtonComfirm: boolean = false;

  constructor(private route: ActivatedRoute,
      private router: Router,
      private commonService: CommonService,
      private fastSaleOrderService: FastSaleOrderService,
      private modalService: TDSModalService,
      private printerService: PrinterService,
      private message: TDSMessageService,
      private viewContainerRef: ViewContainerRef) {
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get("id");
    this.loadData();
  }

  loadData(): void {
    this.loadBill();
    this.loadPaymentInfoJson();
  }

  loadBill() {
    this.isLoading = true;
    this.fastSaleOrderService.getById(this.id).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
        delete res['@odata.context'];

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
        // console.log(this.dataModel)

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
    this.fastSaleOrderService.getPaymentInfoJson(this.id).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
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
        obs = this.printerService.printUrl(`/fastsaleorder/PrintShipThuan?ids=${this.dataModel.Id}${this.dataModel.Carrier.Id}`);
        break;
      default:
        break;
    }
    if (TDSHelperObject.hasValue(obs)) {
      this.isProcessing = true;
      obs.pipe(takeUntil(this.destroy$)).subscribe((res: TDSSafeAny) => {
          that.printerService.printHtml(res);
          that.isProcessing = false;
      })
    }
  }

  sendToShipper() {
    if (this.isProcessing) {
      return
    }

    let that = this;
    that.isProcessing = true;

    this.modalService.success({
      title: 'Gửi vận đơn',
      content: 'Bạn có muốn gửi vận đơn',
      onOk: () => {
          let model = { id: parseInt(that.id) }

          that.fastSaleOrderService.getSendToShipper(model).pipe(takeUntil(this.destroy$)).subscribe((res: TDSSafeAny) => {
              that.message.success('Xác nhận gửi vận đơn thành công!');
              that.isProcessing = false;
              that.loadData();
          }, error => {
            let err = error.error.message.split('Error:')?.[1];
              that.message.error(err ?? 'Gửi vận đơn thất bại');
              that.isProcessing = false;
          })
      },
      onCancel: () => { that.isProcessing = false; },
      okText: "Xác nhận",
      cancelText: "Đóng",
    });
  }

  actionCancel() {
    console.log(this.isProcessing)
    if (this.isProcessing) {
      return
    }

    let that = this;
    that.isProcessing = true;

    this.modalService.success({
      title: 'Hủy hóa đơn',
      content: 'Bạn có muốn xác nhận hủy hóa đơn',
      onOk: () => {
          let model = {
              ids: [parseInt(that.id)]
          }

          that.fastSaleOrderService.getActionCancel(model).pipe(takeUntil(this.destroy$)).subscribe(() => {
              that.message.success('Xác nhận hủy hóa đơn thành công!');
              that.isProcessing = false;
              this.loadData();
          }, error => {
              that.message.error(error.error.message ?? 'Xác nhận hủy hóa đơn thất bại');
              that.isProcessing = false;
          })
      },
      onCancel: () => { that.isProcessing = false; },
      okText: "Xác nhận",
      cancelText: "Đóng",
    });
  }

  onClickButton(e: MouseEvent) {
  }

  showModalRegisterPayment() {
    let model = { ids: [parseInt(this.id)] };
    this.fastSaleOrderService.getRegisterPayment(model).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
        delete res["@odata.context"];
        this.modalService.create({
            title: 'Đăng ký thanh toán',
            content: ModalPaymentComponent,
            size: "lg",
            viewContainerRef: this.viewContainerRef,
            componentParams:{ dataModel : res }
        });
    }, error => {
        this.message.error(error.error.message ?? 'Không tải được dữ liệu');
    })
  }

  cancelBill() {
    this.modalService.error({
      title: 'Xác nhận hủy',
      content: 'Bạn có muốn hủy hóa đơn, thông tin về đơn hàng này sẽ được xóa',
      onOk: () => {
        this.isStatusStep = 'error'
      },
      onCancel: () => { console.log('cancel') },
      okText: "Hủy hóa đơn",
      cancelText: "Đóng"
    });
  }

  actionRefund() {
    if (this.isProcessing) {
      return
    }

    let that = this;
    that.isProcessing = true;

    this.modalService.success({
      title: 'Tạo trả hàng',
      content: 'Bạn có muốn xác nhận tạo trả hàng',
      onOk: () => {
          let model = { id: parseInt(that.id) };

          that.fastSaleOrderService.getActionRefund(model).pipe(takeUntil(this.destroy$)).subscribe((res: TDSSafeAny) => {
              that.message.success('Tạo trả hàng thành công!');
              that.isProcessing = false;
              this.loadData();
          }, error => {
              that.message.error(error.error.message ?? 'Tạo trả hàng thất bại');
              that.isProcessing = false;
          })
      },
      onCancel: () => { that.isProcessing = false; },
      okText: "Xác nhận",
      cancelText: "Đóng",
    });
  }

  onSavePrint(type: string) {
    if (this.isProcessing) {
      return
    }

    let that = this;
    that.isProcessing = true;

    that.modalService.success({
      title: 'Xác nhận bán hàng',
      content: 'Bạn có muốn xác nhận bán hàng',
      onOk: () => {
        let model = { ids: [parseInt(that.id)] };
        this.isLoading = true;
        that.fastSaleOrderService.actionInvoiceOpen(model).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
          if(res && res.Success) {

              that.message.success('Xác nhận bán hàng thành công!');

              let obs: TDSSafeAny;
              switch (type) {
                case "print":
                  obs = that.printerService.printUrl(`/fastsaleorder/print?ids=${that.id}`);
                  break;

                case "printship":
                  if(this.dataModel.Carrier) {
                    obs = that.printerService.printUrl(`/fastsaleorder/PrintShipThuan?ids=` + `${that.id}` + "&carrierid=" + `${that.dataModel.Carrier.Id}`);
                  } else {
                    obs = that.printerService.printUrl(`/fastsaleorder/PrintShipThuan?ids=${that.id}`);
                  }
                  break;
                default: break;
              }

              if (TDSHelperObject.hasValue(obs)) {
                obs.pipe(takeUntil(that.destroy$)).subscribe((res: TDSSafeAny) => {
                  that.printerService.printHtml(res);
                  that.isProcessing = false;
                  this.isLoading = false;
                })
              }else{
                this.isProcessing = false;
                this.isLoading = false;
              }
              this.loadData();
              this.loadInventoryIds();
          }
        }, error => {
            this.isProcessing = false;
            this.isLoading = false;
            that.message.error(`${error.error.message || 'Xác nhận bán hàng thất bại'}`);
        })
      },
      onCancel: () => { that.isProcessing = false; },
      okText: "Xác nhận",
      cancelText: "Đóng",
    });
  }

  loadInventoryIds(){
    let ids: any = [];
    let data = this.dataModel.OrderLines;
    if(data) {
      data.forEach((x: any) => {
        if (!ids.includes(x.ProductId)) {
            ids.push(x.ProductId);
        }
      });
    }

    let warehouseId = this.dataModel.WarehouseId;
    this.commonService.getInventoryByIds(warehouseId, ids).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.message.success('Cập nhật tồn kho thành công!');
    }, error => {
      this.message.error(`${error.error.message || 'Cập nhật tồn kho thất bại'}`);
    })
  }

  onCreate(){
    this.router.navigateByUrl('bill/create');
  }

  onEdit(){
    this.router.navigateByUrl(`bill/edit/${this.id}`);
  }

  onBack(){
    history.back();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
