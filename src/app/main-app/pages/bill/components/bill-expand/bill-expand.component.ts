import { TDSTabChangeEvent } from 'tds-ui/tabs';
import { TDSDestroyService } from 'tds-ui/core/services';
import { SendMessageComponent } from 'src/app/main-app/shared/tpage-send-message/send-message.component';
import { ModalPaymentComponent } from './../../../partner/components/modal-payment/modal-payment.component';
import { ExcelExportService } from './../../../../services/excel-export.service';
import { PrinterService } from './../../../../services/printer.service';
import { FastSaleOrderDTO } from './../../../../dto/fastsaleorder/fastsaleorder.dto';
import { OdataFSOrderLinesV2, FSOrderLinesV2 } from './../../../../dto/fastsaleorder/fastsale-orderline.dto';
import { finalize, takeUntil } from 'rxjs';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { Component, Input, OnInit, OnDestroy, ViewContainerRef, Inject, ChangeDetectorRef } from '@angular/core';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalService } from 'tds-ui/modal';
import { TDSHelperObject, TDSSafeAny } from 'tds-ui/shared/utility';
import { GenerateMessageTypeEnum } from 'src/app/main-app/dto/conversation/message.dto';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-bill-expand',
  templateUrl: './bill-expand.component.html',
  providers: [TDSDestroyService]
})
export class BillExpandComponent implements OnInit, OnDestroy {

  @Input() dataItem!: FastSaleOrderDTO;

  type!: string;
  lstOfData: FSOrderLinesV2[] = [];
  isProcessing: boolean = false;
  isLoading: boolean = false;
  logOrder: any;
  selectedIndex = 0;

  constructor(
    private fSOService: FastSaleOrderService,
    private printerService: PrinterService,
    private excelExportService: ExcelExportService,
    private message: TDSMessageService,
    private modalService: TDSModalService,
    @Inject(DOCUMENT) private document: Document,
    private cdrRef: ChangeDetectorRef,
    private destroy$: TDSDestroyService,
    private viewContainerRef: ViewContainerRef) { }

  ngOnInit(): void {
    if (this.dataItem) {
      this.type = this.dataItem.Type;
      this.loadData();
    }
  }

  loadData() {
    this.isLoading = true;

    this.fSOService.getOrderLineData(this.dataItem.Id).pipe(takeUntil(this.destroy$)).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: OdataFSOrderLinesV2) => {
          if(res) {
            this.lstOfData = [...res.value];
          }

          this.isLoading = false;
        }, error: (error) => {
          this.isLoading = false;
          this.message.error(`${error?.error?.message}` || 'Tải dữ liệu thất bại');
        }
      });
  }

  print(type: string) {
    if (this.isProcessing) {
      return
    }

    let that = this;
    let printer: TDSSafeAny;
    this.isProcessing = true;

    switch (type) {
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
      printer.pipe(takeUntil(this.destroy$)).pipe(finalize(() => this.isProcessing = false)).subscribe({
        next: (res: TDSSafeAny) => {
          that.printerService.printHtml(res);
        },
        error: (error: any) => {
          let err: any;

          if(typeof(error) === "string") {
            err = JSON.parse(error) as any;
          } else {
            err = error;
          }

          this.isProcessing = false;
          this.message.error(error?.error?.message);
        }
      })
    }
  }

  excelDetail() {
    if (this.isProcessing) {
      return
    }

    this.isProcessing = true;
    let name = this.type == "invoice" ? "ban-hang" : "tra-hang-ban-hang";

    this.excelExportService.exportGet(`/fastsaleorder/ExcelPrint?id=${this.dataItem.Id}`, `${name}`)
      .pipe(takeUntil(this.destroy$))
      .pipe(finalize(() => this.isProcessing = false))
      .subscribe()
  }

  showMessageModal() {
    this.modalService.create({
      title: 'Gửi tin nhắn Facebook',
      size: 'lg',
      content: SendMessageComponent,
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        selectedUsers: [this.dataItem.Id],
        messageType: GenerateMessageTypeEnum.Bill,
        inBillExpand: true
      }
    });
  }

  showPayInvoiceModal(Id: TDSSafeAny) {
    this.fSOService.getRegisterPayment({ ids: [Id] }).pipe(takeUntil(this.destroy$)).subscribe(
      (res) => {
        if(res) {
          delete res['@odata.context'];

          this.modalService.create({
            title: 'Đăng ký thanh toán',
            size: 'lg',
            content: ModalPaymentComponent,
            viewContainerRef: this.viewContainerRef,
            componentParams: {
              dataModel: res
            }
          });
        }
      }, err => {
        this.message.error(err?.error?.message || 'Không tải được dữ liệu');
      }
    )
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSelectedChange(ev: TDSTabChangeEvent) {
    switch (ev.index) {
      case 0:
        this.loadData();
        break;

      case 1:
        break;

      case 2:
        this.logOrder = [];

        this.fSOService.getHistoryEditOrder(this.dataItem.Id).subscribe((res: any) => {

          res.value.forEach((obj: any) => {
            obj.JSONData = JSON.parse(obj.JSONData);
          });

          this.logOrder = res.value;
        })
        break;
    }
  }

  ngAfterViewInit() {
    this.getResizeExpand();
  }

  getResizeExpand() {
    // let element = this.document.getElementById(`expand[${this.dataItem.Id}]`) as any;
    // if(element) {
    //     let containerTable = element.closest('.tds-table-container') as any;
    //     let containerExpand = element.closest('.tds-custom-scroll') as any;
    //     let wrapView = Number(containerTable.clientWidth - 36);
    //     element.setAttribute('style', `width: ${wrapView}px; margin-left: ${Number(containerExpand.scrollLeft) + 2}px;`);

    //     let scrollTable = element.closest('.tds-custom-scroll');
    //     if(element && scrollTable) {
    //       scrollTable.addEventListener('scroll', function() {
    //           let scrollleft = Number(scrollTable.scrollLeft);
    //           let wrapScroll = Number(scrollTable.clientWidth - 24);

    //           element.setAttribute('style', `margin-left: ${scrollleft}px; width: ${wrapScroll}px;`)
    //       });
    //     }
    // }

    // this.cdrRef.detectChanges();
  }

}
