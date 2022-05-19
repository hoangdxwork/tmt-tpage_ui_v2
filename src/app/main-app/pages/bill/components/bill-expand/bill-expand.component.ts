import { ModalSendMessageComponent } from './../../../partner/components/modal-send-message/modal-send-message.component';
import { ModelPayInvoiceComponent } from './../model-pay-invoice/model-pay-invoice.component';
import { ExcelExportService } from './../../../../services/excel-export.service';
import { PrinterService } from './../../../../services/printer.service';
import { FastSaleOrderDTO } from './../../../../dto/fastsaleorder/fastsaleorder.dto';
import { OdataFSOrderLinesV2, FSOrderLinesV2 } from './../../../../dto/fastsaleorder/fastsale-orderline.dto';
import { Subject, pipe } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { TDSSafeAny, TDSMessageService, TDSHelperObject, TDSModalService } from 'tmt-tang-ui';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { Component, Input, OnInit, OnDestroy, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-bill-expand',
  templateUrl: './bill-expand.component.html'
})
export class BillExpandComponent implements OnInit, OnDestroy {
  @Input() billData!:FastSaleOrderDTO;
  lstOfData:FSOrderLinesV2[] = [];
  private destroy$ = new Subject();
  isProcessing: boolean = false;

  constructor(
    private fSOService:FastSaleOrderService,
    private printerService: PrinterService,
    private excelExportService: ExcelExportService,
    private message: TDSMessageService,
    private modalService: TDSModalService, 
    private viewContainerRef: ViewContainerRef) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(){
    this.fSOService.getOrderLineData(this.billData.Id).pipe(takeUntil(this.destroy$)).subscribe(
      (res:OdataFSOrderLinesV2)=>{
        this.lstOfData = res.value;
      },
      err=>{
        this.message.error('Tải dữ liệu thất bại');
      }
    )
  }

  print(type:string){
    if (this.isProcessing) {
      return
    }

    let that = this;
    let printer:TDSSafeAny;

    switch(type){
      case 'bill80':
      case 'bill58':
      case 'A4':
      case 'A5':
        printer = this.printerService.printUrl(`/fastsaleorder/print?ids=${this.billData.Id}&Template=${type}`);
        break;
      case 'delivery':
        printer = this.printerService.printUrl(`/fastsaleorder/PrintDelivery?ids=${this.billData.Id}`);
        break;
      case 'ship':
        printer = this.printerService.printUrl(`/fastsaleorder/PrintShipThuan?ids=${this.billData.Id}`);
        break;
      case 'excel':
        this.excelExportService.exportGet(
          `/Fastsaleorder/ExcelPrint?id=${this.billData.Id}`,
          `Phieu_ban_hang_${this.billData.Id}`
        );
    }

    if (TDSHelperObject.hasValue(printer)) {
      this.isProcessing = true;
      printer.pipe(takeUntil(this.destroy$)).subscribe((res: TDSSafeAny) => {
        that.printerService.printHtml(res);
        that.isProcessing = false;
      })
    }
  }

  showMessageModal(){
    const modal = this.modalService.create({
      title: 'Gửi tin nhắn Facebook',
      size:'lg',
      content: ModalSendMessageComponent,
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        partnerIds: [this.billData.PartnerId]
      }
    });
  }

  showPayInvoiceModal(Id:TDSSafeAny){
    this.fSOService.getRegisterPayment({ids: [Id]}).pipe(takeUntil(this.destroy$)).subscribe(
      (res)=>{
        delete res['@odata.context'];
        const modal = this.modalService.create({
          title: 'Đăng ký thanh toán',
          size:'lg',
          content: ModelPayInvoiceComponent,
          viewContainerRef: this.viewContainerRef,
          componentParams: {
            dataModel: res
          }
        });
      },
      err=>{
        this.message.error(err.error.message??'Không tải được dữ liệu');
      }
    )
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
