import { SendMessageComponent } from 'src/app/main-app/shared/tpage-send-message/send-message.component';
import { ModalPaymentComponent } from './../../../partner/components/modal-payment/modal-payment.component';
import { ExcelExportService } from './../../../../services/excel-export.service';
import { PrinterService } from './../../../../services/printer.service';
import { FastSaleOrderDTO } from './../../../../dto/fastsaleorder/fastsaleorder.dto';
import { OdataFSOrderLinesV2, FSOrderLinesV2 } from './../../../../dto/fastsaleorder/fastsale-orderline.dto';
import { Subject, finalize, takeUntil, pipe } from 'rxjs';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { Component, Input, OnInit, OnDestroy, ViewContainerRef } from '@angular/core';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalService } from 'tds-ui/modal';
import { TDSHelperObject, TDSSafeAny } from 'tds-ui/shared/utility';
import { GenerateMessageTypeEnum } from 'src/app/main-app/dto/conversation/message.dto';

@Component({
  selector: 'app-bill-expand',
  templateUrl: './bill-expand.component.html'
})
export class BillExpandComponent implements OnInit, OnDestroy {

  @Input() dataItem!:FastSaleOrderDTO;

  type!: string;
  lstOfData:FSOrderLinesV2[] = [];
  isProcessing: boolean = false;
  isLoading: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(
    private fSOService:FastSaleOrderService,
    private printerService: PrinterService,
    private excelExportService: ExcelExportService,
    private message: TDSMessageService,
    private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef) { }

  ngOnInit(): void {
    if(this.dataItem) {
      this.type = this.dataItem.Type;
      this.loadData();
    }
  }

  loadData(){
    this.isLoading = true;
    this.fSOService.getOrderLineData(this.dataItem.Id)
      .pipe(takeUntil(this.destroy$)).pipe(finalize(() => this.isLoading = false))
      .subscribe((res: OdataFSOrderLinesV2) => {
          this.lstOfData = res.value;
      }, error => {
        this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Tải dữ liệu thất bại');
      }
    )
  }

  print(type:string){
    if (this.isProcessing) {
      return
    }

    let that = this;
    let printer:TDSSafeAny;
    this.isProcessing = true;

    switch(type){
      case 'A4':
        printer = this.printerService.printUrl(`/fastsaleorder/print?ids=${this.dataItem.Id}&Template=${type}`)
        break;
      case 'A5':
        printer = this.printerService.printUrl(`/fastsaleorder/print?ids=${this.dataItem.Id}&Template=${type}`)
        break;
      case 'delivery':
        printer = this.printerService.printUrl(`/fastsaleorder/PrintDelivery?ids=${this.dataItem.Id}`)
        break;
      case 'ship':
        printer = this.printerService.printUrl(`/fastsaleorder/PrintShipThuan?ids=${this.dataItem.Id}`)
        break;
      default: break;
    }

    if (TDSHelperObject.hasValue(printer)) {
      printer.pipe(takeUntil(this.destroy$)).pipe(finalize(() => this.isProcessing = false)).subscribe((res: TDSSafeAny) => {
          that.printerService.printHtml(res);
      })
    }
  }

  excelDetail() {
    if (this.isProcessing) {
      return
    }

    this.isProcessing = true;
    let name = this.type == "invoice" ? "ban-hang" : "tra-hang-ban-hang";

    this.excelExportService.exportGet(`/fastsaleorder/ExcelPrint?id=${this.dataItem.Id}`,`${name}`)
      .pipe(takeUntil(this.destroy$))
      .pipe(finalize(() => this.isProcessing = false))
      .subscribe()
  }

  showMessageModal(){
    this.modalService.create({
      title: 'Gửi tin nhắn Facebook',
      size:'lg',
      content: SendMessageComponent,
      viewContainerRef: this.viewContainerRef,
      componentParams: {
          selectedUsers: [this.dataItem.Id],
          messageType: GenerateMessageTypeEnum.Bill
      }
    });
  }

  showPayInvoiceModal(Id:TDSSafeAny){
    this.fSOService.getRegisterPayment({ids: [Id]}).pipe(takeUntil(this.destroy$)).subscribe(
      (res)=>{
        delete res['@odata.context'];
        this.modalService.create({
          title: 'Đăng ký thanh toán',
          size:'lg',
          content: ModalPaymentComponent,
          viewContainerRef: this.viewContainerRef,
          componentParams: {
            dataModel : res
          }
        });
      }, err => {
        this.message.error(err.error.message ?? 'Không tải được dữ liệu');
      }
    )
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
