import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { OperatorEnum } from "src/app/lib";
import { ExcelExportService } from "src/app/main-app/services/excel-export.service";
import { FastSaleOrderService } from "src/app/main-app/services/fast-sale-order.service";
import { PrinterService } from "src/app/main-app/services/printer.service";
import { TDSHelperObject, TDSMessageService, TDSModalService, TDSSafeAny } from "tmt-tang-ui";

@Component({
  selector: 'action-dropdown',
  templateUrl: './action-dropdown.component.html',
})

export class ActionDropdownComponent implements OnInit, OnDestroy {
  private _destroy = new Subject<void>();
  @Input() filterObj: any;
  @Input() setOfCheckedId: any = [];
  isProcessing: boolean = false;
  tagIds: any = [];
  idsModel: any = [];

  constructor(private router: Router,
    private modal: TDSModalService,
    private fastSaleOrderService: FastSaleOrderService,
    private message: TDSMessageService,
    private excelExportService: ExcelExportService,
    private printerService: PrinterService) {
  }


  ngOnInit(): void { }

  exportExcel(type: string): any {
    if (this.isProcessing) {
      return
    }

    let dateStart = this.filterObj.dateRange.startDate;
    let dateEnd = this.filterObj.dateRange.endDate;

    let data = {
      filter: {
        filters: [
          { field: "Type", operator: OperatorEnum.eq, value: "invoice" },
          { field: "DateInvoice", operator: "gte", value: dateStart },
          { field: "DateInvoice", operator: "lte", value: dateEnd }
        ],
        logic: "and",
      },
    };
    let that = this;
    let callBackFn = () => {
      that.isProcessing = false;
    }
    switch (type) {
      case "excels":
        this.isProcessing = true;
        this.excelExportService.exportPost(`/fastsaleorder/ExportFile?TagIds=
            ${this.tagIds}`, { data: JSON.stringify(data), ids: this.idsModel },
          `ban-hang`, callBackFn);
        break;

      case "details":
        if (this.checkValueEmpty() == 1) {
          this.isProcessing = true;
          this.excelExportService.exportPost(`/fastsaleorder/ExportFileDetail?TagIds=${this.tagIds}`,
            { data: JSON.stringify(data), ids: this.idsModel }, "ban-hang-chi-tiet", callBackFn);
        }
        break;
      default:
        break;
    }
  }

  print(type: string) {
    let that = this;
    if (this.isProcessing) {
      return
    }

    if (this.checkValueEmpty() == 1) {

      let obs: TDSSafeAny;
      switch (type) {
        case "print":
          obs = this.printerService.printUrl(`/fastsaleorder/print?ids=${this.idsModel}`);
          break;
        case "printShips":
          obs = this.printerService.printUrl(`/fastsaleorder/PrintShipThuan?ids=${this.idsModel}`);
          break;
        case "printDeliveries":
          obs = this.printerService.printUrl(`/fastsaleorder/PrintDelivery?ids=${this.idsModel}`);
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
  }

  checkValueEmpty() {
    var ids: any[] = [...this.setOfCheckedId][0];
    this.idsModel = [...ids];

    if (this.idsModel.length == 0) {
      this.message.error('Vui lòng chọn tối thiểu một dòng!');
      return 0;
    }

    return 1;
  }

  cancelDelivery() {
    let that = this;
    if (this.isProcessing) {
      return
    }

    if (this.checkValueEmpty() == 1) {
      that.isProcessing = true;
      this.modal.success({
        title: 'Hủy vận đơn',
        content: 'Bạn có muốn hủy vận đơn',
        onOk: () => {
          that.fastSaleOrderService.cancelShipIds({ ids: that.idsModel }).pipe(takeUntil(this._destroy)).subscribe((res: TDSSafeAny) => {
            that.message.success('Hủy vận đơn thành công!');
            that.isProcessing = false;
          }, error => {
            that.message.error(`${error?.error?.message}`);
            that.isProcessing = false;
          })
        },
        onCancel: () => { that.isProcessing = false; },
        okText: "Xác nhận",
        cancelText: "Đóng"
      });
    }
  }

  cancelInvoice() {
    if (this.isProcessing) {
      return
    }
    if (this.checkValueEmpty() == 1) {
      let that = this;
      this.modal.success({
        title: 'Hủy hóa đơn',
        content: 'Bạn có muốn hủy hóa đơn',
        onOk: () => {
          that.fastSaleOrderService.cancelInvoice({ ids: that.idsModel }).pipe(takeUntil(this._destroy)).subscribe((res: TDSSafeAny) => {
            that.message.success('Hủy hóa đơn thành công!');
            that.isProcessing = false;
          }, error => {
            that.message.error(`${error?.error?.message}`);
            that.isProcessing = false;
          })
        },
        onCancel: () => { that.isProcessing = false; },
        okText: "Xác nhận",
        cancelText: "Đóng"
      });
    }
  }

  unLink() {
    if (this.isProcessing) {
      return
    }
    if (this.checkValueEmpty() == 1) {
      let that = this;
      that.isProcessing = true;
      this.modal.success({
        title: 'Xóa hóa đơn',
        content: 'Bạn có muốn xóa hóa đơn',
        onOk: () => {
          that.fastSaleOrderService.unLink({ ids: that.idsModel }).pipe(takeUntil(this._destroy)).subscribe((res: TDSSafeAny) => {
            that.message.success('Xóa hóa đơn thành công!');
            that.isProcessing = false;
          }, error => {
            that.message.error(`${error?.error?.message}`);
            that.isProcessing = false;
          })
        },
        onCancel: () => { that.isProcessing = false; },
        okText: "Xác nhận",
        cancelText: "Đóng"
      });
    }
  }
  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }
}
