import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { OperatorEnum } from "src/app/lib";
import { ExcelExportService } from "src/app/main-app/services/excel-export.service";
import { FastSaleOrderService } from "src/app/main-app/services/fast-sale-order.service";
import { PrinterService } from "src/app/main-app/services/printer.service";
import { TDSMessageService, TDSModalService, TDSSafeAny } from "tmt-tang-ui";

@Component({
  selector: 'action-dropdown',
  templateUrl: './action-dropdown.component.html',
})

export class ActionDropdownComponent implements OnInit{

  @Input() filterObj: any;
  @Input() setOfCheckedId: any = [];

  tagIds: any = [];
  idsModel: any = [];

  constructor(private router: Router,
    private modal: TDSModalService,
    private fastSaleOrderService: FastSaleOrderService,
    private message: TDSMessageService,
    private excelExportService: ExcelExportService,
    private printerService: PrinterService) {
  }

  ngOnInit(): void {}

  exportExcel(type: string): any {
    let dateStart = this.filterObj.dateRange.startDate;
    let dateEnd =  this.filterObj.dateRange.endDate;

    let data = {
      filter: {
        filters: [
            { field: "Type", operator: OperatorEnum.eq, value: "invoice"},
            {field: "DateInvoice", operator: "gte",value: dateStart },
            { field: "DateInvoice", operator: "lte", value: dateEnd }
        ],
        logic: "and",
      },
    };

    switch (type) {
      case "excels":
        this.excelExportService.exportPost(`/fastsaleorder/ExportFile?TagIds=
            ${this.tagIds}`, { data: JSON.stringify(data), ids: this.idsModel },
            `ban-hang`);
        break;

      case "details":
        if(this.checkValueEmpty() == 1) {
          this.excelExportService.exportPost(`/fastsaleorder/ExportFileDetail?TagIds=${this.tagIds}`,
            { data: JSON.stringify(data), ids: this.idsModel }, "ban-hang-chi-tiet");

        }
      break;
      default:
          break;
    }
  }

  print(type: string) {
    if(this.checkValueEmpty() == 1) {
      switch (type) {
        case "print":
          this.printerService.printUrl(`/fastsaleorder/print?ids=${this.idsModel}`);
          break;
        case "printShips":
          this.printerService.printUrl(`/fastsaleorder/PrintShipThuan?ids=${this.idsModel}`);
          break;
        case "printDeliveries":
          this.printerService.printUrl(`/fastsaleorder/PrintDelivery?ids=${this.idsModel}`);
          break;
      }
    }
  }

  checkValueEmpty() {
    var ids: any[] = [...this.setOfCheckedId][0];
    this.idsModel = [...ids];

    if(this.idsModel.length == 0) {
        this.message.error('Vui lòng chọn tối thiểu một dòng!');
        return 0;
    }

    return 1;
  }

  cancelDelivery() {
    if (this.checkValueEmpty() == 1) {
        let that = this;
        this.modal.success({
            title: 'Hủy vận đơn',
            content: 'Bạn có muốn hủy vận đơn',
            onOk: () =>  {
                that.fastSaleOrderService.cancelShipIds({ids: that.idsModel}).subscribe((res: TDSSafeAny) => {
                  that.message.success('Hủy vận đơn thành công!');
                }, error => {
                  that.message.error(`${error?.error?.message}`);
                })
            },
            onCancel:()=> {},
            okText:"Xác nhận",
            cancelText:"Đóng"
        });
    }
  }

  cancelInvoice() {
    if (this.checkValueEmpty() == 1) {
      let that = this;
      this.modal.success({
          title: 'Hủy hóa đơn',
          content: 'Bạn có muốn hủy hóa đơn',
          onOk: () =>  {
              that.fastSaleOrderService.cancelInvoice({ids: that.idsModel}).subscribe((res: TDSSafeAny) => {
                that.message.success('Hủy hóa đơn thành công!');
              }, error => {
                that.message.error(`${error?.error?.message}`);
              })
          },
          onCancel:()=> {},
          okText:"Xác nhận",
          cancelText:"Đóng"
      });
    }
  }

  unLink() {
    if (this.checkValueEmpty() == 1) {
      let that = this;
      this.modal.success({
          title: 'Xóa hóa đơn',
          content: 'Bạn có muốn xóa hóa đơn',
          onOk: () =>  {
              that.fastSaleOrderService.unLink({ids: that.idsModel}).subscribe((res: TDSSafeAny) => {
                that.message.success('Xóa hóa đơn thành công!');
              }, error => {
                that.message.error(`${error?.error?.message}`);
              })
          },
          onCancel:()=> {},
          okText:"Xác nhận",
          cancelText:"Đóng"
      });
    }
  }

}
